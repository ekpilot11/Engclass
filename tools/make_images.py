#!/usr/bin/env python3
"""
Hello Dubai: make the lesson pictures with OpenAI's image model.

    node tools/list-images.js --stops passport --people you,officer > /tmp/images.json
    .venv/bin/python tools/make_images.py /tmp/images.json --max 20

- The API key is never stored here. Set OPENAI_API_KEY, or run where a proxy adds it.
- Pictures are cached in tools/.image-cache, so only new or changed prompts cost money.
  --only key1,key2 --variant 2   makes a new version of those pictures.
- --max N stops before making more than N new pictures (protection against surprises).
- Output: img/<kind>/<name>.webp and img/index.js (the list the website reads).
"""
import argparse
import base64
import hashlib
import io
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request
import uuid

from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = os.path.join(ROOT, 'tools', '.image-cache')
OUT = os.path.join(ROOT, 'img')
API = 'https://api.openai.com/v1'
KEY = os.environ.get('OPENAI_API_KEY', 'sk-proxy-adds-the-key')
SIZES = {'vocab': (400, 400), 'scene': (960, 540), 'people': (256, 256)}


def call(method, path, body=None, headers=None, timeout=360):
    h = {'Authorization': 'Bearer ' + KEY}
    h.update(headers or {})
    for attempt in range(4):
        req = urllib.request.Request(API + path, data=body, headers=h, method=method)
        try:
            with urllib.request.urlopen(req, timeout=timeout) as r:
                return json.loads(r.read())
        except urllib.error.HTTPError as e:
            msg = e.read().decode('utf-8', 'replace')
            if e.code in (429, 500, 502, 503) and attempt < 3:
                time.sleep(8 * (attempt + 1))
                continue
            sys.exit(f'OpenAI error {e.code} on {path}: {msg[:800]}')
        except (urllib.error.URLError, TimeoutError) as e:
            if attempt < 3:
                time.sleep(8 * (attempt + 1))
                continue
            sys.exit(f'Network error on {path}: {e}')


def pick_model(wanted):
    ids = sorted(m['id'] for m in call('GET', '/models')['data'] if 'image' in m['id'] and m['id'].startswith('gpt'))
    print('image models on this account:', ', '.join(ids) or '(none)')
    if wanted:
        if wanted not in ids:
            sys.exit(f'Model {wanted} is not available on this account.')
        return wanted
    full = [i for i in ids if 'mini' not in i and not re.search(r'\d{4}-\d{2}-\d{2}', i)] or ids
    if not full:
        sys.exit('No image model available. Is the organization verified for image generation?')

    def version(i):
        nums = re.findall(r'\d+(?:\.\d+)?', i)
        return [float(n) for n in nums] or [0]
    full.sort(key=lambda i: (version(i), -len(i)))
    return full[-1]


def multipart(fields, files):
    boundary = uuid.uuid4().hex
    out = io.BytesIO()
    for k, v in fields.items():
        out.write(f'--{boundary}\r\nContent-Disposition: form-data; name="{k}"\r\n\r\n{v}\r\n'.encode())
    for name, path in files:
        with open(path, 'rb') as f:
            data = f.read()
        out.write(f'--{boundary}\r\nContent-Disposition: form-data; name="{name}"; filename="{os.path.basename(path)}"\r\n'
                  f'Content-Type: image/png\r\n\r\n'.encode())
        out.write(data)
        out.write(b'\r\n')
    out.write(f'--{boundary}--\r\n'.encode())
    return out.getvalue(), f'multipart/form-data; boundary={boundary}'


def generate(job, model, quality, ref_paths):
    if ref_paths:
        fields = {'model': model, 'prompt': job['prompt'], 'size': job['size'], 'quality': quality, 'n': '1'}
        body, ctype = multipart(fields, [('image[]', p) for p in ref_paths])
        res = call('POST', '/images/edits', body, {'Content-Type': ctype})
    else:
        body = json.dumps({'model': model, 'prompt': job['prompt'], 'size': job['size'], 'quality': quality, 'n': 1}).encode()
        res = call('POST', '/images/generations', body, {'Content-Type': 'application/json'})
    return base64.b64decode(res['data'][0]['b64_json'])


