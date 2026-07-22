import type { SeedQuest } from '../quest-validate.js';

// Living-room furniture dialogue quest. Source of truth: authoring JSON preserved
// byte-for-byte in IDs, text, branching, quality, feedback, endings, vocabulary.

export const biranjeNamestajaZaDnevnuSobu: SeedQuest = {
  slug: 'biranje-namestaja-za-dnevnu-sobu',
  kind: 'quest',
  titleSr: 'Nameštaj za dnevnu sobu',
  titleRu: 'Мебель для гостиной',
  position: 4,
  descriptionSr: 'Izaberi sofu, sto i policu prema dimenzijama svoje dnevne sobe.',
  descriptionRu: 'Выбери диван, стол и стеллаж с учётом размеров своей гостиной.',
  intro: {
    sr: 'U salonu nameštaja opremaš malu dnevnu sobu. Imaš zapisane dimenzije prostora i moraš da proveriš da li sofa, klub-sto i polica mogu udobno da stanu.',
    ru: 'В мебельном салоне ты обставляешь небольшую гостиную. У тебя записаны размеры комнаты, и нужно проверить, поместятся ли диван, журнальный столик и стеллаж.',
  },
  objective: {
    sr: 'Navedi dimenzije prostorije, pitaj za širinu, dužinu, visinu i dubinu nameštaja i sastavi praktičan komplet.',
    ru: 'Назови размеры комнаты, спроси ширину, длину, высоту и глубину мебели и собери практичный комплект.',
  },
  startSceneId: 'greeting',
  scenes: [
    {
      id: 'greeting',
      speaker: 'employee',
      phase: {
        sr: 'Objašnjenje potrebe',
        ru: 'Объясняем задачу',
      },
      employee: {
        sr: 'Dobar dan. Da li tražite nešto određeno?',
        ru: 'Добрый день. Вы ищете что-то конкретное?',
      },
      promptRu: 'Как объяснить, что тебе нужно?',
      choices: [
        {
          id: 'need-complete',
          text: {
            sr: 'Dobar dan. Opremljam malu dnevnu sobu i tražim trosed, klub-sto i usku policu za knjige.',
            ru: 'Добрый день. Я обставляю небольшую гостиную и ищу трёхместный диван, журнальный столик и узкий книжный стеллаж.',
          },
          quality: 'best',
          feedback: {
            sr: 'Odlično. Naveo si prostoriju i tri konkretna komada nameštaja.',
            ru: 'Отлично. Ты назвал комнату и три конкретных предмета мебели.',
          },
          nextSceneId: 'room-size',
        },
        {
          id: 'need-general',
          text: {
            sr: 'Treba mi nameštaj za dnevnu sobu.',
            ru: 'Мне нужна мебель для гостиной.',
          },
          quality: 'acceptable',
          feedback: {
            sr: 'Ispravno, ali prodavac još ne zna koje komade tražiš.',
            ru: 'Верно, но продавец ещё не знает, какие именно предметы тебе нужны.',
          },
          nextSceneId: 'room-size',
        },
        {
          id: 'need-vague',
          text: {
            sr: 'Pokažite mi nešto lepo.',
            ru: 'Покажите мне что-нибудь красивое.',
          },
          quality: 'poor',
          feedback: {
            sr: 'Ukus je važan, ali bez vrste nameštaja i ograničenja teško je dobiti koristan predlog.',
            ru: 'Вкус важен, но без типа мебели и ограничений трудно получить полезное предложение.',
          },
          nextSceneId: 'room-size',
        },
      ],
    },
    {
      id: 'room-size',
      speaker: 'employee',
      phase: {
        sr: 'Dimenzije prostorije',
        ru: 'Размеры комнаты',
      },
      employee: {
        sr: 'Kolika je dnevna soba?',
        ru: 'Какого размера гостиная?',
      },
      promptRu: 'Как назвать размеры комнаты?',
      choices: [
        {
          id: 'room-exact',
          text: {
            sr: 'Soba je dugačka četiri metra i široka tri metra. Zid za sofu je širok 240 centimetara.',
            ru: 'Комната четыре метра в длину и три метра в ширину. Стена для дивана имеет ширину 240 сантиметров.',
          },
          quality: 'best',
          feedback: {
            sr: 'Odlično. Daješ ukupne dimenzije i najvažnije ograničenje za sofu.',
            ru: 'Отлично. Ты называешь общие размеры и главное ограничение для дивана.',
          },
          nextSceneId: 'sofa-proposal',
        },
        {
          id: 'room-approx',
          text: {
            sr: 'Otprilike četiri sa tri metra.',
            ru: 'Примерно четыре на три метра.',
          },
          quality: 'acceptable',
          feedback: {
            sr: 'Dovoljno za početak, ali tačna širina zida je važna pre kupovine.',
            ru: 'Для начала достаточно, но перед покупкой важно знать точную ширину стены.',
          },
          nextSceneId: 'sofa-proposal',
        },
        {
          id: 'room-unknown',
          text: {
            sr: 'Ne znam, ali nije velika.',
            ru: 'Не знаю, но она небольшая.',
          },
          quality: 'poor',
          feedback: {
            sr: 'Bez merenja postoji veliki rizik da nameštaj neće stati.',
            ru: 'Без измерений велик риск, что мебель не поместится.',
          },
          nextSceneId: 'sofa-proposal',
        },
      ],
    },
    {
      id: 'sofa-proposal',
      speaker: 'employee',
      phase: {
        sr: 'Provera sofe',
        ru: 'Проверяем диван',
      },
      employee: {
        sr: 'Ovaj trosed je veoma popularan. Širok je 230 centimetara i dubok 105 centimetara.',
        ru: 'Этот трёхместный диван очень популярен. Его ширина 230 сантиметров, а глубина — 105 сантиметров.',
      },
      promptRu: 'Как оценить, подходит ли диван?',
      choices: [
        {
          id: 'sofa-calculate',
          text: {
            sr: 'Po širini staje, ali ostaje samo pet centimetara sa svake strane. Da li imate model širok oko 210 centimetara i dubok najviše 90?',
            ru: 'По ширине он помещается, но с каждой стороны останется только по пять сантиметров. Есть модель шириной около 210 сантиметров и глубиной не больше 90?',
          },
          quality: 'best',
          feedback: {
            sr: 'Odlično. Računaš slobodan prostor i navodiš željene maksimalne dimenzije.',
            ru: 'Отлично. Ты рассчитываешь свободное место и называешь желаемые максимальные размеры.',
          },
          nextSceneId: 'compact-sofa',
        },
        {
          id: 'sofa-width-only',
          text: {
            sr: 'Širina je u redu. Imate li nešto malo manje?',
            ru: 'По ширине подходит. Есть что-нибудь немного меньше?',
          },
          quality: 'acceptable',
          feedback: {
            sr: 'Dobro, ali treba proveriti i dubinu, jer ona utiče na prolaz kroz sobu.',
            ru: 'Хорошо, но нужно проверить и глубину, потому что от неё зависит проход по комнате.',
          },
          nextSceneId: 'compact-sofa',
        },
        {
          id: 'sofa-looks',
          text: {
            sr: 'Lep je, uzeću ga.',
            ru: 'Красивый, я его возьму.',
          },
          quality: 'poor',
          feedback: {
            sr: 'Izgled nije dovoljan. Sofa skoro popunjava ceo zid i veoma je duboka za malu sobu.',
            ru: 'Внешнего вида недостаточно. Диван почти занимает всю стену и слишком глубок для маленькой комнаты.',
          },
          nextSceneId: 'compact-sofa',
        },
      ],
    },
    {
      id: 'compact-sofa',
      speaker: 'employee',
      phase: {
        sr: 'Poređenje modela',
        ru: 'Сравниваем модели',
      },
      employee: {
        sr: 'Imamo dvosed širok 205, dubok 88 i visok 82 centimetra. Ležaj se razvlači napred još 140 centimetara.',
        ru: 'Есть двухместный диван шириной 205, глубиной 88 и высотой 82 сантиметра. Спальное место выдвигается вперёд ещё на 140 сантиметров.',
      },
      promptRu: 'Что важно уточнить?',
      choices: [
        {
          id: 'sofa-clearance',
          text: {
            sr: 'Kada se razvuče, ukupna potrebna dubina je 228 centimetara. Imam dovoljno prostora, ali želim prolaz od najmanje 70 centimetara. To bi trebalo da stane.',
            ru: 'Когда диван разложен, общая необходимая глубина — 228 сантиметров. Места достаточно, но я хочу оставить проход не меньше 70 сантиметров. Это должно поместиться.',
          },
          quality: 'best',
          feedback: {
            sr: 'Odlično. Sabiraš dubinu i prostor za razvlačenje, pa proveravaš širinu prolaza.',
            ru: 'Отлично. Ты складываешь глубину и место для раскладывания, затем проверяешь ширину прохода.',
          },
          nextSceneId: 'coffee-table',
        },
        {
          id: 'sofa-bed-question',
          text: {
            sr: 'Da li se lako razvlači?',
            ru: 'Он легко раскладывается?',
          },
          quality: 'acceptable',
          feedback: {
            sr: 'Korisno pitanje, ali još treba proveriti koliko prostora zauzima kada je otvoren.',
            ru: 'Полезный вопрос, но ещё нужно проверить, сколько места он занимает в разложенном виде.',
          },
          nextSceneId: 'coffee-table',
        },
        {
          id: 'sofa-ignore-open',
          text: {
            sr: 'Nije važno koliko mesta zauzima kada se razvuče.',
            ru: 'Неважно, сколько места он занимает в разложенном виде.',
          },
          quality: 'poor',
          feedback: {
            sr: 'Ako planiraš da koristiš ležaj, prostor za razvlačenje je ključna dimenzija.',
            ru: 'Если ты собираешься пользоваться спальным местом, пространство для раскладывания — ключевой размер.',
          },
          nextSceneId: 'coffee-table',
        },
      ],
    },
    {
      id: 'coffee-table',
      speaker: 'employee',
      phase: {
        sr: 'Izbor klub-stola',
        ru: 'Выбираем журнальный столик',
      },
      employee: {
        sr: 'Uz taj dvosed preporučujem pravougaoni klub-sto, 120 puta 70 centimetara.',
        ru: 'К этому дивану рекомендую прямоугольный журнальный столик размером 120 на 70 сантиметров.',
      },
      promptRu: 'Как проверить удобство стола?',
      choices: [
        {
          id: 'table-smaller',
          text: {
            sr: 'To je verovatno preveliko. Tražim sto dug oko 90 i širok najviše 50 centimetara, da ostane dovoljno mesta za prolaz.',
            ru: 'Наверное, это слишком большой стол. Мне нужен столик длиной около 90 и шириной не больше 50 сантиметров, чтобы осталось достаточно места для прохода.',
          },
          quality: 'best',
          feedback: {
            sr: 'Odlično. Koristiš dužinu i širinu i povezuješ ih sa funkcionalnim prolazom.',
            ru: 'Отлично. Ты используешь длину и ширину и связываешь их с удобным проходом.',
          },
          nextSceneId: 'shelf',
        },
        {
          id: 'table-round',
          text: {
            sr: 'Imate li manji ili okrugli sto?',
            ru: 'Есть столик поменьше или круглый?',
          },
          quality: 'acceptable',
          feedback: {
            sr: 'Dobar smer, ali maksimalne dimenzije bi pomogle prodavcu da izabere pravi model.',
            ru: 'Хорошее направление, но максимальные размеры помогли бы продавцу выбрать подходящую модель.',
          },
          nextSceneId: 'shelf',
        },
        {
          id: 'table-accept',
          text: {
            sr: 'U redu, uzeću taj od 120 puta 70.',
            ru: 'Хорошо, возьму этот размером 120 на 70.',
          },
          quality: 'poor',
          feedback: {
            sr: 'Za malu sobu takav sto može da suzi prolaz. Prvo proveri raspoloživi prostor.',
            ru: 'Для маленькой комнаты такой столик может сузить проход. Сначала проверь свободное место.',
          },
          nextSceneId: 'shelf',
        },
      ],
    },
    {
      id: 'shelf',
      speaker: 'employee',
      phase: {
        sr: 'Izbor police',
        ru: 'Выбираем стеллаж',
      },
      employee: {
        sr: 'Za knjige imamo policu visoku 200, široku 90 i duboku 40 centimetara.',
        ru: 'Для книг есть стеллаж высотой 200, шириной 90 и глубиной 40 сантиметров.',
      },
      promptRu: 'Как оценить стеллаж?',
      choices: [
        {
          id: 'shelf-fit',
          text: {
            sr: 'Visina odgovara, ali imam nišu široku 75 centimetara. Treba mi polica široka najviše 70 i duboka oko 30 centimetara.',
            ru: 'Высота подходит, но у меня ниша шириной 75 сантиметров. Нужен стеллаж шириной не больше 70 и глубиной около 30 сантиметров.',
          },
          quality: 'best',
          feedback: {
            sr: 'Odlično. Jasno razlikuješ visinu, širinu i dubinu i daješ ograničenja niše.',
            ru: 'Отлично. Ты ясно различаешь высоту, ширину и глубину и называешь ограничения ниши.',
          },
          nextSceneId: 'delivery',
        },
        {
          id: 'shelf-narrow',
          text: {
            sr: 'Imate li užu policu?',
            ru: 'Есть стеллаж поуже?',
          },
          quality: 'acceptable',
          feedback: {
            sr: 'Dobro pitanje, ali tačna maksimalna širina ubrzava izbor.',
            ru: 'Хороший вопрос, но точная максимальная ширина ускорит выбор.',
          },
          nextSceneId: 'delivery',
        },
        {
          id: 'shelf-force',
          text: {
            sr: 'Možda mogu nekako da uguram ovu.',
            ru: 'Может быть, я как-нибудь втисну этот.',
          },
          quality: 'poor',
          feedback: {
            sr: 'Polica od 90 centimetara ne može bezbedno stati u nišu od 75 centimetara.',
            ru: 'Стеллаж шириной 90 сантиметров не может безопасно поместиться в нишу шириной 75 сантиметров.',
          },
          nextSceneId: 'delivery',
        },
      ],
    },
    {
      id: 'delivery',
      speaker: 'employee',
      phase: {
        sr: 'Provera dostave',
        ru: 'Проверяем доставку',
      },
      employee: {
        sr: 'Našli smo užu policu. Da li želite dostavu i montažu?',
        ru: 'Мы нашли более узкий стеллаж. Нужны доставка и сборка?',
      },
      promptRu: 'Какие размеры ещё важно проверить?',
      choices: [
        {
          id: 'door-measure',
          text: {
            sr: 'Da, ali prvo da proverimo unošenje. Ulazna vrata su široka 82 centimetra, a lift je dubok 140 centimetara. Da li paket sa sofom može da prođe?',
            ru: 'Да, но сначала проверим занос. Входная дверь шириной 82 сантиметра, а глубина лифта — 140 сантиметров. Пройдёт ли упаковка с диваном?',
          },
          quality: 'best',
          feedback: {
            sr: 'Odlično. Nameštaj mora ne samo da stane u sobu već i da prođe kroz vrata i lift.',
            ru: 'Отлично. Мебель должна не только поместиться в комнате, но и пройти через дверь и лифт.',
          },
          nextSceneId: 'summary',
        },
        {
          id: 'delivery-simple',
          text: {
            sr: 'Da, želim dostavu i montažu.',
            ru: 'Да, мне нужны доставка и сборка.',
          },
          quality: 'acceptable',
          feedback: {
            sr: 'Korisno, ali dimenzije vrata, hodnika i lifta treba proveriti pre isporuke.',
            ru: 'Полезно, но до доставки нужно проверить размеры двери, коридора и лифта.',
          },
          nextSceneId: 'summary',
        },
        {
          id: 'delivery-assume',
          text: {
            sr: 'Sigurno će moći da uđe.',
            ru: 'Наверняка всё пройдёт.',
          },
          quality: 'poor',
          feedback: {
            sr: 'Pretpostavka može dovesti do neuspele dostave. Potrebno je uporediti dimenzije paketa i prolaza.',
            ru: 'Предположение может привести к неудачной доставке. Нужно сравнить размеры упаковки и проходов.',
          },
          nextSceneId: 'summary',
        },
      ],
    },
    {
      id: 'summary',
      speaker: 'employee',
      phase: {
        sr: 'Potvrda kompleta',
        ru: 'Подтверждаем комплект',
      },
      employee: {
        sr: 'Paket može da prođe kroz vrata ako se naslon skine. Da li potvrđujete dvosed, mali okrugli sto i usku policu?',
        ru: 'Упаковка пройдёт в дверь, если снять спинку. Подтверждаете двухместный диван, маленький круглый столик и узкий стеллаж?',
      },
      promptRu: 'Как подтвердить выбор?',
      choices: [
        {
          id: 'confirm-details',
          text: {
            sr: 'Da. Potvrđujem dvosed 205 × 88 centimetara, sto prečnika 80 centimetara i policu 68 × 30 × 190 centimetara, sa dostavom i montažom.',
            ru: 'Да. Подтверждаю диван 205 × 88 сантиметров, столик диаметром 80 сантиметров и стеллаж 68 × 30 × 190 сантиметров, с доставкой и сборкой.',
          },
          quality: 'best',
          feedback: {
            sr: 'Odlično. Ponavljaš komade, dimenzije i usluge, pa nema prostora za nesporazum.',
            ru: 'Отлично. Ты повторяешь предметы, размеры и услуги, поэтому недоразумения маловероятны.',
          },
          nextSceneId: 'success',
        },
        {
          id: 'confirm-general',
          text: {
            sr: 'Da, potvrđujem sve.',
            ru: 'Да, всё подтверждаю.',
          },
          quality: 'acceptable',
          feedback: {
            sr: 'Dogovor je postignut, ali sigurnije je ponoviti dimenzije i usluge.',
            ru: 'Договорённость достигнута, но надёжнее повторить размеры и услуги.',
          },
          nextSceneId: 'success',
        },
        {
          id: 'confirm-uncertain',
          text: {
            sr: 'Valjda će sve stati. Uzeću.',
            ru: 'Наверное, всё поместится. Беру.',
          },
          quality: 'poor',
          feedback: {
            sr: 'Već imaš potrebne podatke; završna provera je bolja od nagađanja.',
            ru: 'У тебя уже есть нужные данные; финальная проверка лучше догадок.',
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
      titleSr: 'Komplet odgovara prostoru',
      titleRu: 'Комплект подходит комнате',
      text: {
        sr: 'Uporedio si dimenzije sobe, nameštaja, vrata i lifta i izabrao funkcionalan komplet za dnevnu sobu.',
        ru: 'Ты сопоставил размеры комнаты, мебели, двери и лифта и выбрал функциональный комплект для гостиной.',
      },
    },
    {
      id: 'partial-success',
      type: 'partial',
      titleSr: 'Nameštaj je izabran uz malo rizika',
      titleRu: 'Мебель выбрана с небольшим риском',
      text: {
        sr: 'Izabrao si komade, ali završna provera dimenzija nije bila potpuna. Pre poručivanja ponovo izmeri prostor i prolaze.',
        ru: 'Ты выбрал предметы, но финальная проверка размеров была неполной. Перед заказом ещё раз измерь комнату и проходы.',
      },
    },
  ],
  vocabulary: [
    {
      sr: 'dnevna soba',
      ru: 'гостиная',
      exampleSr: 'Opremljam malu dnevnu sobu.',
      exampleRu: 'Я обставляю небольшую гостиную.',
    },
    {
      sr: 'trosed',
      ru: 'трёхместный диван',
      exampleSr: 'Tražim trosed za ovaj zid.',
      exampleRu: 'Я ищу трёхместный диван для этой стены.',
    },
    {
      sr: 'dvosed',
      ru: 'двухместный диван',
      exampleSr: 'Ovaj dvosed je širok 205 centimetara.',
      exampleRu: 'Этот двухместный диван имеет ширину 205 сантиметров.',
    },
    {
      sr: 'klub-sto',
      ru: 'журнальный столик',
      exampleSr: 'Treba mi mali klub-sto.',
      exampleRu: 'Мне нужен маленький журнальный столик.',
    },
    {
      sr: 'polica',
      ru: 'стеллаж, полка',
      exampleSr: 'Polica mora da stane u nišu.',
      exampleRu: 'Стеллаж должен поместиться в нишу.',
    },
    {
      sr: 'širina',
      ru: 'ширина',
      exampleSr: 'Kolika je širina sofe?',
      exampleRu: 'Какова ширина дивана?',
    },
    {
      sr: 'dužina',
      ru: 'длина',
      exampleSr: 'Sto je dug 90 centimetara.',
      exampleRu: 'Длина столика — 90 сантиметров.',
    },
    {
      sr: 'visina',
      ru: 'высота',
      exampleSr: 'Visina police je 190 centimetara.',
      exampleRu: 'Высота стеллажа — 190 сантиметров.',
    },
    {
      sr: 'dubina',
      ru: 'глубина',
      exampleSr: 'Dubina sofe je 88 centimetara.',
      exampleRu: 'Глубина дивана — 88 сантиметров.',
    },
    {
      sr: 'prečnik',
      ru: 'диаметр',
      exampleSr: 'Sto ima prečnik 80 centimetara.',
      exampleRu: 'Диаметр столика — 80 сантиметров.',
    },
    {
      sr: 'prolaz',
      ru: 'проход',
      exampleSr: 'Želim prolaz od najmanje 70 centimetara.',
      exampleRu: 'Я хочу оставить проход не меньше 70 сантиметров.',
    },
    {
      sr: 'montaža',
      ru: 'сборка',
      exampleSr: 'Da li je montaža uključena u cenu?',
      exampleRu: 'Сборка включена в цену?',
    },
  ],
};
