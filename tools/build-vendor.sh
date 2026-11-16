#!/bin/bash
# Hello Dubai: builds js/vendor/elevenlabs-client.js, the official ElevenLabs browser client for live
# conversations (with the libraries it contains), as one minified file, and js/vendor/LICENSES.txt.
#
#   tools/build-vendor.sh            the version below
#   tools/build-vendor.sh 1.33.0     another version (test "Live conversation" on a phone afterwards)
#
# The website loads this file only when a live conversation starts. Needs node and npm.
set -euo pipefail

VERSION="${1:-1.32.1}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/js/vendor"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

cd "$TMP"
npm init -y > /dev/null
npm install --no-audit --no-fund --silent "@elevenlabs/client@$VERSION" esbuild@0.28.2
./node_modules/.bin/esbuild node_modules/@elevenlabs/client/dist/lib.iife.js \
  --minify --target=es2019 --legal-comments=none --log-level=warning --outfile=client.min.js

mkdir -p "$OUT"
{
  echo "/*! @elevenlabs/client $VERSION (MIT, (c) ElevenLabs), with livekit-client (Apache-2.0) and other libraries."
  echo " *  Their licenses are in js/vendor/LICENSES.txt. Built by tools/build-vendor.sh: do not edit. */"
  # in a function of its own, so that only "ElevenLabsClient" becomes a global name
  echo "(function(){"
  cat client.min.js
  echo "window.ElevenLabsClient=ElevenLabsClient;})();"
} > "$OUT/elevenlabs-client.js"

# The license of every library in the bundle.
node - "$OUT/LICENSES.txt" <<'EOF'
const fs = require('fs');
const path = require('path');
const seen = new Map();
function walk(name) {
  if (seen.has(name)) return;
  const dir = path.join('node_modules', name);
  let pkg;
  try { pkg = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8')); } catch (e) { return; }
  const file = fs.readdirSync(dir).find(f => /^licen[sc]e/i.test(f));
  seen.set(name, { version: pkg.version, license: pkg.license, text: file ? fs.readFileSync(path.join(dir, file), 'utf8').trim() : '' });
  Object.keys(pkg.dependencies || {}).forEach(walk);
}
walk('@elevenlabs/client');
let out = 'js/vendor/elevenlabs-client.js contains these libraries. Their licenses follow.\n\n';
for (const [name, p] of seen) out += `- ${name} ${p.version} (${p.license})\n`;
for (const [name, p] of seen) {
  out += `\n\n${'='.repeat(78)}\n${name} ${p.version} (${p.license})\n${'='.repeat(78)}\n\n`;
  out += p.text || `No license file in the package. License: ${p.license}.`;
  out += '\n';
}
fs.writeFileSync(process.argv[2], out);
EOF

echo "wrote js/vendor/elevenlabs-client.js ($(wc -c < "$OUT/elevenlabs-client.js") bytes) and js/vendor/LICENSES.txt"
