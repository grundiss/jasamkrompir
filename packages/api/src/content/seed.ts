import { eq } from 'drizzle-orm';
import type { AppDb } from '../db/index.js';
import { paragraphs, texts } from '../db/schema.js';

// The seed content shipped with the app. Each entry is one bilingual text with
// its paragraphs aligned by order (Serbian ↔ Russian). `ensureSeeded` inserts
// any text whose slug is not yet present, so it is safe to run on every start
// and to extend with more texts over time.

interface SeedText {
  slug: string;
  titleSr: string;
  titleRu: string;
  position: number;
  paragraphs: { sr: string; ru: string }[];
}

export const seedTexts: SeedText[] = [
  {
    slug: 'ja-se-zovem-ivan',
    titleSr: 'Ja se zovem Ivan',
    titleRu: 'Меня зовут Иван',
    position: 1,
    paragraphs: [
      {
        sr: 'Ja se zovem Ivan. Ja sam iz Rusije. Imam dvadeset jednu godinu. Sada živim u Beogradu jer studiram na univerzitetu.',
        ru: 'Меня зовут Иван. Я из России. Мне двадцать один год. Сейчас я живу в Белграде, потому что учусь в университете.',
      },
      {
        sr: 'Svaki dan idem na predavanja. Učim srpski jezik i upoznajem nove prijatelje. Profesori su ljubazni, a studenti mi često pomažu.',
        ru: 'Каждый день я хожу на занятия. Я изучаю сербский язык и знакомлюсь с новыми друзьями. Преподаватели добрые, а студенты часто мне помогают.',
      },
      {
        sr: 'Posle nastave pijem kafu sa kolegama. Ponekad šetamo pored Save i Dunava ili idemo u centar grada. Beograd mi se mnogo sviđa. Grad je lep, ljudi su prijatni, a hrana je veoma ukusna.',
        ru: 'После занятий я пью кофе с одногруппниками. Иногда мы гуляем вдоль Савы и Дуная или идём в центр города. Белград мне очень нравится. Город красивый, люди приветливые, а еда очень вкусная.',
      },
      {
        sr: 'Nedostaje mi porodica u Rusiji, ali sam srećan što imam priliku da studiram u Srbiji. Nadam se da ću uskoro govoriti srpski mnogo bolje.',
        ru: 'Я скучаю по семье в России, но рад, что у меня есть возможность учиться в Сербии. Надеюсь, что скоро буду говорить по-сербски намного лучше.',
      },
    ],
  },
];

// Idempotently insert any seed text not already present (matched by slug). Each
// text and its paragraphs are inserted together in a transaction.
export async function ensureSeeded(db: AppDb): Promise<void> {
  for (const seed of seedTexts) {
    const [existing] = await db
      .select({ id: texts.id })
      .from(texts)
      .where(eq(texts.slug, seed.slug))
      .limit(1);
    if (existing) continue;

    await db.transaction(async (tx) => {
      const [created] = await tx
        .insert(texts)
        .values({
          slug: seed.slug,
          titleSr: seed.titleSr,
          titleRu: seed.titleRu,
          position: seed.position,
        })
        .returning({ id: texts.id });

      await tx.insert(paragraphs).values(
        seed.paragraphs.map((p, index) => ({
          textId: created!.id,
          position: index,
          sr: p.sr,
          ru: p.ru,
        })),
      );
    });
  }
}
