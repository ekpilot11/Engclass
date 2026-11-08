/* Hello Dubai — journey 1: On the plane (boarding, meals, help during the flight, landing). */
window.HD_CONTENT.journeys.push({
  id: "flight",
  title: "On the plane",
  pt: "No avião",
  board: "In flight",
  boardAr: "على متن الطائرة",
  stops: [
    /* ------------------------------------------------------------------ boarding */
    {
      id: "boarding",
      title: "Finding your seats",
      pt: "Encontrando os assentos",
      ar: "الصعود إلى الطائرة",
      icon: "💺",
      sub: "Boarding passes and seats",
      scene: "🎫 ✈️ 💺 🧳",
      imgScene: "boarding the plane: the family from the reference image walks down the aisle of a big airplane cabin; a friendly flight attendant in a dark-teal uniform points to their row of seats; some overhead lockers are open.",
      intro: "You board the plane with the twins, your mother and the nanny. Show your boarding passes, find your seats and ask to sit together.",
      introPt: "Você embarca no avião com os gêmeos, sua mãe e a babá. Mostre os cartões de embarque, encontre os assentos e peça para vocês sentarem juntos.",
      tips: [
        { t: "Children over 2 years old have their own seat and wear a normal seatbelt.",
          pt: "Crianças com mais de 2 anos têm o próprio assento e usam o cinto de segurança normal." },
        { t: "A seat number has a row and a letter, for example 32A. Seat A is usually next to the window.",
          pt: "O número do assento tem a fileira e uma letra, por exemplo 32A. O assento A normalmente fica na janela." },
        { t: "If your family is not sitting together, ask the cabin crew politely. They often help families with small children.",
          pt: "Se a família não estiver sentada junta, peça com educação à tripulação. Eles costumam ajudar famílias com crianças pequenas." }
      ],
      vocab: [
        { e: "🎫", w: "boarding pass", pt: "cartão de embarque", ex: "May I see your boarding pass?", exPt: "Posso ver seu cartão de embarque?",
          img: "an airline boarding pass held in a hand, with a barcode-like pattern and grey lines instead of writing" },
        { e: "💺", w: "seat", pt: "assento, poltrona", ex: "My seat is 32A.", exPt: "Meu assento é o 32A.",
          img: "a single comfortable airplane seat in an aircraft cabin, seen from the front" },
        { e: "🔢", w: "row", pt: "fileira", ex: "We are in row thirty-two.", exPt: "Estamos na fileira trinta e dois.",
          img: "a row of three airplane seats side by side in a cabin, seen from the aisle" },
        { e: "🪟", w: "window seat", pt: "assento na janela", ex: "The children want the window seat.", exPt: "As crianças querem o assento na janela.",
          img: "an airplane window seat next to an oval window showing clouds and blue sky" },
        { e: "🚶", w: "aisle", pt: "corredor", ex: "Go down this aisle.", exPt: "Siga por este corredor.",
          note: "Say it like “I’ll”: the s is silent.", notePt: "Pronuncia-se “ail”: o s é mudo.",
          img: "the long narrow aisle between rows of seats inside an airplane cabin, seen from one end" },
        { e: "🧳", w: "overhead locker", pt: "compartimento de bagagem", ex: "Please put your bag in the overhead locker.", exPt: "Por favor, coloque a mala no compartimento de bagagem.",
          img: "an open overhead locker above airplane seats with a suitcase inside" },
        { e: "👨‍👩‍👧‍👦", w: "together", pt: "juntos", ex: "Can we sit together?", exPt: "Podemos sentar juntos?",
          img: "the family from the reference image sitting together side by side in a row of airplane seats, smiling", imgFamily: true },
        { e: "👦👧", w: "twins", pt: "gêmeos", ex: "They are twins: a boy and a girl.", exPt: "Eles são gêmeos: um menino e uma menina.",
          img: "the two toddler twins from the reference image, the boy and the girl, sitting side by side in airplane seats with their seatbelts on", imgFamily: true },
        { e: "🛫", w: "take-off", pt: "decolagem", ex: "The children must wear seatbelts for take-off.", exPt: "As crianças precisam usar o cinto na decolagem.",
          img: "an airplane taking off from a runway into a clear blue sky" }
      ],
      dialogue: {
        lines: [
          { who: "crew", t: "Good evening, welcome on board. May I see your [boarding] passes, please?", pt: "Boa noite, bem-vindos a bordo. Posso ver os cartões de embarque, por favor?" },
          { who: "you", t: "Here you are. We are five: me, my mother, our nanny and my two children.", pt: "Aqui estão. Somos cinco: eu, minha mãe, nossa babá e meus dois filhos." },
          { who: "crew", t: "Thank you. Your seats are in row [thirty-two]. Go down this [aisle], on the left.", pt: "Obrigada. Os assentos de vocês estão na fileira trinta e dois. Sigam por este corredor, à esquerda." },
          { who: "you", t: "Excuse me, our seats are not [together]. Can we sit together? The children are only two.", pt: "Com licença, nossos assentos não estão juntos. Podemos sentar juntos? As crianças têm só dois anos." },
          { who: "crew", t: "Let me check. Yes, this gentleman can [change] seats with you.", pt: "Deixe-me verificar. Sim, este senhor pode trocar de lugar com vocês." },
          { who: "you", t: "Thank you so much! That’s very kind.", pt: "Muito obrigada! É muita gentileza." },
          { who: "crew", t: "Please put your big bags in the overhead [locker]. Small bags go under the seat in front of you.", pt: "Por favor, coloquem as malas grandes no compartimento de bagagem. As bolsas pequenas vão embaixo do assento da frente." },
          { who: "you", t: "Could you show me how to fasten the children’s [seatbelts]?", pt: "Você pode me mostrar como prender o cinto das crianças?" },
          { who: "crew", t: "Of course. Like this: click, and then pull. They must wear them for [take-off].", pt: "Claro. Assim: clique e depois puxe. Eles precisam usar o cinto na decolagem." },
          { who: "you", t: "Thank you. My mother doesn’t speak English. I can [translate] for her.", pt: "Obrigada. Minha mãe não fala inglês. Eu posso traduzir para ela." },
          { who: "crew", t: "No problem. If you need anything, press this button to call me.", pt: "Sem problema. Se precisar de alguma coisa, aperte este botão para me chamar." }
        ],
        extra: ["twenty-three", "window", "door", "speak"],
        questions: [
          { q: "Where are their seats?", pt: "Onde ficam os assentos deles?", a: ["Row 32, on the left", "Row 23, on the right", "Row 32, on the right"] },
          { q: "Who changes seats with them?", pt: "Quem troca de lugar com eles?", a: ["A man (“this gentleman”)", "The flight attendant", "Her mother"] },
          { q: "Why does she translate for her mother?", pt: "Por que ela traduz para a mãe?", a: ["Her mother doesn’t speak English.", "Her mother is sleeping.", "Her mother is on another plane."] }
        ]
      },
      roleplay: [
        { who: "crew", t: "Good evening. Boarding passes, please.", pt: "Boa noite. Cartões de embarque, por favor." },
        { choose: [
          { t: "Good evening. Here you are.", ok: true },
          { t: "Yes, we are boarding.", why: "She wants to see your boarding passes. Give them to her and say “Here you are.”", whyPt: "Ela quer ver os cartões de embarque. Entregue e diga “Here you are.” (Aqui estão.)" },
          { t: "Good evening. Window, please.", why: "She didn’t ask about the window. Give her your boarding passes.", whyPt: "Ela não perguntou sobre a janela. Entregue os cartões de embarque." }
        ] },
        { who: "crew", t: "Your seats are in row twenty-three, on the right.", pt: "Os assentos de vocês estão na fileira vinte e três, à direita." },
        { ask: "Where are your seats?", askPt: "Onde ficam seus assentos?", choose: [
          { t: "Row 23, on the right ➡️", ok: true },
          { t: "Row 32, on the right ➡️" },
          { t: "Row 23, on the left ⬅️" }
        ], hint: "Listen again: “twenty-three” is 23, and “right” is ➡️.", hintPt: "Ouça de novo: “twenty-three” é 23, e “right” é direita ➡️." },
        { sit: "A man is sitting in your seat, 23C.", pt: "Um homem está sentado no seu assento, o 23C." },
        { choose: [
          { t: "Excuse me, I think you’re in my seat. I’m 23C.", ok: true },
          { t: "Get up! This is my seat!", why: "This is too rude. Start with “Excuse me, I think…”.", whyPt: "Isso é grosseiro demais. Comece com “Excuse me, I think…” (Com licença, acho que…)." },
          { t: "Sorry, I’m sitting here.", why: "He is sitting there now. Tell him politely it is your seat: “I think you’re in my seat.”", whyPt: "Ele está sentado aí agora. Diga com educação que o lugar é seu: “I think you’re in my seat.”" }
        ] },
        { who: "passenger", t: "Oh, sorry! You’re right. My seat is 32C.", pt: "Ah, desculpe! Você tem razão. Meu assento é o 32C.", say: "Oh, sorry! You’re right. My seat is thirty-two C." },
        { sit: "Your family has seats in different rows. You want to sit together.", pt: "Sua família tem assentos em fileiras diferentes. Vocês querem sentar juntos." },
        { choose: [
          { t: "Excuse me, could we sit together, please? We have two small children.", ok: true },
          { t: "We want together.", why: "Make a full, polite question: “Could we sit together, please?”", whyPt: "Faça uma pergunta completa e educada: “Could we sit together, please?”" },
          { t: "Change our seats now.", why: "This sounds like an order. Use “Could we…, please?”", whyPt: "Isso parece uma ordem. Use “Could we…, please?”" }
        ] },
        { who: "crew", t: "Of course. Let me see what I can do.", pt: "Claro. Vou ver o que posso fazer." },
        { who: "crew", t: "Is this lady with you? Would she like a blanket?", pt: "Esta senhora está com vocês? Ela gostaria de um cobertor?" },
        { choose: [
          { t: "Yes, she’s my mother. A blanket, please. Thank you!", ok: true },
          { t: "No, she isn’t.", why: "She is your mother, so she is with you! Say “Yes, she’s my mother.”", whyPt: "Ela é sua mãe, então está com você! Diga “Yes, she’s my mother.”" },
          { t: "Yes, he’s my mother.", why: "For a woman we say “she”, not “he”: “Yes, she’s my mother.”", whyPt: "Para mulher dizemos “she”, não “he”: “Yes, she’s my mother.”" }
        ] },
        { who: "crew", t: "Here you are. The children need to wear their seatbelts now.", pt: "Aqui está. As crianças precisam colocar o cinto agora." },
        { choose: [
          { t: "OK. Could you show me how, please?", ok: true },
          { t: "No, they are sleeping.", why: "Children must wear seatbelts, even when they sleep.", whyPt: "As crianças precisam usar o cinto, mesmo dormindo." },
          { t: "Yes, they are two.", why: "She didn’t ask their age. Say “OK” and fasten their seatbelts.", whyPt: "Ela não perguntou a idade. Diga “OK” e prenda o cinto deles." }
        ] },
        { who: "crew", t: "Sure. Click it like this, and pull. Perfect!", pt: "Claro. Clique assim e puxe. Perfeito!" }
      ],
      phrases: [
        { t: "Could we sit together, please? We have two small children.", pt: "Podemos sentar juntos, por favor? Temos duas crianças pequenas." },
        { t: "Excuse me, I think you’re in my seat.", pt: "Com licença, acho que você está no meu lugar." },
        { t: "Could you show me how to fasten the seatbelt?", pt: "Você pode me mostrar como prender o cinto?" }
      ]
    },

    /* ------------------------------------------------------------------ meals */
    {
      id: "meals",
      title: "Food and drinks",
      pt: "Comida e bebidas",
      ar: "الوجبات",
      icon: "🍽️",
      sub: "Meals, drinks, warm milk",
      scene: "🍗 🍝 🧃 ☕",
      imgScene: "meal time on the plane: the family from the reference image sits in a row of airplane seats with the tray tables down; a male flight attendant in a dark-teal waistcoat with a food trolley offers meals; the toddlers have colourful children's meals.",
      intro: "The flight attendants bring food and drinks. Choose your meal, order for the children and your mother, and ask for warm milk.",
      introPt: "Os comissários servem comida e bebidas. Escolha sua refeição, peça para as crianças e para sua mãe, e peça leite morno.",
      tips: [
        { t: "When the question is “A or B?”, don’t answer “Yes”. Say the one you want: “Chicken, please.”",
          pt: "Quando a pergunta é “A ou B?”, não responda “Yes”. Diga o que você quer: “Chicken, please.”" },
        { t: "You can order children’s meals before the flight, on the airline’s website (“Manage booking”).",
          pt: "Você pode pedir refeições infantis antes do voo, no site da companhia aérea (“Manage booking”)." },
        { t: "Flight attendants can usually warm milk or baby food for you. Just ask politely.",
          pt: "Os comissários normalmente podem esquentar leite ou papinha. É só pedir com educação." }
      ],
      vocab: [
        { e: "🍗", w: "chicken", pt: "frango", ex: "Chicken with rice, please.", exPt: "Frango com arroz, por favor.",
          img: "an airline meal tray with grilled chicken and rice" },
        { e: "🍝", w: "pasta", pt: "massa, macarrão", ex: "The pasta has vegetables.", exPt: "A massa tem legumes.",
          img: "an airline meal tray with pasta and vegetables in a small dish" },
        { e: "🧒", w: "children’s meal", pt: "refeição infantil", ex: "Two children’s meals, please.", exPt: "Duas refeições infantis, por favor.",
          img: "a colourful children's meal on an airplane tray: a small pasta dish, fruit and a little juice box" },
        { e: "🧃", w: "juice", pt: "suco", ex: "Apple juice for the children, please.", exPt: "Suco de maçã para as crianças, por favor.",
          img: "a small carton of apple juice with a straw next to a plastic cup of juice" },
        { e: "💧", w: "water", pt: "água", ex: "Could I have some water, please?", exPt: "Pode me dar um pouco de água, por favor?",
          img: "a small bottle of water next to a plastic cup of water" },
        { e: "☕", w: "tea", pt: "chá", ex: "Tea with milk, no sugar, please.", exPt: "Chá com leite, sem açúcar, por favor.",
          img: "a cup of tea with milk on a small saucer, with a little steam rising" },
        { e: "🍼", w: "milk bottle", pt: "mamadeira", ex: "Could you warm this milk bottle, please?", exPt: "Você pode esquentar esta mamadeira, por favor?",
          note: "warm = a little hot", notePt: "warm = morno",
          img: "a baby milk bottle filled with warm milk, a small curl of steam above it" },
        { e: "🌶️", w: "spicy", pt: "apimentado", ex: "Is it spicy?", exPt: "É apimentado?",
          img: "a red chili pepper next to a bowl of food, with little flames to show it is spicy" },
        { e: "🍽️", w: "tray", pt: "bandeja", ex: "Can I take your tray?", exPt: "Posso levar sua bandeja?",
          img: "a fold-down tray table on the back of an airplane seat with a meal tray on it" },
        { e: "🧻", w: "napkin", pt: "guardanapo", ex: "Could I have some more napkins?", exPt: "Pode me dar mais guardanapos?",
          img: "a neat stack of folded white paper napkins" }
      ],
      dialogue: {
        lines: [
          { who: "crew", t: "Good evening. Would you like [chicken] with rice, or pasta with vegetables?", pt: "Boa noite. Você prefere frango com arroz ou massa com legumes?" },
          { who: "you", t: "Chicken, please. And the [pasta] for my mother.", pt: "Frango, por favor. E a massa para a minha mãe." },
          { who: "crew", t: "And for the children? We have a special meal for [children].", pt: "E para as crianças? Temos uma refeição especial infantil." },
          { who: "you", t: "Yes, please. Two children’s meals. Is it [spicy]?", pt: "Sim, por favor. Duas refeições infantis. É apimentado?" },
          { who: "crew", t: "No, it isn’t. Anything to [drink]?", pt: "Não, não é. Algo para beber?" },
          { who: "you", t: "Water for me, and apple [juice] for the children, please.", pt: "Água para mim e suco de maçã para as crianças, por favor." },
          { who: "crew", t: "And for the lady? Tea or coffee?", pt: "E para a senhora? Chá ou café?" },
          { who: "you", t: "[Tea] with milk, no sugar, please.", pt: "Chá com leite, sem açúcar, por favor." },
          { who: "you", t: "Excuse me, could you [warm] this milk bottle for my son, please?", pt: "Com licença, você pode esquentar esta mamadeira para o meu filho, por favor?" },
          { who: "crew", t: "Of course. I’ll bring it back in five [minutes].", pt: "Claro. Eu trago de volta em cinco minutos." },
          { who: "crew", t: "Have you finished? Can I take your [tray]?", pt: "Vocês terminaram? Posso levar a bandeja?" },
          { who: "you", t: "Yes, thank you. It was delicious.", pt: "Sim, obrigada. Estava delicioso." }
        ],
        extra: ["fish", "coffee", "cold", "hours"],
        questions: [
          { q: "What does her mother eat?", pt: "O que a mãe dela come?", a: ["The pasta", "The chicken", "A children’s meal"] },
          { q: "What do the children drink?", pt: "O que as crianças bebem?", a: ["Apple juice", "Orange juice", "Tea with milk"] },
          { q: "What does she ask the flight attendant to do?", pt: "O que ela pede à comissária?", a: ["Warm the milk bottle", "Wash the milk bottle", "Buy some milk"] }
        ]
      },
      roleplay: [
        { who: "crew2", t: "Good evening. Chicken or fish?", pt: "Boa noite. Frango ou peixe?" },
        { choose: [
          { t: "Chicken, please.", ok: true },
          { t: "Yes, please.", why: "It’s an “A or B?” question. Say the one you want: “Chicken, please.”", whyPt: "É uma pergunta “A ou B?”. Diga o que você quer: “Chicken, please.”" },
          { t: "I’m chicken.", why: "This means “I am a chicken”! Say “Chicken, please.”", whyPt: "Isso significa “Eu sou um frango”! Diga “Chicken, please.”" }
        ] },
        { who: "crew2", t: "And for the children?", pt: "E para as crianças?" },
        { choose: [
          { t: "Do you have a children’s meal?", ok: true },
          { t: "They have two years.", why: "In English we say “They are two”. And he asked about food: “Do you have a children’s meal?”", whyPt: "Em inglês dizemos “They are two” (e não “have two years”). E ele perguntou sobre comida: “Do you have a children’s meal?”" },
          { t: "They eat.", why: "Ask what food there is for children: “Do you have a children’s meal?”", whyPt: "Pergunte qual comida existe para crianças: “Do you have a children’s meal?”" }
        ] },
        { who: "crew2", t: "Yes, we have pasta with tomato sauce for children.", pt: "Sim, temos massa com molho de tomate para crianças." },
        { who: "crew2", t: "Anything to drink?", pt: "Algo para beber?" },
        { choose: [
          { t: "Water, please. And apple juice for the children.", ok: true },
          { t: "Yes, I drink.", why: "Say what you want to drink: “Water, please.”", whyPt: "Diga o que você quer beber: “Water, please.”" },
          { t: "No, thank you. I’m full.", why: "“Full” is about food (satisfeita). If you want a drink, say “Water, please.”", whyPt: "“Full” é sobre comida (satisfeita). Se quiser uma bebida, diga “Water, please.”" }
        ] },
        { who: "crew2", t: "And how would you like your coffee?", pt: "E como você quer o seu café?" },
        { choose: [
          { t: "With milk and no sugar, please.", ok: true },
          { t: "In a cup, please.", why: "He is asking about milk and sugar. Say “With milk, no sugar, please.”", whyPt: "Ele está perguntando sobre leite e açúcar. Diga “With milk, no sugar, please.”" },
          { t: "Hot, please.", why: "Coffee is always hot! He is asking about milk and sugar.", whyPt: "O café é sempre quente! Ele está perguntando sobre leite e açúcar." }
        ] },
        { sit: "Your daughter’s milk is cold. You want it warm.", pt: "O leite da sua filha está frio. Você quer que fique morno." },
        { choose: [
          { t: "Excuse me, could you warm this milk, please?", ok: true },
          { t: "Excuse me, could you cool this milk, please?", why: "“Cool” means colder. You want “warm”.", whyPt: "“Cool” significa mais frio. Você quer “warm” (morno)." },
          { t: "This milk is bad!", why: "The milk isn’t bad, only cold. Ask: “Could you warm this milk, please?”", whyPt: "O leite não está estragado, só frio. Peça: “Could you warm this milk, please?”" }
        ] },
        { who: "crew2", t: "Sure. I’ll bring it back in ten minutes.", pt: "Claro. Eu trago de volta em dez minutos." },
        { ask: "When will he bring the milk?", askPt: "Quando ele vai trazer o leite?", choose: [
          { t: "In 10 minutes", ok: true },
          { t: "In 2 minutes" },
          { t: "In 10 hours" }
        ], hint: "Listen again: “ten minutes”.", hintPt: "Ouça de novo: “ten minutes” (dez minutos)." },
        { who: "crew2", t: "Have you finished? Can I take your tray?", pt: "Terminou? Posso levar sua bandeja?" },
        { choose: [
          { t: "Yes, thank you. It was delicious.", ok: true },
          { t: "No, it’s my tray.", why: "The tray belongs to the airline! If you have finished, say “Yes, thank you.”", whyPt: "A bandeja é da companhia aérea! Se você terminou, diga “Yes, thank you.”" },
          { t: "Yes, I take it.", why: "He wants to take it away. Say “Yes, thank you.”", whyPt: "Ele quer levar a bandeja. Diga “Yes, thank you.”" }
        ] }
      ],
      phrases: [
        { t: "Chicken, please.", pt: "Frango, por favor." },
        { t: "Do you have a children’s meal?", pt: "Vocês têm refeição infantil?" },
        { t: "Could you warm this milk, please?", pt: "Você pode esquentar este leite, por favor?" },
        { t: "Tea with milk, no sugar, please.", pt: "Chá com leite, sem açúcar, por favor." }
      ]
    },

    /* ------------------------------------------------------------------ help during the flight */
    {
      id: "inflight",
      title: "Help during the flight",
      pt: "Ajuda durante o voo",
      ar: "المساعدة",
      icon: "🛎️",
      sub: "Blankets, toilets, turbulence",
      scene: "🛎️ 🛌 🚻 🤒",
      imgScene: "a long night flight: the family from the reference image sits in airplane seats under soft blankets; the toddler twins are sleepy; a female flight attendant in a dark-teal uniform brings more blankets; small reading lights glow above the seats.",
      intro: "It’s a long flight. The children are cold, your son feels sick, and there is some turbulence. Ask the cabin crew for help.",
      introPt: "O voo é longo. As crianças estão com frio, seu filho está enjoado e há um pouco de turbulência. Peça ajuda à tripulação.",
      tips: [
        { t: "Press the call button (it shows a person) above or next to your seat to call a flight attendant.",
          pt: "Aperte o botão de chamada (com o desenho de uma pessoa) acima ou ao lado do assento para chamar um comissário." },
        { t: "On the toilet door: “Vacant” (green) means free. “Occupied” (red) means somebody is inside.",
          pt: "Na porta do banheiro: “Vacant” (verde) significa livre. “Occupied” (vermelho) significa que tem alguém." },
        { t: "When the seatbelt sign is on, everybody must sit down with seatbelts fastened, including the children.",
          pt: "Quando o aviso de cinto acende, todos devem sentar e apertar o cinto, inclusive as crianças." }
      ],
      vocab: [
        { e: "🛎️", w: "call button", pt: "botão de chamada", ex: "Press the call button if you need help.", exPt: "Aperte o botão de chamada se precisar de ajuda.",
          img: "a hand pressing the flight attendant call button on the panel above an airplane seat; the button shows a small person symbol and lights up" },
        { e: "🛌", w: "blanket", pt: "cobertor", ex: "Could we have two blankets, please?", exPt: "Pode nos dar dois cobertores, por favor?",
          img: "a folded soft blue airline blanket with a small pillow" },
        { e: "🥶", w: "cold", pt: "com frio", ex: "The children are cold.", exPt: "As crianças estão com frio.",
          img: "the toddler twins from the reference image shivering and hugging themselves because they are cold", imgFamily: true },
        { e: "🤢", w: "feel sick", pt: "estar enjoado", ex: "My son feels sick.", exPt: "Meu filho está enjoado.",
          img: "the toddler boy from the reference image looking pale and unwell in an airplane seat, holding his tummy", imgFamily: true },
        { e: "🤮", w: "sick bag", pt: "saquinho para enjoo", ex: "Do you have a sick bag?", exPt: "Você tem um saquinho para enjoo?",
          img: "a white paper sick bag from an airplane seat pocket" },
        { e: "🟢", w: "vacant", pt: "livre", ex: "The toilet is vacant.", exPt: "O banheiro está livre.",
          img: "an airplane toilet door standing open, with a small green light above the door handle" },
        { e: "🔴", w: "occupied", pt: "ocupado", ex: "The toilet is occupied.", exPt: "O banheiro está ocupado.",
          img: "a closed and locked airplane toilet door, with a small red light above the door handle" },
        { e: "🚼", w: "changing table", pt: "trocador", ex: "Is there a changing table in the toilet?", exPt: "Tem trocador no banheiro?",
          img: "a fold-down baby changing table inside a small airplane toilet" },
        { e: "🌪️", w: "turbulence", pt: "turbulência", ex: "There is some turbulence.", exPt: "Há um pouco de turbulência.",
          img: "an airplane bouncing through grey bumpy clouds, with wavy motion lines around it" },
        { e: "🤒", w: "fever", pt: "febre", ex: "My daughter has a fever.", exPt: "Minha filha está com febre.",
          img: "the toddler girl from the reference image with a fever: flushed cheeks, a thermometer in her mouth, and the mother's hand on her forehead", imgFamily: true }
      ],
      dialogue: {
        lines: [
          { who: "you", t: "Excuse me, could we have two [blankets], please? The children are cold.", pt: "Com licença, pode nos dar dois cobertores, por favor? As crianças estão com frio." },
          { who: "crew", t: "Of course. Here you are. Would your mother like one too?", pt: "Claro. Aqui estão. Sua mãe também gostaria de um?" },
          { who: "you", t: "Yes, please. She doesn’t speak English, so I [translate] for her.", pt: "Sim, por favor. Ela não fala inglês, então eu traduzo para ela." },
          { who: "you", t: "Where is the [toilet], please?", pt: "Onde fica o banheiro, por favor?" },
          { who: "crew", t: "At the back of the plane. When the light is green, it’s [vacant].", pt: "No fundo do avião. Quando a luz está verde, está livre." },
          { who: "you", t: "Is there a changing [table]? My daughter needs a new nappy.", pt: "Tem trocador? Minha filha precisa trocar a fralda." },
          { who: "crew", t: "Yes, in the big toilet at the back.", pt: "Sim, no banheiro grande lá no fundo." },
          { who: "pilot", t: "Ladies and gentlemen, we are expecting some [turbulence]. Please return to your seats and fasten your seatbelts.", pt: "Senhoras e senhores, esperamos um pouco de turbulência. Por favor, voltem aos seus assentos e apertem os cintos." },
          { who: "you", t: "Excuse me, my son feels [sick]. Do you have a sick bag?", pt: "Com licença, meu filho está enjoado. Você tem um saquinho para enjoo?" },
          { who: "crew", t: "Yes, here you are. Would you like some [water] for him?", pt: "Sim, aqui está. Quer um pouco de água para ele?" },
          { who: "you", t: "Yes, please. Thank you so much for your help.", pt: "Sim, por favor. Muito obrigada pela ajuda." },
          { who: "crew", t: "You’re welcome. Just press the call [button] if you need me.", pt: "De nada. É só apertar o botão de chamada se precisar de mim." }
        ],
        extra: ["pillows", "occupied", "hungry", "milk"],
        questions: [
          { q: "Why does she ask for blankets?", pt: "Por que ela pede cobertores?", a: ["The children are cold.", "The children are sleeping.", "Her mother is hot."] },
          { q: "What does a green light on the toilet door mean?", pt: "O que significa a luz verde na porta do banheiro?", a: ["It’s vacant (free).", "It’s occupied.", "It’s closed."] },
          { q: "What does the captain ask everybody to do?", pt: "O que o comandante pede a todos?", a: ["Sit down and fasten their seatbelts", "Go to the toilet", "Turn off their phones"] }
        ]
      },
      roleplay: [
        { sit: "The children are cold. You press the call button.", pt: "As crianças estão com frio. Você aperta o botão de chamada." },
        { who: "crew", t: "Hello. How can I help you?", pt: "Olá. Como posso ajudar?" },
        { choose: [
          { t: "Could we have two blankets, please? The children are cold.", ok: true },
          { t: "The children are hot.", why: "“Hot” is the opposite of “cold”. The children are cold.", whyPt: "“Hot” (calor) é o contrário de “cold” (frio). As crianças estão com frio." },
          { t: "I want sleep.", why: "Ask for what you need: “Could we have two blankets, please?”", whyPt: "Peça o que você precisa: “Could we have two blankets, please?”" }
        ] },
        { who: "crew", t: "Of course. Here you are.", pt: "Claro. Aqui estão." },
        { sit: "You go to the toilet. The sign on the door is red.", pt: "Você vai ao banheiro. O aviso na porta está vermelho." },
        { ask: "What does the red sign mean?", askPt: "O que significa o aviso vermelho?", choose: [
          { t: "Occupied: somebody is inside. Wait.", ok: true },
          { t: "Vacant: you can go in." },
          { t: "Broken: don’t use it." }
        ], hint: "Red = occupied. Green = vacant.", hintPt: "Vermelho = ocupado (occupied). Verde = livre (vacant)." },
        { who: "pilot", t: "Ladies and gentlemen, this is your captain. We are expecting some turbulence. Please return to your seats and fasten your seatbelts.", pt: "Senhoras e senhores, aqui é o comandante. Esperamos um pouco de turbulência. Por favor, voltem aos seus assentos e apertem os cintos." },
        { ask: "What must you do now?", askPt: "O que você deve fazer agora?", choose: [
          { t: "Go back to my seat and fasten my seatbelt", ok: true },
          { t: "Stand up and walk" },
          { t: "Go to the toilet" }
        ], hint: "Listen again for “return to your seats”.", hintPt: "Ouça de novo: “return to your seats” (voltem aos seus assentos)." },
        { sit: "Your son feels sick.", pt: "Seu filho está enjoado." },
        { choose: [
          { t: "Excuse me, my son feels sick. Do you have a sick bag?", ok: true },
          { t: "Excuse me, my son is sick of you.", why: "Careful! “Sick of you” means “tired of you”. Say “My son feels sick.”", whyPt: "Cuidado! “Sick of you” significa “cansado de você”. Diga “My son feels sick.”" },
          { t: "Excuse me, my son is happy.", why: "That’s the opposite! Say “My son feels sick.”", whyPt: "É o contrário! Diga “My son feels sick.”" }
        ] },
        { who: "crew", t: "Oh, poor boy. Here’s a bag. Would you like some water for him?", pt: "Ah, coitadinho. Aqui está um saquinho. Quer um pouco de água para ele?" },
        { choose: [
          { t: "Yes, please. Thank you.", ok: true },
          { t: "Yes, I am.", why: "She asked “Would you like…?”, so say “Yes, please.”", whyPt: "Ela perguntou “Would you like…?” (Você gostaria…?), então diga “Yes, please.”" },
          { t: "You’re welcome.", why: "“You’re welcome” is the answer to “Thank you”. Here, say “Yes, please.”", whyPt: "“You’re welcome” é a resposta para “Thank you”. Aqui, diga “Yes, please.”" }
        ] },
        { sit: "Your mother would like some tea, but she doesn’t speak English.", pt: "Sua mãe gostaria de um chá, mas ela não fala inglês." },
        { choose: [
          { t: "Excuse me, my mother would like some tea, please.", ok: true },
          { t: "Excuse me, my mother is tea.", why: "Say “My mother would like some tea.”", whyPt: "Diga “My mother would like some tea.” (Minha mãe gostaria de um chá.)" },
          { t: "Excuse me, tea for me, please.", why: "The tea is for your mother. Say “My mother would like some tea.”", whyPt: "O chá é para a sua mãe. Diga “My mother would like some tea.”" }
        ] },
        { who: "crew", t: "Of course. Anything else?", pt: "Claro. Mais alguma coisa?" },
        { choose: [
          { t: "No, thank you. That’s all.", ok: true },
          { t: "Yes, thank you.", why: "If you don’t need anything else, say “No, thank you. That’s all.”", whyPt: "Se você não precisa de mais nada, diga “No, thank you. That’s all.”" },
          { t: "Something.", why: "Say “No, thank you. That’s all.” or ask for what you need.", whyPt: "Diga “No, thank you. That’s all.” ou peça o que você precisa." }
        ] }
      ],
      phrases: [
        { t: "Could we have two blankets, please?", pt: "Pode nos dar dois cobertores, por favor?" },
        { t: "My son feels sick. Do you have a sick bag?", pt: "Meu filho está enjoado. Você tem um saquinho para enjoo?" },
        { t: "My daughter has a fever.", pt: "Minha filha está com febre." },
        { t: "Is there a changing table?", pt: "Tem trocador?" },
        { t: "My mother would like some tea, please.", pt: "Minha mãe gostaria de um chá, por favor." }
      ]
    },

    /* ------------------------------------------------------------------ landing */
    {
      id: "plane",
      title: "Landing",
      pt: "Pouso",
      ar: "الهبوط",
      icon: "🛬",
      sub: "Listen to the captain",
      scene: "💺 🛬 🌇",
      imgScene: "landing in Dubai: the family from the reference image looks out of the airplane window together at the Dubai skyline at sunset as the plane comes down to land.",
      intro: "Your plane is landing in Dubai. Listen to the captain and the flight attendant, ask for help with your bags, and ask where to collect the stroller.",
      introPt: "Seu avião está pousando em Dubai. Ouça o comandante e a comissária, peça ajuda com as malas e pergunte onde pegar o carrinho de bebê.",
      tips: [
        { t: "Listen for the local time and the temperature. From June to September, Dubai is often over 40°C!",
          pt: "Preste atenção na hora local e na temperatura. De junho a setembro, Dubai costuma passar dos 40°C!" },
        { t: "If you checked your stroller at the gate, ask where to collect it: at the plane door or at baggage claim.",
          pt: "Se você despachou o carrinho de bebê no portão, pergunte onde pegá-lo: na porta do avião ou na esteira de bagagens." },
        { t: "Before you leave the plane, check everybody’s things: passports, the children’s bags, your mother’s and the nanny’s bags.",
          pt: "Antes de sair do avião, confira as coisas de todos: passaportes, as bolsas das crianças, da sua mãe e da babá." }
      ],
      vocab: [
        { e: "🛬", w: "landing", pt: "pouso", ex: "We are landing in Dubai.", exPt: "Estamos pousando em Dubai.",
          img: "an airplane landing on a runway with its wheels down, a city skyline in the distance at sunset" },
        { e: "💺", w: "seatbelt", pt: "cinto de segurança", ex: "Please keep your seatbelt fastened.", exPt: "Por favor, mantenha o cinto afivelado.",
          img: "a fastened airplane seatbelt with a metal buckle across a seat" },
        { e: "🕖", w: "local time", pt: "hora local", ex: "The local time is seven forty-five.", exPt: "A hora local é sete e quarenta e cinco.",
          img: "a round wall clock with hands showing a quarter to eight, with the Dubai skyline at evening behind it; the clock face has dots instead of numbers" },
        { e: "🌡️", w: "temperature", pt: "temperatura", ex: "The temperature is thirty-four degrees.", exPt: "A temperatura é de trinta e quatro graus.",
          img: "a thermometer with a high red level next to a hot desert sun; no numbers on the thermometer" },
        { e: "🎒", w: "belongings", pt: "pertences", ex: "Take all your belongings with you.", exPt: "Leve todos os seus pertences.",
          note: "= your things", notePt: "= suas coisas",
          img: "a group of personal belongings on a seat: a handbag, a phone, passports, a small child's toy and a water bottle" },
        { e: "👶", w: "stroller", pt: "carrinho de bebê", ex: "Where can we collect our stroller?", exPt: "Onde podemos pegar nosso carrinho de bebê?",
          note: "British English: pushchair", notePt: "Em inglês britânico: pushchair",
          img: "a double stroller for twins in a light teal colour" },
        { e: "🏋️", w: "heavy", pt: "pesado", ex: "My bag is very heavy.", exPt: "Minha mala está muito pesada.",
          img: "a woman trying to lift a very heavy suitcase, leaning back with effort, with small motion lines" },
        { e: "📘", w: "passport", pt: "passaporte", ex: "Keep your passports in your hand.", exPt: "Deixe os passaportes na mão.",
          img: "a hand holding several dark-blue passports" }
      ],
      dialogue: {
        lines: [
          { who: "pilot", t: "Ladies and gentlemen, [welcome] to Dubai.", pt: "Senhoras e senhores, bem-vindos a Dubai." },
          { who: "pilot", t: "The local time is seven [forty-five] in the evening, and the temperature is [thirty-four] degrees.", pt: "A hora local é sete e quarenta e cinco da noite, e a temperatura é de trinta e quatro graus." },
          { who: "crew", t: "Please stay in your seat with your [seatbelt] fastened.", pt: "Por favor, permaneçam sentados com o cinto afivelado." },
          { who: "crew", t: "When you leave the plane, please take all your [belongings] with you.", pt: "Ao sair do avião, por favor levem todos os seus pertences." },
          { who: "you", t: "Excuse me, could you help me with my bag, please? It’s very [heavy].", pt: "Com licença, você pode me ajudar com a minha mala, por favor? Está muito pesada." },
          { who: "crew", t: "Of course. Is it this black one?", pt: "Claro. É esta preta?" },
          { who: "you", t: "Yes, that’s right. And where can we collect our [stroller]?", pt: "Sim, isso mesmo. E onde podemos pegar nosso carrinho de bebê?" },
          { who: "crew", t: "It will be at the [door] of the plane when you leave.", pt: "Ele vai estar na porta do avião quando vocês saírem." },
          { who: "crew", t: "Do you have everything? The children’s bags too?", pt: "Vocês estão com tudo? As bolsas das crianças também?" },
          { who: "you", t: "Yes, we have [everything]. Thank you so much.", pt: "Sim, estamos com tudo. Muito obrigada." },
          { who: "crew", t: "Great. Follow the signs to [Arrivals]. Enjoy your stay in Dubai!", pt: "Ótimo. Sigam as placas para “Arrivals” (Chegadas). Aproveitem a estadia em Dubai!" }
        ],
        extra: ["fourteen", "fifteen", "Departures", "light", "window"],
        questions: [
          { q: "What is the temperature in Dubai?", pt: "Qual é a temperatura em Dubai?", a: ["34 degrees", "14 degrees", "45 degrees"] },
          { q: "What time is it in Dubai?", pt: "Que horas são em Dubai?", a: ["7:45 in the evening", "7:45 in the morning", "4:45 in the evening"] },
          { q: "Where will the stroller be?", pt: "Onde vai estar o carrinho de bebê?", a: ["At the door of the plane", "At the information desk", "In the overhead locker"] }
        ]
      },
      roleplay: [
        { who: "crew", t: "We are landing soon. Please fasten your seatbelt, and the children’s seatbelts too.", pt: "Vamos pousar em breve. Por favor, apertem o cinto, e o das crianças também." },
        { choose: [
          { t: "OK, sorry. Thank you.", ok: true },
          { t: "No, thank you. I’m not hungry.", why: "She didn’t offer food. She asked you to fasten your seatbelts.", whyPt: "Ela não ofereceu comida. Ela pediu para vocês apertarem o cinto." },
          { t: "Welcome to Dubai!", why: "The crew says this to passengers. You don’t need to say it.", whyPt: "A tripulação diz isso aos passageiros. Você não precisa dizer." }
        ] },
        { who: "pilot", t: "The local time is six fifteen in the morning, and the temperature is twenty-nine degrees.", pt: "A hora local é seis e quinze da manhã, e a temperatura é de vinte e nove graus." },
        { ask: "What time is it in Dubai?", askPt: "Que horas são em Dubai?", choose: [
          { t: "6:15 in the morning", ok: true },
          { t: "6:50 in the morning" },
          { t: "6:15 in the evening" }
        ], hint: "Listen again: “six fifteen in the morning”.", hintPt: "Ouça de novo: “six fifteen in the morning” (seis e quinze da manhã)." },
        { sit: "The plane has landed. Your bag is in the overhead locker, but it is too heavy for you.", pt: "O avião pousou. Sua mala está no compartimento de bagagem, mas está pesada demais para você." },
        { choose: [
          { t: "Excuse me, could you help me with my bag, please?", ok: true },
          { t: "Give me my bag!", why: "This is too direct and sounds rude. Start with “Excuse me” and use “could you…, please?”", whyPt: "Isso é direto demais e parece grosseiro. Comece com “Excuse me” e use “could you…, please?”" },
          { t: "Where is my bag?", why: "You know where your bag is. You need help to take it down.", whyPt: "Você sabe onde está sua mala. Você precisa de ajuda para tirá-la." }
        ] },
        { who: "crew", t: "Of course. Is this your bag?", pt: "Claro. Esta é a sua mala?" },
        { choose: [
          { t: "Yes, it is. Thank you so much!", ok: true },
          { t: "Yes, I am.", why: "The question is “Is this…?”, so the answer is “Yes, it is.”", whyPt: "A pergunta é “Is this…?”, então a resposta é “Yes, it is.”" },
          { t: "I’m fine, thanks.", why: "This answers “How are you?”. She asked if this is your bag.", whyPt: "Isso responde “How are you?” (Como vai?). Ela perguntou se esta é a sua mala." }
        ] },
        { sit: "You want to know where to collect your stroller.", pt: "Você quer saber onde pegar o carrinho de bebê." },
        { choose: [
          { t: "Where can we collect our stroller, please?", ok: true },
          { t: "Where is my baby?", why: "Your babies are with you! Ask about the stroller.", whyPt: "Seus bebês estão com você! Pergunte sobre o carrinho (stroller)." },
          { t: "Can I buy a stroller?", why: "You already have a stroller. Ask where to collect it.", whyPt: "Você já tem um carrinho. Pergunte onde pegá-lo." }
        ] },
        { who: "crew", t: "It will be at the door of the plane. Enjoy your stay in Dubai!", pt: "Ele vai estar na porta do avião. Aproveitem a estadia em Dubai!" },
        { choose: [
          { t: "Thank you! Goodbye.", ok: true },
          { t: "Me too!", why: "“Me too” means “I also do that.” Here, just say “Thank you!”", whyPt: "“Me too” significa “eu também”. Aqui, diga apenas “Thank you!”" },
          { t: "Yes, please.", why: "She is not offering you anything. Say “Thank you!”", whyPt: "Ela não está oferecendo nada. Diga “Thank you!”" }
        ] }
      ],
      phrases: [
        { t: "Could you help me with my bag, please? It’s very heavy.", pt: "Você pode me ajudar com a minha mala, por favor? Está muito pesada." },
        { t: "Where can we collect our stroller?", pt: "Onde podemos pegar nosso carrinho de bebê?" },
        { t: "Excuse me, can I get past, please?", pt: "Com licença, posso passar, por favor?" }
      ]
    }
  ]
});
