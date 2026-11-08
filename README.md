# Hello Dubai

A small, friendly website for practising the English you need when you move to Dubai.
The first journey is **Arriving at DXB**, with 7 stops, from the plane to the taxi:

| # | Stop | What you practise |
|---|------|-------------------|
| 1 | Landing | The captain's announcement (time, temperature), asking the crew for help |
| 2 | Reading the signs | 21 real airport signs in English and Arabic, "Which sign?" quiz, putting the route in order |
| 3 | Passport control | Answering the officer, asking him to repeat, "Yes, they are" vs "Yes, it is" |
| 4 | Baggage claim | Belts and trolleys, a missing suitcase, a damaged suitcase |
| 5 | Customs | Green and red channels, medicines and prescriptions, cash rules |
| 6 | Asking for help | Toilets, ATM, SIM card, Wi-Fi, understanding left / right / straight ahead |
| 7 | Taking a taxi | Giving the address, paying by card, "turn down the AC", receipt vs recipe |

Each stop has up to four activities:

- **New words**: picture cards with sound, then a "listen and tap the picture" game.
- **Listen**: the conversation as a chat. Play everything or one line at a time, hide the words for a harder challenge, and answer questions.
- **Fill the gaps**: listen and complete the conversation by tapping words (no typing on the phone).
- **Your turn**: a role-play. The staff speak (their words are blurred until you need them) and you choose the right reply. Wrong answers explain *why* they are wrong.

There is also:

- a **Phrasebook** with a "Show" button that puts a sentence in big letters, so you can show it to someone at the airport;
- **passport stamps** for every stop you finish;
- a **slow speech** button (🐢) on every page.

## Sound and accents

The audio uses the voices that are already on the phone or computer (the Web Speech API).
There are no audio files to download, so there is nothing to break.

- **Dubai mix** (default): different people speak with different accents (British, Indian, Filipino, Australian…), like at the real airport.
- **British, American, Indian**: all the airport staff use this accent.
- **Arabic accent (experimental)**: an Arabic voice reads the staff's English. It only works if the device has an Arabic voice, and the quality depends on the device.

The **Voices and accents** page shows which voice each person uses and lets you test them.
Better voices can be installed for free:

- **iPhone / iPad**: Settings → Accessibility → Spoken Content → Voices → English → download an "Enhanced" voice, and also English (India) and Arabic voices.
- **Android**: Settings → search "Text-to-speech" → Google engine settings → Install voice data.
- **Computer**: Microsoft Edge has very natural voices, including Indian English and Arabic.

**Speaking practice ("Say it")**: in Chrome, Edge and Safari, you can tap "Say it" and speak your sentence. The website shows which words it understood. This needs the microphone and an internet connection. It is hidden in browsers that can't do it.

## Put it online (free, with GitHub Pages)

1. On GitHub, open this repository → **Settings** → **Pages**.
2. Under **Build and deployment**, choose **Source: Deploy from a branch**.
3. Choose the branch with the website (for example `main` after merging, or `claude/english-learning-dubai-gtf7je`) and the folder **/ (root)**, then **Save**.
4. After a minute or two the site is at `https://ekpilot11.github.io/Engclass/`.

GitHub Pages is free for **public** repositories. A private repository needs a paid GitHub plan for Pages.
Nothing personal is stored in this code. Progress is saved only in the browser of the person who uses it.

On the phone, open the site and choose **Add to Home Screen** (Safari: Share button; Chrome: ⋮ menu).
It then opens like an app, and after the first visit it also works offline, for example on the plane.

## Try it on your computer

No build step and no installation. From this folder:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>. Opening `index.html` directly also works.

## Add or change lessons

All the lessons are in [`js/content.js`](js/content.js), so you can edit them without changing the app code.

- A dialogue line is `{ who: "officer", t: "Do you have your [visa]?" }`. Words in `[brackets]` become the gaps in "Fill the gaps".
- An optional `say` changes only what is spoken, e.g. `say: "flight E K, two four seven"` for "EK 247".
- In questions and role-play choices, the **first** option (or the one with `ok: true`) is the correct one. Options are shuffled on screen.
- Role-play turns: `{ who, t }` a line, `{ sit: "..." }` a situation card, `{ choose: [...] }` your reply, `{ ask: "...", choose: [...] }` a listening question. Lines can have `fast: true` or `quiet: true`.
- A new stop only needs an `id`, `title`, `icon` and any of `vocab`, `dialogue`, `roleplay`, `signs`. The activities appear automatically.

## Files

```
index.html             the page
css/style.css          the design (light and dark mode)
js/content.js          all lessons, signs, phrases
js/speech.js           voices, accents, speech recognition
js/app.js              pages and activities
sw.js                  offline support
manifest.webmanifest   "Add to Home Screen" app settings
icons/                 app icons
```
