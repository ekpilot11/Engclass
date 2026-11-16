#!/usr/bin/env python3
"""
Hello Dubai: when is each word spoken?

In the animated scenes the words light up while they are spoken, and the speaker's picture moves
with the loudness of the voice. This tool measures both in the recordings and writes
audio/times-<lesson>.js (and lists the files in audio/index.js).

    node tools/list-speech.js > /tmp/speech.json
    .venv/bin/python tools/make_timings.py /tmp/speech.json --packs passport

Run it after make_audio.py. Word times come from the first source that works:
  1. elevenlabs  forced alignment: the most exact. The API key needs the "Forced Alignment" permission.
  2. openai      whisper-1 word timestamps: about $0.006 for a minute of sound.
  3. estimate    from the pauses in the recording: free, less exact.
Results are cached next to the recordings, so only new recordings are measured.
--upgrade measures again where a better source has become available.
The API keys are never stored here: set ELEVENLABS_API_KEY / OPENAI_API_KEY, or run where a proxy adds them.
"""
import argparse
import hashlib
import io
import json
import os
import re
import subprocess
import sys
import time
import urllib.error
import urllib.request
import uuid

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import elevenlabs  # noqa: E402  (tools/elevenlabs.py)
import make_audio  # noqa: E402  (tools/make_audio.py)

CACHE = make_audio.CACHE
OUT = make_audio.OUT
OPENAI_KEY = os.environ.get('OPENAI_API_KEY', 'sk-proxy-adds-the-key')
RANK = {'estimate': 1, 'openai': 2, 'elevenlabs': 3}
RATE = 8000
WIN = 0.05          # seconds per loudness step
FORMAT = 3          # change to measure everything again


# ---------------------------------------------------------------- the recording itself

def pcm(path):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-f', 's16le', '-ac', '1', '-ar', str(RATE), '-'],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768.0


