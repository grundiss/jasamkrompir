import type { SeedQuest } from '../quest-validate.js';

// Market bargaining dialogue quest. Source of truth: authoring JSON preserved
// byte-for-byte in IDs, text, branching, quality, feedback, endings, vocabulary.

export const cenkanjeNaPijaci: SeedQuest = {
  slug: 'cenkanje-na-pijaci',
  kind: 'quest',
  titleSr: 'Cenkanje na pijaci',
  titleRu: 'Торг на рынке',
  position: 5,
  descriptionSr: 'Kupi voće, povrće i sir na pijaci i ljubazno se dogovori o boljoj ceni.',
  descriptionRu: 'Купи фрукты, овощи и сыр на рынке и вежливо договорись о лучшей цене.',
  intro: {
    sr: 'Na pijaci želiš da kupiš veću količinu paradajza, paprika, bresaka i domaćeg sira. Cene nisu fiksne, pa pokušavaš da dobiješ popust za veću kupovinu.',
    ru: 'На рынке ты хочешь купить побольше помидоров, перца, персиков и домашнего сыра. Цены не фиксированы, поэтому ты пытаешься получить скидку за крупную покупку.',
  },
  objective: {
    sr: 'Pitaj za cenu i kvalitet, naruči količine, predloži razuman popust i postigni dogovor bez nepristojnog pritiska.',
    ru: 'Спроси о цене и качестве, назови количество, предложи разумную скидку и договорись без грубого давления.',
  },
  startSceneId: 'greeting',
  scenes: [
    {
      id: 'greeting',
      speaker: 'employee',
      phase: {
        sr: 'Početak kupovine',
        ru: 'Начинаем покупку',
      },
      employee: {
        sr: 'Dobar dan! Izvolite, sve je jutros stiglo.',
        ru: 'Добрый день! Подходите, всё привезли сегодня утром.',
      },
      promptRu: 'Как начать разговор?',
      choices: [
        {
          id: 'greet-interest',
          text: {
            sr: 'Dobar dan. Paradajz izgleda lepo. Koliko košta kilogram?',
            ru: 'Добрый день. Помидоры выглядят хорошо. Сколько стоит килограмм?',
          },
          quality: 'best',
          feedback: {
            sr: 'Odlično. Ljubazno pozdravljaš, pokazuješ interesovanje i pitaš za jedinicu cene.',
            ru: 'Отлично. Ты вежливо здороваешься, проявляешь интерес и уточняешь цену за единицу.',
          },
          nextSceneId: 'tomato-price',
        },
        {
          id: 'greet-price',
          text: {
            sr: 'Koliko je paradajz?',
            ru: 'Почём помидоры?',
          },
          quality: 'acceptable',
          feedback: {
            sr: 'Prirodno za pijacu, ali pozdrav bi razgovor učinio prijatnijim.',
            ru: 'Естественно для рынка, но приветствие сделало бы разговор приятнее.',
          },
          nextSceneId: 'tomato-price',
        },
        {
          id: 'greet-demand',
          text: {
            sr: 'Dajte mi najnižu cenu za paradajz.',
            ru: 'Дайте мне самую низкую цену на помидоры.',
          },
          quality: 'poor',
          feedback: {
            sr: 'Prerano tražiš popust pre nego što znaš cenu, kvalitet ili količinu.',
            ru: 'Ты слишком рано просишь скидку, ещё не зная цены, качества и количества.',
          },
          nextSceneId: 'tomato-price',
        },
      ],
    },
    {
      id: 'tomato-price',
      speaker: 'employee',
      phase: {
        sr: 'Cena i kvalitet',
        ru: 'Цена и качество',
      },
      employee: {
        sr: 'Paradajz je 220 dinara kilogram. Domaći je i baš je zreo.',
        ru: 'Помидоры стоят 220 динаров за килограмм. Они домашние и очень спелые.',
      },
      promptRu: 'Что уточнить перед покупкой?',
      choices: [
        {
          id: 'ask-quality',
          text: {
            sr: 'Da li je dobar za salatu ili je već previše mekan? Mogu li da pogledam jedan?',
            ru: 'Он подходит для салата или уже слишком мягкий? Можно посмотреть один?',
          },
          quality: 'best',
          feedback: {
            sr: 'Odlično. Proveravaš namenu i zrelost pre nego što pregovaraš o ceni.',
            ru: 'Отлично. Ты проверяешь назначение и спелость перед тем, как торговаться.',
          },
          nextSceneId: 'quantity',
        },
        {
          id: 'ask-origin',
          text: {
            sr: 'Odakle je paradajz?',
            ru: 'Откуда эти помидоры?',
          },
          quality: 'acceptable',
          feedback: {
            sr: 'Korisno pitanje o poreklu, ali dobro je proveriti i zrelost.',
            ru: 'Полезный вопрос о происхождении, но стоит проверить и спелость.',
          },
          nextSceneId: 'quantity',
        },
        {
          id: 'insult-quality',
          text: {
            sr: 'Za tu cenu mora da bude savršen.',
            ru: 'За такую цену он должен быть идеальным.',
          },
          quality: 'poor',
          feedback: {
            sr: 'Ovo zvuči podsmešljivo. Bolje je konkretno pitati o kvalitetu.',
            ru: 'Это звучит насмешливо. Лучше конкретно спросить о качестве.',
          },
          nextSceneId: 'quantity',
        },
      ],
    },
    {
      id: 'quantity',
      speaker: 'employee',
      phase: {
        sr: 'Veća količina',
        ru: 'Большое количество',
      },
      employee: {
        sr: 'Slobodno pogledajte. Tvrd je taman koliko treba.',
        ru: 'Конечно, посмотрите. Он как раз нужной плотности.',
      },
      promptRu: 'Как назвать количество и открыть торг?',
      choices: [
        {
          id: 'bulk-offer',
          text: {
            sr: 'Uzeo bih tri kilograma paradajza i dva kilograma paprika. Možete li da napravite bolju cenu za tu količinu?',
            ru: 'Я бы взял три килограмма помидоров и два килограмма перца. Можете сделать цену получше за такое количество?',
          },
          quality: 'best',
          feedback: {
            sr: 'Odlično. Popust vezuješ za konkretnu veću kupovinu, što je prirodan osnov za cenkanje.',
            ru: 'Отлично. Ты связываешь скидку с конкретной крупной покупкой — это естественная основа для торга.',
          },
          nextSceneId: 'seller-offer',
        },
        {
          id: 'bulk-vague',
          text: {
            sr: 'Ako uzmem više, ima li popusta?',
            ru: 'Если возьму больше, будет скидка?',
          },
          quality: 'acceptable',
          feedback: {
            sr: 'Dobro pitanje, ali prodavac još ne zna koliko planiraš da kupiš.',
            ru: 'Хороший вопрос, но продавец ещё не знает, сколько ты собираешься купить.',
          },
          nextSceneId: 'seller-offer',
        },
        {
          id: 'bulk-lowball',
          text: {
            sr: 'Uzeću sve za pola cene.',
            ru: 'Возьму всё за полцены.',
          },
          quality: 'poor',
          feedback: {
            sr: 'Ponuda od pola cene bez obrazloženja deluje neozbiljno i može prekinuti pregovor.',
            ru: 'Предложение половины цены без основания выглядит несерьёзно и может сорвать торг.',
          },
          nextSceneId: 'seller-offer',
        },
      ],
    },
    {
      id: 'seller-offer',
      speaker: 'employee',
      phase: {
        sr: 'Prva ponuda',
        ru: 'Первое предложение',
      },
      employee: {
        sr: 'Mogu da spustim paradajz na 200, a paprike sa 260 na 240 dinara po kilogramu.',
        ru: 'Могу снизить цену помидоров до 200, а перца — с 260 до 240 динаров за килограмм.',
      },
      promptRu: 'Как ответить на предложение?',
      choices: [
        {
          id: 'counter-package',
          text: {
            sr: 'Hvala. Ako uzmem još i dva kilograma bresaka, da li možemo sve zajedno za 1.750 dinara?',
            ru: 'Спасибо. Если я возьму ещё два килограмма персиков, можем договориться на 1750 динаров за всё?',
          },
          quality: 'best',
          feedback: {
            sr: 'Odlično. Zahvaljuješ se, povećavaš kupovinu i daješ konkretnu ukupnu ponudu.',
            ru: 'Отлично. Ты благодаришь, увеличиваешь покупку и называешь конкретную общую сумму.',
          },
          nextSceneId: 'peach-check',
        },
        {
          id: 'accept-first',
          text: {
            sr: 'U redu, može.',
            ru: 'Хорошо, договорились.',
          },
          quality: 'acceptable',
          feedback: {
            sr: 'Brzo i pristojno postižeš dogovor, ali ne koristiš mogućnost paketske cene.',
            ru: 'Ты быстро и вежливо договариваешься, но не используешь возможность общей цены.',
          },
          nextSceneId: 'peach-check',
        },
        {
          id: 'counter-dismiss',
          text: {
            sr: 'To nije nikakav popust.',
            ru: 'Это вообще не скидка.',
          },
          quality: 'poor',
          feedback: {
            sr: 'Prodavac je već ponudio nižu cenu. Potcenjivanje ponude može zatvoriti pregovor.',
            ru: 'Продавец уже предложил снижение. Обесценивание предложения может прекратить торг.',
          },
          nextSceneId: 'peach-check',
        },
      ],
    },
    {
      id: 'peach-check',
      speaker: 'employee',
      phase: {
        sr: 'Provera robe',
        ru: 'Проверяем товар',
      },
      employee: {
        sr: 'Za 1.750 ne mogu, ali mogu za 1.850. Breskve su vrlo zrele.',
        ru: 'За 1750 не могу, но могу за 1850. Персики очень спелые.',
      },
      promptRu: 'Как использовать качество в переговорах?',
      choices: [
        {
          id: 'peach-balanced',
          text: {
            sr: 'Treba mi deo za danas, ali deo za sutra. Ako izaberemo kilogram zrelih i kilogram čvršćih, prihvatiću 1.850.',
            ru: 'Часть нужна на сегодня, а часть на завтра. Если выберем килограмм спелых и килограмм более твёрдых, я соглашусь на 1850.',
          },
          quality: 'best',
          feedback: {
            sr: 'Odlično. Ne obaraš cenu po svaku cenu, već pregovaraš i o kvalitetu robe.',
            ru: 'Отлично. Ты торгуешься не только о цене, но и о качестве товара.',
          },
          nextSceneId: 'cheese',
        },
        {
          id: 'peach-accept',
          text: {
            sr: 'Dobro, može 1.850.',
            ru: 'Хорошо, пусть будет 1850.',
          },
          quality: 'acceptable',
          feedback: {
            sr: 'Dogovor je postignut, ali nisi proverio da li ti odgovara zrelost svih bresaka.',
            ru: 'Договор достигнут, но ты не проверил, подходит ли тебе спелость всех персиков.',
          },
          nextSceneId: 'cheese',
        },
        {
          id: 'peach-threat',
          text: {
            sr: 'Ako ne može 1.750, idem kod drugog prodavca.',
            ru: 'Если не будет 1750, я пойду к другому продавцу.',
          },
          quality: 'poor',
          feedback: {
            sr: 'Možeš odbiti ponudu, ali ultimatum nakon male razlike deluje nepotrebno grubo.',
            ru: 'Можно отказаться, но ультиматум из-за небольшой разницы звучит излишне грубо.',
          },
          nextSceneId: 'cheese',
        },
      ],
    },
    {
      id: 'cheese',
      speaker: 'employee',
      phase: {
        sr: 'Nova tezga i degustacija',
        ru: 'Новый прилавок и дегустация',
      },
      employee: {
        sr: 'Imam i domaći sir, 900 dinara kilogram. Hoćete li da probate?',
        ru: 'Есть ещё домашний сыр, 900 динаров за килограмм. Хотите попробовать?',
      },
      promptRu: 'Как обсудить сыр?',
      choices: [
        {
          id: 'cheese-taste',
          text: {
            sr: 'Da, hvala. Da li je kravlji ili ovčji? Koliko je slan i koliko dugo može da stoji u frižideru?',
            ru: 'Да, спасибо. Он коровий или овечий? Насколько солёный и сколько хранится в холодильнике?',
          },
          quality: 'best',
          feedback: {
            sr: 'Odlično. Pre kupovine proveravaš vrstu, ukus i čuvanje proizvoda.',
            ru: 'Отлично. Перед покупкой ты уточняешь вид, вкус и условия хранения продукта.',
          },
          nextSceneId: 'cheese-bargain',
        },
        {
          id: 'cheese-price',
          text: {
            sr: 'Može. Da li je cena fiksna?',
            ru: 'Можно. Цена фиксированная?',
          },
          quality: 'acceptable',
          feedback: {
            sr: 'Pitaš o pregovoru, ali kvalitet i vrstu sira vredi proveriti pre cene.',
            ru: 'Ты спрашиваешь о торге, но перед ценой стоит уточнить качество и вид сыра.',
          },
          nextSceneId: 'cheese-bargain',
        },
        {
          id: 'cheese-cheap',
          text: {
            sr: 'Preskupo je za sir.',
            ru: 'Слишком дорого для сыра.',
          },
          quality: 'poor',
          feedback: {
            sr: 'Ne znaš još vrstu ni kvalitet. Bolje je prvo probati i pitati za detalje.',
            ru: 'Ты ещё не знаешь вид и качество. Лучше сначала попробовать и уточнить детали.',
          },
          nextSceneId: 'cheese-bargain',
        },
      ],
    },
    {
      id: 'cheese-bargain',
      speaker: 'employee',
      phase: {
        sr: 'Završni dogovor',
        ru: 'Финальный торг',
      },
      employee: {
        sr: 'Kravlji je, umereno slan i može da stoji pet dana. Ako uzmete pola kilograma, to je 450 dinara.',
        ru: 'Он коровий, умеренно солёный и хранится пять дней. Полкилограмма будет стоить 450 динаров.',
      },
      promptRu: 'Как сделать финальное предложение?',
      choices: [
        {
          id: 'final-bundle',
          text: {
            sr: 'Uzeću pola kilograma. Pošto kupujem i voće i povrće, možete li sve zajedno da zaokružite na 2.250 dinara?',
            ru: 'Возьму полкилограмма. Поскольку я покупаю ещё фрукты и овощи, можете округлить всё вместе до 2250 динаров?',
          },
          quality: 'best',
          feedback: {
            sr: 'Odlično. Tražiš mali, razuman završni popust i nudiš da odmah zaključiš kupovinu.',
            ru: 'Отлично. Ты просишь небольшую разумную финальную скидку и готов сразу завершить покупку.',
          },
          nextSceneId: 'weighing',
        },
        {
          id: 'final-cheese-only',
          text: {
            sr: 'U redu, pola kilograma za 450.',
            ru: 'Хорошо, полкилограмма за 450.',
          },
          quality: 'acceptable',
          feedback: {
            sr: 'Jasan dogovor, ali nisi pokušao da objediniš celu kupovinu.',
            ru: 'Ясная договорённость, но ты не попробовал объединить всю покупку.',
          },
          nextSceneId: 'weighing',
        },
        {
          id: 'final-unreasonable',
          text: {
            sr: 'Dajte mi kilogram za 450.',
            ru: 'Дайте мне килограмм за 450.',
          },
          quality: 'poor',
          feedback: {
            sr: 'Tražiš popust od 50 odsto bez dodatne količine ili drugog razloga.',
            ru: 'Ты просишь скидку 50 процентов без дополнительной покупки или другого основания.',
          },
          nextSceneId: 'weighing',
        },
      ],
    },
    {
      id: 'weighing',
      speaker: 'employee',
      phase: {
        sr: 'Provera količine i sume',
        ru: 'Проверяем вес и сумму',
      },
      employee: {
        sr: 'Može 2.250. Imate tri kilograma paradajza, dva kilograma paprika, dva kilograma bresaka i pola kilograma sira.',
        ru: 'Договорились, 2250. У вас три килограмма помидоров, два килограмма перца, два килограмма персиков и полкилограмма сыра.',
      },
      promptRu: 'Как завершить покупку?',
      choices: [
        {
          id: 'finish-check',
          text: {
            sr: 'Odlično, hvala. Molim vas stavite zrele breskve odvojeno, a sir u posebnu kesu. Platiću gotovinom.',
            ru: 'Отлично, спасибо. Пожалуйста, положите спелые персики отдельно, а сыр — в отдельный пакет. Я заплачу наличными.',
          },
          quality: 'best',
          feedback: {
            sr: 'Odlično. Potvrđuješ dogovor, daješ praktična uputstva za pakovanje i navodiš način plaćanja.',
            ru: 'Отлично. Ты подтверждаешь договорённость, даёшь практичные инструкции по упаковке и называешь способ оплаты.',
          },
          nextSceneId: 'success',
        },
        {
          id: 'finish-simple',
          text: {
            sr: 'Hvala, dogovoreno.',
            ru: 'Спасибо, договорились.',
          },
          quality: 'acceptable',
          feedback: {
            sr: 'Pristojno završavaš kupovinu, ali pakovanje zrelog voća i sira vredi precizirati.',
            ru: 'Ты вежливо завершаешь покупку, но упаковку спелых фруктов и сыра стоило уточнить.',
          },
          nextSceneId: 'success',
        },
        {
          id: 'finish-recount',
          text: {
            sr: 'Nadam se da me niste prevarili sa težinom.',
            ru: 'Надеюсь, вы не обманули меня с весом.',
          },
          quality: 'poor',
          feedback: {
            sr: 'Možeš pogledati vagu i proveriti količine bez optuživanja prodavca.',
            ru: 'Можно посмотреть на весы и проверить количество без обвинений продавца.',
          },
          nextSceneId: 'partial-success',
        },
      ],
    },
  ],
  endings: [
    {
      id: 'success',
      type: 'success',
      titleSr: 'Dobra kupovina i pošten dogovor',
      titleRu: 'Удачная покупка и честная сделка',
      text: {
        sr: 'Proverio si kvalitet, pregovarao na osnovu količine i dogovorio razumnu ukupnu cenu uz dobar odnos sa prodavcem.',
        ru: 'Ты проверил качество, торговался на основании количества и договорился о разумной общей цене, сохранив хорошие отношения с продавцом.',
      },
    },
    {
      id: 'partial-success',
      type: 'partial',
      titleSr: 'Kupovina je završena, ali sa nepotrebnom tenzijom',
      titleRu: 'Покупка завершена, но с лишним напряжением',
      text: {
        sr: 'Dobio si robu po dogovorenoj ceni, ali završna sumnja ili preoštar ton pokvarili su inače uspešan pregovor.',
        ru: 'Ты получил товар по согласованной цене, но финальное недоверие или слишком резкий тон испортили в целом успешный торг.',
      },
    },
  ],
  vocabulary: [
    {
      sr: 'pijaca',
      ru: 'рынок',
      exampleSr: 'Subotom kupujem na pijaci.',
      exampleRu: 'По субботам я покупаю на рынке.',
    },
    {
      sr: 'tezga',
      ru: 'прилавок',
      exampleSr: 'Na ovoj tezgi prodaju domaće povrće.',
      exampleRu: 'На этом прилавке продают домашние овощи.',
    },
    {
      sr: 'kilogram',
      ru: 'килограмм',
      exampleSr: 'Koliko košta kilogram paradajza?',
      exampleRu: 'Сколько стоит килограмм помидоров?',
    },
    {
      sr: 'pola kilograma',
      ru: 'полкилограмма',
      exampleSr: 'Uzeću pola kilograma sira.',
      exampleRu: 'Я возьму полкилограмма сыра.',
    },
    {
      sr: 'domaći',
      ru: 'домашний, местный',
      exampleSr: 'Da li je ovo domaći paradajz?',
      exampleRu: 'Это домашние помидоры?',
    },
    {
      sr: 'zreo',
      ru: 'спелый',
      exampleSr: 'Breskve su vrlo zrele.',
      exampleRu: 'Персики очень спелые.',
    },
    {
      sr: 'čvrst',
      ru: 'твёрдый, плотный',
      exampleSr: 'Treba mi kilogram čvršćih bresaka.',
      exampleRu: 'Мне нужен килограмм более твёрдых персиков.',
    },
    {
      sr: 'spustiti cenu',
      ru: 'снизить цену',
      exampleSr: 'Možete li malo da spustite cenu?',
      exampleRu: 'Можете немного снизить цену?',
    },
    {
      sr: 'napraviti bolju cenu',
      ru: 'сделать цену получше',
      exampleSr: 'Možete li da napravite bolju cenu za ovu količinu?',
      exampleRu: 'Можете сделать цену получше за такое количество?',
    },
    {
      sr: 'zaokružiti',
      ru: 'округлить сумму',
      exampleSr: 'Možete li da zaokružite na 2.250 dinara?',
      exampleRu: 'Можете округлить до 2250 динаров?',
    },
    {
      sr: 'dogovoreno',
      ru: 'договорились',
      exampleSr: 'Hvala, dogovoreno.',
      exampleRu: 'Спасибо, договорились.',
    },
    {
      sr: 'gotovina',
      ru: 'наличные',
      exampleSr: 'Platiću gotovinom.',
      exampleRu: 'Я заплачу наличными.',
    },
  ],
};
