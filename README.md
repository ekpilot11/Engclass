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

**Animated scenes.** In lessons that have camera places (so far: Passport control), "Listen" and "Your turn"
play on the lesson picture like a little film. The camera moves to the person who speaks or is talked about,
the words light up while they are spoken, the speaker's portrait moves with the voice, and a word card pops up
when a word of the lesson is said. Other lessons keep the chat layout until their camera places are set.

**Challenges.** Lessons can have three harder activities (so far: Passport control). They don't count for the
passport stamp, so nothing she already earned changes.

- **Build the sentence**: tap mixed-up words into the right order. There are trap words ("have" in
  "They are two"), and a wrong answer explains the mistake. First with sound, then from the Portuguese only.
- **Catch the number**: hear a line with the words hidden and pick the number (14 or 40? 60 or 16?).
- **Final test**: 10 mixed questions with no Portuguese, hidden words, two listens per line and 3 hearts.
  8 right answers turn the lesson's stamp **gold**.

There is also:

- a **Daily review** on the home page: up to 8 questions from what she got wrong (they come back the same
  day) and what she got right (it comes back after 1, 2, 4, 8 and 16 days);
- a **Phrasebook** with a "Show" button that puts a sentence in big letters (with the Portuguese below), including cards for **grandma and the nanny**, who don't speak English;
- **passport stamps** for every stop you finish;
- **miles**: 10 for a right answer on the first try, 5 after a mistake, 20 for finishing an activity.
  The home page shows today's miles against a **daily goal** (100, 200 or 300, chosen in Settings),
  how many **days in a row** she has practised, and her level (Blue, Silver, Gold, Platinum);
- short **game sounds** for right and wrong answers (they can be turned off in Settings);
- a **slow speech** button (🐢) on every page;
- a **Portuguese help** switch in Settings, to turn the translations off when she is ready.

## Sound

**Recorded voices (default).** Every sentence (about 550) is recorded in advance and stored as MP3
files inside `audio/`, so the sound is the same on every phone and doesn't depend on the phone's
speech engine. Each lesson only downloads its own sounds (about 1 MB).

All lessons and the phrasebook are recorded with **ElevenLabs** voices with real accents, chosen by the
family in a voice audition. The voices are listed in `tools/voices.json`:

