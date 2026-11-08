#!/usr/bin/env python3
"""
Hello Dubai: record every sentence with the Kokoro voice model, so the website
has real audio files instead of depending on the phone's speech engine.

Setup (once):
    python3 -m venv .venv && .venv/bin/pip install kokoro-onnx soundfile
    # model files (Apache-2.0), from https://github.com/thewh1teagle/kokoro-onnx/releases
    #   kokoro-v1.0.onnx and voices-v1.0.bin  ->  put them in a folder, e.g. ~/kokoro
    # ffmpeg must be installed.

Run:
    node tools/list-speech.js > /tmp/speech.json
    .venv/bin/python tools/make_audio.py /tmp/speech.json ~/kokoro

Output: audio/pack-<stop>.js (MP3 clips as base64) and audio/index.js.
Clips are cached in tools/.audio-cache, so only new or changed sentences are recorded.
"""
import base64
import hashlib
import json
import os
import subprocess
import sys
import tempfile

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = os.path.join(ROOT, 'tools', '.audio-cache')
OUT = os.path.join(ROOT, 'audio')

# Character -> (Kokoro voice, phonemizer language, label shown in the app)
VOICES = {
    'you':       ('af_heart',    'en-us', 'Heart (American English)'),
    'teacher':   ('bf_emma',     'en-gb', 'Emma (British English)'),
    'pilot':     ('bm_george',   'en-gb', 'George (British English)'),
    'crew':      ('bf_isabella', 'en-gb', 'Isabella (British English)'),
    'crew2':     ('bm_fable',    'en-gb', 'Fable (British English)'),
    'passenger': ('am_puck',     'en-us', 'Puck (American English)'),
    'officer':   ('am_michael',  'en-us', 'Michael (American English)'),
    'porter':    ('am_puck',     'en-us', 'Puck (American English)'),
    'agent':     ('af_kore',     'en-us', 'Kore (American English)'),
    'customs':   ('af_aoede',    'en-us', 'Aoede (American English)'),
    'info':      ('af_sarah',    'en-us', 'Sarah (American English)'),
    'marshal':   ('bm_lewis',    'en-gb', 'Lewis (British English)'),
    'driver':    ('am_fenrir',   'en-us', 'Fenrir (American English)'),
}
SPEED = 0.95          # a little slower than natural, for learners
BITRATE = '40k'       # mono speech, 24 kHz
TARGET_RMS_DB = -20.0
VERSION = 'k1'        # change to re-record everything


def normalise(samples):
    samples = samples.astype(np.float32)
    rms = float(np.sqrt(np.mean(samples ** 2))) or 1e-6
    gain = (10 ** (TARGET_RMS_DB / 20)) / rms
    peak = float(np.max(np.abs(samples))) * gain
    if peak > 0.95:
        gain *= 0.95 / peak
    return samples * gain


def ffmpeg_mp3(wav_path, mp3_path, fx):
    # 120 ms of silence first: some phones and Bluetooth speakers cut the very start.
    filters = ['adelay=120:all=1']
    inputs = ['-i', wav_path]
    if fx == 'fast':
        filters.insert(0, 'atempo=1.35')
    if fx == 'quiet':
        # a noisy airport: speech quieter, brown noise on top
        inputs += ['-f', 'lavfi', '-i', 'anoisesrc=color=brown:amplitude=0.25:sample_rate=24000']
        graph = '[0:a]volume=0.32,adelay=120:all=1,apad=pad_dur=0.3[s];[1:a]volume=0.55[n];[s][n]amix=inputs=2:duration=first:normalize=0[out]'
        cmd = ['ffmpeg', '-v', 'error', '-y'] + inputs + ['-filter_complex', graph, '-map', '[out]',
                                                         '-ac', '1', '-ar', '24000', '-b:a', BITRATE, mp3_path]
    else:
        cmd = ['ffmpeg', '-v', 'error', '-y'] + inputs + ['-af', ','.join(filters),
                                                         '-ac', '1', '-ar', '24000', '-b:a', BITRATE, mp3_path]
    subprocess.run(cmd, check=True)


def main():
    items_path, model_dir = sys.argv[1], sys.argv[2]
    items = json.load(open(items_path, encoding='utf-8'))
    os.makedirs(CACHE, exist_ok=True)
    os.makedirs(OUT, exist_ok=True)
    kokoro = Kokoro(os.path.join(model_dir, 'kokoro-v1.0.onnx'), os.path.join(model_dir, 'voices-v1.0.bin'))

    unique = {}
    for it in items:
        unique.setdefault(it['key'], it)
    todo = [it for k, it in unique.items() if not os.path.exists(os.path.join(CACHE, f"{VERSION}-{k}.mp3"))]
    print(f'{len(unique)} sentences, {len(todo)} to record', flush=True)

    with tempfile.TemporaryDirectory() as tmp:
        for n, it in enumerate(todo, 1):
            voice, lang, _ = VOICES.get(it['who'], VOICES['teacher'])
            samples, rate = kokoro.create(it['text'], voice=voice, speed=SPEED, lang=lang)
            wav = os.path.join(tmp, 'clip.wav')
            sf.write(wav, normalise(samples), rate)
            ffmpeg_mp3(wav, os.path.join(CACHE, f"{VERSION}-{it['key']}.mp3"), it['fx'])
            if n % 25 == 0 or n == len(todo):
                print(f'  recorded {n}/{len(todo)}', flush=True)

    # Packs: one script per stop (plus "common"), so a page only loads what it needs.
    packs = {}
    for it in items:
        packs.setdefault(it['pack'], {})[it['key']] = it
    keys_index = {}
    pack_files = {}
    total = 0
    for name, entries in sorted(packs.items()):
        data = {}
        for k in sorted(entries):
            with open(os.path.join(CACHE, f'{VERSION}-{k}.mp3'), 'rb') as f:
                data[k] = base64.b64encode(f.read()).decode('ascii')
            keys_index.setdefault(k, []).append(name)
        body = json.dumps(data, separators=(',', ':'))
        digest = hashlib.sha1(body.encode()).hexdigest()[:8]
        path = os.path.join(OUT, f'pack-{name}.js')
        with open(path, 'w', encoding='utf-8') as f:
            f.write(f'window.HDAudioPack&&window.HDAudioPack("{name}",{body});\n')
        total += os.path.getsize(path)
        pack_files[name] = f'audio/pack-{name}.js?v={digest}'

    # Remove packs of stops that no longer exist.
    for fname in os.listdir(OUT):
        if fname.startswith('pack-') and fname[5:-3] not in packs:
            os.remove(os.path.join(OUT, fname))

    index = {
        'packs': pack_files,
        'keys': keys_index,
        'voices': {who: label for who, (_, _, label) in VOICES.items()},
    }
    with open(os.path.join(OUT, 'index.js'), 'w', encoding='utf-8') as f:
        f.write('window.HD_AUDIO = ' + json.dumps(index, separators=(',', ':')) + ';\n')
    print(f'wrote {len(packs)} packs, {total / 1e6:.1f} MB', flush=True)


if __name__ == '__main__':
    main()