def export(png, kind, path):
    im = Image.open(io.BytesIO(png)).convert('RGB')
    W, H = SIZES[kind]
    w, h = im.size
    target = W / H
    if w / h > target:
        nw = int(h * target)
        im = im.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
    else:
        nh = int(w / target)
        im = im.crop((0, (h - nh) // 2, w, (h - nh) // 2 + nh))
    im = im.resize((W, H), Image.LANCZOS)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    im.save(path, 'WEBP', quality=82, method=6)


def write_index():
    entries = {}
    for kind in sorted(SIZES):
        folder = os.path.join(OUT, kind)
        if not os.path.isdir(folder):
            continue
        for name in sorted(os.listdir(folder)):
            if not name.endswith('.webp'):
                continue
            with open(os.path.join(folder, name), 'rb') as f:
                v = hashlib.sha1(f.read()).hexdigest()[:8]
            entries[f'{kind}/{name[:-5]}'] = f'img/{kind}/{name}?v={v}'
    with open(os.path.join(OUT, 'index.js'), 'w', encoding='utf-8') as f:
        f.write('/* Generated by tools/make_images.py: the lesson pictures that exist. */\n')
        f.write('window.HD_IMAGES = ' + json.dumps(entries, indent=1) + ';\n')
    return len(entries)


def contact_sheet(items, path):
    thumbs = []
    for key, png in items:
        im = Image.open(io.BytesIO(png)).convert('RGB')
        im.thumbnail((360, 360))
        thumbs.append((key, im))
    cols = 4
    rows = (len(thumbs) + cols - 1) // cols
    sheet = Image.new('RGB', (cols * 380, rows * 400), 'white')
    draw = ImageDraw.Draw(sheet)
    for i, (key, im) in enumerate(thumbs):
        x, y = (i % cols) * 380 + 10, (i // cols) * 400 + 10
        sheet.paste(im, (x, y))
        draw.text((x, y + 365), key, fill='black')
    sheet.save(path, quality=85)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('jobs')
    ap.add_argument('--model')
    ap.add_argument('--quality', default='medium')
    ap.add_argument('--only', help='comma-separated keys to make (default: all in the list)')
    ap.add_argument('--variant', default='1', help='change to get a new version of --only pictures')
    ap.add_argument('--max', type=int, default=20, help='stop before making more than this many new pictures')
    ap.add_argument('--contact', help='write a contact sheet JPEG of the pictures made in this list')
    a = ap.parse_args()

    jobs = json.load(open(a.jobs, encoding='utf-8'))
    only = set(a.only.split(',')) if a.only else None
    os.makedirs(CACHE, exist_ok=True)
    map_path = os.path.join(CACHE, 'map.json')
    cmap = json.load(open(map_path)) if os.path.exists(map_path) else {}

    model = None
    made = 0
    done = []
    for job in jobs:
        if only and job['key'] not in only and job['key'] != 'sheet':
            continue
        refs = [os.path.join(CACHE, cmap[r]) for r in job['refs'] if r in cmap]
        if len(refs) != len(job['refs']):
            sys.exit(f"{job['key']} needs {job['refs']} first.")
        variant = a.variant if (only and job['key'] in only) else '1'
        ref_ids = ','.join(cmap[r] for r in job['refs'])
        h = hashlib.sha1('|'.join([job['prompt'], job['size'], a.quality, ref_ids, variant, a.model or 'auto']).encode()).hexdigest()[:16]
        fname = f'{h}.png'
        cpath = os.path.join(CACHE, fname)
        if not os.path.exists(cpath):
            if made >= a.max:
                sys.exit(f'Stopped: --max {a.max} new pictures reached. Run again with a higher --max to continue.')
            if model is None:
                model = pick_model(a.model)
                print('using model:', model)
            print(f"making {job['key']} …", flush=True)
            png = generate(job, model, a.quality, refs)
            with open(cpath, 'wb') as f:
                f.write(png)
            made += 1
        cmap[job['key']] = fname
        with open(map_path, 'w') as f:
            json.dump(cmap, f, indent=1)
        with open(cpath, 'rb') as f:
            png = f.read()
        done.append((job['key'], png))
        if job['kind'] in SIZES:
            kind, name = job['key'].split('/', 1)
            export(png, kind, os.path.join(OUT, kind, name + '.webp'))

    n = write_index()
    if a.contact:
        contact_sheet(done, a.contact)
    print(f'{made} new pictures made; {n} pictures in img/index.js')


if __name__ == '__main__':
    main()