| Person | Voice |
|--------|-------|
| You (the learner's own lines) | Ana, Brazilian-accented English |
| Teacher (tips, words) | Alice, British |
| Passport officer / customs officer | Emirati man / Salma, Arabic-accented English |
| Baggage porter, information desk, taxi marshal, taxi driver | Raju, Alisha, Viraj, Raju: Indian English |
| Baggage services agent | Rachel, Filipino English |
| Captain / flight attendants | George, British / Lily, British and Charlie, Australian |
| Passenger on the plane | Chris, American |

**Kokoro** (open source, Apache-2.0) British and American voices are used for any new sentence that is
recorded without ElevenLabs.

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
- Challenges are optional lists on a stop:
  - `build: [{ t, pt, trap: ["have"], why, whyPt }]`: her own sentences to put in order. `trap` words don't
    belong in the sentence; `why` is shown when she gets it wrong.
  - `numbers: [{ who, t, pt, ask, askPt, a: ["14", "40", "4"] }]`: lines with a number; the **first** answer is correct.
    Write the number as words in `t` ("counter fourteen") so it is spoken correctly.
  - `test: true`: a final test made from the stop's words, role-play, numbers and sentences.

After changing English text, record the new sentences (only new or changed ones are recorded):

```bash
python3 -m venv .venv && .venv/bin/pip install kokoro-onnx soundfile   # once
# once: download kokoro-v1.0.onnx and voices-v1.0.bin from
# https://github.com/thewh1teagle/kokoro-onnx/releases (model-files-v1.0) into a folder, e.g. ~/kokoro
node tools/list-speech.js > /tmp/speech.json
.venv/bin/python tools/make_audio.py /tmp/speech.json ~/kokoro
```

Sentences without a recording still work: they use the device voice.

### Voices with accents (ElevenLabs)

`tools/voices.json` says which person speaks with which ElevenLabs voice, and in which lessons
(`"packs": ["*"]` means all). `make_audio.py` uses it automatically; `--max-chars` stops a run that
would use more characters than expected. `tools/elevenlabs.py` helps choose voices:

```bash
.venv/bin/python tools/elevenlabs.py status                      # characters left this month
.venv/bin/python tools/elevenlabs.py search --accent indian --gender female
.venv/bin/python tools/elevenlabs.py audition tools/audition.json /tmp/audition   # listen-and-choose page
```

The API key is never stored in this project: set `ELEVENLABS_API_KEY` in your shell when you run the tools.

### Pictures (OpenAI)

Every picture has a description in the lesson content: `imgScene` for a lesson scene, and `img` (plus
`imgFamily: true` when the family is in it) for a word card. One style guide and the family's look are in
`tools/image-style.json`. A family "character sheet" is made first and used as a reference, so the family looks
the same in every picture.

```bash
.venv/bin/pip install pillow                                      # once
node tools/list-images.js --stops taxi > /tmp/images.json         # or no --stops for everything
OPENAI_API_KEY=... .venv/bin/python tools/make_images.py /tmp/images.json \
    --model gpt-image-2.6-sunburst --vocab-quality low --max 20 --contact /tmp/contact.jpg
```

Pictures are cached, so only new descriptions cost money; `--max` limits how many are made in one run, and the
spending is logged. `--only KEY --variant 2` makes a new version of one picture. A missing picture simply shows
the emoji.

### Animated scenes

A lesson gets an animated scene when its stop has `imgSpots`: the places the camera can look at in the scene
picture.

```js
imgSpots: {
  officer: [0.85, 0.30, 2.2],                    // x, y (0 to 1) and zoom
  grandma: [0.225, 0.23, 2.2, 0.16],             // a 4th number adds a spotlight of that size around x, y
  camera:  [0.905, 0.50, 2.1, 0.12, 0.86, 0.42]  // a 5th and 6th move the middle of the shot
}
```

A line looks at the place named like its speaker (`officer`, `you`), or at the place named in its `cam`:
`{ who: "officer", t: "Who is this lady?", cam: "grandma" }`.

Then make the larger copy of the picture and the word times (both use the caches, so they cost little or nothing):

```bash
node tools/list-images.js > /tmp/images.json
.venv/bin/python tools/make_images.py /tmp/images.json --model gpt-image-2.6-sunburst --only scene/passport --max 0
node tools/list-speech.js > /tmp/speech.json
.venv/bin/python tools/make_timings.py /tmp/speech.json --packs passport
```

`make_timings.py` measures when each word is spoken in the recordings. It uses ElevenLabs forced alignment when
the API key has that permission, otherwise OpenAI `whisper-1` (about $0.006 for a minute of sound), otherwise an
estimate from the pauses. Run it again after `make_audio.py` records new sentences; `--upgrade` measures again
where a better source has become available. With device voices, or without word times, a whole line lights up
at once.

## Files

```
index.html                 the page
css/style.css              the design (light and dark mode)
js/content.js              characters, airport signs, phrasebook groups
js/content-flight.js       journey 1: on the plane
js/content-airport.js      journey 2: arriving at DXB
js/speech-items.js         the list of everything the app can say (shared with the recording tool)
js/speech.js               recorded audio, device voices, speech recognition
js/image-items.js          names of the lesson pictures
js/pictograms.js           airport sign pictograms (SVG)
img/                       lesson pictures (generated by tools/make_images.py); img/stage/ has the larger scenes
js/game.js                 miles, daily goal, streak, levels, review boxes, game sounds, confetti
js/stage.js                the animated scene: camera, words that light up, word cards
js/app.js                  pages and activities
audio/                     recorded sentences (generated by tools/make_audio.py)
audio/times-*.js           when each word is spoken (generated by tools/make_timings.py)
audio/sfx.js               game sounds (generated by tools/make_sfx.py, needs only ffmpeg)
tools/                     recording tools
sw.js                      offline support
manifest.webmanifest       "Add to Home Screen" app settings
icons/                     app icons
```
