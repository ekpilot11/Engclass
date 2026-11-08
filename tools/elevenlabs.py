#!/usr/bin/env python3
"""
Hello Dubai: ElevenLabs helper (voices with real accents).

    python tools/elevenlabs.py status
        plan, characters used / left, voice slots
    python tools/elevenlabs.py search --accent arabic --gender male [--n 10]
        voices from the ElevenLabs voice library with that accent (free-plan friendly first)
    python tools/elevenlabs.py voices
        voices already in the account (including the standard "premade" ones)
    python tools/elevenlabs.py add OWNER_ID VOICE_ID NAME   |   delete VOICE_ID...
        add a library voice to the account (needed to record with it) / remove voices
    python tools/elevenlabs.py audition tools/audition.json OUT_DIR
        adds the candidate voices, records one sample sentence for each, and writes
        OUT_DIR/index.html, a page to listen and choose

The API key is never stored here. Set ELEVENLABS_API_KEY, or run where a proxy adds it.
make_audio.py uses tts() from this file to record the lessons.
"""
import argparse
import hashlib
import html
import json
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

API = 'https://api.elevenlabs.io'
KEY = os.environ.get('ELEVENLABS_API_KEY', 'proxy-adds-the-key')
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = os.path.join(ROOT, 'tools', '.audio-cache')

DEFAULT_SETTINGS = {'stability': 0.5, 'similarity_boost': 0.75, 'style': 0.0, 'use_speaker_boost': True, 'speed': 0.92}


def call(method, path, body=None, raw=False, timeout=180):
    headers = {'xi-api-key': KEY, 'Accept': 'audio/mpeg' if raw else 'application/json'}
    data = None
    if body is not None:
        data = json.dumps(body).encode()
        headers['Content-Type'] = 'application/json'
    for attempt in range(4):
        req = urllib.request.Request(API + path, data=data, headers=headers, method=method)
        try:
            with urllib.request.urlopen(req, timeout=timeout) as r:
                out = r.read()
                return out if raw else (json.loads(out) if out else {})
        except urllib.error.HTTPError as e:
            msg = e.read().decode('utf-8', 'replace')
            if e.code in (429, 500, 502, 503) and attempt < 3:
                time.sleep(6 * (attempt + 1))
                continue
            sys.exit(f'ElevenLabs error {e.code} on {path}: {msg[:800]}')
        except (urllib.error.URLError, TimeoutError) as e:
            if attempt < 3:
                time.sleep(6 * (attempt + 1))
                continue
            sys.exit(f'Network error on {path}: {e}')


def status():
    s = call('GET', '/v1/user/subscription')
    return {
        'tier': s.get('tier'),
        'characters_used': s.get('character_count'),
        'characters_limit': s.get('character_limit'),
        'characters_left': (s.get('character_limit') or 0) - (s.get('character_count') or 0),
        'voice_slots_used': s.get('voice_slots_used', s.get('voice_count')),
        'voice_limit': s.get('voice_limit'),
        'resets_unix': s.get('next_character_count_reset_unix'),
    }


def tts(voice_id, text, model='eleven_multilingual_v2', settings=None):
    """Record one sentence. Returns MP3 bytes."""
    body = {'text': text, 'model_id': model, 'voice_settings': dict(DEFAULT_SETTINGS, **(settings or {}))}
    return call('POST', f'/v1/text-to-speech/{voice_id}?output_format=mp3_44100_128', body, raw=True)


def search(accent=None, gender=None, age=None, n=10, text=None):
    q = {'page_size': 50, 'language': 'en', 'sort': 'usage_character_count_1y'}
    if accent:
        q['accent'] = accent
    if gender:
        q['gender'] = gender
    if age:
        q['age'] = age
    if text:
        q['search'] = text
    res = call('GET', '/v1/shared-voices?' + urllib.parse.urlencode(q))
    voices = res.get('voices', [])
    voices.sort(key=lambda v: (not v.get('free_users_allowed', True), -(v.get('usage_character_count_1y') or 0)))
    return voices[:n]


