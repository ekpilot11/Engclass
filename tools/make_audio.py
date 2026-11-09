#!/usr/bin/env python3
"""
Hello Dubai: record every sentence, so the website has real audio files instead of
depending on the phone's speech engine.

Two engines:
- Kokoro (free, runs here): British and American voices.
- ElevenLabs (tools/voices.json): real accents (Arabic, Indian, Filipino…) for the lessons
  listed there. Uses tools/elevenlabs.py; the API key is never stored in this project.
  --max-chars stops a run that would use more ElevenLabs characters than expected.

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
import argparse
import base64
import hashlib
import json
import os
import subprocess
import sys
import tempfile

import numpy as np
import soundfile as sf

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
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


def load_config():
    """tools/voices.json: which lessons use ElevenLabs voices, and which voice each person has."""
    path = os.path.join(ROOT, 'tools', 'voices.json')
    cfg = json.load(open(path, encoding='utf-8')) if os.path.exists(path) else {}
    el = cfg.get('elevenlabs') or {}
    el.setdefault('voices', {})
    el.setdefault('packs', [])
    el.setdefault('model', 'eleven_multilingual_v2')
    el.setdefault('settings', {})
    return el


def plan(unique, packs_of, el):
    """Decide the engine and the cache file of every sentence."""
    out = {}
    for k, it in unique.items():
        voice = el['voices'].get(it['who'])
        if voice and voice.get('id') and (packs_of[k] & set(el['packs']) or '*' in el['packs']):
            sig = json.dumps([voice['id'], el['model'], el['settings'], it['text'], it['fx']], sort_keys=True)
            out[k] = ('elevenlabs', voice['id'], f"el-{hashlib.sha1(sig.encode()).hexdigest()[:16]}.mp3")
        else:
            out[k] = ('kokoro', None, f'{VERSION}-{k}.mp3')
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('items')
    ap.add_argument('kokoro_dir', help='folder with kokoro-v1.0.onnx and voices-v1.0.bin')
    ap.add_argument('--max-chars', type=int, default=3000,
                    help='stop before sending more than this many characters to ElevenLabs in one run')
    a = ap.parse_args()
    items = json.load(open(a.items, encoding='utf-8'))
    os.makedirs(CACHE, exist_ok=True)
    os.makedirs(OUT, exist_ok=True)
    el = load_config()

    unique, packs_of = {}, {}
    for it in items:
        unique.setdefault(it['key'], it)
        packs_of.setdefault(it['key'], set()).add(it['pack'])
    engine = plan(unique, packs_of, el)
    todo = [it for k, it in unique.items() if not os.path.exists(os.path.join(CACHE, engine[k][2]))]
    el_chars = sum(len(it['text']) for it in todo if engine[it['key']][0] == 'elevenlabs')
    print(f'{len(unique)} sentences, {len(todo)} to record ({el_chars} characters on ElevenLabs)', flush=True)
    if el_chars > a.max_chars:
        sys.exit(f'Stopped: {el_chars} ElevenLabs characters is more than --max-chars {a.max_chars}.')

    kokoro = None
    with tempfile.TemporaryDirectory() as tmp:
        for n, it in enumerate(todo, 1):
            kind, voice_id, fname = engine[it['key']]
            wav = os.path.join(tmp, 'clip.wav')
            if kind == 'elevenlabs':
                import elevenlabs  # tools/elevenlabs.py
                mp3 = os.path.join(tmp, 'el.mp3')
                with open(mp3, 'wb') as f:
                    f.write(elevenlabs.tts(voice_id, it['text'], el['model'], el['settings']))
                subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', mp3, '-ac', '1', '-ar', '24000', wav], check=True)
                samples, rate = sf.read(wav)
            else:
                if kokoro is None:
                    from kokoro_onnx import Kokoro
                    kokoro = Kokoro(os.path.join(a.kokoro_dir, 'kokoro-v1.0.onnx'), os.path.join(a.kokoro_dir, 'voices-v1.0.bin'))
                voice, lang, _ = VOICES.get(it['who'], VOICES['teacher'])
                samples, rate = kokoro.create(it['text'], voice=voice, speed=SPEED, lang=lang)
            sf.write(wav, normalise(samples), rate)
            ffmpeg_mp3(wav, os.path.join(CACHE, fname), it['fx'])
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
            with open(os.path.join(CACHE, engine[k][2]), 'rb') as f:
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

    labels = {who: label for who, (_, _, label) in VOICES.items()}
    el_used = {unique[k]['who'] for k, e in engine.items() if e[0] == 'elevenlabs'}
    kokoro_used = any(e[0] == 'kokoro' for e in engine.values())
    for who in el_used:
        voice = el['voices'][who]
        where = '' if '*' in el['packs'] else ' in ' + el.get('packsLabel', ', '.join(el['packs']))
        labels[who] = f"{voice.get('label', 'ElevenLabs voice')}{where}; elsewhere {labels.get(who, 'Kokoro')}" if where else voice.get('label', 'ElevenLabs voice')
    index = {
        'packs': pack_files,
        'keys': keys_index,
        'voices': labels,
        'credits': (['Voices by ElevenLabs'] if el_used else []) + (['Voices by Kokoro (Apache-2.0)'] if kokoro_used else []),
    }
    with open(os.path.join(OUT, 'index.js'), 'w', encoding='utf-8') as f:
        f.write('window.HD_AUDIO = ' + json.dumps(index, separators=(',', ':')) + ';\n')
    print(f'wrote {len(packs)} packs, {total / 1e6:.1f} MB', flush=True)


if __name__ == '__main__':
    main()
