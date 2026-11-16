#!/usr/bin/env python3
"""
Makes the short game sounds (right answer, wrong answer, activity finished, stamp) with ffmpeg
and writes them into audio/sfx.js. No downloads and no API: the sounds are simple synthesised tones.

    python3 tools/make_sfx.py
"""
import base64
import json
import os
import subprocess
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'audio', 'sfx.js')


def note(freq, start, decay, gain=0.32):
    """A soft bell-like note: a sine with a quieter octave above it, fading out."""
    t = f'(t-{start})'
    return (f'{gain}*(sin(2*PI*{freq}*{t})+0.3*sin(2*PI*{freq * 2}*{t}))'
            f'*exp(-{decay}*{t})*gte(t,{start})')


SOUNDS = {
    # two rising notes
    'right': (0.45, '+'.join([note(659.25, 0, 16), note(987.77, 0.09, 9)])),
    # two soft falling notes (never a harsh buzzer); not too low, so phone speakers can play them
    'wrong': (0.42, '+'.join([note(329.63, 0, 13, 0.26), note(261.63, 0.11, 10, 0.26)])),
    # a small rising fanfare
    'done': (1.1, '+'.join([note(523.25, 0, 7, 0.24), note(659.25, 0.1, 7, 0.24),
                            note(783.99, 0.2, 7, 0.24), note(1046.5, 0.3, 4.5, 0.28)])),
    # a passport stamp: a short thump with a little paper noise
    'stamp': (0.3, '0.5*sin(2*PI*180*t)*exp(-28*t)+0.25*sin(2*PI*360*t)*exp(-40*t)'
                   '+0.16*(random(0)*2-1)*exp(-70*t)'),
}


def main():
    data = {}
    with tempfile.TemporaryDirectory() as tmp:
        for name, (seconds, expr) in SOUNDS.items():
            path = os.path.join(tmp, name + '.mp3')
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'lavfi',
                            '-i', f"aevalsrc='{expr}':d={seconds}:s=44100",
                            '-af', f'afade=t=out:st={seconds - 0.05}:d=0.05',
                            '-ac', '1', '-ar', '24000', '-b:a', '48k', path], check=True)
            with open(path, 'rb') as f:
                data[name] = base64.b64encode(f.read()).decode('ascii')
            print(f'{name}: {os.path.getsize(path)} bytes')
    with open(OUT, 'w', encoding='utf-8') as f:
        f.write('window.HD_SFX = ' + json.dumps(data, separators=(',', ':')) + ';\n')
    print('wrote', os.path.relpath(OUT, ROOT), os.path.getsize(OUT), 'bytes')


if __name__ == '__main__':
    main()