def my_voices():
    return call('GET', '/v1/voices').get('voices', [])


def add_library_voice(public_owner_id, voice_id, name):
    """Copy a voice from the library into the account (needed before using it).
    Returns (voice id, True if it was added now)."""
    for v in my_voices():
        if v.get('voice_id') == voice_id or v.get('name') == name:
            return v['voice_id'], False
    res = call('POST', f'/v1/voices/add/{public_owner_id}/{voice_id}', {'new_name': name})
    return res.get('voice_id', voice_id), True


def delete_voice(voice_id):
    """Remove a voice from the account (frees a voice slot; recordings already made are kept)."""
    call('DELETE', f'/v1/voices/{voice_id}')


def sample_path(voice_id, text, model, settings):
    h = hashlib.sha1(json.dumps([voice_id, text, model, settings], sort_keys=True).encode()).hexdigest()[:16]
    return os.path.join(CACHE, f'sample-{h}.mp3')


def sample(voice_id, text, model, settings):
    os.makedirs(CACHE, exist_ok=True)
    path = sample_path(voice_id, text, model, settings)
    if not os.path.exists(path):
        with open(path, 'wb') as f:
            f.write(tts(voice_id, text, model, settings))
    return path


def audition(config_path, out_dir):
    """config: {"model": ..., "people": [{"who", "label", "text", "candidates": [{"name", "voice_id", "public_owner_id"?, "note"}]}]}"""
    cfg = json.load(open(config_path, encoding='utf-8'))
    model = cfg.get('model', 'eleven_multilingual_v2')
    settings = cfg.get('settings', {})
    os.makedirs(out_dir, exist_ok=True)
    sections = []
    for person in cfg['people']:
        rows = []
        for i, c in enumerate(person['candidates']):
            vid, added = c['voice_id'], False
            cached = os.path.exists(sample_path(vid, person['text'], model, settings))
            if c.get('public_owner_id') and not cached:
                vid, added = add_library_voice(c['public_owner_id'], c['voice_id'], f"HD {person['who']} {c['name']}")
            src = sample(vid, person['text'], model, settings)
            if added and cfg.get('cleanup'):
                delete_voice(vid)  # keep voice slots free; the chosen ones are added again later
            fname = f"{person['who']}-{i + 1}.mp3"
            with open(src, 'rb') as f, open(os.path.join(out_dir, fname), 'wb') as g:
                g.write(f.read())
            letter = chr(65 + i)
            rows.append(f'<div class="cand"><span class="letter">{letter}</span>'
                        f'<button class="play" data-src="{fname}" type="button">▶ Play {letter}</button>'
                        f'<span class="note">{html.escape(c.get("note", ""))}</span></div>')
        sections.append(f'<section><h2>{html.escape(person["label"])}</h2>'
                        f'<p class="line">“{html.escape(person["text"])}”</p>{"".join(rows)}</section>')
    page = PAGE.replace('{sections}', '\n'.join(sections))
    with open(os.path.join(out_dir, 'index.html'), 'w', encoding='utf-8') as f:
        f.write(page)
    print('audition page:', os.path.join(out_dir, 'index.html'))


