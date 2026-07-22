import type { SeedQuest } from '../quest-validate.js';

// Delivery-service dialogue quest. Source of truth: authoring JSON preserved
// byte-for-byte in IDs, text, branching, quality, feedback, endings, vocabulary.

export const pozivDostavnojSluzbi: SeedQuest = {
  slug: 'poziv-dostavnoj-sluzbi',
  kind: 'quest',
  titleSr: 'Paket koji nije stigao do vrata',
  titleRu: 'Посылка, которая не дошла до двери',
  position: 2,
  descriptionSr:
    'Pozovi dostavnu službu, objasni problem i pokušaj da dobiješ povraćaj novca za dostavu.',
  descriptionRu:
    'Позвони в службу доставки, объясни проблему и попробуй добиться возврата денег за доставку.',
  intro: {
    sr: 'Kurir je trebalo da dostavi paket na tvoju kućnu adresu. Platio si dostavu do vrata, ali je paket ostavljen u obližnjoj prodavnici bez tvog pristanka. Pozivaš korisničku službu da rešiš problem.',
    ru: 'Курьер должен был доставить посылку на твой домашний адрес. Ты заплатил за доставку до двери, но посылку без твоего согласия оставили в соседнем магазине. Ты звонишь в службу поддержки, чтобы решить проблему.',
  },
  objective: {
    sr: 'Objasni problem mirno, ali odlučno. Traži objašnjenje, bezbedno preuzimanje paketa i povraćaj novca za neizvršenu dostavu.',
    ru: 'Объясни проблему спокойно, но настойчиво. Потребуй объяснения, безопасного получения посылки и возврата денег за неоказанную доставку.',
  },
  startSceneId: 'greeting',
  scenes: [
    {
      id: 'greeting',
      speaker: 'employee',
      phase: {
        sr: 'Uspostavljanje kontakta',
        ru: 'Устанавливаем контакт',
      },
      employee: {
        sr: 'Dobar dan, dostavna služba. Kako mogu da vam pomognem?',
        ru: 'Добрый день, служба доставки. Чем я могу вам помочь?',
      },
      promptRu: 'Как лучше начать разговор?',
      choices: [
        {
          id: 'greeting-polite',
          text: {
            sr: 'Dobar dan. Zovem u vezi jedne pošiljke. Možete li mi pomoći?',
            ru: 'Добрый день. Звоню по поводу одной посылки. Можете ли мне помочь?',
          },
          quality: 'best',
          feedback: {
            sr: 'Odlično. Odmah si objasnio razlog poziva i ostao ljubazan.',
            ru: 'Отлично. Ты сразу обозначил причину звонка и сохранил вежливый тон.',
          },
          nextSceneId: 'identification',
        },
        {
          id: 'greeting-vague',
          text: {
            sr: 'Dobar dan. Imam problem.',
            ru: 'Добрый день. У меня проблема.',
          },
          quality: 'acceptable',
          feedback: {
            sr: 'Razumljivo je, ali bolje je odmah reći da zoveš zbog pošiljke.',
            ru: 'Понятно, но лучше сразу сказать, что ты звонишь по поводу посылки.',
          },
          nextSceneId: 'identification',
        },
        {
          id: 'greeting-aggressive',
          text: {
            sr: 'Šta vi tamo radite? Gde je moj paket?',
            ru: 'Что вы там вообще делаете? Где моя посылка?',
          },
          quality: 'poor',
          feedback: {
            sr: 'Previše agresivan početak. Sagovornik još ne zna ni o kojoj pošiljci govoriš.',
            ru: 'Слишком агрессивное начало. Собеседник ещё даже не знает, о какой посылке идёт речь.',
          },
          nextSceneId: 'identification',
        },
      ],
    },
    {
      id: 'identification',
      speaker: 'employee',
      phase: {
        sr: 'Identifikacija pošiljke',
        ru: 'Идентификация посылки',
      },
      employee: {
        sr: 'Da, naravno. Koji je broj porudžbine?',
        ru: 'Да, конечно. Какой номер заказа?',
      },
      promptRu: 'Назови данные заказа.',
      choices: [
        {
          id: 'identify-complete',
          text: {
            sr: 'Broj porudžbine je [BROJ PORUDŽBINE]. Ime i prezime: [IME I PREZIME].',
            ru: 'Номер заказа — [НОМЕР ЗАКАЗА]. Имя и фамилия: [ИМЯ И ФАМИЛИЯ].',
          },
          quality: 'best',
          feedback: {
            sr: 'Tačno. Dao si obe informacije koje će operateru verovatno biti potrebne.',
            ru: 'Верно. Ты сообщил обе вещи, которые, скорее всего, понадобятся оператору.',
          },
          nextSceneId: 'state-complaint',
        },
        {
          id: 'identify-number-only',
          text: {
            sr: 'Broj je [BROJ PORUDŽBINE].',
            ru: 'Номер — [НОМЕР ЗАКАЗА].',
          },
          quality: 'acceptable',
          feedback: {
            sr: 'Dovoljno za početak, ali operater može dodatno da traži tvoje ime i prezime.',
            ru: 'Для начала достаточно, но оператор может дополнительно попросить имя и фамилию.',
          },
          nextSceneId: 'state-complaint',
        },
      ],
    },
    {
      id: 'state-complaint',
      speaker: 'employee',
      phase: {
        sr: 'Izlaganje problema',
        ru: 'Излагаем проблему',
      },
      employee: {
        sr: 'Vidim porudžbinu. Recite mi u čemu je problem.',
        ru: 'Я вижу заказ. Расскажите, в чём проблема.',
      },
      promptRu: 'Как обозначить серьёзность ситуации?',
      choices: [
        {
          id: 'complaint-clear',
          text: {
            sr: 'Imam jednu ozbiljnu zamerku u vezi isporuke.',
            ru: 'У меня есть серьёзная претензия по поводу доставки.',
          },
          quality: 'best',
          feedback: {
            sr: 'Dobro. Izraz „ozbiljna zamerka” zvuči odlučno, ali i dalje pristojno.',
            ru: 'Хорошо. Выражение «серьёзная претензия» звучит настойчиво, но остаётся вежливым.',
          },
          nextSceneId: 'describe-service',
        },
        {
          id: 'complaint-neutral',
          text: {
            sr: 'Nisam zadovoljan isporukom.',
            ru: 'Я недоволен доставкой.',
          },
          quality: 'acceptable',
          feedback: {
            sr: 'Ispravno, ali blaže. Još nisi pokazao koliko je problem ozbiljan.',
            ru: 'Правильно, но мягче. Пока ты не показал, насколько серьёзна проблема.',
          },
          nextSceneId: 'describe-service',
        },
        {
          id: 'complaint-insult',
          text: {
            sr: 'Vaša dostava je katastrofa.',
            ru: 'Ваша доставка — катастрофа.',
          },
          quality: 'poor',
          feedback: {
            sr: 'Emocija je jasna, ali ovakav početak lako pretvara razgovor u svađu.',
            ru: 'Эмоция понятна, но такое начало легко превращает разговор в ссору.',
          },
          nextSceneId: 'describe-service',
        },
      ],
    },
    {
      id: 'describe-service',
      speaker: 'employee',
      phase: {
        sr: 'Činjenice',
        ru: 'Излагаем факты',
      },
      employee: {
        sr: 'Šta se tačno dogodilo?',
        ru: 'Что именно произошло?',
      },
      promptRu: 'Выбери наиболее точное объяснение.',
      choices: [
        {
          id: 'facts-complete',
          text: {
            sr: 'Kurir je danas trebalo da mi dostavi paket na kućnu adresu. Izričito sam platio dostavu do vrata. Međutim, nije ni pokušao da dođe do moje adrese. Ostavio je paket u nepoznatom lokalu, a da me nije propisno obavestio.',
            ru: 'Курьер сегодня должен был доставить посылку на мой домашний адрес. Я специально заплатил за доставку до двери. Однако он даже не попытался приехать по моему адресу. Он оставил посылку в неизвестном заведении, не уведомив меня должным образом.',
          },
          quality: 'best',
          feedback: {
            sr: 'Odlično. Naveo si šta je bilo dogovoreno, šta je plaćeno i šta je kurir uradio.',
            ru: 'Отлично. Ты указал, что было согласовано, за что было заплачено и что сделал курьер.',
          },
          nextSceneId: 'employee-convenient',
        },
        {
          id: 'facts-short',
          text: {
            sr: 'Kurir je ostavio paket u prodavnici umesto da ga donese na moju adresu.',
            ru: 'Курьер оставил посылку в магазине вместо того, чтобы привезти её по моему адресу.',
          },
          quality: 'acceptable',
          feedback: {
            sr: 'Suština je jasna, ali važno je pomenuti da si platio dostavu do vrata.',
            ru: 'Суть ясна, но важно упомянуть, что ты оплатил доставку до двери.',
          },
          nextSceneId: 'employee-convenient',
        },
        {
          id: 'facts-emotional',
          text: {
            sr: 'Nemam pojma gde je paket. Vaš kurir radi šta hoće!',
            ru: 'Я понятия не имею, где посылка. Ваш курьер делает что хочет!',
          },
          quality: 'poor',
          feedback: {
            sr: 'Ovo pokazuje nezadovoljstvo, ali ne daje operateru dovoljno preciznih činjenica.',
            ru: 'Это выражает недовольство, но не даёт оператору достаточно точных фактов.',
          },
          nextSceneId: 'employee-convenient',
        },
      ],
    },
    {
      id: 'employee-convenient',
      speaker: 'employee',
      phase: {
        sr: 'Prvi prigovor operatera',
        ru: 'Первое возражение оператора',
      },
      employee: {
        sr: 'Kurir je ostavio paket u lokalnoj prodavnici. To je blizu vaše adrese i verovatno vam je tako čak i lakše.',
        ru: 'Курьер оставил посылку в местном магазине. Он находится рядом с вашим адресом, и, возможно, так вам даже удобнее.',
      },
      promptRu: 'Как спокойно отбить это возражение?',
      choices: [
        {
          id: 'contract-argument',
          text: {
            sr: 'Razumem da je kurir možda hteo da uštedi vreme, ali to nije moj problem. Platio sam uslugu koju nisam dobio. Dostava je ugovorena između mene i vaše firme, a ne između mene i obližnje prodavnice.',
            ru: 'Я понимаю, что курьер, возможно, хотел сэкономить время, но это не моя проблема. Я заплатил за услугу, которую не получил. Доставка была согласована между мной и вашей компанией, а не между мной и соседним магазином.',
          },
          quality: 'best',
          feedback: {
            sr: 'Odlično. Ne raspravljaš o namerama kurira, već vraćaš razgovor na plaćenu uslugu.',
            ru: 'Отлично. Ты не споришь о намерениях курьера, а возвращаешь разговор к оплаченной услуге.',
          },
          nextSceneId: 'explain-dissatisfaction',
        },
        {
          id: 'not-convenient',
          text: {
            sr: 'Meni to nije lakše. Platio sam dostavu do vrata.',
            ru: 'Мне так не удобнее. Я оплатил доставку до двери.',
          },
          quality: 'acceptable',
          feedback: {
            sr: 'Dobar i direktan odgovor. Možeš ga dodatno pojačati objašnjenjem da usluga nije izvršena.',
            ru: 'Хороший и прямой ответ. Его можно усилить объяснением, что услуга не была оказана.',
          },
          nextSceneId: 'explain-dissatisfaction',
        },
        {
          id: 'accept-store',
          text: {
            sr: 'Dobro, onda ću otići po paket.',
            ru: 'Хорошо, тогда я схожу за посылкой.',
          },
          quality: 'poor',
          feedback: {
            sr: 'Time praktično prihvataš neizvršenu uslugu i gubiš osnov za zahtev.',
            ru: 'Так ты фактически соглашаешься с неоказанной услугой и ослабляешь свою позицию.',
          },
          nextSceneId: 'time-and-fuel',
        },
      ],
    },
    {
      id: 'explain-dissatisfaction',
      speaker: 'employee',
      phase: {
        sr: 'Argumentacija',
        ru: 'Аргументируем позицию',
      },
      employee: {
        sr: 'Ali paket je ipak dostavljen u vaš kraj.',
        ru: 'Но посылка всё-таки была доставлена в ваш район.',
      },
      promptRu: 'Объясни, почему этого недостаточно.',
      choices: [
        {
          id: 'service-definition',
          text: {
            sr: 'Dozvolite da objasnim zašto sam nezadovoljan. Platio sam uslugu dostave, što znači da pošiljka mora da stigne na moju adresu, a ne na mesto koje kurir sam odabere. Ako sam platio dostavu do vrata, očekujem da kurir pozvoni na moja vrata i lično mi preda paket.',
            ru: 'Разрешите объяснить, почему я недоволен. Я заплатил за услугу доставки, а значит, посылка должна прибыть на мой адрес, а не в место, которое курьер выберет сам. Если я оплатил доставку до двери, я ожидаю, что курьер позвонит в мою дверь и лично передаст мне посылку.',
          },
          quality: 'best',
          feedback: {
            sr: 'Veoma dobro. Precizno si definisao šta podrazumeva plaćena dostava do vrata.',
            ru: 'Очень хорошо. Ты точно объяснил, что подразумевает оплаченная доставка до двери.',
          },
          nextSceneId: 'time-and-fuel',
        },
        {
          id: 'address-only',
          text: {
            sr: 'Moj kraj nije isto što i moja adresa.',
            ru: 'Мой район — это не то же самое, что мой адрес.',
          },
          quality: 'acceptable',
          feedback: {
            sr: 'Tačno i upečatljivo, ali vredi pomenuti i plaćenu uslugu.',
            ru: 'Верно и выразительно, но стоит также упомянуть оплаченную услугу.',
          },
          nextSceneId: 'time-and-fuel',
        },
      ],
    },
    {
      id: 'time-and-fuel',
      speaker: 'employee',
      phase: {
        sr: 'Posledice za kupca',
        ru: 'Последствия для покупателя',
      },
      employee: {
        sr: 'Prodavnica nije daleko. Možete li jednostavno da preuzmete paket tamo?',
        ru: 'Магазин находится недалеко. Не могли бы вы просто забрать посылку там?',
      },
      promptRu: 'Как объяснить, почему это неприемлемо?',
      choices: [
        {
          id: 'unfair-cost',
          text: {
            sr: 'Ovo nije fer prema meni kao kupcu. Sada moram da trošim svoje vreme i gorivo da bih tražio paket, iako sam platio da mi ga donesu.',
            ru: 'Это нечестно по отношению ко мне как к покупателю. Теперь я должен тратить своё время и бензин, чтобы искать посылку, хотя заплатил за то, чтобы её привезли мне.',
          },
          quality: 'best',
          feedback: {
            sr: 'Odlično. Pokazao si konkretnu štetu: dodatno vreme, put i trošak.',
            ru: 'Отлично. Ты показал конкретный ущерб: дополнительное время, поездку и расходы.',
          },
          nextSceneId: 'make-demands',
        },
        {
          id: 'refuse-only',
          text: {
            sr: 'Ne, ne želim da idem tamo.',
            ru: 'Нет, я не хочу туда ехать.',
          },
          quality: 'acceptable',
          feedback: {
            sr: 'Granica je jasna, ali obrazložen zahtev obično zvuči ubedljivije.',
            ru: 'Граница обозначена ясно, но обоснованное требование обычно звучит убедительнее.',
          },
          nextSceneId: 'make-demands',
        },
      ],
    },
    {
      id: 'make-demands',
      speaker: 'employee',
      phase: {
        sr: 'Zahtev',
        ru: 'Формулируем требование',
      },
      employee: {
        sr: 'Razumem da ste nezadovoljni. Šta očekujete da sada uradimo?',
        ru: 'Я понимаю, что вы недовольны. Что вы ожидаете от нас сейчас?',
      },
      promptRu: 'Сформулируй конкретные требования.',
      choices: [
        {
          id: 'demand-complete',
          text: {
            sr: 'Molim vas da mi objasnite zašto je kurir ovo uradio i kako mogu bezbedno da dođem do svog paketa. Takođe zahtevam povraćaj novca za dostavu, pošto usluga nije izvršena kako treba.',
            ru: 'Прошу объяснить, почему курьер так поступил и как я могу безопасно получить свою посылку. Также я требую возврата денег за доставку, поскольку услуга не была оказана надлежащим образом.',
          },
          quality: 'best',
          feedback: {
            sr: 'Odlično. Zahtev je konkretan: objašnjenje, rešenje za paket i povraćaj novca.',
            ru: 'Отлично. Требование конкретно: объяснение, решение по посылке и возврат денег.',
          },
          nextSceneId: 'employee-delay',
        },
        {
          id: 'demand-refund',
          text: {
            sr: 'Zahtevam da mi vratite novac za dostavu.',
            ru: 'Я требую вернуть мне деньги за доставку.',
          },
          quality: 'acceptable',
          feedback: {
            sr: 'Jasno, ali još treba rešiti gde je paket i kako ćeš ga bezbedno preuzeti.',
            ru: 'Понятно, но ещё нужно решить, где находится посылка и как безопасно её получить.',
          },
          nextSceneId: 'employee-delay',
        },
        {
          id: 'demand-vague',
          text: {
            sr: 'Uradite nešto.',
            ru: 'Сделайте что-нибудь.',
          },
          quality: 'poor',
          feedback: {
            sr: 'Previše neodređeno. Operateru ostavljaš da sam odluči šta, ako išta, treba da uradi.',
            ru: 'Слишком неопределённо. Ты оставляешь оператору решать, что именно — и нужно ли вообще — делать.',
          },
          nextSceneId: 'employee-delay',
        },
      ],
    },
    {
      id: 'employee-delay',
      speaker: 'employee',
      phase: {
        sr: 'Odlaganje',
        ru: 'Оператор затягивает разговор',
      },
      employee: {
        sr: 'Ne mogu sada da odobrim povraćaj novca. Poslaćemo upit kurirskoj službi, pa ćemo videti.',
        ru: 'Сейчас я не могу одобрить возврат денег. Мы отправим запрос в курьерскую службу, а затем посмотрим.',
      },
      promptRu: 'Как не позволить разговору закончиться неопределённо?',
      choices: [
        {
          id: 'deadline',
          text: {
            sr: 'U redu. Kada tačno mogu da očekujem odgovor? Molim vas da zabeležite moj zahtev za povraćaj novca i da mi date broj prijave.',
            ru: 'Хорошо. Когда именно я могу ожидать ответ? Пожалуйста, зарегистрируйте моё требование о возврате денег и сообщите мне номер обращения.',
          },
          quality: 'best',
          feedback: {
            sr: 'Odlično. Tražiš rok i dokaz da je zahtev zvanično evidentiran.',
            ru: 'Отлично. Ты запрашиваешь срок и подтверждение того, что требование официально зарегистрировано.',
          },
          nextSceneId: 'employee-refuses',
        },
        {
          id: 'wait-passively',
          text: {
            sr: 'Dobro, čekaću.',
            ru: 'Хорошо, я подожду.',
          },
          quality: 'poor',
          feedback: {
            sr: 'Nema roka, broja prijave ni obećanog sledećeg koraka. Problem lako može da bude zaboravljen.',
            ru: 'Нет ни срока, ни номера обращения, ни обещанного следующего шага. О проблеме легко могут забыть.',
          },
          nextSceneId: 'callback-ending',
        },
      ],
    },
    {
      id: 'employee-refuses',
      speaker: 'employee',
      phase: {
        sr: 'Eskalacija',
        ru: 'Эскалация',
      },
      employee: {
        sr: 'Ne mogu da vam obećam ni povraćaj novca ni tačan rok. Takva je procedura.',
        ru: 'Я не могу обещать ни возврат денег, ни точный срок. Такова процедура.',
      },
      promptRu: 'Выбери вежливое предупреждение об официальной жалобе.',
      choices: [
        {
          id: 'formal-escalation',
          text: {
            sr: 'Ako ne uspemo da rešimo ovo na korektan način, biću primoran da podnesem prigovor vašoj službi za korisnike i, ako bude potrebno, organizaciji za zaštitu potrošača. Nadam se da neće doći do toga.',
            ru: 'Если нам не удастся решить вопрос надлежащим образом, я буду вынужден подать официальную жалобу в вашу службу поддержки и, если потребуется, обратиться в организацию по защите прав потребителей. Надеюсь, до этого не дойдёт.',
          },
          quality: 'best',
          feedback: {
            sr: 'Odlično. Jasno si naveo sledeći korak bez uvreda i praznih pretnji.',
            ru: 'Отлично. Ты ясно назвал следующий шаг без оскорблений и пустых угроз.',
          },
          nextSceneId: 'resolution',
        },
        {
          id: 'angry-threat',
          text: {
            sr: 'Videćete vi! Tužiću vas sve!',
            ru: 'Вы у меня ещё увидите! Я на вас всех подам в суд!',
          },
          quality: 'poor',
          feedback: {
            sr: 'Pretnja zvuči neodmereno i može da prekine konstruktivan razgovor.',
            ru: 'Угроза звучит несоразмерно и может прекратить конструктивный разговор.',
          },
          nextSceneId: 'resolution',
        },
      ],
    },
    {
      id: 'resolution',
      speaker: 'employee',
      phase: {
        sr: 'Rešenje',
        ru: 'Решение',
      },
      employee: {
        sr: 'Razumem. Evidentiraću prigovor i zahtev za povraćaj novca. Kolega će vas pozvati u roku od sat vremena, a kurirska služba će proveriti gde se paket nalazi.',
        ru: 'Понимаю. Я зарегистрирую жалобу и требование о возврате денег. Коллега позвонит вам в течение часа, а курьерская служба проверит, где находится посылка.',
      },
      promptRu: 'Как правильно завершить разговор?',
      choices: [
        {
          id: 'finish-callback',
          text: {
            sr: 'Važi. Očekujem vaš poziv u roku od sat vremena. Ako me ne pozovete, pozvaću ponovo. Hvala na pomoći. Doviđenja.',
            ru: 'Договорились. Ожидаю ваш звонок в течение часа. Если вы не позвоните, я позвоню снова. Спасибо за помощь. До свидания.',
          },
          quality: 'best',
          feedback: {
            sr: 'Odlično. Potvrdio si rok, najavio sledeći korak i završio razgovor pristojno.',
            ru: 'Отлично. Ты подтвердил срок, обозначил следующий шаг и вежливо завершил разговор.',
          },
          nextSceneId: 'success',
        },
        {
          id: 'finish-short',
          text: {
            sr: 'Važi. Hvala. Doviđenja.',
            ru: 'Хорошо. Спасибо. До свидания.',
          },
          quality: 'acceptable',
          feedback: {
            sr: 'Ljubazno, ali nisi naglas ponovio dogovoreni rok.',
            ru: 'Вежливо, но ты не повторил вслух согласованный срок.',
          },
          nextSceneId: 'success',
        },
      ],
    },
    {
      id: 'callback-ending',
      speaker: 'employee',
      phase: {
        sr: 'Neodređen završetak',
        ru: 'Неопределённый финал',
      },
      employee: {
        sr: 'U redu. Javićemo vam se kada budemo imali više informacija.',
        ru: 'Хорошо. Мы свяжемся с вами, когда появится дополнительная информация.',
      },
      promptRu: 'Попробуй всё же зафиксировать срок.',
      choices: [
        {
          id: 'recover-deadline',
          text: {
            sr: 'Molim vas da mi kažete makar približan rok i da mi date broj prijave.',
            ru: 'Пожалуйста, назовите хотя бы примерный срок и сообщите мне номер обращения.',
          },
          quality: 'best',
          feedback: {
            sr: 'Dobro si se vratio u razgovor i zatražio konkretne informacije.',
            ru: 'Ты удачно вернулся к разговору и запросил конкретную информацию.',
          },
          nextSceneId: 'resolution',
        },
        {
          id: 'end-without-deadline',
          text: {
            sr: 'Dobro. Doviđenja.',
            ru: 'Хорошо. До свидания.',
          },
          quality: 'poor',
          feedback: {
            sr: 'Razgovor je završen bez roka, broja prijave i konkretnog obećanja.',
            ru: 'Разговор завершён без срока, номера обращения и конкретного обещания.',
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
      titleSr: 'Prigovor je evidentiran',
      titleRu: 'Жалоба зарегистрирована',
      text: {
        sr: 'Uspeo si da ostaneš pristojan, jasno objasniš problem i dobiješ konkretan sledeći korak. Zahtev za povraćaj novca je evidentiran, a dostavna služba mora da proveri gde se paket nalazi.',
        ru: 'Ты сохранил вежливость, ясно объяснил проблему и добился конкретного следующего шага. Требование о возврате денег зарегистрировано, а служба доставки должна проверить, где находится посылка.',
      },
    },
    {
      id: 'partial-success',
      type: 'partial',
      titleSr: 'Obećali su da će se javiti',
      titleRu: 'Они обещали связаться',
      text: {
        sr: 'Operater je saslušao problem, ali razgovor je završen bez tačnog roka i broja prijave. Sledeći put traži da zahtev bude zvanično evidentiran.',
        ru: 'Оператор выслушал проблему, но разговор завершился без точного срока и номера обращения. В следующий раз потребуй официально зарегистрировать требование.',
      },
    },
  ],
  vocabulary: [
    {
      sr: 'pošiljka',
      ru: 'посылка',
      exampleSr: 'Zovem u vezi jedne pošiljke.',
      exampleRu: 'Я звоню по поводу одной посылки.',
    },
    {
      sr: 'isporuka',
      ru: 'доставка, процесс доставки',
      exampleSr: 'Imam zamerku u vezi isporuke.',
      exampleRu: 'У меня есть претензия по поводу доставки.',
    },
    {
      sr: 'dostava do vrata',
      ru: 'доставка до двери',
      exampleSr: 'Platio sam dostavu do vrata.',
      exampleRu: 'Я оплатил доставку до двери.',
    },
    {
      sr: 'kurir',
      ru: 'курьер',
      exampleSr: 'Kurir nije došao do moje adrese.',
      exampleRu: 'Курьер не приехал по моему адресу.',
    },
    {
      sr: 'zamerka',
      ru: 'замечание, претензия',
      exampleSr: 'Imam jednu ozbiljnu zamerku.',
      exampleRu: 'У меня есть одна серьёзная претензия.',
    },
    {
      sr: 'krajnje neozbiljno',
      ru: 'крайне несерьёзно, совершенно неприемлемо',
      exampleSr: 'Ovo je krajnje neozbiljno.',
      exampleRu: 'Это крайне несерьёзно.',
    },
    {
      sr: 'povraćaj novca',
      ru: 'возврат денег',
      exampleSr: 'Zahtevam povraćaj novca za dostavu.',
      exampleRu: 'Я требую возврата денег за доставку.',
    },
    {
      sr: 'prigovor',
      ru: 'официальная жалоба, претензия',
      exampleSr: 'Želim da podnesem prigovor.',
      exampleRu: 'Я хочу подать официальную жалобу.',
    },
    {
      sr: 'zaštita potrošača',
      ru: 'защита прав потребителей',
      exampleSr: 'Obratiću se organizaciji za zaštitu potrošača.',
      exampleRu: 'Я обращусь в организацию по защите прав потребителей.',
    },
    {
      sr: 'krajnje nezadovoljan',
      ru: 'крайне недоволен',
      exampleSr: 'Krajnje sam nezadovoljan ovom uslugom.',
      exampleRu: 'Я крайне недоволен этой услугой.',
    },
    {
      sr: 'usluga nije izvršena',
      ru: 'услуга не оказана',
      exampleSr: 'Usluga nije izvršena kako treba.',
      exampleRu: 'Услуга не была оказана надлежащим образом.',
    },
  ],
};
