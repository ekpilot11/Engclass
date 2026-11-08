/*
 * Hello Dubai — shared content: characters, airport signs, phrasebook groups.
 * The journeys themselves are in content-flight.js and content-airport.js.
 *
 * Every learner-facing English text has a Brazilian Portuguese help text next to it (`pt`).
 *
 * Conventions (all journeys)
 * - Dialogue lines: { who, t, pt } where `who` is a key of `characters`.
 *   Words in [square brackets] become the gaps in "Fill the gaps".
 *   Optional `say` replaces the spoken text (e.g. to read "EK 247" as "E K, two four seven").
 * - Comprehension questions: { q, pt, a: [...] }. The FIRST answer is the correct one.
 * - Role-play turns: { who, t, pt } a line (optional fast / quiet), { sit, pt } a situation card,
 *   { choose: [...] } your reply (the option with ok: true is correct; why / whyPt explain the others),
 *   { ask, askPt, choose, hint, hintPt } a listening question. Options are shuffled when shown.
 * - Tips and phrases: { t, pt }.
 *
 * Audio: after changing any English text, run `node tools/list-speech.js` and
 * `tools/make_audio.py` to record the new sentences (see README).
 */
window.HD_CONTENT = {
  characters: {
    you:       { name: "You",               avatar: "👩",     group: "you",   gender: "f" },
    teacher:   { name: "Teacher",           avatar: "🔊",     group: "you",   gender: "f" },
    pilot:     { name: "Captain",           avatar: "👨‍✈️",   group: "crew",  gender: "m", mixed: ["gb", "au"] },
    crew:      { name: "Flight attendant",  avatar: "💁‍♀️",   group: "crew",  gender: "f", mixed: ["au", "gb"] },
    crew2:     { name: "Flight attendant",  avatar: "💁🏻‍♂️", group: "crew",  gender: "m", mixed: ["gb", "in"] },
    passenger: { name: "Passenger",         avatar: "🧑🏼",   group: "staff", gender: "m", mixed: ["us", "gb"] },
    officer:   { name: "Passport officer",  avatar: "👮‍♂️",   group: "staff", gender: "m", mixed: ["gb", "us"] },
    porter:    { name: "Airport staff",     avatar: "👨🏽‍💼", group: "staff", gender: "m", mixed: ["in", "gb"] },
    agent:     { name: "Baggage services",  avatar: "👩🏻‍💼", group: "staff", gender: "f", mixed: ["ph", "in", "gb"] },
    customs:   { name: "Customs officer",   avatar: "👮‍♀️",   group: "staff", gender: "f", mixed: ["gb", "us"] },
    info:      { name: "Information desk",  avatar: "👩🏽‍💼", group: "staff", gender: "f", mixed: ["in", "gb"] },
    marshal:   { name: "Taxi marshal",      avatar: "🦺",     group: "staff", gender: "m", mixed: ["in", "gb"] },
    driver:    { name: "Taxi driver",       avatar: "🧔🏽",   group: "staff", gender: "m", mixed: ["in", "gb"] }
  },

  /* Airport signs. kind: dir (yellow wayfinding), fac (facility), green / red (customs channels),
     rule (not allowed), warn (yellow notice). Arabic is only given where it is certain. */
  signs: {
    arrivals:    { en: "Arrivals",           pt: "Chegadas",                ar: "الوصول",        e: "🛬", kind: "dir",
                   mean: "For passengers who just landed.", meanPt: "Para os passageiros que acabaram de pousar." },
    departures:  { en: "Departures",         pt: "Partidas",                ar: "المغادرة",       e: "🛫", kind: "dir",
                   mean: "For passengers who are flying away.", meanPt: "Para os passageiros que vão embarcar e viajar." },
    connections: { en: "Connections",        pt: "Conexões",                                      e: "🔁", kind: "dir",
                   mean: "For passengers who take another flight. Not for you!", meanPt: "Para quem vai pegar outro voo. Não é para você!" },
    passport:    { en: "Passport Control",   pt: "Controle de passaportes", ar: "الجوازات",       e: "🛂", kind: "dir",
                   mean: "An officer checks your passport and visa.", meanPt: "Um oficial verifica seu passaporte e seu visto." },
    nationals:   { en: "UAE Nationals",      pt: "Cidadãos dos Emirados",   ar: "المواطنون",      e: "🇦🇪", kind: "dir",
                   mean: "Only for people with a UAE passport.", meanPt: "Somente para quem tem passaporte dos Emirados Árabes." },
    allpass:     { en: "All Passports",      pt: "Todos os passaportes",    ar: "جميع الجوازات",  e: "🌍", kind: "dir",
                   mean: "For everybody with a passport from another country.", meanPt: "Para todas as pessoas com passaporte de outro país." },
    baggage:     { en: "Baggage Claim",      pt: "Restituição de bagagem",  ar: "استلام الأمتعة", e: "🛄", kind: "dir",
                   mean: "Take your suitcases here.", meanPt: "Pegue suas malas aqui." },
    oversize:    { en: "Oversized Baggage",  pt: "Bagagem especial (grande)",                     e: "📦", kind: "dir",
                   mean: "Big items, strollers and car seats come out here.", meanPt: "Volumes grandes, carrinhos de bebê e cadeirinhas saem aqui." },
    customs:     { en: "Customs",            pt: "Alfândega",               ar: "الجمارك",        e: "🛃", kind: "dir",
                   mean: "Officers can check your bags here.", meanPt: "Os oficiais podem verificar suas malas aqui." },
    nothing:     { en: "Nothing to Declare", pt: "Nada a declarar",                               e: "✓",  kind: "green",
                   mean: "Green channel: you have nothing special in your bags.", meanPt: "Canal verde: você não tem nada especial nas malas." },
    declare:     { en: "Goods to Declare",   pt: "Bens a declarar",                               e: "!",  kind: "red",
                   mean: "Red channel: you must tell customs about something, for example a lot of cash.", meanPt: "Canal vermelho: você precisa informar algo à alfândega, por exemplo muito dinheiro em espécie." },
    exit:        { en: "Exit",               pt: "Saída",                   ar: "مخرج",          e: "🚪", kind: "dir",
                   mean: "The way out.", meanPt: "O caminho para sair." },
    taxi:        { en: "Taxi",               pt: "Táxi",                    ar: "سيارات الأجرة",  e: "🚕", kind: "dir",
                   mean: "Get a taxi here.", meanPt: "Pegue um táxi aqui." },
    metro:       { en: "Metro",              pt: "Metrô",                   ar: "المترو",         e: "🚇", kind: "dir",
                   mean: "The train to the city.", meanPt: "O trem para a cidade." },
    meeting:     { en: "Meeting Point",      pt: "Ponto de encontro",       ar: "نقطة الالتقاء",  e: "🤝", kind: "dir",
                   mean: "Meet your family or friends here.", meanPt: "Encontre sua família ou seus amigos aqui." },
    toilets:     { en: "Toilets",            pt: "Banheiros",               ar: "دورات المياه",   e: "🚻", kind: "fac",
                   mean: "Toilets. In American English: restrooms.", meanPt: "Banheiros. Em inglês americano: restrooms." },
    baby:        { en: "Baby Care",          pt: "Fraldário",                                     e: "🚼", kind: "fac",
                   mean: "A room to change or feed your baby.", meanPt: "Uma sala para trocar a fralda ou alimentar o bebê." },
    info:        { en: "Information",        pt: "Informações",             ar: "الاستعلامات",    e: "ℹ️", kind: "fac",
                   mean: "Ask your questions here.", meanPt: "Faça suas perguntas aqui." },
    prayer:      { en: "Prayer Room",        pt: "Sala de oração",          ar: "مصلى",          e: "🕌", kind: "fac",
                   mean: "A quiet room for prayer.", meanPt: "Uma sala silenciosa para rezar." },
    exchange:    { en: "Currency Exchange",  pt: "Câmbio",                  ar: "صرافة",         e: "💱", kind: "fac",
                   mean: "Change your money into dirhams.", meanPt: "Troque seu dinheiro por dirhams." },
    trolleys:    { en: "Trolleys",           pt: "Carrinhos de bagagem",    ar: "عربات الأمتعة",  e: "🛒", kind: "fac",
                   mean: "Carts for your suitcases. They are free at DXB.", meanPt: "Carrinhos para as malas. São grátis no DXB." },
    lost:        { en: "Lost & Found",       pt: "Achados e perdidos",      ar: "المفقودات",      e: "🔎", kind: "fac",
                   mean: "Go here if you lose something.", meanPt: "Vá aqui se perder alguma coisa." },
    nophotos:    { en: "No Photos",          pt: "Proibido fotografar",     ar: "ممنوع التصوير",  e: "📷", kind: "rule",
                   mean: "Do not take pictures here.", meanPt: "Não tire fotos aqui." },
    waitline:    { en: "Please wait behind the line", pt: "Aguarde atrás da linha",               e: "🧍", kind: "warn",
                   mean: "Stand here until the officer calls you.", meanPt: "Fique aqui até o oficial chamar você." }
  },

  journeys: [],

  /* Phrasebook groups shown before and after the stops. */
  essentials: [
    { t: "Excuse me, can you help me, please?", pt: "Com licença, você pode me ajudar, por favor?" },
    { t: "Sorry, I don’t speak English very well.", pt: "Desculpe, eu não falo inglês muito bem." },
    { t: "Could you speak more slowly, please?", pt: "Você pode falar mais devagar, por favor?" },
    { t: "Could you say that again, please?", pt: "Você pode repetir, por favor?" },
    { t: "Could you write it down, please?", pt: "Você pode escrever, por favor?" },
    { t: "I’m travelling with my mother, our nanny and my two children.", pt: "Estou viajando com minha mãe, nossa babá e meus dois filhos." },
    { t: "Thank you very much!", pt: "Muito obrigada!" }
  ],
  family: {
    title: "For grandma and the nanny",
    pt: "Para a vovó e a babá",
    note: "They can show these cards to a person at the airport.",
    notePt: "Elas podem mostrar estes cartões para alguém no aeroporto.",
    items: [
      { t: "Sorry, I don’t speak English.", pt: "Desculpe, eu não falo inglês." },
      { t: "I am with my family. My daughter speaks English.", pt: "Estou com minha família. Minha filha fala inglês." },
      { t: "I am the children’s nanny. I am with this family.", pt: "Sou a babá das crianças. Estou com esta família." },
      { t: "Please help me find my family.", pt: "Por favor, me ajude a encontrar minha família." },
      { t: "Can you call this number, please?", pt: "Você pode ligar para este número, por favor?" },
      { t: "Where is the toilet, please?", pt: "Onde fica o banheiro, por favor?" },
      { t: "Some water, please.", pt: "Um pouco de água, por favor." }
    ]
  },
  emergency: [
    { t: "Please help me. It’s an emergency.", pt: "Por favor, me ajude. É uma emergência." },
    { t: "I need a doctor.", pt: "Eu preciso de um médico." },
    { t: "My child is sick.", pt: "Meu filho está doente." },
    { t: "I can’t find my child.", pt: "Não consigo encontrar meu filho." },
    { t: "I lost my passport.", pt: "Eu perdi meu passaporte." },
    { t: "Please call the police.", pt: "Por favor, chame a polícia." }
  ],

  /* Shown on the home page as the next journeys to build. */
  comingSoon: [
    { icon: "🏠", title: "Our new home", pt: "Nossa nova casa", sub: "Neighbours, the building, deliveries" },
    { icon: "🛒", title: "The supermarket", pt: "O supermercado", sub: "Food, prices, paying" },
    { icon: "🏫", title: "School and nursery", pt: "Escola e berçário", sub: "Talking to teachers and parents" },
    { icon: "💊", title: "Doctor and pharmacy", pt: "Médico e farmácia", sub: "Describing a problem" }
  ]
};