def loudness(samples):
    """RMS for every 50 ms, and the level that counts as "somebody is speaking"."""
    n = int(RATE * WIN)
    steps = max(1, len(samples) // n)
    rms = np.array([float(np.sqrt(np.mean(samples[i * n:(i + 1) * n] ** 2))) for i in range(steps)])
    top = float(np.percentile(rms, 95)) or 1e-6
    return rms, top


def envelope(rms, top):
    """Loudness as one digit (0-9) per 50 ms: small enough to ship for every sentence."""
    return ''.join(str(int(min(9, round(9 * min(1.0, v / top) ** 0.7)))) for v in rms)


def voiced_span(rms, top):
    on = np.where(rms > 0.12 * top)[0]
    if not len(on):
        return 0.0, len(rms) * WIN
    return float(on[0] * WIN), float((on[-1] + 1) * WIN)


# ---------------------------------------------------------------- word times from the three sources

def norm(word):
    return re.sub(r'[^a-z0-9]+', '', word.lower().replace('’', "'").replace("'", ''))


def same_word(a, b):
    if not a or not b:
        return False
    return a == b or (min(len(a), len(b)) >= 3 and (a.startswith(b) or b.startswith(a)))


def fit(ours, theirs):
    """Give each of our words a (start, end) from the recognised words (word, start, end).
    Words that were not recognised get their time from their neighbours."""
    a = [norm(w) for w in ours]
    b = [norm(w[0]) for w in theirs]
    n, m = len(a), len(b)
    dp = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(n - 1, -1, -1):
        for j in range(m - 1, -1, -1):
            dp[i][j] = dp[i + 1][j + 1] + 1 if same_word(a[i], b[j]) else max(dp[i + 1][j], dp[i][j + 1])
    out = [None] * n
    i = j = 0
    while i < n and j < m:
        if same_word(a[i], b[j]):
            out[i] = (theirs[j][1], theirs[j][2])
            i += 1
            j += 1
        elif dp[i + 1][j] >= dp[i][j + 1]:
            i += 1
        else:
            j += 1
    return out, sum(1 for o in out if o) / max(1, n)


def fill(ours, times, start, end):
    """Fill the gaps (None) between known words, sharing the time by word length."""
    out = list(times)
    i = 0
    while i < len(out):
        if out[i] is not None:
            i += 1
            continue
        j = i
        while j < len(out) and out[j] is None:
            j += 1
        left = out[i - 1][1] if i > 0 else start
        right = out[j][0] if j < len(out) else end
        right = max(right, left)
        weights = [len(norm(w)) + 1 for w in ours[i:j]]
        total = float(sum(weights))
        t = left
        for k in range(i, j):
            span = (right - left) * weights[k - i] / total
            out[k] = (t, t + span)
            t += span
        i = j
    return out


def from_elevenlabs(path, text, ours):
    words = elevenlabs.align(path, text)
    return fit(ours, words)


def from_openai(path, text, ours):
    boundary = uuid.uuid4().hex
    body = io.BytesIO()
    fields = {'model': 'whisper-1', 'response_format': 'verbose_json', 'timestamp_granularities[]': 'word',
              'language': 'en', 'prompt': text}
    for k, v in fields.items():
        body.write(f'--{boundary}\r\nContent-Disposition: form-data; name="{k}"\r\n\r\n{v}\r\n'.encode('utf-8'))
    with open(path, 'rb') as f:
        audio = f.read()
    body.write(f'--{boundary}\r\nContent-Disposition: form-data; name="file"; filename="clip.mp3"\r\n'
               f'Content-Type: audio/mpeg\r\n\r\n'.encode())
    body.write(audio)
    body.write(f'\r\n--{boundary}--\r\n'.encode())
    headers = {'Authorization': 'Bearer ' + OPENAI_KEY, 'Content-Type': f'multipart/form-data; boundary={boundary}'}
    for attempt in range(3):
        req = urllib.request.Request('https://api.openai.com/v1/audio/transcriptions', data=body.getvalue(), headers=headers, method='POST')
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
                res = json.loads(r.read())
            words = [(w['word'], float(w['start']), float(w['end'])) for w in res.get('words', [])]
            return fit(ours, words)
        except urllib.error.HTTPError as e:
            msg = e.read().decode('utf-8', 'replace')
            if e.code in (429, 500, 502, 503) and attempt < 2:
                time.sleep(5 * (attempt + 1))
                continue
            raise elevenlabs.ApiError(e.code, msg)
        except (urllib.error.URLError, TimeoutError) as e:
            if attempt < 2:
                time.sleep(5 * (attempt + 1))
                continue
            raise elevenlabs.ApiError(0, str(e))


def from_estimate(ours, rms, top):
    """No recognition: share the time when somebody is speaking between the words, by their length."""
    speaking = rms > 0.12 * top
    steps = np.where(speaking)[0]
    if not len(steps):
        steps = np.arange(len(rms))
    weights = [len(norm(w)) + 1 for w in ours]
    total = float(sum(weights))
    out = []
    done = 0.0
    for w in weights:
        a = int(done / total * len(steps))
        done += w
        b = max(a, int(done / total * len(steps)) - 1)
        out.append((float(steps[min(a, len(steps) - 1)] * WIN), float((steps[min(b, len(steps) - 1)] + 1) * WIN)))
    return out


def segments(rms, top, min_pause=0.15):
    """The stretches of speech between pauses, as (start, end) in seconds."""
    speaking = rms > 0.12 * top
    segs = []
    i, n = 0, len(speaking)
    while i < n:
        if not speaking[i]:
            i += 1
            continue
        j = i
        while j < n and speaking[j]:
            j += 1
        a, b = i * WIN, j * WIN
        if segs and a - segs[-1][1] < min_pause:
            segs[-1] = (segs[-1][0], b)
        else:
            segs.append((a, b))
        i = j
    return segs


def snap(words, times, segs, tol=0.42):
    """Recognisers are vague around pauses. After a pause a word must start exactly when the sound
    starts again, so move the nearest word start onto every such moment."""
    starts = [s for s, _ in times]
    if not starts or not segs:
        return times
    used = -1
    for n, (a, _) in enumerate(segs):
        if n == 0:
            best = 0  # the first sound is always the first word
        else:
            # the first word that starts after the sound before this pause ended begins this stretch
            prev_end = segs[n - 1][1]
            best = next((i for i in range(used + 1, len(starts)) if starts[i] >= prev_end - 0.05), None)
            if best is not None and starts[best] > a + tol:
                best = None
        if best is None:
            continue
        starts[best] = a
        used = best
    # no word may start inside a pause: move it to where the sound starts again
    for i, st in enumerate(starts):
        inside = any(a <= st < b for a, b in segs)
        if not inside:
            later = [a for a, _ in segs if a >= st]
            if later:
                starts[i] = later[0]
    for i in range(1, len(starts)):
        starts[i] = max(starts[i], starts[i - 1])
    # words that were given (almost) the same moment share the time until the next word, by length
    i = 0
    while i < len(starts) - 1:
        j = i
        while j + 1 < len(starts) and starts[j + 1] - starts[j] < 0.09:
            j += 1
        if j > i:
            seg_end = next((b for a, b in segs if a <= starts[i] < b), segs[-1][1])
            right = min(starts[j + 1], seg_end) if j + 1 < len(starts) else seg_end
            if right - starts[i] >= 0.1 * (j - i + 1):
                weights = [len(norm(w)) + 1 for w in words[i:j + 1]]
                total, t = float(sum(weights)), starts[i]
                for k in range(i, j + 1):
                    starts[k] = t
                    t += (right - starts[i]) * weights[k - i] / total
        i = j + 1
    out = []
    for i, st in enumerate(starts):
        seg_end = next((b for a, b in segs if a <= st < b), segs[-1][1])
        nxt = starts[i + 1] if i + 1 < len(starts) else seg_end
        out.append((st, max(st, min(nxt, seg_end))))
    return out


def tidy(times, start, end):
    """Whole milliseconds, never going backwards, inside the part where somebody speaks."""
    out = []
    last = max(0.0, start - 0.06)
    for s, e in times:
        s = min(max(s, last), end)
        e = min(max(e, s), end)
        out.append([int(round(s * 1000)), int(round(e * 1000))])
        last = s
    if out:
        out[-1][1] = max(out[-1][1], int(round(end * 1000)))
    return out


# ---------------------------------------------------------------- main

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('items')
    ap.add_argument('--packs', help='comma-separated lessons (default: all)')
    ap.add_argument('--source', default='auto', choices=['auto', 'elevenlabs', 'openai', 'estimate'])
    ap.add_argument('--upgrade', action='store_true', help='measure again where a better source is available now')
    a = ap.parse_args()

    items = json.load(open(a.items, encoding='utf-8'))
    el = make_audio.load_config()
    unique, packs_of = {}, {}
    for it in items:
        unique.setdefault(it['key'], it)
        packs_of.setdefault(it['key'], set()).add(it['pack'])
    engine = make_audio.plan(unique, packs_of, el)
    all_packs = sorted({it['pack'] for it in items})
    wanted = [p for p in (a.packs.split(',') if a.packs else all_packs) if p in all_packs]
    if not wanted:
        sys.exit('No such lesson. Lessons: ' + ', '.join(all_packs))

    order = ['elevenlabs', 'openai', 'estimate'] if a.source == 'auto' else [a.source, 'estimate']
    broken = {}
    used = {}
    seconds = {'openai': 0.0, 'elevenlabs': 0.0}
    results = {}
    keys = [k for k in unique if packs_of[k] & set(wanted)]
    for n, k in enumerate(keys, 1):
        it = unique[k]
        path = os.path.join(CACHE, engine[k][2])
        if not os.path.exists(path):
            continue  # not recorded yet
        with open(path, 'rb') as f:
            digest = hashlib.sha1(f.read()).hexdigest()[:16]
        cpath = os.path.join(CACHE, f'words-{digest}.json')
        ours = it['text'].split()
        cached = None
        if os.path.exists(cpath):
            c = json.load(open(cpath, encoding='utf-8'))
            if c.get('text') == it['text'] and c.get('format') == FORMAT:
                cached = c
        best = next((s for s in order if s not in broken), 'estimate')
        samples = pcm(path)
        rms, top = loudness(samples)
        start, end = voiced_span(rms, top)
        if cached and not (a.upgrade and RANK[cached['source']] < RANK[best]):
            raw, source = cached['raw'], cached['source']
        else:
            raw, source = None, 'estimate'
            for s in order:
                if s in broken or s == 'estimate':
                    continue
                try:
                    fitted, share = (from_elevenlabs if s == 'elevenlabs' else from_openai)(path, it['text'], ours)
                    seconds[s] += len(samples) / RATE
                except elevenlabs.ApiError as e:
                    broken[s] = str(e)
                    print(f'  {s} is not available ({str(e)[:140]}): using the next source', flush=True)
                    continue
                if share >= 0.5:  # otherwise it heard something else: try the next source
                    raw, source = fitted, s
                    break
            with open(cpath, 'w', encoding='utf-8') as f:
                json.dump({'format': FORMAT, 'text': it['text'], 'source': source, 'raw': raw}, f)
        times = fill(ours, [tuple(t) if t else None for t in raw], start, end) if raw else from_estimate(ours, rms, top)
        times = snap(ours, times, segments(rms, top))
        results[k] = {'source': source, 'words': tidy(times, start, end), 'env': envelope(rms, top)}
        used[source] = used.get(source, 0) + 1
        if n % 50 == 0:
            print(f'  measured {n}/{len(keys)}', flush=True)

    for pack in wanted:
        data = {}
        for k in sorted(results):
            if pack in packs_of[k]:
                flat = [t for pair in results[k]['words'] for t in pair]
                data[k] = {'w': flat, 'e': results[k]['env']}
        path = os.path.join(OUT, f'times-{pack}.js')
        with open(path, 'w', encoding='utf-8') as f:
            f.write(f'window.HDAudioTimes&&window.HDAudioTimes("{pack}",' + json.dumps(data, separators=(',', ':')) + ');\n')
        print(f'wrote audio/times-{pack}.js: {len(data)} sentences, {os.path.getsize(path) / 1000:.1f} kB')

    index = make_audio.read_index()
    index['times'] = make_audio.scan_times(index['packs'])
    make_audio.write_index(index)
    measured = ', '.join(f'{s} {seconds[s] / 60:.1f} min' for s in seconds if seconds[s])
    print('sources used:', used, '| new sound measured:', measured or 'none')
    if seconds['openai']:
        print(f"OpenAI cost of this run: about ${seconds['openai'] / 60 * 0.006:.3f}")


if __name__ == '__main__':
    main()