PAGE = """<title>Voice Audition</title>
<style>
:root { --bg:#EDF0F3; --surface:#fff; --ink:#141A20; --muted:#55606B; --line:#CFD6DD; --yellow:#FFC21A; --yellow-ink:#17150C; color-scheme: light; }
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { --bg:#0E1216; --surface:#171E25; --ink:#ECEFF2; --muted:#9AA6B1; --line:#2C3640; --yellow:#FFC833; --yellow-ink:#17150C; color-scheme: dark; } }
:root[data-theme="dark"] { --bg:#0E1216; --surface:#171E25; --ink:#ECEFF2; --muted:#9AA6B1; --line:#2C3640; --yellow:#FFC833; --yellow-ink:#17150C; color-scheme: dark; }
body { background: var(--bg); color: var(--ink); font: 17px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; margin: 0; }
main { max-width: 640px; margin: 0 auto; padding-block: 20px 48px; padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); display: grid; gap: 18px; }
h1 { margin: 0; font-size: 1.8rem; } h2 { margin: 0 0 4px; font-size: 1.2rem; }
section { background: var(--surface); border: 1px solid var(--line); border-radius: 14px; padding: 16px; display: grid; gap: 10px; }
.line { margin: 0; color: var(--muted); font-style: italic; }
.cand { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.letter { font-weight: 800; width: 1.5em; }
.play { min-height: 44px; padding: 8px 16px; border-radius: 12px; border: 0; background: var(--yellow); color: var(--yellow-ink); font: 700 1rem system-ui, sans-serif; cursor: pointer; }
.play.on { outline: 3px solid var(--ink); }
.note { color: var(--muted); font-size: .92rem; }
.tip { color: var(--muted); margin: 0; }
</style>
<main>
<h1>Voice audition</h1>
<p class="tip">Listen to each voice, then tell Claude your choice, for example: “Officer B, You A, Teacher C”. On iPhone, turn off silent mode first. · Ouça cada voz e diga sua escolha ao Claude, por exemplo: “Officer B, You A, Teacher C”.</p>
{sections}
<p class="tip">Voices by ElevenLabs.</p>
</main>
<script>
var player = new Audio(), current = null;
function play(btn) {
  var src = btn.getAttribute('data-src');
  if (current) current.classList.remove('on');
  current = btn; btn.classList.add('on');
  player.onended = function () { btn.classList.remove('on'); };
  player.onerror = function () {
    // some pages block direct audio files: try a blob URL instead
    fetch(src).then(function (r) { return r.blob(); }).then(function (b) {
      player.onerror = null; player.src = URL.createObjectURL(b); player.play();
    });
  };
  player.src = src;
  var p = player.play(); if (p && p.catch) p.catch(function () {});
}
document.querySelectorAll('.play').forEach(function (b) { b.addEventListener('click', function () { play(b); }); });
</script>
"""


def main():
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest='cmd', required=True)
    sub.add_parser('status')
    sub.add_parser('voices')
    s = sub.add_parser('search')
    s.add_argument('--accent')
    s.add_argument('--gender')
    s.add_argument('--age')
    s.add_argument('--text')
    s.add_argument('--n', type=int, default=10)
    d = sub.add_parser('delete')
    d.add_argument('voice_ids', nargs='+')
    ad = sub.add_parser('add')
    ad.add_argument('public_owner_id')
    ad.add_argument('voice_id')
    ad.add_argument('name')
    a2 = sub.add_parser('audition')
    a2.add_argument('config')
    a2.add_argument('out')
    a = ap.parse_args()
    if a.cmd == 'status':
        print(json.dumps(status(), indent=1))
    elif a.cmd == 'voices':
        for v in my_voices():
            lab = v.get('labels') or {}
            print(f"{v['voice_id']}  {v['name']:<22} {v.get('category', ''):<12} {lab.get('accent', '')} / {lab.get('gender', '')} / {lab.get('age', '')} / {lab.get('description', lab.get('descriptive', ''))}")
    elif a.cmd == 'search':
        for v in search(a.accent, a.gender, a.age, a.n, a.text):
            print(f"{v['voice_id']}  owner={v.get('public_owner_id')}  {v.get('name', ''):<24} accent={v.get('accent')} {v.get('gender')} {v.get('age')} "
                  f"free={v.get('free_users_allowed')} uses={v.get('usage_character_count_1y')} | {(v.get('description') or v.get('descriptive') or '')[:80]}")
    elif a.cmd == 'delete':
        for v in a.voice_ids:
            delete_voice(v)
            print('deleted', v)
    elif a.cmd == 'add':
        print(add_library_voice(a.public_owner_id, a.voice_id, a.name))
    elif a.cmd == 'audition':
        audition(a.config, a.out)


if __name__ == '__main__':
    main()
