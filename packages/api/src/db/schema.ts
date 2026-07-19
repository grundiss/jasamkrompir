import { integer, pgTable, serial, text, timestamp, unique } from 'drizzle-orm/pg-core';

// The content model for the Serbian reader. Each "page" of the app is one
// bilingual `text`: a short Serbian passage paired with its Russian translation,
// split into aligned `paragraphs` so the two languages can be shown side by side.
//
// A text owns an ordered list of paragraphs; every paragraph carries both the
// Serbian (`sr`) and Russian (`ru`) rendering of the same passage, aligned by
// `position`. New texts are added by inserting a `texts` row plus its paragraphs.

export const texts = pgTable('texts', {
  id: serial('id').primaryKey(),
  // Stable, human-readable identifier used for seeding idempotency and routing.
  slug: text('slug').notNull().unique(),
  titleSr: text('title_sr').notNull(),
  titleRu: text('title_ru').notNull(),
  // Optional narration track: a root-relative URL to an audio file shipped as a
  // web asset (e.g. `/audio/<slug>.mp3`), or NULL when the text has no recording.
  audioUrl: text('audio_url'),
  // Ordering of texts in the reader's list. Lower comes first.
  position: integer('position').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const paragraphs = pgTable(
  'paragraphs',
  {
    id: serial('id').primaryKey(),
    textId: integer('text_id')
      .notNull()
      .references(() => texts.id, { onDelete: 'cascade' }),
    // Ordering within a text; the Serbian and Russian sides share this index.
    position: integer('position').notNull(),
    sr: text('sr').notNull(),
    ru: text('ru').notNull(),
  },
  (t) => [unique('paragraphs_text_position').on(t.textId, t.position)],
);

export type Text = typeof texts.$inferSelect;
export type NewText = typeof texts.$inferInsert;
export type Paragraph = typeof paragraphs.$inferSelect;
export type NewParagraph = typeof paragraphs.$inferInsert;
