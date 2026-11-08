# Hello Dubai

A small, friendly website for practising the English you need when you move to Dubai,
written for a Brazilian family travelling with twins, grandma and the nanny.
Every screen has optional help in Brazilian Portuguese.

There are two journeys with 10 stops, from boarding the plane to the taxi:

| Journey | Stop | What you practise |
|---------|------|-------------------|
| On the plane | Finding your seats | Boarding passes, rows and seats, asking to sit together, the children's seatbelts |
| | Food and drinks | "Chicken or fish?", children's meals, warm milk, tea or coffee |
| | Help during the flight | Blankets, toilets (vacant / occupied), turbulence, a sick child, translating for grandma |
| | Landing | The captain's announcement (time, temperature), heavy bags, collecting the stroller |
| Arriving at DXB | Reading the signs | 22 real airport signs in English and Arabic, "Which sign?" quiz, putting the route in order |
| | Passport control | Introducing the family (mother, nanny, twins), asking the officer to repeat, "They are two", not "They have two years" |
| | Baggage claim | Belts and trolleys, oversized baggage (stroller, car seats), a missing suitcase |
| | Customs | Green and red channels, the children's medicine and prescription (not "recipe"!), milk powder |
| | Asking for help | Toilets, baby care room, ATM, SIM card, Wi-Fi, left / right / straight ahead |
| | Taking a taxi | A big taxi for five, car seats, paying by card, "turn down the AC", receipt vs recipe |

Each stop has up to four activities:

- **New words**: picture cards with sound and the Portuguese word, then a "listen and tap the picture" game.
- **Listen**: the conversation as a chat. Play everything or one line at a time, hide the words for a harder challenge, show the Portuguese translation, and answer questions.
- **Fill the gaps**: listen and complete the conversation by tapping words (no typing on the phone).
- **Your turn**: a role-play. The staff speak (their words are blurred until you need them) and you choose the right reply. Wrong answers explain *why*, in English and Portuguese.

There is also:

- a **Phrasebook** with a "Show" button that puts a sentence in big letters (with the Portuguese below), including cards for **grandma and the nanny**, who don't speak English;
- **passport stamps** for every stop you finish;
- a **slow speech** button (🐢) on every page;
- a **Portuguese help** switch in Settings, to turn the translations off when she is ready.

## Sound

**Recorded voices (default).** Every sentence (about 550) was recorded in advance with the open-source
[Kokoro](https://github.com/hexgrad/kokoro) voice model (Apache-2.0), using British and American voices.
The recordings are MP3 files inside `audio/`, so the sound is the same on every phone and doesn't depend
on the phone's speech engine. Each lesson only downloads its own sounds (under 1 MB).

**Device voices (optional).** In Settings you can switch to the phone's own voices, which allows other accents:
Dubai mix, British, American, Indian and an experimental Arabic accent. If a recording can't play
(for example because a page blocks audio), the app uses the device voice automatically.

**No sound on iPhone?** Turn off silent mode (the switch or Action button on the side of the phone),
turn up the volume, and tap a ▶ button again. iPhones only start sound after a tap.

**Speaking practice ("Say it")**: in Chrome, Edge and Safari, you can tap "Say it" and speak your sentence.
The website shows which words it understood. This needs the microphone and an internet connection.
It is hidden in browsers that can't do it.

## Put it online (free, with GitHub Pages)

1. On GitHub, open this repository → **Settings** → **Pages**.
2. Under **Build and deployment**, choose **Source: Deploy from a branch**.
3. Choose the branch with the website (for example `main` after merging, or `claude/english-learning-dubai-gtf7je`) and the folder **/ (root)**, then **Save**.
4. After a minute or two the site is at `https://ekpilot11.github.io/Engclass/`.

GitHub Pages is free for **public** repositories. A private repository needs a paid GitHub plan for Pages.
Nothing personal is stored in this code. Progress is saved only in the browser of the person who uses it.

On the phone, open the site in Safari or Chrome and choose **Add to Home Screen** (Safari: Share button; Chrome: ⋮ menu).
It then opens like an app. In **Settings → Use it on the plane** you can download all the sounds, so the lessons work without internet.

## Try it on your computer

No build step and no installation. From this folder:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>. Opening `index.html` directly also works.

## Add or change lessons

The lessons are in `js/content-flight.js` and `js/content-airport.js`; characters, signs and phrasebook groups are in `js/content.js`.

- A dialogue line is `{ who: "officer", t: "Do you have your [visa]?", pt: "Você tem seu visto?" }`. Words in `[brackets]` become the gaps in "Fill the gaps".
- An optional `say` changes only what is spoken, e.g. `say: "flight E K, two four seven"` for "EK 247".
- In questions the **first** answer is correct; in role-play choices the one with `ok: true` is correct. Options are shuffled on screen.
- Role-play turns: `{ who, t, pt }` a line, `{ sit, pt }` a situation card, `{ choose: [...] }` your reply (with `why` / `whyPt` for wrong answers), `{ ask, askPt, choose }` a listening question. Lines can have `fast: true` or `quiet: true`.
- A new stop only needs an `id`, `title`, `icon` and any of `vocab`, `dialogue`, `roleplay`, `signs`. The activities appear automatically.

After changing English text, record the new sentences (only new or changed ones are recorded):

```bash
python3 -m venv .venv && .venv/bin/pip install kokoro-onnx soundfile   # once
# once: download kokoro-v1.0.onnx and voices-v1.0.bin from
# https://github.com/thewh1teagle/kokoro-onnx/releases (model-files-v1.0) into a folder, e.g. ~/kokoro
node tools/list-speech.js > /tmp/speech.json
.venv/bin/python tools/make_audio.py /tmp/speech.json ~/kokoro
```

Sentences without a recording still work: they use the device voice.

## Files

```
index.html                 the page
css/style.css              the design (light and dark mode)
js/content.js              characters, airport signs, phrasebook groups
js/content-flight.js       journey 1: on the plane
js/content-airport.js      journey 2: arriving at DXB
js/speech-items.js         the list of everything the app can say (shared with the recording tool)
js/speech.js               recorded audio, device voices, speech recognition
js/app.js                  pages and activities
audio/                     recorded sentences (generated by tools/make_audio.py)
tools/                     recording tools
sw.js                      offline support
manifest.webmanifest       "Add to Home Screen" app settings
icons/                     app icons
```
