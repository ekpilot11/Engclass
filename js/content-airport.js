/* Hello Dubai — journey 2: Arriving at DXB (signs, passport control, baggage, customs, help, taxi). */
window.HD_CONTENT.journeys.push({
  id: "airport",
  title: "Arriving at DXB",
  pt: "Chegada em Dubai",
  board: "Arrivals",
  boardAr: "الوصول",
  stops: [
    /* ------------------------------------------------------------------ signs */
    {
      id: "signs",
      title: "Reading the signs",
      pt: "Lendo as placas",
      ar: "اللافتات",
      icon: "🪧",
      sub: "Lead the family",
      scene: "🛂 ➜ 🛄 ➜ 🛃 ➜ 🚕",
      intro: "Signs at DXB are in Arabic and English. Learn the important ones: your mother and the nanny will follow you!",
      introPt: "As placas no DXB estão em árabe e inglês. Aprenda as mais importantes: sua mãe e a babá vão seguir você!",
      tips: [
        { t: "Follow “Arrivals” and “Baggage Claim”. Don’t follow “Connections”: that is for people taking another flight.",
          pt: "Siga “Arrivals” e “Baggage Claim”. Não siga “Connections”: é para quem vai pegar outro voo." },
        { t: "Trolleys at DXB are free. With five people and many suitcases, take two.",
          pt: "Os carrinhos de bagagem no DXB são grátis. Com cinco pessoas e muitas malas, peguem dois." },
        { t: "Don’t take photos at passport control or customs.",
          pt: "Não tire fotos no controle de passaportes nem na alfândega." }
      ],
      signs: ["arrivals", "connections", "passport", "allpass", "baggage", "oversize", "trolleys", "customs", "nothing", "declare", "exit", "meeting", "taxi", "metro", "toilets", "baby", "info", "exchange", "prayer", "lost", "nophotos", "waitline"],
      signquiz: [
        { q: "You just got off the plane. You want to leave the airport. Which sign do you follow?", pt: "Vocês acabaram de sair do avião e querem sair do aeroporto. Qual placa vocês seguem?", opts: ["arrivals", "departures", "connections"] },
        { q: "You need to show your passports to an officer.", pt: "Vocês precisam mostrar os passaportes para um oficial.", opts: ["passport", "customs", "info"] },
        { q: "You are not from the UAE. Which line do you join?", pt: "Vocês não são dos Emirados. Em qual fila vocês entram?", opts: ["allpass", "nationals"] },
        { sign: "waitline", q: "What does this sign mean?", pt: "O que esta placa significa?", a: ["Stand here until the officer calls you.", "Walk past the line quickly.", "This line is for children only."] },
        { sign: "nophotos", q: "What does this sign mean?", pt: "O que esta placa significa?", a: ["Don’t take pictures here.", "You can take pictures here.", "You can buy photos here."] },
        { q: "You want to get your suitcases.", pt: "Vocês querem pegar as malas.", opts: ["baggage", "lost", "departures"] },
        { q: "Your bags are heavy. You need a cart.", pt: "As malas estão pesadas. Vocês precisam de um carrinho.", opts: ["trolleys", "taxi", "exit"] },
        { q: "The double stroller and the car seats are not on the normal belt.", pt: "O carrinho duplo e as cadeirinhas não estão na esteira normal.", opts: ["oversize", "lost", "baggage"] },
        { q: "Your daughter needs a new nappy (American English: diaper).", pt: "Sua filha precisa trocar a fralda.", opts: ["baby", "prayer", "info"] },
        { q: "At customs, you have nothing special in your bags. Which way do you go?", pt: "Na alfândega, vocês não têm nada especial nas malas. Para onde vocês vão?", opts: ["nothing", "declare"] },
        { q: "You are carrying AED 70,000 in cash. Which way do you go?", pt: "Você está levando 70.000 dirhams em dinheiro. Para onde você vai?", opts: ["declare", "nothing"],
          note: "In the UAE, you must declare cash over AED 60,000.", notePt: "Nos Emirados, é obrigatório declarar dinheiro acima de 60.000 dirhams." },
        { sign: "connections", q: "What does this sign mean?", pt: "O que esta placa significa?", a: ["For passengers taking another flight.", "For passengers leaving the airport.", "For phone and internet connections."] },
        { q: "You only have dollars. You need dirhams.", pt: "Você só tem dólares. Você precisa de dirhams.", opts: ["exchange", "info", "taxi"] },
        { q: "A friend is waiting for you in the arrivals hall. Where do you meet?", pt: "Um amigo está esperando por vocês no saguão de chegada. Onde vocês se encontram?", opts: ["meeting", "departures", "customs"] },
        { q: "You want to go to your new home by car.", pt: "Vocês querem ir de carro para a casa nova.", opts: ["taxi", "metro", "connections"] },
        { q: "You don’t know where to go. You have a question.", pt: "Você não sabe para onde ir. Você tem uma pergunta.", opts: ["info", "lost", "exit"],
          note: "“Lost & Found” is for lost things, not lost people!", notePt: "“Lost & Found” é para objetos perdidos, não para pessoas perdidas!" }
      ],
      signorder: ["arrivals", "passport", "baggage", "customs", "exit", "taxi"],
      signorderHints: [
        { t: "First, you get off the plane.", pt: "Primeiro, vocês saem do avião." },
        { t: "Then an officer checks your passports.", pt: "Depois, um oficial verifica os passaportes." },
        { t: "Then you take your suitcases.", pt: "Depois, vocês pegam as malas." },
        { t: "Then officers can check your bags.", pt: "Depois, os oficiais podem verificar as malas." },
        { t: "Then you leave the building.", pt: "Depois, vocês saem do prédio." },
        { t: "Finally, you get a car to your new home.", pt: "Por fim, vocês pegam um carro para a casa nova." }
      ],
      phrases: [
        { t: "Where is Baggage Claim, please?", pt: "Onde fica a restituição de bagagem, por favor?" },
        { t: "Which way is the exit?", pt: "Para que lado fica a saída?" },
        { t: "Is this the way to Passport Control?", pt: "É por aqui o controle de passaportes?" }
      ]
    },

    /* ------------------------------------------------------------------ passport control */
    {
      id: "passport",
      title: "Passport control",
      pt: "Controle de passaportes",
      ar: "الجوازات",
      icon: "🛂",
      sub: "Talk to the officer",
      scene: "👮‍♂️ 📘 📷",
      imgScene: "passport control in the arrivals hall of Dubai airport. The family from the reference image (the mother, the grandmother, the nanny and the toddler twins, a boy and a girl) stands together at a passport control counter. The mother hands over the passports. Behind the counter sits a friendly Emirati officer with a short black beard, in a white kandura and white ghutra, with a small camera on the counter. A bright modern airport hall with big windows in the background. Calm and welcoming.",
      intro: "The officer checks the passports of the whole family. Answer simple questions, explain who everybody is, and ask him to repeat if you don’t understand.",
      introPt: "O oficial verifica os passaportes de toda a família. Responda perguntas simples, explique quem é cada pessoa e peça para ele repetir se não entender.",
      tips: [
        { t: "Stay together and go to the officer as a family.",
          pt: "Fiquem juntos e vão até o oficial em família." },
        { t: "If you don’t understand, say: “Sorry, could you say that again more slowly, please?” Never just say “yes”.",
          pt: "Se não entender, diga: “Sorry, could you say that again more slowly, please?” Nunca diga apenas “yes”." },
        { t: "The officer may take a photo and scan everybody’s eyes. This is normal.",
          pt: "O oficial pode tirar uma foto e escanear os olhos de todos. Isso é normal." },
        { t: "Keep everybody’s visas ready: yours, the children’s, your mother’s and the nanny’s.",
          pt: "Deixe os vistos de todos à mão: o seu, o das crianças, o da sua mãe e o da babá." }
      ],
      vocab: [
        { e: "📘", w: "passport", pt: "passaporte", ex: "Here is my passport.", exPt: "Aqui está meu passaporte.",
          img: "a closed dark-blue passport booklet with a simple gold emblem on the cover and no writing" },
        { e: "📄", w: "visa", pt: "visto", ex: "This is my residence visa.", exPt: "Este é meu visto de residência.",
          note: "Your first visa may be called an “entry permit”.", notePt: "Seu primeiro visto pode se chamar “entry permit” (autorização de entrada).",
          img: "an official residence visa: a sheet of paper with a small photo of a woman, a round official stamp and a few grey lines instead of writing, held in a hand" },
        { e: "👮‍♂️", w: "officer", pt: "oficial, agente", ex: "The officer checks our passports.", exPt: "O oficial verifica nossos passaportes.",
          img: "a friendly Emirati passport control officer with a short black beard, in a white kandura and white ghutra, sitting in a passport control booth and looking at an open passport" },
        { e: "🚶‍♀️🚶‍♂️🚶", w: "queue", pt: "fila", ex: "Please wait in the queue.", exPt: "Por favor, espere na fila.",
          note: "American English: line", notePt: "Em inglês americano: line",
          img: "a short line of four travellers with suitcases waiting one behind the other at an airport, seen from the side" },
        { e: "📷", w: "camera", pt: "câmera", ex: "Please look at the camera.", exPt: "Por favor, olhe para a câmera.",
          img: "a small round security camera on a short stand on an airport counter, the lens pointing straight at the viewer" },
        { e: "🎯", w: "purpose", pt: "motivo", ex: "What is the purpose of your visit?", exPt: "Qual é o motivo da sua visita?",
          note: "= the reason", notePt: "= o motivo, a razão",
          img: "the reason for the trip: the mother from the reference image (teal blouse, long wavy dark-brown hair) carrying a cardboard moving box with a simple house symbol on it, next to suitcases, with the Dubai skyline in the background", imgFamily: true },
        { e: "🏠", w: "live", pt: "morar", ex: "We are going to live in Dubai.", exPt: "Nós vamos morar em Dubai.",
          img: "the new home: the whole family from the reference image (mother, grandmother, nanny and the toddler twins) standing happily in front of a modern apartment building in Dubai with balconies and palm trees, warm evening light", imgFamily: true },
        { e: "👦👧", w: "twins", pt: "gêmeos", ex: "They are twins: a boy and a girl.", exPt: "Eles são gêmeos: um menino e uma menina.",
          img: "the two toddler twins from the reference image, the boy and the girl, holding hands and smiling", imgFamily: true },
        { e: "👩‍🍼", w: "nanny", pt: "babá", ex: "She is our nanny.", exPt: "Ela é nossa babá.",
          img: "the nanny from the reference image (the woman with dark hair in a bun, light-blue tunic and dark trousers, NOT the mother) holding the hands of the two toddler twins", imgFamily: true },
        { e: "🗣️", w: "translate", pt: "traduzir", ex: "I can translate for my mother.", exPt: "Eu posso traduzir para a minha mãe.",
          img: "the mother from the reference image translating for the grandmother from the reference image: the mother turns to her mother and explains something kindly, with two empty speech bubbles between them", imgFamily: true }
      ],
      dialogue: {
        lines: [
          { who: "officer", t: "Good evening. Next, please.", pt: "Boa noite. Próximo, por favor." },
          { who: "you", t: "Good evening. We are a family of five.", pt: "Boa noite. Somos uma família de cinco pessoas." },
          { who: "officer", t: "[Passports], please.", pt: "Passaportes, por favor." },
          { who: "you", t: "Here you are. These are our passports and our [visas].", pt: "Aqui estão. Estes são nossos passaportes e nossos vistos." },
          { who: "officer", t: "Thank you. What is the [purpose] of your visit?", pt: "Obrigado. Qual é o motivo da sua visita?" },
          { who: "you", t: "We are moving to Dubai. We are going to [live] here.", pt: "Estamos nos mudando para Dubai. Vamos morar aqui." },
          { who: "officer", t: "Who is this lady?", pt: "Quem é esta senhora?" },
          { who: "you", t: "This is my [mother]. She doesn’t speak English, so I can translate.", pt: "Esta é minha mãe. Ela não fala inglês, então eu posso traduzir." },
          { who: "officer", t: "And this lady?", pt: "E esta senhora?" },
          { who: "you", t: "She is our [nanny]. Here is her visa.", pt: "Ela é nossa babá. Aqui está o visto dela." },
          { who: "officer", t: "Are these your children?", pt: "Estas crianças são suas?" },
          { who: "you", t: "Yes, they are. They are [twins], a boy and a girl.", pt: "Sim, são. Eles são gêmeos, um menino e uma menina." },
          { who: "officer", t: "How old are they?", pt: "Quantos anos eles têm?" },
          { who: "you", t: "They are [two].", pt: "Eles têm dois anos." },
          { who: "officer", t: "OK. Please look at the [camera], everybody.", pt: "Ok. Olhem para a câmera, todos, por favor." },
          { who: "officer", t: "Everything is fine. [Welcome] to Dubai.", pt: "Está tudo certo. Bem-vindos a Dubai." },
          { who: "you", t: "Thank you very much!", pt: "Muito obrigada!" }
        ],
        extra: ["tickets", "sister", "work", "three"],
        questions: [
          { q: "Who is the older lady?", pt: "Quem é a senhora mais velha?", a: ["Her mother", "Her sister", "Another passenger"] },
          { q: "Who speaks English in the family?", pt: "Quem fala inglês na família?", a: ["Only she does.", "Her mother does.", "The nanny does."] },
          { q: "How old are the twins?", pt: "Quantos anos os gêmeos têm?", a: ["Two", "Three", "Twelve"] }
        ]
      },
      roleplay: [
        { who: "officer", t: "Good morning. Passports, please.", pt: "Bom dia. Passaportes, por favor." },
        { choose: [
          { t: "Good morning. Here you are.", ok: true },
          { t: "Yes, I am.", why: "He is asking for your passports. Give them to him and say “Here you are.”", whyPt: "Ele está pedindo os passaportes. Entregue e diga “Here you are.” (Aqui estão.)" },
          { t: "Nothing to declare.", why: "You say this at customs, later. Here, just give him your passports.", whyPt: "Isso se diz na alfândega, depois. Aqui, apenas entregue os passaportes." }
        ] },
        { who: "officer", t: "What is the purpose of your visit?", pt: "Qual é o motivo da sua visita?" },
        { choose: [
          { t: "We are moving here. We are going to live in Dubai.", ok: true },
          { t: "Two weeks.", why: "“Two weeks” answers “How long…?”. “Purpose” means the reason.", whyPt: "“Two weeks” responde “How long…?” (Quanto tempo…?). “Purpose” significa o motivo." },
          { t: "By plane.", why: "“By plane” answers “How did you come?”. “Purpose” means the reason.", whyPt: "“By plane” responde “Como vocês vieram?”. “Purpose” significa o motivo." }
        ] },
        { sit: "The officer asks the next question very fast.", pt: "O oficial faz a próxima pergunta muito rápido." },
        { who: "officer", t: "Do you have the entry permits or the residence visas for everybody with you today?", pt: "Você tem as autorizações de entrada ou os vistos de residência de todos aqui hoje?", fast: true },
        { choose: [
          { t: "Sorry, could you say that again more slowly, please?", ok: true },
          { t: "Yes.", why: "Never say “yes” if you don’t understand! Ask him to repeat.", whyPt: "Nunca diga “yes” se você não entendeu! Peça para ele repetir." },
          { t: "What?!", why: "“What?!” can sound rude. Say “Sorry, could you say that again, please?”", whyPt: "“What?!” pode parecer grosseiro. Diga “Sorry, could you say that again, please?”" }
        ] },
        { who: "officer", t: "Of course. Do you have everybody’s visas?", pt: "Claro. Você tem os vistos de todos?" },
        { choose: [
          { t: "Yes, here they are.", ok: true },
          { t: "Yes, I do it.", why: "Say “Yes, I do.” or “Yes, here they are.”", whyPt: "Diga “Yes, I do.” ou “Yes, here they are.” (Sim, aqui estão.)" },
          { t: "No, thank you.", why: "“No, thank you” is how you refuse an offer. He wants to see the visas.", whyPt: "“No, thank you” serve para recusar uma oferta. Ele quer ver os vistos." }
        ] },
        { who: "officer", t: "Who is this lady?", pt: "Quem é esta senhora?" },
        { choose: [
          { t: "She’s my mother. She doesn’t speak English.", ok: true },
          { t: "She’s my husband.", why: "Careful: “husband” means “marido”! Say “She’s my mother.”", whyPt: "Cuidado: “husband” significa marido! Diga “She’s my mother.”" },
          { t: "He’s my mother.", why: "For a woman we say “she”: “She’s my mother.”", whyPt: "Para mulher dizemos “she”: “She’s my mother.”" }
        ] },
        { who: "officer", t: "And this lady?", pt: "E esta senhora?" },
        { choose: [
          { t: "She’s our nanny. She lives with us.", ok: true },
          { t: "She’s our grandmother.", why: "Your mother is the children’s grandmother. This lady is the nanny.", whyPt: "Sua mãe é a avó das crianças. Esta senhora é a babá (nanny)." },
          { t: "Nanny is she.", why: "Word order: “She’s our nanny.”", whyPt: "Ordem das palavras: “She’s our nanny.”" }
        ] },
        { who: "officer", t: "Are these your children?", pt: "Estas crianças são suas?" },
        { choose: [
          { t: "Yes, they are. They’re twins.", ok: true },
          { t: "Yes, it is.", why: "“These” is plural, so we say “Yes, they are.”", whyPt: "“These” é plural, então dizemos “Yes, they are.”" },
          { t: "No, thank you.", why: "He asked a yes/no question. Answer “Yes, they are.”", whyPt: "Ele fez uma pergunta de sim ou não. Responda “Yes, they are.”" }
        ] },
        { who: "officer", t: "How old are they?", pt: "Quantos anos eles têm?" },
        { choose: [
          { t: "They’re two years old.", ok: true },
          { t: "They have two years.", why: "In English we say “They are two”, not “They have two years”.", whyPt: "Em inglês, a idade usa o verbo “to be”: “They are two”. Não se diz “They have two years”, como em português." },
          { t: "They are fine.", why: "He asked their age: “They’re two years old.”", whyPt: "Ele perguntou a idade: “They’re two years old.”" }
        ] },
        { who: "officer", t: "Please look at the camera, everybody.", pt: "Por favor, todos olhem para a câmera." },
        { choose: [
          { t: "OK. Like this?", ok: true },
          { t: "No photos, please.", why: "This is a security camera. Everybody must look at it.", whyPt: "É uma câmera de segurança. Todos precisam olhar para ela." },
          { t: "Here is my camera.", why: "He doesn’t want your camera. He wants you to look at his camera.", whyPt: "Ele não quer a sua câmera. Ele quer que você olhe para a câmera dele." }
        ] },
        { who: "officer", t: "Welcome to Dubai.", pt: "Bem-vindos a Dubai." },
        { choose: [
          { t: "Thank you very much!", ok: true },
          { t: "You’re welcome.", why: "“You’re welcome” is the answer to “Thank you”. Here, say “Thank you!”", whyPt: "“You’re welcome” é a resposta para “Thank you” (de nada). Aqui, diga “Thank you!”" },
          { t: "Welcome to you too.", why: "Just say “Thank you!”", whyPt: "Diga apenas “Thank you!”" }
        ] }
      ],
      phrases: [
        { t: "Here are our passports and visas.", pt: "Aqui estão nossos passaportes e vistos." },
        { t: "We are moving to Dubai.", pt: "Estamos nos mudando para Dubai." },
        { t: "This is my mother. She doesn’t speak English.", pt: "Esta é minha mãe. Ela não fala inglês." },
        { t: "She is our nanny.", pt: "Ela é nossa babá." },
        { t: "They are twins. They’re two years old.", pt: "Eles são gêmeos. Eles têm dois anos." },
        { t: "Sorry, could you say that again more slowly, please?", pt: "Desculpe, você pode repetir mais devagar, por favor?" }
      ]
    },

    /* ------------------------------------------------------------------ baggage claim */
    {
      id: "baggage",
      title: "Baggage claim",
      pt: "Restituição de bagagem",
      ar: "استلام الأمتعة",
      icon: "🧳",
      sub: "Suitcases, stroller, car seats",
      scene: "🖥️ 🔄 🧳 🛒",
      intro: "Find your belt on the screen and take two trolleys: you have a lot of suitcases! Then find the stroller and the car seats, and report a missing bag.",
      introPt: "Encontre sua esteira na tela e pegue dois carrinhos de bagagem: vocês têm muitas malas! Depois encontre o carrinho de bebê e as cadeirinhas e informe uma mala que não chegou.",
      tips: [
        { t: "Find your flight number on the screens. It tells you the belt number.",
          pt: "Procure o número do seu voo nas telas. Ele mostra o número da esteira." },
        { t: "Strollers, car seats and big boxes often come out at a special belt called “Oversized Baggage”.",
          pt: "Carrinhos de bebê, cadeirinhas e caixas grandes muitas vezes saem numa esteira especial chamada “Oversized Baggage”." },
        { t: "Keep your baggage tags. If a bag doesn’t arrive, go to Baggage Services before you leave the hall.",
          pt: "Guarde as etiquetas de bagagem. Se uma mala não chegar, vá ao Baggage Services antes de sair do saguão." }
      ],
      vocab: [
        { e: "🧳", w: "suitcase", pt: "mala", ex: "My suitcase is big and black.", exPt: "Minha mala é grande e preta." },
        { e: "🛒", w: "trolley", pt: "carrinho de bagagem", ex: "The trolleys are free.", exPt: "Os carrinhos de bagagem são grátis.",
          note: "American English: cart", notePt: "Em inglês americano: cart" },
        { e: "🔄", w: "belt", pt: "esteira", ex: "Our bags are on belt six.", exPt: "Nossas malas estão na esteira seis.",
          note: "Also called a carousel", notePt: "Também se diz carousel" },
        { e: "🖥️", w: "screen", pt: "tela", ex: "Look at the screen for your flight number.", exPt: "Procure o número do voo na tela." },
        { e: "🏷️", w: "baggage tag", pt: "etiqueta de bagagem", ex: "Keep your baggage tag. Don’t throw it away!", exPt: "Guarde a etiqueta de bagagem. Não jogue fora!" },
        { e: "❓", w: "missing", pt: "faltando", ex: "One of our suitcases is missing.", exPt: "Está faltando uma das nossas malas." },
        { e: "💔", w: "damaged", pt: "danificado", ex: "My suitcase is damaged.", exPt: "Minha mala está danificada.",
          note: "= broken", notePt: "= quebrado" },
        { e: "🚚", w: "deliver", pt: "entregar", ex: "They will deliver the suitcase to your home.", exPt: "Eles vão entregar a mala na sua casa." },
        { e: "👶", w: "stroller", pt: "carrinho de bebê", ex: "Where is our double stroller?", exPt: "Onde está nosso carrinho duplo?",
          note: "British English: pushchair", notePt: "Em inglês britânico: pushchair" },
        { e: "🚗", w: "car seat", pt: "cadeirinha", ex: "We have two car seats for the children.", exPt: "Temos duas cadeirinhas para as crianças." }
      ],
      dialogue: {
        lines: [
          { who: "you", t: "Excuse me, where can I find a [trolley]?", pt: "Com licença, onde encontro um carrinho de bagagem?" },
          { who: "porter", t: "The trolleys are over there, next to the wall. They are [free].", pt: "Os carrinhos estão ali, ao lado da parede. São grátis." },
          { who: "you", t: "Thank you. Which [belt] is for flight EK 247?", pt: "Obrigada. Qual esteira é do voo EK 247?", say: "Thank you. Which belt is for flight E K, two four seven?" },
          { who: "porter", t: "Belt number [six]. Look at the screen.", pt: "Esteira número seis. Olhe na tela." },
          { who: "you", t: "And where are the strollers and [car] seats?", pt: "E onde ficam os carrinhos de bebê e as cadeirinhas?" },
          { who: "porter", t: "They come out at [Oversized] Baggage, over there on the left.", pt: "Eles saem na “Oversized Baggage” (bagagem especial), ali à esquerda." },
          { who: "you", t: "Excuse me. One of our suitcases didn’t [arrive].", pt: "Com licença. Uma das nossas malas não chegou." },
          { who: "agent", t: "I’m sorry to hear that. Can I see your baggage [tag], please?", pt: "Sinto muito. Posso ver sua etiqueta de bagagem, por favor?" },
          { who: "you", t: "Here it is.", pt: "Aqui está." },
          { who: "agent", t: "Thank you. Can you [describe] the suitcase?", pt: "Obrigada. Você pode descrever a mala?" },
          { who: "you", t: "It’s big and black, with a red ribbon on the handle.", pt: "É grande e preta, com uma fita vermelha na alça." },
          { who: "agent", t: "OK. It’s on the next flight. It arrives [tomorrow] morning.", pt: "Ok. Ela está no próximo voo. Chega amanhã de manhã." },
          { who: "agent", t: "We can [deliver] it to your home. Please write your address and phone number here.", pt: "Podemos entregá-la na sua casa. Por favor, escreva seu endereço e telefone aqui." },
          { who: "you", t: "Yes, of course. Thank you for your help.", pt: "Sim, claro. Obrigada pela ajuda." }
        ],
        extra: ["sixteen", "cheap", "today", "small"],
        questions: [
          { q: "Are the trolleys free?", pt: "Os carrinhos de bagagem são grátis?", a: ["Yes, they are free.", "No, they cost 10 dirhams."] },
          { q: "Where are the strollers and car seats?", pt: "Onde estão os carrinhos de bebê e as cadeirinhas?", a: ["At Oversized Baggage, on the left", "On belt six", "At the information desk"] },
          { q: "When will the missing suitcase arrive?", pt: "Quando a mala que faltou vai chegar?", a: ["Tomorrow morning", "Tonight", "Next week"] }
        ]
      },
      roleplay: [
        { sit: "You can’t find your flight on the screen. You ask a man in an airport uniform.", pt: "Você não encontra seu voo na tela. Você pergunta a um homem com uniforme do aeroporto." },
        { choose: [
          { t: "Excuse me, which belt is for flight EK 247?", say: "Excuse me, which belt is for flight E K, two four seven?", ok: true },
          { t: "Where is the plane?", why: "You don’t need the plane now. Ask about the belt for your bags.", whyPt: "Você não precisa do avião agora. Pergunte sobre a esteira das malas." },
          { t: "I want a belt.", why: "Careful! A belt is also something you wear (cinto). Ask “Which belt is for my flight?”", whyPt: "Cuidado! “Belt” também é cinto de roupa. Pergunte “Which belt is for my flight?”" }
        ] },
        { who: "porter", t: "Flight EK 247? That’s belt number seven.", pt: "Voo EK 247? É a esteira número sete.", say: "Flight E K, two four seven? That’s belt number seven." },
        { ask: "Which belt is it?", askPt: "Qual é a esteira?", choose: [
          { t: "Belt 7", ok: true },
          { t: "Belt 11" },
          { t: "Belt 17" }
        ], hint: "Listen again: “seven”.", hintPt: "Ouça de novo: “seven” (sete)." },
        { sit: "All your suitcases arrive, but the double stroller is not on the belt.", pt: "As malas chegam, mas o carrinho duplo não está na esteira." },
        { choose: [
          { t: "Excuse me, where can we find our stroller? It isn’t on the belt.", ok: true },
          { t: "Excuse me, where is my baby?", why: "Your babies are with you! Ask about the stroller.", whyPt: "Seus bebês estão com você! Pergunte sobre o carrinho (stroller)." },
          { t: "The belt is broken.", why: "The belt works. Ask where the stroller is.", whyPt: "A esteira está funcionando. Pergunte onde está o carrinho." }
        ] },
        { who: "porter", t: "Strollers come out at Oversized Baggage, over there, next to belt nine.", pt: "Carrinhos de bebê saem na “Oversized Baggage”, ali, ao lado da esteira nove." },
        { ask: "Where is the stroller?", askPt: "Onde está o carrinho?", choose: [
          { t: "At Oversized Baggage, next to belt 9", ok: true },
          { t: "At Oversized Baggage, next to belt 5" },
          { t: "At the information desk" }
        ], hint: "Listen again: “next to belt nine”.", hintPt: "Ouça de novo: “next to belt nine” (ao lado da esteira nove)." },
        { sit: "One suitcase doesn’t come. You go to Baggage Services.", pt: "Uma mala não chega. Você vai ao Baggage Services." },
        { who: "agent", t: "Hello. How can I help you?", pt: "Olá. Como posso ajudar?" },
        { choose: [
          { t: "Hello. One of our suitcases didn’t arrive.", ok: true },
          { t: "Hello. I have nothing to declare.", why: "That is for customs. Tell her your suitcase didn’t arrive.", whyPt: "Isso é para a alfândega. Diga que sua mala não chegou." },
          { t: "Hello. I want to buy a suitcase.", why: "You don’t want a new suitcase! Tell her yours didn’t arrive.", whyPt: "Você não quer uma mala nova! Diga que a sua não chegou." }
        ] },
        { who: "agent", t: "I’m sorry. Do you have your baggage tag?", pt: "Sinto muito. Você tem a etiqueta de bagagem?" },
        { choose: [
          { t: "Yes, here it is.", ok: true },
          { t: "Yes, it’s heavy.", why: "She asked for the tag (the small paper sticker). Say “Yes, here it is.”", whyPt: "Ela pediu a etiqueta (o adesivo pequeno). Diga “Yes, here it is.”" },
          { t: "No, I’m tired.", why: "Look for the small sticker on your boarding pass or passport and say “Here it is.”", whyPt: "Procure o adesivo pequeno no cartão de embarque ou no passaporte e diga “Here it is.”" }
        ] },
        { who: "agent", t: "What does your suitcase look like?", pt: "Como é a sua mala?" },
        { choose: [
          { t: "It’s a big blue suitcase with four wheels.", ok: true },
          { t: "It looks sad.", why: "Describe the colour, the size and other details.", whyPt: "Descreva a cor, o tamanho e outros detalhes." },
          { t: "It’s in Dubai.", why: "She wants a description: size, colour, details.", whyPt: "Ela quer uma descrição: tamanho, cor, detalhes." }
        ] },
        { who: "agent", t: "We will deliver it to your home. What is your phone number?", pt: "Vamos entregá-la na sua casa. Qual é o seu telefone?" },
        { choose: [
          { t: "My number is 050 123 4567.", say: "My number is oh five oh, one two three, four five six seven.", ok: true },
          { t: "My home is very big.", why: "She asked for your phone number.", whyPt: "Ela pediu seu número de telefone." },
          { t: "Tomorrow is fine.", why: "She asked for your phone number, not the time.", whyPt: "Ela pediu seu telefone, não o horário." }
        ] }
      ],
      phrases: [
        { t: "Which belt is for my flight?", pt: "Qual esteira é do meu voo?" },
        { t: "Where can we find our stroller and car seats?", pt: "Onde encontramos nosso carrinho de bebê e as cadeirinhas?" },
        { t: "One of our suitcases didn’t arrive.", pt: "Uma das nossas malas não chegou." },
        { t: "My suitcase is damaged.", pt: "Minha mala está danificada." },
        { t: "Here is my baggage tag.", pt: "Aqui está minha etiqueta de bagagem." }
      ]
    },

    /* ------------------------------------------------------------------ customs */
    {
      id: "customs",
      title: "Customs",
      pt: "Alfândega",
      ar: "الجمارك",
      icon: "🛃",
      sub: "Green or red channel?",
      scene: "🟢 🧳 🔍 🍼",
      intro: "Choose the green or the red channel. An officer may scan your bags and ask about the children’s medicine and food.",
      introPt: "Escolha o canal verde ou o vermelho. Um oficial pode passar as malas no raio-x e perguntar sobre os remédios e a comida das crianças.",
      tips: [
        { t: "Green = nothing to declare. Red = goods to declare.",
          pt: "Verde = nada a declarar. Vermelho = bens a declarar." },
        { t: "You must declare cash or valuables worth more than AED 60,000.",
          pt: "É obrigatório declarar dinheiro ou objetos de valor acima de 60.000 dirhams." },
        { t: "Some medicines are controlled in the UAE. Carry the doctor’s prescription with all medicines, also the children’s.",
          pt: "Alguns remédios são controlados nos Emirados. Leve a receita médica junto com todos os remédios, inclusive os das crianças." }
      ],
      vocab: [
        { e: "🛃", w: "customs", pt: "alfândega", ex: "Customs officers can check your bags.", exPt: "Os oficiais da alfândega podem verificar suas malas." },
        { e: "📝", w: "declare", pt: "declarar", ex: "Do you have anything to declare?", exPt: "Você tem algo a declarar?" },
        { e: "🟢", w: "green channel", pt: "canal verde", ex: "Nothing to declare? Take the green channel.", exPt: "Nada a declarar? Vá pelo canal verde." },
        { e: "🔴", w: "red channel", pt: "canal vermelho", ex: "Goods to declare? Take the red channel.", exPt: "Bens a declarar? Vá pelo canal vermelho." },
        { e: "🔍", w: "scanner", pt: "raio-x", ex: "Please put your bags on the scanner.", exPt: "Por favor, coloque as malas no raio-x.",
          note: "Also called an X-ray machine", notePt: "Também se diz X-ray machine" },
        { e: "💵", w: "cash", pt: "dinheiro em espécie", ex: "I have two thousand dirhams in cash.", exPt: "Tenho dois mil dirhams em dinheiro." },
        { e: "💊", w: "medicine", pt: "remédio", ex: "This is my children’s medicine.", exPt: "Este é o remédio dos meus filhos." },
        { e: "📋", w: "prescription", pt: "receita médica", ex: "Here is the prescription from the doctor.", exPt: "Aqui está a receita do médico.",
          note: "Careful: a “recipe” is for cooking!", notePt: "Atenção: “recipe” é receita de cozinha! Receita médica é “prescription”." },
        { e: "🍼", w: "milk powder", pt: "leite em pó", ex: "This is milk powder for the twins.", exPt: "Isto é leite em pó para os gêmeos." },
        { e: "🎁", w: "gift", pt: "presente", ex: "These are gifts for our friends.", exPt: "Estes são presentes para nossos amigos." }
      ],
      dialogue: {
        lines: [
          { who: "customs", t: "Excuse me, madam. Please put your bags on the [scanner].", pt: "Com licença, senhora. Por favor, coloque as malas no raio-x." },
          { who: "you", t: "All of them?", pt: "Todas?" },
          { who: "customs", t: "Yes, all of them, please. Do you have anything to [declare]?", pt: "Sim, todas, por favor. Você tem algo a declarar?" },
          { who: "you", t: "No, [nothing] to declare.", pt: "Não, nada a declarar." },
          { who: "customs", t: "Are you carrying more than sixty thousand dirhams in [cash]?", pt: "Você está levando mais de sessenta mil dirhams em dinheiro?" },
          { who: "you", t: "No, I’m not.", pt: "Não, não estou." },
          { who: "customs", t: "What is this in your bag?", pt: "O que é isto na sua mala?" },
          { who: "you", t: "It’s my children’s [medicine]. Here is the [prescription].", pt: "É o remédio dos meus filhos. Aqui está a receita médica." },
          { who: "customs", t: "And these boxes?", pt: "E estas caixas?" },
          { who: "you", t: "It’s milk [powder] and baby food for the twins.", pt: "É leite em pó e papinha para os gêmeos." },
          { who: "customs", t: "That’s fine. You can go. Have a nice day.", pt: "Tudo bem. Podem ir. Tenham um bom dia." },
          { who: "you", t: "Thank you. You too!", pt: "Obrigada. Para você também!" }
        ],
        extra: ["camera", "everything", "recipe", "sugar"],
        questions: [
          { q: "Where does she put her bags?", pt: "Onde ela coloca as malas?", a: ["On the scanner", "On the floor", "In a taxi"] },
          { q: "What is in the boxes?", pt: "O que tem nas caixas?", a: ["Milk powder and baby food", "Gifts for friends", "Medicine"] },
          { q: "Does she have a lot of cash?", pt: "Ela está com muito dinheiro?", a: ["No, she doesn’t.", "Yes, more than 60,000 dirhams."] }
        ]
      },
      roleplay: [
        { who: "customs", t: "Good evening. Do you have anything to declare?", pt: "Boa noite. Você tem algo a declarar?" },
        { choose: [
          { t: "No, nothing to declare.", ok: true },
          { t: "No, I’m not.", why: "The question starts with “Do you…?”, so say “No, I don’t” or “No, nothing to declare.”", whyPt: "A pergunta começa com “Do you…?”, então diga “No, I don’t” ou “No, nothing to declare.”" },
          { t: "Yes, I am.", why: "This doesn’t answer “Do you have…?”. Say “No, nothing to declare.”", whyPt: "Isso não responde “Do you have…?”. Diga “No, nothing to declare.”" }
        ] },
        { who: "customs", t: "OK. Please put your bags on the machine.", pt: "Ok. Por favor, coloque as malas na máquina." },
        { choose: [
          { t: "Sure. The children’s bags too?", ok: true },
          { t: "No, these are my bags.", why: "Customs officers can check your bags. Say “Sure” and do it.", whyPt: "Os oficiais da alfândega podem verificar suas malas. Diga “Sure” (Claro) e faça." },
          { t: "I’m fine, thank you.", why: "She didn’t ask how you are. She asked you to put your bags on the machine.", whyPt: "Ela não perguntou como você está. Ela pediu para colocar as malas na máquina." }
        ] },
        { sit: "The officer takes a box of medicine out of your bag.", pt: "A oficial tira uma caixa de remédio da sua mala." },
        { who: "customs", t: "What is this?", pt: "O que é isto?" },
        { choose: [
          { t: "It’s my children’s medicine. Here is the prescription.", ok: true },
          { t: "It’s my children’s medicine. Here is the recipe.", why: "A “recipe” is for cooking! For medicine, say “prescription”.", whyPt: "“Recipe” é receita de cozinha! Para remédio, diga “prescription”." },
          { t: "I don’t know.", why: "Always know what is in your bags. Explain that it is medicine.", whyPt: "Sempre saiba o que tem nas suas malas. Explique que é remédio." }
        ] },
        { who: "customs", t: "And what is this powder?", pt: "E que pó é este?" },
        { choose: [
          { t: "It’s milk powder for the babies.", ok: true },
          { t: "It’s a secret.", why: "Never say this at customs! Say what it is: “It’s milk powder.”", whyPt: "Nunca diga isso na alfândega! Diga o que é: “It’s milk powder.” (É leite em pó.)" },
          { t: "It’s nothing!", why: "This sounds strange. Explain calmly what it is.", whyPt: "Isso parece estranho. Explique com calma o que é." }
        ] },
        { who: "customs", t: "How much cash are you carrying?", pt: "Quanto dinheiro você está levando?" },
        { choose: [
          { t: "About two thousand dirhams.", ok: true },
          { t: "By credit card.", why: "She asked “How much?”, so answer with an amount of money.", whyPt: "Ela perguntou “How much?” (Quanto?), então responda com um valor." },
          { t: "Two bags.", why: "She asked about cash (money), not bags.", whyPt: "Ela perguntou sobre dinheiro (cash), não sobre malas." }
        ] },
        { sit: "You have a big box of gifts. You are not sure about the rules.", pt: "Você tem uma caixa grande de presentes. Você não tem certeza das regras." },
        { choose: [
          { t: "Excuse me, do I need to declare this?", ok: true },
          { t: "I will hide it.", why: "Never hide things at customs! Ask the officer.", whyPt: "Nunca esconda nada na alfândega! Pergunte à oficial." },
          { t: "Green or red, I don’t care.", why: "This sounds rude. Ask politely: “Do I need to declare this?”", whyPt: "Isso parece grosseiro. Pergunte com educação: “Do I need to declare this?”" }
        ] },
        { who: "customs", t: "No, that’s fine. Welcome to Dubai.", pt: "Não, está tudo bem. Bem-vindos a Dubai." }
      ],
      phrases: [
        { t: "Nothing to declare.", pt: "Nada a declarar." },
        { t: "This is my children’s medicine. Here is the prescription.", pt: "Este é o remédio dos meus filhos. Aqui está a receita médica." },
        { t: "It’s milk powder for the babies.", pt: "É leite em pó para os bebês." },
        { t: "Do I need to declare this?", pt: "Preciso declarar isto?" }
      ]
    },

    /* ------------------------------------------------------------------ asking for help */
    {
      id: "help",
      title: "Asking for help",
      pt: "Pedindo ajuda",
      ar: "الاستعلامات",
      icon: "🙋‍♀️",
      sub: "Toilets, ATM, SIM card",
      scene: "ℹ️ 🚻 🏧 📱",
      intro: "The twins need the toilet and a nappy change, and you need money and a SIM card. Ask at the information desk and understand the directions.",
      introPt: "Os gêmeos precisam ir ao banheiro e trocar a fralda, e você precisa de dinheiro e de um chip de celular. Pergunte no balcão de informações e entenda as direções.",
      tips: [
        { t: "Start with “Excuse me”. It is polite, and it gets attention.",
          pt: "Comece com “Excuse me” (Com licença). É educado e chama a atenção." },
        { t: "You can buy a SIM card from du or e& (Etisalat) shops in the arrivals hall.",
          pt: "Você pode comprar um chip de celular nas lojas da du ou da e& (Etisalat) no saguão de chegada." },
        { t: "Emergency numbers in the UAE: Police 999, Ambulance 998.",
          pt: "Números de emergência nos Emirados: Polícia 999, Ambulância 998." }
      ],
      vocab: [
        { e: "🙋‍♀️", w: "Excuse me", pt: "Com licença", ex: "Excuse me, can you help me, please?", exPt: "Com licença, você pode me ajudar, por favor?",
          note: "Say this first to get someone’s attention.", notePt: "Diga isso primeiro para chamar a atenção de alguém." },
        { e: "🚻", w: "toilet", pt: "banheiro", ex: "Where is the toilet, please?", exPt: "Onde fica o banheiro, por favor?",
          note: "American English: restroom", notePt: "Em inglês americano: restroom" },
        { e: "⬅️", w: "on the left", pt: "à esquerda", ex: "The toilets are on the left.", exPt: "Os banheiros ficam à esquerda." },
        { e: "➡️", w: "on the right", pt: "à direita", ex: "The pharmacy is on the right.", exPt: "A farmácia fica à direita." },
        { e: "⬆️", w: "straight ahead", pt: "em frente", ex: "Go straight ahead.", exPt: "Siga em frente." },
        { e: "👫", w: "next to", pt: "ao lado de", ex: "The ATM is next to the café.", exPt: "O caixa eletrônico fica ao lado do café." },
        { e: "🏧", w: "ATM", pt: "caixa eletrônico", ex: "Is there an ATM near here?", exPt: "Tem um caixa eletrônico aqui perto?" },
        { e: "📱", w: "SIM card", pt: "chip de celular", ex: "Where can I buy a SIM card?", exPt: "Onde posso comprar um chip de celular?" },
        { e: "📶", w: "Wi-Fi", pt: "wi-fi", ex: "Is there free Wi-Fi?", exPt: "Tem wi-fi grátis?" },
        { e: "🚼", w: "baby care room", pt: "fraldário", ex: "Is there a baby care room?", exPt: "Tem fraldário?" }
      ],
      dialogue: {
        lines: [
          { who: "you", t: "Excuse me, can you [help] me, please?", pt: "Com licença, você pode me ajudar, por favor?" },
          { who: "info", t: "Of course, madam. How can I help?", pt: "Claro, senhora. Como posso ajudar?" },
          { who: "you", t: "Where is the nearest [toilet]? And is there a baby care room?", pt: "Onde fica o banheiro mais próximo? E tem fraldário?" },
          { who: "info", t: "Go [straight] ahead. The toilets are on your [left], and the baby care room is next to them.", pt: "Siga em frente. Os banheiros ficam à sua esquerda, e o fraldário fica ao lado deles." },
          { who: "you", t: "Thank you. And where can I buy a [SIM] card?", pt: "Obrigada. E onde posso comprar um chip de celular?" },
          { who: "info", t: "There are phone shops near the exit, on your [right].", pt: "Há lojas de celular perto da saída, à sua direita." },
          { who: "you", t: "Is there free [Wi-Fi] in the airport?", pt: "Tem wi-fi grátis no aeroporto?" },
          { who: "info", t: "Yes, it’s free. Just connect to the airport network.", pt: "Sim, é grátis. É só conectar na rede do aeroporto." },
          { who: "you", t: "Great. One more question. Is there an [ATM]?", pt: "Ótimo. Mais uma pergunta. Tem caixa eletrônico?" },
          { who: "info", t: "Yes, there is an ATM [next] to the currency exchange.", pt: "Sim, tem um caixa eletrônico ao lado da casa de câmbio." },
          { who: "you", t: "Thank you so much!", pt: "Muito obrigada!" },
          { who: "info", t: "You’re welcome. Enjoy Dubai!", pt: "De nada. Aproveite Dubai!" }
        ],
        extra: ["behind", "money", "down", "phone"],
        questions: [
          { q: "Where are the toilets?", pt: "Onde ficam os banheiros?", a: ["Straight ahead, on the left", "Straight ahead, on the right", "Downstairs"] },
          { q: "Where can she buy a SIM card?", pt: "Onde ela pode comprar um chip?", a: ["In the phone shops near the exit", "At the information desk", "At the café"] },
          { q: "Is the Wi-Fi free?", pt: "O wi-fi é grátis?", a: ["Yes", "No"] }
        ]
      },
      roleplay: [
        { sit: "You need help. You see a woman at the information desk.", pt: "Você precisa de ajuda. Você vê uma mulher no balcão de informações." },
        { choose: [
          { t: "Excuse me, can you help me, please?", ok: true },
          { t: "Hey! You! Help!", why: "This is too loud and rude. Start with “Excuse me…”.", whyPt: "Isso é alto e grosseiro demais. Comece com “Excuse me…”." },
          { t: "Help me now.", why: "This sounds like an order. Add “Excuse me” and “please”.", whyPt: "Isso parece uma ordem. Acrescente “Excuse me” e “please”." }
        ] },
        { who: "info", t: "Sure. What do you need?", pt: "Claro. Do que você precisa?" },
        { choose: [
          { t: "Where is the nearest toilet, please?", ok: true },
          { t: "Where the toilet is, please?", why: "Word order: in a question, “is” comes first: “Where is the toilet?”", whyPt: "Ordem das palavras: na pergunta, “is” vem antes: “Where is the toilet?”" },
          { t: "I need. Toilet.", why: "She will understand, but make a full question: “Where is the toilet, please?”", whyPt: "Ela vai entender, mas faça uma pergunta completa: “Where is the toilet, please?”" }
        ] },
        { who: "info", t: "Go straight ahead and turn left. It’s next to the pharmacy.", pt: "Siga em frente e vire à esquerda. Fica ao lado da farmácia." },
        { ask: "Where is the toilet?", askPt: "Onde fica o banheiro?", choose: [
          { t: "⬆️ then ⬅️, next to the pharmacy", ok: true },
          { t: "⬆️ then ➡️, next to the café" },
          { t: "⬇️ Downstairs, next to the exit" }
        ], hint: "Listen again for “left” or “right”.", hintPt: "Ouça de novo: “left” (esquerda) ou “right” (direita)?" },
        { sit: "You need some dirhams. You have a bank card.", pt: "Você precisa de dirhams. Você tem um cartão do banco." },
        { choose: [
          { t: "Is there an ATM near here?", ok: true },
          { t: "Where can I buy a SIM card?", why: "You need money, not a SIM card. Ask for an ATM.", whyPt: "Você precisa de dinheiro, não de um chip. Pergunte por um caixa eletrônico (ATM)." },
          { t: "Can you give me money?", why: "She can’t give you money! Ask where the ATM is.", whyPt: "Ela não pode lhe dar dinheiro! Pergunte onde fica o caixa eletrônico." }
        ] },
        { who: "info", t: "Yes, there’s an ATM on your right, after the currency exchange.", pt: "Sim, tem um caixa eletrônico à sua direita, depois da casa de câmbio." },
        { ask: "Where is the ATM?", askPt: "Onde fica o caixa eletrônico?", choose: [
          { t: "➡️ On the right, after the currency exchange", ok: true },
          { t: "⬅️ On the left, before the currency exchange" },
          { t: "⬆️ Straight ahead, next to the toilets" }
        ], hint: "Listen again for “left” or “right”.", hintPt: "Ouça de novo: “left” (esquerda) ou “right” (direita)?" },
        { sit: "Now you want a SIM card. You ask, but the airport is very noisy.", pt: "Agora você quer um chip de celular. Você pergunta, mas o aeroporto está muito barulhento." },
        { who: "info", t: "The phone shops are near the exit, on your left.", pt: "As lojas de celular ficam perto da saída, à sua esquerda.", quiet: true },
        { choose: [
          { t: "Sorry, could you say that again, please?", ok: true },
          { t: "OK, thank you!", why: "If you didn’t hear, don’t say OK. Ask her to repeat.", whyPt: "Se você não ouviu, não diga OK. Peça para ela repetir." },
          { t: "Louder!", why: "This is rude. Say “Sorry, could you say that again, please?”", whyPt: "Isso é grosseiro. Diga “Sorry, could you say that again, please?”" }
        ] },
        { who: "info", t: "Of course! The phone shops are near the exit, on your left.", pt: "Claro! As lojas de celular ficam perto da saída, à sua esquerda." },
        { ask: "Where are the phone shops?", askPt: "Onde ficam as lojas de celular?", choose: [
          { t: "Near the exit, on the left", ok: true },
          { t: "Near the exit, on the right" },
          { t: "Next to the ATM" }
        ], hint: "Listen again: “near the exit, on your…”", hintPt: "Ouça de novo: “near the exit, on your…” (perto da saída, à sua…)" }
      ],
      phrases: [
        { t: "Where is the toilet, please?", pt: "Onde fica o banheiro, por favor?" },
        { t: "Is there a baby care room?", pt: "Tem fraldário?" },
        { t: "Is there an ATM near here?", pt: "Tem um caixa eletrônico aqui perto?" },
        { t: "Where can I buy a SIM card?", pt: "Onde posso comprar um chip de celular?" },
        { t: "Is there free Wi-Fi?", pt: "Tem wi-fi grátis?" }
      ]
    },

    /* ------------------------------------------------------------------ taxi */
    {
      id: "taxi",
      title: "Taking a taxi",
      pt: "Pegando um táxi",
      ar: "سيارات الأجرة",
      icon: "🚕",
      sub: "Big taxi, car seats, receipt",
      scene: "🚐 🧳 📍 🏙️",
      intro: "You are five people with a lot of luggage. At the taxi rank, ask for a big taxi, give the address, and ask about car seats and the price.",
      introPt: "Vocês são cinco pessoas com muita bagagem. No ponto de táxi, peça um táxi grande, diga o endereço e pergunte sobre cadeirinhas e o preço.",
      tips: [
        { t: "Use the official taxi rank outside Arrivals. Dubai taxis use a meter.",
          pt: "Use o ponto de táxi oficial na saída de Arrivals. Os táxis de Dubai usam taxímetro." },
        { t: "UAE law says children under 4 must travel in a child car seat. Most taxis don’t have them: bring your own, or book a car with child seats before you travel.",
          pt: "A lei dos Emirados diz que crianças com menos de 4 anos devem viajar em cadeirinha. A maioria dos táxis não tem: leve as suas ou reserve um carro com cadeirinhas antes da viagem." },
        { t: "Pink-roof taxis have women drivers. They are for women and families.",
          pt: "Os táxis de teto rosa têm motoristas mulheres. São para mulheres e famílias." },
        { t: "Taxis from the airport have a higher starting fare (about AED 25). The Careem and Uber apps also work in Dubai.",
          pt: "Os táxis do aeroporto têm uma bandeirada mais alta (cerca de 25 dirhams). Os aplicativos Careem e Uber também funcionam em Dubai." }
      ],
      vocab: [
        { e: "🚕", w: "taxi rank", pt: "ponto de táxi", ex: "The taxi rank is outside, near the exit.", exPt: "O ponto de táxi fica do lado de fora, perto da saída.",
          note: "American English: taxi stand", notePt: "Em inglês americano: taxi stand" },
        { e: "🚐", w: "van", pt: "van", ex: "We need a big taxi. A van, please.", exPt: "Precisamos de um táxi grande. Uma van, por favor." },
        { e: "📍", w: "address", pt: "endereço", ex: "Here is the address.", exPt: "Aqui está o endereço." },
        { e: "🧳", w: "boot", pt: "porta-malas", ex: "Can you put the bags in the boot?", exPt: "Você pode colocar as malas no porta-malas?",
          note: "American English: trunk", notePt: "Em inglês americano: trunk" },
        { e: "🚗", w: "car seat", pt: "cadeirinha", ex: "We have our own car seats.", exPt: "Temos nossas próprias cadeirinhas." },
        { e: "💳", w: "pay by card", pt: "pagar com cartão", ex: "Can I pay by card?", exPt: "Posso pagar com cartão?" },
        { e: "🚦", w: "traffic", pt: "trânsito", ex: "It depends on the traffic.", exPt: "Depende do trânsito." },
        { e: "❄️", w: "air conditioning", pt: "ar-condicionado", ex: "Could you turn down the air conditioning, please?", exPt: "Você pode diminuir o ar-condicionado, por favor?",
          note: "People often say “the AC”.", notePt: "Muita gente diz “the AC”." },
        { e: "🧾", w: "receipt", pt: "recibo", ex: "Can I have a receipt, please?", exPt: "Pode me dar um recibo, por favor?",
          note: "Careful: a “recipe” is for cooking!", notePt: "Cuidado: “recipe” é receita de cozinha! Recibo é “receipt”." },
        { e: "⏱️", w: "meter", pt: "taxímetro", ex: "The price is on the meter.", exPt: "O preço está no taxímetro." }
      ],
      dialogue: {
        lines: [
          { who: "marshal", t: "Taxi, madam? How many [people]?", pt: "Táxi, senhora? Quantas pessoas?" },
          { who: "you", t: "Five: three adults and two small children. And we have a lot of [bags].", pt: "Cinco: três adultos e duas crianças pequenas. E temos muitas malas." },
          { who: "marshal", t: "No problem. Please take the [big] taxi over there. It’s a van.", pt: "Sem problema. Peguem aquele táxi grande ali. É uma van." },
          { who: "driver", t: "Good evening, madam. [Where] are you going?", pt: "Boa noite, senhora. Para onde vocês vão?" },
          { who: "you", t: "Good evening. To Dubai Marina, please. Here is the [address].", pt: "Boa noite. Para a Dubai Marina, por favor. Aqui está o endereço." },
          { who: "driver", t: "OK. I will put your bags in the [boot].", pt: "Ok. Vou colocar as malas no porta-malas." },
          { who: "you", t: "Thank you. We have our own car [seats] for the children. Is that OK?", pt: "Obrigada. Temos nossas próprias cadeirinhas para as crianças. Tudo bem?" },
          { who: "driver", t: "Yes, of course. I can help you put them in.", pt: "Sim, claro. Posso ajudar a instalar." },
          { who: "you", t: "How long does it [take]?", pt: "Quanto tempo leva?" },
          { who: "driver", t: "About [thirty] minutes. It depends on the traffic.", pt: "Mais ou menos trinta minutos. Depende do trânsito." },
          { who: "you", t: "Can I pay by [card]?", pt: "Posso pagar com cartão?" },
          { who: "driver", t: "Yes, of course. Card or cash, no problem.", pt: "Sim, claro. Cartão ou dinheiro, sem problema." },
          { who: "you", t: "It’s a bit cold for the children. Could you turn [down] the air conditioning, please?", pt: "Está um pouco frio para as crianças. Você pode diminuir o ar-condicionado, por favor?" },
          { who: "driver", t: "Sure, no problem.", pt: "Claro, sem problema." },
          { who: "driver", t: "Here we are. That’s ninety-five dirhams.", pt: "Chegamos. São noventa e cinco dirhams." },
          { who: "you", t: "Here you are. Can I have a [receipt], please?", pt: "Aqui está. Pode me dar um recibo, por favor?" },
          { who: "driver", t: "Of course. Here you are. Welcome to Dubai!", pt: "Claro. Aqui está. Bem-vindos a Dubai!" }
        ],
        extra: ["thirteen", "up", "recipe", "small"],
        questions: [
          { q: "How many people are in the family?", pt: "Quantas pessoas há na família?", a: ["Five", "Four", "Three"] },
          { q: "How long is the trip?", pt: "Quanto tempo dura a viagem?", a: ["About 30 minutes", "About 13 minutes", "About 3 hours"] },
          { q: "How much is the taxi?", pt: "Quanto custa o táxi?", a: ["AED 95", "AED 59", "AED 15"] }
        ]
      },
      roleplay: [
        { who: "marshal", t: "Good evening. How many people?", pt: "Boa noite. Quantas pessoas?" },
        { choose: [
          { t: "Five: three adults and two children.", ok: true },
          { t: "Fifteen.", why: "“Fifteen” is 15! You are five (5).", whyPt: "“Fifteen” é 15! Vocês são cinco (five)." },
          { t: "We are fine, thanks.", why: "He asked how many people. Say “Five: three adults and two children.”", whyPt: "Ele perguntou quantas pessoas. Diga “Five: three adults and two children.”" }
        ] },
        { who: "marshal", t: "And you have a lot of luggage. You need a big taxi.", pt: "E vocês têm muita bagagem. Vocês precisam de um táxi grande." },
        { choose: [
          { t: "Yes, please. A big taxi.", ok: true },
          { t: "No, a small taxi, please.", why: "Five people and many suitcases don’t fit in a small taxi!", whyPt: "Cinco pessoas e muitas malas não cabem num táxi pequeno!" },
          { t: "Yes, I am big.", why: "He means the car! Say “Yes, please. A big taxi.”", whyPt: "Ele está falando do carro! Diga “Yes, please. A big taxi.”" }
        ] },
        { who: "driver", t: "Hello, madam. Where to?", pt: "Olá, senhora. Para onde?" },
        { choose: [
          { t: "To this address, please.", ok: true },
          { t: "From the airport.", why: "You are already at the airport. He wants to know where you are going.", whyPt: "Vocês já estão no aeroporto. Ele quer saber para onde vocês vão." },
          { t: "Yes, I’m going.", why: "“Where to?” means “Where are you going?”. Show him the address.", whyPt: "“Where to?” significa “Para onde vocês vão?”. Mostre o endereço." }
        ] },
        { sit: "The twins need car seats.", pt: "Os gêmeos precisam de cadeirinhas." },
        { choose: [
          { t: "Do you have car seats for the children?", ok: true },
          { t: "Do you have chairs for the children?", why: "In a car, we say “car seats”, not “chairs”.", whyPt: "No carro, dizemos “car seats” (cadeirinhas), não “chairs” (cadeiras)." },
          { t: "The children can sit on my legs.", why: "This is not safe, and the law says small children need a car seat.", whyPt: "Não é seguro, e a lei exige cadeirinha para crianças pequenas." }
        ] },
        { who: "driver", t: "Sorry, I don’t have car seats.", pt: "Desculpe, não tenho cadeirinhas." },
        { choose: [
          { t: "No problem. We have our own.", ok: true },
          { t: "Yes, please.", why: "He said he doesn’t have car seats. Say you have your own: “We have our own.”", whyPt: "Ele disse que não tem cadeirinhas. Diga que vocês têm as suas: “We have our own.”" },
          { t: "You’re welcome.", why: "“You’re welcome” answers “Thank you”. Say “No problem. We have our own.”", whyPt: "“You’re welcome” responde “Thank you”. Diga “No problem. We have our own.”" }
        ] },
        { who: "driver", t: "OK. It takes about forty minutes.", pt: "Ok. Leva mais ou menos quarenta minutos." },
        { ask: "How long is the trip?", askPt: "Quanto tempo dura a viagem?", choose: [
          { t: "40 minutes", ok: true },
          { t: "14 minutes" },
          { t: "4 hours" }
        ], hint: "Listen again: “forty” is 40, “fourteen” is 14.", hintPt: "Ouça de novo: “forty” é 40, “fourteen” é 14." },
        { sit: "You don’t have any cash.", pt: "Você não tem dinheiro em espécie." },
        { choose: [
          { t: "Can I pay by card?", ok: true },
          { t: "I have no money, sorry.", why: "He may think you can’t pay! Ask about paying by card.", whyPt: "Ele pode achar que você não pode pagar! Pergunte se aceita cartão." },
          { t: "Is the card free?", why: "Ask: “Can I pay by card?”", whyPt: "Pergunte: “Can I pay by card?”" }
        ] },
        { who: "driver", t: "Yes, card is fine.", pt: "Sim, cartão está ótimo." },
        { sit: "The car is too cold for the children.", pt: "O carro está frio demais para as crianças." },
        { choose: [
          { t: "Could you turn down the air conditioning, please?", ok: true },
          { t: "Could you turn up the air conditioning, please?", why: "“Turn up” means more air conditioning. It will be even colder! Say “turn down”.", whyPt: "“Turn up” significa aumentar o ar-condicionado. Vai ficar ainda mais frio! Diga “turn down” (diminuir)." },
          { t: "Stop the cold now!", why: "This sounds rude. Use “Could you…, please?”", whyPt: "Isso parece grosseiro. Use “Could you…, please?”" }
        ] },
        { who: "driver", t: "Here we are. That’s ninety dirhams.", pt: "Chegamos. São noventa dirhams." },
        { ask: "How much is it?", askPt: "Quanto custa?", choose: [
          { t: "AED 90", ok: true },
          { t: "AED 19" },
          { t: "AED 9" }
        ], hint: "“Ninety” is 90. “Nineteen” is 19.", hintPt: "“Ninety” é 90. “Nineteen” é 19." },
        { sit: "You want a paper that shows the price you paid.", pt: "Você quer um papel que mostre o valor que pagou." },
        { choose: [
          { t: "Can I have a receipt, please?", ok: true },
          { t: "Can I have a recipe, please?", why: "A “recipe” tells you how to cook food! You want a “receipt”.", whyPt: "“Recipe” é receita de cozinha! Você quer um “receipt” (recibo)." },
          { t: "Can I have a ticket, please?", why: "In a taxi, ask for a “receipt”.", whyPt: "No táxi, peça um “receipt” (recibo)." }
        ] },
        { who: "driver", t: "Here you are. Welcome to Dubai!", pt: "Aqui está. Bem-vindos a Dubai!" }
      ],
      phrases: [
        { t: "We are five people. We need a big taxi.", pt: "Somos cinco pessoas. Precisamos de um táxi grande." },
        { t: "To this address, please.", pt: "Para este endereço, por favor." },
        { t: "We have our own car seats.", pt: "Temos nossas próprias cadeirinhas." },
        { t: "How long does it take?", pt: "Quanto tempo leva?" },
        { t: "Can I pay by card?", pt: "Posso pagar com cartão?" },
        { t: "Could you turn down the air conditioning, please?", pt: "Você pode diminuir o ar-condicionado, por favor?" },
        { t: "Can I have a receipt, please?", pt: "Pode me dar um recibo, por favor?" }
      ]
    }
  ]
});
