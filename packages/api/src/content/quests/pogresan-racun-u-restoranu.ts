import type { SeedQuest } from '../quest-validate.js';

// Wrong restaurant bill dialogue quest. Source of truth: authoring JSON preserved
// byte-for-byte in IDs, text, branching, quality, feedback, endings, vocabulary.

export const pogresanRacunURestoranu: SeedQuest = {
  slug: 'pogresan-racun-u-restoranu',
  kind: 'quest',
  titleSr: 'Pogrešan račun u restoranu',
  titleRu: 'Неправильный счёт в ресторане',
  position: 3,
  descriptionSr: 'Proveri račun, objasni grešku konobaru i mirno dogovori ispravku.',
  descriptionRu: 'Проверь счёт, объясни официанту ошибку и спокойно договорись об исправлении.',
  intro: {
    sr: 'Završio si večeru u restoranu. Na računu vidiš jelo koje nisi naručio i dve porcije deserta umesto jedne. Pozivaš konobara da proverite račun.',
    ru: 'Ты закончил ужин в ресторане. В счёте указано блюдо, которого ты не заказывал, и две порции десерта вместо одной. Ты зовёшь официанта, чтобы проверить счёт.',
  },
  objective: {
    sr: 'Ljubazno ukaži na konkretne greške, objasni šta si zaista naručio i traži ispravljen račun.',
    ru: 'Вежливо укажи на конкретные ошибки, объясни, что ты действительно заказывал, и попроси исправленный счёт.',
  },
  startSceneId: 'call-waiter',
  scenes: [
    {
      id: 'call-waiter',
      speaker: 'employee',
      phase: {
        sr: 'Pozivanje konobara',
        ru: 'Зовём официанта',
      },
      employee: {
        sr: 'Izvolite, da li je sve bilo u redu?',
        ru: 'Слушаю вас, всё ли было в порядке?',
      },
      promptRu: 'Как начать разговор о проблеме?',
      choices: [
        {
          id: 'call-polite',
          text: {
            sr: 'Da, hrana je bila ukusna, ali mislim da postoji greška na računu. Možete li da pogledate?',
            ru: 'Да, еда была вкусной, но, кажется, в счёте есть ошибка. Можете посмотреть?',
          },
          quality: 'best',
          feedback: {
            sr: 'Odlično. Počinješ mirno, priznaješ ono što je bilo dobro i jasno navodiš problem.',
            ru: 'Отлично. Ты начинаешь спокойно, отмечаешь хорошее и ясно обозначаешь проблему.',
          },
          nextSceneId: 'identify-errors',
        },
        {
          id: 'call-direct',
          text: {
            sr: 'Ovaj račun nije tačan.',
            ru: 'Этот счёт неправильный.',
          },
          quality: 'acceptable',
          feedback: {
            sr: 'Jasno je, ali korisno je odmah zamoliti konobara da zajedno proverite račun.',
            ru: 'Понятно, но лучше сразу предложить официанту вместе проверить счёт.',
          },
          nextSceneId: 'identify-errors',
        },
        {
          id: 'call-angry',
          text: {
            sr: 'Pokušavate da me prevarite ovim računom!',
            ru: 'Вы пытаетесь обмануть меня этим счётом!',
          },
          quality: 'poor',
          feedback: {
            sr: 'Optužba bez provere lako izaziva sukob. Bolje je prvo govoriti o mogućoj grešci.',
            ru: 'Обвинение без проверки легко вызывает конфликт. Лучше сначала говорить о возможной ошибке.',
          },
          nextSceneId: 'identify-errors',
        },
      ],
    },
    {
      id: 'identify-errors',
      speaker: 'employee',
      phase: {
        sr: 'Navođenje grešaka',
        ru: 'Указываем ошибки',
      },
      employee: {
        sr: 'Naravno. Šta vam izgleda pogrešno?',
        ru: 'Конечно. Что именно кажется вам неправильным?',
      },
      promptRu: 'Как точно объяснить ошибки?',
      choices: [
        {
          id: 'errors-specific',
          text: {
            sr: 'Na računu je teleća čorba, a nju nisam naručio. Takođe su naplaćena dva kolača, a imali smo samo jedan.',
            ru: 'В счёте есть суп из телятины, но я его не заказывал. Кроме того, посчитаны два пирожных, хотя у нас было только одно.',
          },
          quality: 'best',
          feedback: {
            sr: 'Odlično. Navodiš tačne stavke i količine, pa greška može brzo da se proveri.',
            ru: 'Отлично. Ты называешь конкретные позиции и количество, поэтому ошибку легко проверить.',
          },
          nextSceneId: 'waiter-checks',
        },
        {
          id: 'errors-general',
          text: {
            sr: 'Ima nekoliko stvari koje nismo uzeli.',
            ru: 'Здесь есть несколько позиций, которые мы не брали.',
          },
          quality: 'acceptable',
          feedback: {
            sr: 'Suština je jasna, ali bez naziva i količina provera će trajati duže.',
            ru: 'Суть ясна, но без названий и количества проверка займёт больше времени.',
          },
          nextSceneId: 'waiter-checks',
        },
        {
          id: 'errors-dismissive',
          text: {
            sr: 'Skoro sve je pogrešno. Sami pronađite grešku.',
            ru: 'Почти всё неправильно. Сами найдите ошибку.',
          },
          quality: 'poor',
          feedback: {
            sr: 'Ovakav odgovor ne daje potrebne činjenice i otežava rešavanje problema.',
            ru: 'Такой ответ не даёт нужных фактов и затрудняет решение проблемы.',
          },
          nextSceneId: 'waiter-checks',
        },
      ],
    },
    {
      id: 'waiter-checks',
      speaker: 'employee',
      phase: {
        sr: 'Provera porudžbine',
        ru: 'Проверяем заказ',
      },
      employee: {
        sr: 'Vidim dve porcije kolača u sistemu. Možda je vaš prijatelj naručio drugu?',
        ru: 'В системе указаны две порции пирожного. Возможно, вторую заказал ваш друг?',
      },
      promptRu: 'Как не согласиться без ссоры?',
      choices: [
        {
          id: 'clarify-order',
          text: {
            sr: 'Proverio sam sa svima za stolom. Naručili smo jednu porciju i podelili je. Možete li da proverite sa kolegom koji nas je posluživao?',
            ru: 'Я уточнил у всех за столом. Мы заказали одну порцию и поделили её. Можете проверить у коллеги, который нас обслуживал?',
          },
          quality: 'best',
          feedback: {
            sr: 'Dobro. Mirno potvrđuješ činjenice i predlažeš konkretan način provere.',
            ru: 'Хорошо. Ты спокойно подтверждаешь факты и предлагаешь конкретный способ проверки.',
          },
          nextSceneId: 'soup-explanation',
        },
        {
          id: 'clarify-firm',
          text: {
            sr: 'Siguran sam da je bila samo jedna porcija.',
            ru: 'Я уверен, что была только одна порция.',
          },
          quality: 'acceptable',
          feedback: {
            sr: 'Dovoljno jasno, ali predlog kako da se proveri dodatno bi pomogao.',
            ru: 'Достаточно ясно, но предложение, как это проверить, помогло бы.',
          },
          nextSceneId: 'soup-explanation',
        },
        {
          id: 'clarify-hostile',
          text: {
            sr: 'Nemojte da izmišljate. Znam šta smo jeli.',
            ru: 'Не выдумывайте. Я знаю, что мы ели.',
          },
          quality: 'poor',
          feedback: {
            sr: 'Poruka je odlučna, ali optužujući ton nepotrebno zaoštrava razgovor.',
            ru: 'Мысль выражена твёрдо, но обвинительный тон напрасно обостряет разговор.',
          },
          nextSceneId: 'soup-explanation',
        },
      ],
    },
    {
      id: 'soup-explanation',
      speaker: 'employee',
      phase: {
        sr: 'Druga sporna stavka',
        ru: 'Вторая спорная позиция',
      },
      employee: {
        sr: 'A čorba je možda bila uključena u dnevni meni koji ste naručili.',
        ru: 'А суп, возможно, входил в заказанное вами дневное меню.',
      },
      promptRu: 'Как объяснить, что это не соответствует заказу?',
      choices: [
        {
          id: 'menu-precise',
          text: {
            sr: 'Naručio sam pljeskavicu pojedinačno, ne dnevni meni. U jelovniku je cena pljeskavice 850 dinara, i to je ono što sam poručio.',
            ru: 'Я заказал плескавицу отдельно, а не дневное меню. В меню плескавица стоит 850 динаров, и именно её я заказал.',
          },
          quality: 'best',
          feedback: {
            sr: 'Odlično. Porediš račun sa jelovnikom i tačno opisuješ svoju porudžbinu.',
            ru: 'Отлично. Ты сверяешь счёт с меню и точно описываешь свой заказ.',
          },
          nextSceneId: 'manager-option',
        },
        {
          id: 'menu-short',
          text: {
            sr: 'Nisam naručio meni, samo pljeskavicu.',
            ru: 'Я не заказывал комплекс, только плескавицу.',
          },
          quality: 'acceptable',
          feedback: {
            sr: 'Jasno i korisno, mada bi pominjanje cene dodatno ojačalo objašnjenje.',
            ru: 'Ясно и по делу, хотя упоминание цены сделало бы объяснение ещё убедительнее.',
          },
          nextSceneId: 'manager-option',
        },
        {
          id: 'menu-sarcastic',
          text: {
            sr: 'Da li sada svaki gost dobija čorbu koju nije tražio?',
            ru: 'Теперь каждому гостю приносят суп, которого он не просил?',
          },
          quality: 'poor',
          feedback: {
            sr: 'Sarkazam ne pomaže proveri porudžbine i može da skrene razgovor sa činjenica.',
            ru: 'Сарказм не помогает проверить заказ и может увести разговор от фактов.',
          },
          nextSceneId: 'manager-option',
        },
      ],
    },
    {
      id: 'manager-option',
      speaker: 'employee',
      phase: {
        sr: 'Traženje rešenja',
        ru: 'Просим решение',
      },
      employee: {
        sr: 'Razumem. Mogu da pozovem menadžera, ali možda ćete morati malo da sačekate.',
        ru: 'Понимаю. Я могу позвать менеджера, но, возможно, придётся немного подождать.',
      },
      promptRu: 'Что попросить сейчас?',
      choices: [
        {
          id: 'request-correction',
          text: {
            sr: 'U redu, mogu da sačekam nekoliko minuta. Molim vas, proverite porudžbinu i donesite ispravljen račun bez čorbe i druge porcije kolača.',
            ru: 'Хорошо, я могу подождать несколько минут. Пожалуйста, проверьте заказ и принесите исправленный счёт без супа и второй порции пирожного.',
          },
          quality: 'best',
          feedback: {
            sr: 'Odlično. Jasno kažeš koje rešenje očekuješ i ostavljaš razuman rok za proveru.',
            ru: 'Отлично. Ты ясно говоришь, какого решения ожидаешь, и даёшь разумное время на проверку.',
          },
          nextSceneId: 'offer-discount',
        },
        {
          id: 'request-manager',
          text: {
            sr: 'Pozovite menadžera, molim vas.',
            ru: 'Позовите менеджера, пожалуйста.',
          },
          quality: 'acceptable',
          feedback: {
            sr: 'Pristojno i jasno, ali još nisi ponovio koje stavke treba ispraviti.',
            ru: 'Вежливо и ясно, но ты ещё не повторил, какие позиции нужно исправить.',
          },
          nextSceneId: 'offer-discount',
        },
        {
          id: 'request-refuse',
          text: {
            sr: 'Neću ništa da platim dok se ovo ne reši.',
            ru: 'Я ничего не буду платить, пока это не решится.',
          },
          quality: 'poor',
          feedback: {
            sr: 'Ovo zvuči kao pretnja. Bolje je tražiti preciznu ispravku spornog dela računa.',
            ru: 'Это звучит как угроза. Лучше потребовать точного исправления спорной части счёта.',
          },
          nextSceneId: 'offer-discount',
        },
      ],
    },
    {
      id: 'offer-discount',
      speaker: 'employee',
      phase: {
        sr: 'Procena ponude',
        ru: 'Оцениваем предложение',
      },
      employee: {
        sr: 'Izvinjavamo se. Možemo da uklonimo čorbu, a za kolač da vam ponudimo deset odsto popusta na ceo račun.',
        ru: 'Приносим извинения. Мы можем убрать суп, а из-за пирожного предложить скидку десять процентов на весь счёт.',
      },
      promptRu: 'Как ответить на частичное решение?',
      choices: [
        {
          id: 'insist-correct-bill',
          text: {
            sr: 'Hvala na ponudi, ali ne želim popust umesto ispravke. Molim vas da naplatite samo jednu porciju kolača, jer je samo jedna i poručena.',
            ru: 'Спасибо за предложение, но мне не нужна скидка вместо исправления. Пожалуйста, посчитайте только одну порцию пирожного, потому что заказана была одна.',
          },
          quality: 'best',
          feedback: {
            sr: 'Odlično. Zahvaljuješ se, ali ostaješ usmeren na tačno i pravično rešenje.',
            ru: 'Отлично. Ты благодаришь, но продолжаешь добиваться точного и справедливого решения.',
          },
          nextSceneId: 'final-bill',
        },
        {
          id: 'accept-discount',
          text: {
            sr: 'U redu, prihvatiću popust.',
            ru: 'Хорошо, я соглашусь на скидку.',
          },
          quality: 'acceptable',
          feedback: {
            sr: 'Praktično rešenje, ali račun i dalje formalno sadrži pogrešnu količinu.',
            ru: 'Практичное решение, но формально в счёте всё ещё остаётся неверное количество.',
          },
          nextSceneId: 'partial-success',
        },
        {
          id: 'reject-rudely',
          text: {
            sr: 'To je smešna ponuda. Donesite normalan račun!',
            ru: 'Это смешное предложение. Принесите нормальный счёт!',
          },
          quality: 'poor',
          feedback: {
            sr: 'Odbijanje je razumljivo, ali uvreda otežava saradnju.',
            ru: 'Отказ понятен, но оскорбление мешает сотрудничеству.',
          },
          nextSceneId: 'final-bill',
        },
      ],
    },
    {
      id: 'final-bill',
      speaker: 'employee',
      phase: {
        sr: 'Provera ispravke',
        ru: 'Проверяем исправление',
      },
      employee: {
        sr: 'U redu, uklonili smo obe pogrešne stavke. Evo novog računa.',
        ru: 'Хорошо, мы убрали обе ошибочные позиции. Вот новый счёт.',
      },
      promptRu: 'Как завершить разговор?',
      choices: [
        {
          id: 'close-check',
          text: {
            sr: 'Hvala. Sada je račun tačan: jedna pljeskavica, jedna salata, jedan kolač i dva pića. Platiću karticom.',
            ru: 'Спасибо. Теперь счёт верный: одна плескавица, один салат, одно пирожное и два напитка. Я оплачу картой.',
          },
          quality: 'best',
          feedback: {
            sr: 'Odlično. Još jednom proveravaš stavke i jasno završavaš plaćanje.',
            ru: 'Отлично. Ты ещё раз проверяешь позиции и ясно завершаешь оплату.',
          },
          nextSceneId: 'success',
        },
        {
          id: 'close-simple',
          text: {
            sr: 'Hvala, sada je u redu.',
            ru: 'Спасибо, теперь всё в порядке.',
          },
          quality: 'acceptable',
          feedback: {
            sr: 'Ljubazno završavaš razgovor, mada bi kratka provera stavki bila sigurnija.',
            ru: 'Ты вежливо завершаешь разговор, хотя краткая проверка позиций была бы надёжнее.',
          },
          nextSceneId: 'success',
        },
        {
          id: 'close-grudge',
          text: {
            sr: 'Konačno. Više nikada neću doći ovde.',
            ru: 'Наконец-то. Я сюда больше никогда не приду.',
          },
          quality: 'poor',
          feedback: {
            sr: 'Problem je rešen, ali ovakav završetak nepotrebno obnavlja sukob.',
            ru: 'Проблема решена, но такой финал напрасно возобновляет конфликт.',
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
      titleSr: 'Račun je ispravljen',
      titleRu: 'Счёт исправлен',
      text: {
        sr: 'Mirno si naveo konkretne greške, proverio porudžbinu i dobio račun sa tačnim jelima i količinama.',
        ru: 'Ты спокойно назвал конкретные ошибки, проверил заказ и получил счёт с правильными блюдами и количеством.',
      },
    },
    {
      id: 'partial-success',
      type: 'partial',
      titleSr: 'Dogovor je postignut, ali račun nije potpuno ispravljen',
      titleRu: 'Компромисс достигнут, но счёт исправлен не полностью',
      text: {
        sr: 'Dobio si popust ili završio razgovor bez potpune provere. Situacija je rešena praktično, ali ne sasvim precizno.',
        ru: 'Ты получил скидку или завершил разговор без полной проверки. Ситуация решена практически, но не совсем точно.',
      },
    },
  ],
  vocabulary: [
    {
      sr: 'račun',
      ru: 'счёт',
      exampleSr: 'Mislim da postoji greška na računu.',
      exampleRu: 'Кажется, в счёте есть ошибка.',
    },
    {
      sr: 'stavka',
      ru: 'позиция в счёте',
      exampleSr: 'Ova stavka nije moja.',
      exampleRu: 'Эта позиция не моя.',
    },
    {
      sr: 'porcija',
      ru: 'порция',
      exampleSr: 'Naručili smo jednu porciju kolača.',
      exampleRu: 'Мы заказали одну порцию пирожного.',
    },
    {
      sr: 'jelo',
      ru: 'блюдо',
      exampleSr: 'Ovo jelo nisam naručio.',
      exampleRu: 'Я не заказывал это блюдо.',
    },
    {
      sr: 'jelovnik',
      ru: 'меню',
      exampleSr: 'Cena je navedena u jelovniku.',
      exampleRu: 'Цена указана в меню.',
    },
    {
      sr: 'naplatiti',
      ru: 'начислить, взять плату',
      exampleSr: 'Naplaćena su dva kolača.',
      exampleRu: 'В счёт включили два пирожных.',
    },
    {
      sr: 'ispravljen račun',
      ru: 'исправленный счёт',
      exampleSr: 'Molim vas, donesite ispravljen račun.',
      exampleRu: 'Пожалуйста, принесите исправленный счёт.',
    },
    {
      sr: 'popust',
      ru: 'скидка',
      exampleSr: 'Ponudili su nam popust.',
      exampleRu: 'Нам предложили скидку.',
    },
    {
      sr: 'prilog',
      ru: 'гарнир',
      exampleSr: 'Koji prilog ide uz ovo jelo?',
      exampleRu: 'Какой гарнир подают к этому блюду?',
    },
    {
      sr: 'ukloniti sa računa',
      ru: 'убрать из счёта',
      exampleSr: 'Molim vas, uklonite čorbu sa računa.',
      exampleRu: 'Пожалуйста, уберите суп из счёта.',
    },
  ],
};
