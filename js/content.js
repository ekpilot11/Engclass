/*
 * Hello Dubai — lesson content.
 *
 * Everything the learner sees and hears lives in this file, so new journeys
 * (supermarket, school, doctor…) can be added without touching the app code.
 *
 * Conventions
 * - Dialogue lines: { who, t } where `who` is a key of `characters`.
 *   Words in [square brackets] become the gaps in "Fill the gaps".
 *   Optional `say` replaces the spoken text (e.g. to read "EK 247" as "E K two four seven").
 * - Comprehension questions and role-play choices: the FIRST option is the correct one
 *   (or the one marked ok: true). Options are shuffled when shown.
 * - Role-play turns: { who, t } a line, { sit } a situation card, { choose: [...] } your reply,
 *   { ask, choose } a listening question. Optional line flags: fast, quiet.
 */
window.HD_CONTENT = {
  characters: {
    you:     { name: "You",               avatar: "👩",     group: "you",   gender: "f" },
    teacher: { name: "Teacher",           avatar: "🔊",     group: "you",   gender: "f" },
    pilot:   { name: "Captain",           avatar: "👨‍✈️",   group: "crew",  gender: "m", mixed: ["gb", "au"] },
    crew:    { name: "Flight attendant",  avatar: "💁‍♀️",   group: "crew",  gender: "f", mixed: ["au", "gb"] },
    officer: { name: "Passport officer",  avatar: "👮‍♂️",   group: "staff", gender: "m", mixed: ["gb", "us"] },
    porter:  { name: "Airport staff",     avatar: "👨🏽‍💼", group: "staff", gender: "m", mixed: ["in", "gb"] },
    agent:   { name: "Baggage services",  avatar: "👩🏻‍💼", group: "staff", gender: "f", mixed: ["ph", "in", "gb"] },
    customs: { name: "Customs officer",   avatar: "👮‍♀️",   group: "staff", gender: "f", mixed: ["gb", "us"] },
    info:    { name: "Information desk",  avatar: "👩🏽‍💼", group: "staff", gender: "f", mixed: ["in", "gb"] },
    marshal: { name: "Taxi marshal",      avatar: "🦺",     group: "staff", gender: "m", mixed: ["in", "gb"] },
    driver:  { name: "Taxi driver",       avatar: "🧔🏽",   group: "staff", gender: "m", mixed: ["in", "gb"] }
  },

  /* Airport signs. kind: dir (yellow wayfinding), fac (facility), green / red (customs channels),
     rule (not allowed), warn (yellow notice). Arabic is only given where it is certain. */
  signs: {
    arrivals:    { en: "Arrivals",            ar: "الوصول",        e: "🛬", kind: "dir",  mean: "For passengers who just landed." },
    departures:  { en: "Departures",          ar: "المغادرة",       e: "🛫", kind: "dir",  mean: "For passengers who are flying away." },
    connections: { en: "Connections",                              e: "🔁", kind: "dir",  mean: "For passengers who take another flight. Not for you!" },
    passport:    { en: "Passport Control",    ar: "الجوازات",       e: "🛂", kind: "dir",  mean: "An officer checks your passport and visa." },
    nationals:   { en: "UAE Nationals",       ar: "المواطنون",      e: "🇦🇪", kind: "dir",  mean: "Only for people with a UAE passport." },
    allpass:     { en: "All Passports",       ar: "جميع الجوازات",  e: "🌍", kind: "dir",  mean: "For everybody with a passport from another country." },
    baggage:     { en: "Baggage Claim",       ar: "استلام الأمتعة", e: "🛄", kind: "dir",  mean: "Take your suitcases here." },
    customs:     { en: "Customs",             ar: "الجمارك",        e: "🛃", kind: "dir",  mean: "Officers can check your bags here." },
    nothing:     { en: "Nothing to Declare",                       e: "✓",  kind: "green", mean: "Green channel: you have nothing special in your bags." },
    declare:     { en: "Goods to Declare",                         e: "!",  kind: "red",  mean: "Red channel: you must tell customs about something, for example a lot of cash." },
    exit:        { en: "Exit",                ar: "مخرج",          e: "🚪", kind: "dir",  mean: "The way out." },
    taxi:        { en: "Taxi",                ar: "سيارات الأجرة",  e: "🚕", kind: "dir",  mean: "Get a taxi here." },
    metro:       { en: "Metro",               ar: "المترو",         e: "🚇", kind: "dir",  mean: "The train to the city." },
    meeting:     { en: "Meeting Point",       ar: "نقطة الالتقاء",  e: "🤝", kind: "dir",  mean: "Meet your family or friends here." },
    toilets:     { en: "Toilets",             ar: "دورات المياه",   e: "🚻", kind: "fac",  mean: "Toilets. In American English: restrooms." },
    baby:        { en: "Baby Care",                                e: "🚼", kind: "fac",  mean: "A room to change or feed your baby." },
    info:        { en: "Information",         ar: "الاستعلامات",    e: "ℹ️", kind: "fac",  mean: "Ask your questions here." },
    prayer:      { en: "Prayer Room",         ar: "مصلى",          e: "🕌", kind: "fac",  mean: "A quiet room for prayer." },
    exchange:    { en: "Currency Exchange",   ar: "صرافة",         e: "💱", kind: "fac",  mean: "Change your money into dirhams." },
    trolleys:    { en: "Trolleys",            ar: "عربات الأمتعة",  e: "🛒", kind: "fac",  mean: "Carts for your suitcases. They are free at DXB." },
    lost:        { en: "Lost & Found",        ar: "المفقودات",      e: "🔎", kind: "fac",  mean: "Go here if you lose something." },
    nophotos:    { en: "No Photos",           ar: "ممنوع التصوير",  e: "📷", kind: "rule", mean: "Do not take pictures here." },
    waitline:    { en: "Please wait behind the line",              e: "🧍", kind: "warn", mean: "Stand here until the officer calls you." }
  },

  journeys: [
    {
      id: "airport",
      title: "Arriving at DXB",
      stops: [
        /* ------------------------------------------------------------------ 1 */
        {
          id: "plane",
          title: "Landing",
          ar: "الهبوط",
          icon: "🛬",
          sub: "Listen to the captain",
          scene: "💺 🛬 🌇",
          intro: "Your plane is landing in Dubai. Listen to the captain and the flight attendant, and ask for help with your bag.",
          tips: [
            "Listen for the local time and the temperature. From June to September, Dubai is often over 40°C!",
            "Ask the cabin crew for help with heavy bags: “Could you help me, please?”"
          ],
          vocab: [
            { e: "🛬", w: "landing", ex: "We are landing in Dubai." },
            { e: "💺", w: "seatbelt", ex: "Please keep your seatbelt fastened." },
            { e: "🕖", w: "local time", ex: "The local time is seven forty-five." },
            { e: "🌡️", w: "temperature", ex: "The temperature is thirty-four degrees." },
            { e: "🎒", w: "belongings", ex: "Take all your belongings with you.", note: "= your things" },
            { e: "🧳", w: "overhead locker", ex: "My bag is in the overhead locker." },
            { e: "🏋️", w: "heavy", ex: "My bag is very heavy." },
            { e: "💁‍♀️", w: "flight attendant", ex: "The flight attendant helps the passengers." }
          ],
          dialogue: {
            lines: [
              { who: "pilot", t: "Ladies and gentlemen, [welcome] to Dubai." },
              { who: "pilot", t: "The local time is seven [forty-five] in the evening, and the temperature is [thirty-four] degrees." },
              { who: "crew", t: "Please stay in your seat with your [seatbelt] fastened." },
              { who: "crew", t: "When you leave the plane, please take all your [belongings] with you." },
              { who: "you", t: "Excuse me, could you help me with my bag, please? It’s very [heavy]." },
              { who: "crew", t: "Of course. Is it this black one?" },
              { who: "you", t: "Yes, that’s right. Thank you so much." },
              { who: "crew", t: "You’re welcome. Do you have everything? The children’s bags too?" },
              { who: "you", t: "Yes, we have [everything]." },
              { who: "crew", t: "Great. Follow the signs to [Arrivals]. Enjoy your stay in Dubai!" }
            ],
            extra: ["fourteen", "fifteen", "Departures", "light"],
            questions: [
              { q: "What is the temperature in Dubai?", a: ["34 degrees", "14 degrees", "45 degrees"] },
              { q: "What time is it in Dubai?", a: ["7:45 in the evening", "7:45 in the morning", "4:45 in the evening"] },
              { q: "What does she need help with?", a: ["Her heavy bag", "Her seatbelt", "Her ticket"] }
            ]
          },
          roleplay: [
            { who: "crew", t: "Would you like something to drink before we land?" },
            { choose: [
              { t: "Yes, a glass of water, please.", ok: true },
              { t: "Yes, I’m landing.", why: "She is offering you a drink. Say what you would like, or “No, thank you.”" },
              { t: "No, I’m from here.", why: "This doesn’t answer her question. Try “Yes, … please” or “No, thank you.”" }
            ] },
            { who: "crew", t: "Here you are. Please fasten your seatbelt now. We are landing soon." },
            { choose: [
              { t: "OK, sorry. Thank you.", ok: true },
              { t: "No, thank you. I’m not hungry.", why: "She didn’t offer food. She asked you to fasten your seatbelt." },
              { t: "Welcome to Dubai!", why: "The crew says this to passengers. You don’t need to say it." }
            ] },
            { sit: "The plane has landed. Your bag is in the overhead locker, but it is too heavy for you." },
            { choose: [
              { t: "Excuse me, could you help me with my bag, please?", ok: true },
              { t: "Give me my bag!", why: "This is too direct and sounds rude. Start with “Excuse me” and use “could you…, please?”" },
              { t: "Where is my bag?", why: "You know where your bag is. You need help to take it down." }
            ] },
            { who: "crew", t: "Of course. Is this your bag?" },
            { choose: [
              { t: "Yes, it is. Thank you so much!", ok: true },
              { t: "Yes, I am.", why: "The question is “Is this…?”, so the answer is “Yes, it is.”" },
              { t: "I’m fine, thanks.", why: "This answers “How are you?”. She asked if this is your bag." }
            ] },
            { who: "crew", t: "You’re welcome. Enjoy your stay in Dubai!" },
            { choose: [
              { t: "Thank you! Goodbye.", ok: true },
              { t: "Me too!", why: "“Me too” means “I also do that.” Here, just say “Thank you!”" },
              { t: "Yes, please.", why: "She is not offering you anything. Say “Thank you!”" }
            ] }
          ],
          phrases: [
            "Could you help me with my bag, please?",
            "Can I have some water, please?",
            "Excuse me, can I get past, please?"
          ]
        },

        /* ------------------------------------------------------------------ 2 */
        {
          id: "signs",
          title: "Reading the signs",
          ar: "اللافتات",
          icon: "🪧",
          sub: "Find your way",
          scene: "🛂 ➜ 🛄 ➜ 🛃 ➜ 🚕",
          intro: "Signs at DXB are in Arabic and English. Learn the important ones, so you always know where to go with the children.",
          tips: [
            "Follow “Arrivals” and “Baggage Claim”. Don’t follow “Connections”: that is for people taking another flight.",
            "Trolleys at DXB are free.",
            "Don’t take photos at passport control or customs."
          ],
          signs: ["arrivals", "connections", "passport", "allpass", "baggage", "trolleys", "customs", "nothing", "declare", "exit", "meeting", "taxi", "metro", "toilets", "baby", "info", "exchange", "prayer", "lost", "nophotos", "waitline"],
          signquiz: [
            { q: "You just got off the plane. You want to leave the airport. Which sign do you follow?", opts: ["arrivals", "departures", "connections"] },
            { q: "You need to show your passport to an officer.", opts: ["passport", "customs", "info"] },
            { q: "You are not from the UAE. Which line do you join?", opts: ["allpass", "nationals"] },
            { sign: "waitline", q: "What does this sign mean?", a: ["Stand here until the officer calls you.", "Walk past the line quickly.", "This line is for children only."] },
            { sign: "nophotos", q: "What does this sign mean?", a: ["Don’t take pictures here.", "You can take pictures here.", "You can buy photos here."] },
            { q: "You want to get your suitcases.", opts: ["baggage", "lost", "departures"] },
            { q: "Your bags are heavy. You need a cart.", opts: ["trolleys", "taxi", "exit"] },
            { q: "Your baby needs a new nappy (American English: diaper).", opts: ["baby", "prayer", "info"] },
            { q: "At customs, you have nothing special in your bags. Which way do you go?", opts: ["nothing", "declare"] },
            { q: "You are carrying AED 70,000 in cash. Which way do you go?", opts: ["declare", "nothing"], note: "In the UAE, you must declare cash over AED 60,000." },
            { sign: "connections", q: "What does this sign mean?", a: ["For passengers taking another flight.", "For passengers leaving the airport.", "For phone and internet connections."] },
            { q: "You only have dollars. You need dirhams.", opts: ["exchange", "info", "taxi"] },
            { q: "Your friend is waiting for you. Where do you meet?", opts: ["meeting", "departures", "customs"] },
            { q: "You want to go to your new home by car.", opts: ["taxi", "metro", "connections"] },
            { q: "You don’t know where to go. You have a question.", opts: ["info", "lost", "exit"], note: "“Lost & Found” is for lost things, not lost people!" }
          ],
          signorder: ["arrivals", "passport", "baggage", "customs", "exit", "taxi"],
          signorderHints: [
            "First, you get off the plane.",
            "Then an officer checks your passport.",
            "Then you take your suitcases.",
            "Then officers can check your bags.",
            "Then you leave the building.",
            "Finally, you get a car to your new home."
          ],
          phrases: [
            "Where is Baggage Claim, please?",
            "Which way is the exit?",
            "Is this the way to Passport Control?"
          ]
        },

        /* ------------------------------------------------------------------ 3 */
        {
          id: "passport",
          title: "Passport control",
          ar: "الجوازات",
          icon: "🛂",
          sub: "Talk to the officer",
          scene: "👮‍♂️ 📘 📷",
          intro: "The officer checks your passports and your visa. Answer simple questions, and ask him to repeat if you don’t understand.",
          tips: [
            "If you don’t understand, say: “Sorry, could you say that again more slowly, please?” Never just say “yes”.",
            "The officer may take a photo and scan your eyes. This is normal.",
            "Later, with your Emirates ID, you may be able to use the fast Smart Gates."
          ],
          vocab: [
            { e: "📘", w: "passport", ex: "Here is my passport." },
            { e: "📄", w: "visa", ex: "This is my residence visa.", note: "Your first visa may be called an “entry permit”." },
            { e: "👮‍♂️", w: "officer", ex: "The officer checks our passports." },
            { e: "🚶‍♀️🚶‍♂️🚶", w: "queue", ex: "Please wait in the queue.", note: "American English: line" },
            { e: "📷", w: "camera", ex: "Please look at the camera." },
            { e: "👓", w: "glasses", ex: "Please take off your glasses." },
            { e: "🎯", w: "purpose", ex: "What is the purpose of your visit?", note: "= the reason" },
            { e: "🏠", w: "live", ex: "We are going to live in Dubai." },
            { e: "👧👦", w: "children", ex: "These are my children." }
          ],
          dialogue: {
            lines: [
              { who: "officer", t: "Good evening. Next, please." },
              { who: "you", t: "Good evening." },
              { who: "officer", t: "[Passports], please." },
              { who: "you", t: "Here you are. This is my passport, and these are my children’s passports." },
              { who: "officer", t: "Thank you. What is the [purpose] of your visit?" },
              { who: "you", t: "We are moving to Dubai. We are going to [live] here." },
              { who: "officer", t: "Do you have your [visa]?" },
              { who: "you", t: "Yes. Here it is." },
              { who: "officer", t: "Is this your [first] time in the UAE?" },
              { who: "you", t: "Yes, it is." },
              { who: "officer", t: "OK. Please take off your [glasses] and look at the [camera]." },
              { who: "officer", t: "Are these your [children]?" },
              { who: "you", t: "Yes, they are." },
              { who: "officer", t: "Everything is fine. [Welcome] to Dubai." },
              { who: "you", t: "Thank you very much!" }
            ],
            extra: ["tickets", "work", "last", "shoes"],
            questions: [
              { q: "Why is the family in Dubai?", a: ["They are moving to Dubai.", "They are on holiday.", "They are taking another flight."] },
              { q: "Is it her first time in the UAE?", a: ["Yes, it is.", "No, it isn’t."] },
              { q: "What does the officer ask her to take off?", a: ["Her glasses", "Her shoes", "Her jacket"] }
            ]
          },
          roleplay: [
            { who: "officer", t: "Good morning. Passport, please." },
            { choose: [
              { t: "Good morning. Here you are.", ok: true },
              { t: "Yes, I am.", why: "He is asking for your passport. Give it to him and say “Here you are.”" },
              { t: "Nothing to declare.", why: "You say this at customs, later. Here, just give him your passport." }
            ] },
            { who: "officer", t: "What is the purpose of your visit?" },
            { choose: [
              { t: "We are moving here. We are going to live in Dubai.", ok: true },
              { t: "Two weeks.", why: "“Two weeks” answers “How long…?”. “Purpose” means the reason." },
              { t: "By plane.", why: "“By plane” answers “How did you come?”. “Purpose” means the reason." }
            ] },
            { sit: "The officer asks the next question very fast." },
            { who: "officer", t: "Do you have your entry permit or your residence visa with you today?", fast: true },
            { choose: [
              { t: "Sorry, could you say that again more slowly, please?", ok: true },
              { t: "Yes.", why: "Never say “yes” if you don’t understand! Ask him to repeat." },
              { t: "What?!", why: "“What?!” can sound rude. Say “Sorry, could you say that again, please?”" }
            ] },
            { who: "officer", t: "Of course. Do you have your visa?" },
            { choose: [
              { t: "Yes, here it is.", ok: true },
              { t: "Yes, I do it.", why: "Say “Yes, I do.” or “Yes, here it is.”" },
              { t: "No, thank you.", why: "“No, thank you” is how you refuse an offer. He wants to see your visa." }
            ] },
            { who: "officer", t: "Please look at the camera." },
            { choose: [
              { t: "OK. Like this?", ok: true },
              { t: "No photos, please.", why: "This is a security camera. You must look at it." },
              { t: "Here is my camera.", why: "He doesn’t want your camera. He wants you to look at his camera." }
            ] },
            { who: "officer", t: "Are these your children?" },
            { choose: [
              { t: "Yes, they are.", ok: true },
              { t: "Yes, it is.", why: "“These” is plural, so we say “Yes, they are.”" },
              { t: "No, thank you.", why: "He asked a yes/no question. Answer “Yes, they are.”" }
            ] },
            { who: "officer", t: "Welcome to Dubai." },
            { choose: [
              { t: "Thank you very much!", ok: true },
              { t: "You’re welcome.", why: "“You’re welcome” is the answer to “Thank you”. Here, say “Thank you!”" },
              { t: "Welcome to you too.", why: "Just say “Thank you!”" }
            ] }
          ],
          phrases: [
            "Here is my passport.",
            "Here is my visa.",
            "We are moving to Dubai.",
            "These are my children.",
            "Sorry, could you say that again more slowly, please?"
          ]
        },

        /* ------------------------------------------------------------------ 4 */
        {
          id: "baggage",
          title: "Baggage claim",
          ar: "استلام الأمتعة",
          icon: "🧳",
          sub: "Find your suitcases",
          scene: "🖥️ 🔄 🧳 🛒",
          intro: "Find your belt on the screen and take a trolley. Oh no, one suitcase is missing! Talk to Baggage Services.",
          tips: [
            "Find your flight number on the screens. It tells you the belt number.",
            "Keep your baggage tags. You need them if a bag is lost.",
            "If a bag doesn’t arrive, go to the Baggage Services desk before you leave the hall."
          ],
          vocab: [
            { e: "🧳", w: "suitcase", ex: "My suitcase is big and black." },
            { e: "🛒", w: "trolley", ex: "The trolleys are free.", note: "American English: cart" },
            { e: "🔄", w: "belt", ex: "Our bags are on belt six.", note: "Also called a carousel" },
            { e: "🖥️", w: "screen", ex: "Look at the screen for your flight number." },
            { e: "🏷️", w: "baggage tag", ex: "Keep your baggage tag. Don’t throw it away!" },
            { e: "❓", w: "missing", ex: "One of my suitcases is missing." },
            { e: "💔", w: "damaged", ex: "My suitcase is damaged.", note: "= broken" },
            { e: "🚚", w: "deliver", ex: "They will deliver the suitcase to your home." },
            { e: "👶", w: "stroller", ex: "Where can I get my stroller?", note: "British English: pushchair" }
          ],
          dialogue: {
            lines: [
              { who: "you", t: "Excuse me, where can I find a [trolley]?" },
              { who: "porter", t: "The trolleys are over there, next to the wall. They are [free]." },
              { who: "you", t: "Thank you. Which [belt] is for flight EK 247?", say: "Thank you. Which belt is for flight E K, two four seven?" },
              { who: "porter", t: "Belt number [six]. Look at the screen." },
              { who: "you", t: "Excuse me. One of our suitcases didn’t [arrive]." },
              { who: "agent", t: "I’m sorry to hear that. Can I see your baggage [tag], please?" },
              { who: "you", t: "Here it is." },
              { who: "agent", t: "Thank you. Can you [describe] the suitcase?" },
              { who: "you", t: "It’s big and black, with a red ribbon on the handle." },
              { who: "agent", t: "OK. Your suitcase is on the next flight. It arrives [tomorrow] morning." },
              { who: "agent", t: "We can [deliver] it to your home. Please write your address and phone number here." },
              { who: "you", t: "Yes, of course. Thank you for your help." }
            ],
            extra: ["sixteen", "cheap", "today", "leave"],
            questions: [
              { q: "Are the trolleys free?", a: ["Yes, they are free.", "No, they cost 10 dirhams."] },
              { q: "When will the suitcase arrive?", a: ["Tomorrow morning", "Tonight", "Next week"] },
              { q: "What does her suitcase look like?", a: ["Big and black, with a red ribbon", "Small and red, with a black ribbon", "Big and blue, with wheels"] }
            ]
          },
          roleplay: [
            { sit: "You can’t find your flight on the screen. You ask a man in an airport uniform." },
            { choose: [
              { t: "Excuse me, which belt is for flight EK 247?", say: "Excuse me, which belt is for flight E K, two four seven?", ok: true },
              { t: "Where is the plane?", why: "You don’t need the plane now. Ask about the belt for your bags." },
              { t: "I want a belt.", why: "Careful! A belt is also something you wear. Ask “Which belt is for my flight?”" }
            ] },
            { who: "porter", t: "Flight EK 247? That’s belt number seven.", say: "Flight E K, two four seven? That’s belt number seven." },
            { ask: "Which belt is it?", choose: [
              { t: "Belt 7", ok: true },
              { t: "Belt 11" },
              { t: "Belt 17" }
            ], hint: "Listen again: “seven”." },
            { sit: "You wait for a long time. One suitcase doesn’t come. You go to Baggage Services." },
            { who: "agent", t: "Hello. How can I help you?" },
            { choose: [
              { t: "Hello. One of my suitcases didn’t arrive.", ok: true },
              { t: "Hello. I have nothing to declare.", why: "That is for customs. Tell her your suitcase didn’t arrive." },
              { t: "Hello. I want to buy a suitcase.", why: "You don’t want a new suitcase! Tell her yours didn’t arrive." }
            ] },
            { who: "agent", t: "I’m sorry. Do you have your baggage tag?" },
            { choose: [
              { t: "Yes, here it is.", ok: true },
              { t: "Yes, it’s heavy.", why: "She asked for the tag (the small paper sticker). Say “Yes, here it is.”" },
              { t: "No, I’m tired.", why: "Look for the small sticker on your boarding pass or passport and say “Here it is.”" }
            ] },
            { who: "agent", t: "What does your suitcase look like?" },
            { choose: [
              { t: "It’s a big blue suitcase with four wheels.", ok: true },
              { t: "It looks sad.", why: "Describe the colour, the size and other details." },
              { t: "It’s in Dubai.", why: "She wants a description: size, colour, details." }
            ] },
            { who: "agent", t: "We will deliver it to your home. What is your phone number?" },
            { choose: [
              { t: "My number is 050 123 4567.", say: "My number is oh five oh, one two three, four five six seven.", ok: true },
              { t: "My home is very big.", why: "She asked for your phone number." },
              { t: "Tomorrow is fine.", why: "She asked for your phone number, not the time." }
            ] },
            { sit: "You check your other suitcase. The wheel is broken!" },
            { choose: [
              { t: "Excuse me, this suitcase is damaged. Look, the wheel is broken.", ok: true },
              { t: "Excuse me, this suitcase is missing.", why: "It isn’t missing, you have it! It is damaged (broken)." },
              { t: "I broke the airport.", why: "Say “This suitcase is damaged.”" }
            ] }
          ],
          phrases: [
            "Which belt is for my flight?",
            "Where can I find a trolley?",
            "One of my suitcases didn’t arrive.",
            "My suitcase is damaged.",
            "Here is my baggage tag."
          ]
        },

        /* ------------------------------------------------------------------ 5 */
        {
          id: "customs",
          title: "Customs",
          ar: "الجمارك",
          icon: "🛃",
          sub: "Green or red channel?",
          scene: "🟢 🧳 🔍 💊",
          intro: "Choose the green or the red channel. An officer may scan your bags and ask what is inside.",
          tips: [
            "Green = nothing to declare. Red = goods to declare.",
            "You must declare cash or valuables worth more than AED 60,000.",
            "Some medicines are controlled in the UAE. Carry the doctor’s prescription with your medicine."
          ],
          vocab: [
            { e: "🛃", w: "customs", ex: "Customs officers can check your bags." },
            { e: "📝", w: "declare", ex: "Do you have anything to declare?", note: "= tell the officer officially" },
            { e: "🟢", w: "green channel", ex: "Nothing to declare? Take the green channel." },
            { e: "🔴", w: "red channel", ex: "Goods to declare? Take the red channel." },
            { e: "🔍", w: "scanner", ex: "Please put your bags on the scanner.", note: "Also called an X-ray machine" },
            { e: "💵", w: "cash", ex: "I have two thousand dirhams in cash." },
            { e: "💊", w: "medicine", ex: "This is my child’s medicine." },
            { e: "📋", w: "prescription", ex: "Here is the prescription from the doctor." },
            { e: "🎁", w: "gift", ex: "These are gifts for our friends.", note: "= a present" }
          ],
          dialogue: {
            lines: [
              { who: "customs", t: "Excuse me, madam. Please put your bags on the [scanner]." },
              { who: "you", t: "All of them?" },
              { who: "customs", t: "Yes, all of them, please. Do you have anything to [declare]?" },
              { who: "you", t: "No, [nothing] to declare." },
              { who: "customs", t: "Are you carrying more than sixty thousand dirhams in [cash]?" },
              { who: "you", t: "No, I’m not." },
              { who: "customs", t: "What is this in your bag?" },
              { who: "you", t: "It’s my child’s [medicine]. Here is the [prescription]." },
              { who: "customs", t: "Thank you. Do you have any [food]?" },
              { who: "you", t: "Just some [snacks] for the children." },
              { who: "customs", t: "That’s fine. You can go. Have a nice day." },
              { who: "you", t: "Thank you. You too!" }
            ],
            extra: ["camera", "everything", "passport", "drinks"],
            questions: [
              { q: "Where does she put her bags?", a: ["On the scanner", "On the floor", "In a taxi"] },
              { q: "Who is the medicine for?", a: ["Her child", "Her husband", "The officer"] },
              { q: "Does she have a lot of cash?", a: ["No, she doesn’t.", "Yes, more than 60,000 dirhams."] }
            ]
          },
          roleplay: [
            { who: "customs", t: "Good evening. Do you have anything to declare?" },
            { choose: [
              { t: "No, nothing to declare.", ok: true },
              { t: "No, I’m not.", why: "The question starts with “Do you…?”, so say “No, I don’t” or “No, nothing to declare.”" },
              { t: "Yes, I am.", why: "This doesn’t answer “Do you have…?”. Say “No, nothing to declare.”" }
            ] },
            { who: "customs", t: "OK. Please put your bags on the machine." },
            { choose: [
              { t: "Sure. My handbag too?", ok: true },
              { t: "No, these are my bags.", why: "Customs officers can check your bags. Say “Sure” and do it." },
              { t: "I’m fine, thank you.", why: "She didn’t ask how you are. She asked you to put your bags on the machine." }
            ] },
            { sit: "The officer takes a box of tablets out of your bag." },
            { who: "customs", t: "What is this?" },
            { choose: [
              { t: "It’s my medicine. Here is my prescription.", ok: true },
              { t: "It’s nothing!", why: "This sounds strange. Explain calmly what it is." },
              { t: "I don’t know.", why: "Always know what is in your bags. Explain that it is your medicine." }
            ] },
            { who: "customs", t: "How much cash are you carrying?" },
            { choose: [
              { t: "About two thousand dirhams.", ok: true },
              { t: "By credit card.", why: "She asked “How much?”, so answer with an amount of money." },
              { t: "Two bags.", why: "She asked about cash (money), not bags." }
            ] },
            { sit: "You have a big box of gifts. You are not sure about the rules." },
            { choose: [
              { t: "Excuse me, do I need to declare this?", ok: true },
              { t: "I will hide it.", why: "Never hide things at customs! Ask the officer." },
              { t: "Green or red, I don’t care.", why: "This sounds rude. Ask politely: “Do I need to declare this?”" }
            ] },
            { who: "customs", t: "No, that’s fine. Welcome to Dubai." }
          ],
          phrases: [
            "Nothing to declare.",
            "This is my child’s medicine.",
            "Here is the prescription.",
            "Do I need to declare this?"
          ]
        },

        /* ------------------------------------------------------------------ 6 */
        {
          id: "help",
          title: "Asking for help",
          ar: "الاستعلامات",
          icon: "🙋‍♀️",
          sub: "Toilets, ATM, SIM card",
          scene: "ℹ️ 🚻 🏧 📱",
          intro: "The children need the toilet, you need money and a SIM card. Ask at the information desk and understand the directions.",
          tips: [
            "Start with “Excuse me”. It is polite, and it gets attention.",
            "You can buy a SIM card from du or e& (Etisalat) shops in the arrivals hall.",
            "Emergency numbers in the UAE: Police 999, Ambulance 998."
          ],
          vocab: [
            { e: "🙋‍♀️", w: "Excuse me", ex: "Excuse me, can you help me, please?", note: "Say this first to get someone’s attention." },
            { e: "🚻", w: "toilet", ex: "Where is the toilet, please?", note: "American English: restroom" },
            { e: "⬅️", w: "on the left", ex: "The toilets are on the left." },
            { e: "➡️", w: "on the right", ex: "The pharmacy is on the right." },
            { e: "⬆️", w: "straight ahead", ex: "Go straight ahead." },
            { e: "👫", w: "next to", ex: "The ATM is next to the café." },
            { e: "🏧", w: "ATM", ex: "Is there an ATM near here?", note: "= a cash machine" },
            { e: "📱", w: "SIM card", ex: "Where can I buy a SIM card?" },
            { e: "📶", w: "Wi-Fi", ex: "Is there free Wi-Fi?" },
            { e: "💧", w: "water", ex: "Where can I buy some water?" }
          ],
          dialogue: {
            lines: [
              { who: "you", t: "Excuse me, can you [help] me, please?" },
              { who: "info", t: "Of course, madam. How can I help?" },
              { who: "you", t: "Where is the nearest [toilet]? The children need to go." },
              { who: "info", t: "Go [straight] ahead. The toilets are on your [left], next to the café." },
              { who: "you", t: "Thank you. And where can I buy a [SIM] card?" },
              { who: "info", t: "There are phone shops near the exit, on your [right]." },
              { who: "you", t: "Is there free [Wi-Fi] in the airport?" },
              { who: "info", t: "Yes, it’s free. Just connect to the airport network." },
              { who: "you", t: "Great. Sorry, one more question. Is there an [ATM]?" },
              { who: "info", t: "Yes, there is an ATM [next] to the currency exchange." },
              { who: "you", t: "Thank you so much!" },
              { who: "info", t: "You’re welcome. Enjoy Dubai!" }
            ],
            extra: ["behind", "money", "down", "phone"],
            questions: [
              { q: "Where are the toilets?", a: ["Straight ahead, on the left", "Straight ahead, on the right", "Downstairs"] },
              { q: "Where can she buy a SIM card?", a: ["In the phone shops near the exit", "At the information desk", "At the café"] },
              { q: "Is the Wi-Fi free?", a: ["Yes", "No"] }
            ]
          },
          roleplay: [
            { sit: "You need help. You see a woman at the information desk." },
            { choose: [
              { t: "Excuse me, can you help me, please?", ok: true },
              { t: "Hey! You! Help!", why: "This is too loud and rude. Start with “Excuse me…”." },
              { t: "Help me now.", why: "This sounds like an order. Add “Excuse me” and “please”." }
            ] },
            { who: "info", t: "Sure. What do you need?" },
            { choose: [
              { t: "Where is the nearest toilet, please?", ok: true },
              { t: "Where the toilet is, please?", why: "Word order: in a question, “is” comes first: “Where is the toilet?”" },
              { t: "I need. Toilet.", why: "She will understand, but make a full question: “Where is the toilet, please?”" }
            ] },
            { who: "info", t: "Go straight ahead and turn left. It’s next to the pharmacy." },
            { ask: "Where is the toilet?", choose: [
              { t: "⬆️ then ⬅️ — next to the pharmacy", ok: true },
              { t: "⬆️ then ➡️ — next to the café" },
              { t: "⬇️ Downstairs, next to the exit" }
            ], hint: "Listen again for “left” or “right”." },
            { sit: "You need some dirhams. You have a bank card." },
            { choose: [
              { t: "Is there an ATM near here?", ok: true },
              { t: "Where can I buy a SIM card?", why: "You need money, not a SIM card. Ask for an ATM." },
              { t: "Can you give me money?", why: "She can’t give you money! Ask where the ATM is." }
            ] },
            { who: "info", t: "Yes, there’s an ATM on your right, after the currency exchange." },
            { ask: "Where is the ATM?", choose: [
              { t: "➡️ On the right, after the currency exchange", ok: true },
              { t: "⬅️ On the left, before the currency exchange" },
              { t: "⬆️ Straight ahead, next to the toilets" }
            ], hint: "Listen again for “left” or “right”." },
            { sit: "Now you want a SIM card. You ask, but the airport is very noisy." },
            { who: "info", t: "The phone shops are near the exit, on your left.", quiet: true },
            { choose: [
              { t: "Sorry, could you say that again, please?", ok: true },
              { t: "OK, thank you!", why: "If you didn’t hear, don’t say OK. Ask her to repeat." },
              { t: "Louder!", why: "This is rude. Say “Sorry, could you say that again, please?”" }
            ] },
            { who: "info", t: "Of course! The phone shops are near the exit, on your left." },
            { ask: "Where are the phone shops?", choose: [
              { t: "Near the exit, on the left", ok: true },
              { t: "Near the exit, on the right" },
              { t: "Next to the ATM" }
            ], hint: "Listen again: “near the exit, on your…”" }
          ],
          phrases: [
            "Where is the toilet, please?",
            "Is there an ATM near here?",
            "Where can I buy a SIM card?",
            "Is there free Wi-Fi?"
          ]
        },

        /* ------------------------------------------------------------------ 7 */
        {
          id: "taxi",
          title: "Taking a taxi",
          ar: "سيارات الأجرة",
          icon: "🚕",
          sub: "Go to your new home",
          scene: "🚕 🧳 📍 🏙️",
          intro: "Go to the taxi rank outside Arrivals. Tell the driver the address, ask about the price, and ask for a receipt.",
          tips: [
            "Use the official taxi rank outside Arrivals. Dubai taxis use a meter.",
            "Pink-roof taxis have women drivers. They are for women and families.",
            "Taxis from the airport have a higher starting fare (about AED 25). The Careem and Uber apps also work in Dubai."
          ],
          vocab: [
            { e: "🚕", w: "taxi rank", ex: "The taxi rank is outside, near the exit.", note: "American English: taxi stand" },
            { e: "📍", w: "address", ex: "Here is the address." },
            { e: "🧳🚗", w: "boot", ex: "Can you put the bags in the boot?", note: "American English: trunk" },
            { e: "💳", w: "pay by card", ex: "Can I pay by card?" },
            { e: "💵", w: "cash", ex: "I can pay in cash." },
            { e: "🚦", w: "traffic", ex: "It depends on the traffic." },
            { e: "❄️", w: "air conditioning", ex: "Could you turn down the air conditioning, please?", note: "People often say “the AC”." },
            { e: "🧾", w: "receipt", ex: "Can I have a receipt, please?", note: "Careful: a “recipe” is for cooking!" },
            { e: "⏱️", w: "meter", ex: "The price is on the meter." }
          ],
          dialogue: {
            lines: [
              { who: "marshal", t: "Taxi, madam? Do you have a lot of [bags]?" },
              { who: "you", t: "Yes, we have [four] suitcases." },
              { who: "marshal", t: "No problem. Please take the [big] taxi over there." },
              { who: "driver", t: "Good evening, madam. [Where] are you going?" },
              { who: "you", t: "Good evening. To Dubai Marina, please. Here is the [address]." },
              { who: "driver", t: "OK. I will put your bags in the [boot]." },
              { who: "you", t: "Thank you. How long does it [take]?" },
              { who: "driver", t: "About [thirty] minutes. It depends on the traffic." },
              { who: "you", t: "Can I pay by [card]?" },
              { who: "driver", t: "Yes, of course. Card or cash, no problem." },
              { who: "you", t: "It’s a bit cold for the children. Could you turn [down] the air conditioning, please?" },
              { who: "driver", t: "Sure, no problem." },
              { who: "driver", t: "Here we are. That’s eighty-five dirhams." },
              { who: "you", t: "Here you are. Can I have a [receipt], please?" },
              { who: "driver", t: "Of course. Here you are. Welcome to Dubai!" }
            ],
            extra: ["fourteen", "thirteen", "up", "recipe", "small"],
            questions: [
              { q: "How many suitcases do they have?", a: ["Four", "Fourteen", "Two"] },
              { q: "How long is the trip?", a: ["About 30 minutes", "About 13 minutes", "About 3 hours"] },
              { q: "How much is the taxi?", a: ["AED 85", "AED 58", "AED 15"] }
            ]
          },
          roleplay: [
            { who: "marshal", t: "Good evening. How many bags do you have?" },
            { choose: [
              { t: "We have four suitcases.", ok: true },
              { t: "We are four.", why: "That answers “How many people?”. He asked about bags." },
              { t: "Bags are good.", why: "Tell him the number: “We have four suitcases.”" }
            ] },
            { who: "driver", t: "Hello, madam. Where to?" },
            { choose: [
              { t: "To this address, please.", ok: true },
              { t: "From the airport.", why: "You are already at the airport. He wants to know where you are going." },
              { t: "Yes, I’m going.", why: "“Where to?” means “Where are you going?”. Show him the address." }
            ] },
            { who: "driver", t: "OK. It takes about forty minutes." },
            { ask: "How long is the trip?", choose: [
              { t: "40 minutes", ok: true },
              { t: "14 minutes" },
              { t: "4 hours" }
            ], hint: "Listen again: “forty” is 40, “fourteen” is 14." },
            { sit: "You don’t have any cash." },
            { choose: [
              { t: "Can I pay by card?", ok: true },
              { t: "I have no money, sorry.", why: "He may think you can’t pay! Ask about paying by card." },
              { t: "Is the card free?", why: "Ask: “Can I pay by card?”" }
            ] },
            { who: "driver", t: "Yes, card is fine." },
            { sit: "The car is too cold for the children." },
            { choose: [
              { t: "Could you turn down the air conditioning, please?", ok: true },
              { t: "Could you turn up the air conditioning, please?", why: "“Turn up” means more air conditioning. It will be even colder! Say “turn down”." },
              { t: "Stop the cold now!", why: "This sounds rude. Use “Could you…, please?”" }
            ] },
            { who: "driver", t: "Here we are. That’s ninety dirhams." },
            { ask: "How much is it?", choose: [
              { t: "AED 90", ok: true },
              { t: "AED 19" },
              { t: "AED 9" }
            ], hint: "“Ninety” is 90. “Nineteen” is 19." },
            { sit: "You want a paper that shows the price you paid." },
            { choose: [
              { t: "Can I have a receipt, please?", ok: true },
              { t: "Can I have a recipe, please?", why: "A “recipe” tells you how to cook food! You want a “receipt”." },
              { t: "Can I have a ticket, please?", why: "In a taxi, ask for a “receipt”." }
            ] },
            { who: "driver", t: "Here you are. Welcome to Dubai!" }
          ],
          phrases: [
            "To this address, please.",
            "How long does it take?",
            "Can I pay by card?",
            "Could you turn down the air conditioning, please?",
            "Can I have a receipt, please?"
          ]
        }
      ]
    }
  ],

  /* Extra phrasebook groups (shown before and after the stops). */
  essentials: [
    "Excuse me, can you help me, please?",
    "Sorry, I don’t speak English very well.",
    "Could you speak more slowly, please?",
    "Could you say that again, please?",
    "Could you write it down, please?",
    "I’m travelling with my children.",
    "Thank you very much!"
  ],
  emergency: [
    "Please help me. It’s an emergency.",
    "I need a doctor.",
    "I can’t find my child.",
    "I lost my passport.",
    "Please call the police."
  ],

  /* Shown on the home page as the next journeys to build. */
  comingSoon: [
    { icon: "🏠", title: "Our new home", sub: "Neighbours, the building, deliveries" },
    { icon: "🛒", title: "The supermarket", sub: "Food, prices, paying" },
    { icon: "🏫", title: "School", sub: "Talking to teachers and parents" },
    { icon: "💊", title: "Doctor and pharmacy", sub: "Describing a problem" }
  ]
};
