import { integer, pgTable, serial, text, timestamp, unique } from 'drizzle-orm/pg-core';

// Content model: each sidebar entry is one row in `texts`, discriminated by
// `kind` (`text` | `quest`). Linear bilingual passages store body in
// `paragraphs`; interactive quests store their graph in the `quest_*` tables.
// New content is added by inserting a `texts` row plus its kind-specific rows.

export const texts = pgTable('texts', {
  id: serial('id').primaryKey(),
  // Stable, human-readable identifier used for seeding idempotency and routing.
  slug: text('slug').notNull().unique(),
  // Discriminator: 'text' (linear bilingual passage) or 'quest' (dialogue).
  // Existing rows default to 'text' via migration.
  kind: text('kind').notNull().default('text'),
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

// 1:1 quest metadata for a `texts` row with kind = 'quest'.
export const quests = pgTable('quests', {
  textId: integer('text_id')
    .primaryKey()
    .references(() => texts.id, { onDelete: 'cascade' }),
  descriptionSr: text('description_sr').notNull(),
  descriptionRu: text('description_ru').notNull(),
  introSr: text('intro_sr').notNull(),
  introRu: text('intro_ru').notNull(),
  objectiveSr: text('objective_sr').notNull(),
  objectiveRu: text('objective_ru').notNull(),
  startSceneId: text('start_scene_id').notNull(),
});

export const questScenes = pgTable(
  'quest_scenes',
  {
    id: serial('id').primaryKey(),
    textId: integer('text_id')
      .notNull()
      .references(() => texts.id, { onDelete: 'cascade' }),
    // Stable string id from the content authoring format (e.g. "greeting").
    sceneId: text('scene_id').notNull(),
    speaker: text('speaker').notNull(),
    phaseSr: text('phase_sr').notNull(),
    phaseRu: text('phase_ru').notNull(),
    employeeSr: text('employee_sr').notNull(),
    employeeRu: text('employee_ru').notNull(),
    promptRu: text('prompt_ru').notNull(),
    position: integer('position').notNull(),
  },
  (t) => [unique('quest_scenes_text_scene').on(t.textId, t.sceneId)],
);

export const questChoices = pgTable(
  'quest_choices',
  {
    id: serial('id').primaryKey(),
    sceneRowId: integer('scene_row_id')
      .notNull()
      .references(() => questScenes.id, { onDelete: 'cascade' }),
    choiceId: text('choice_id').notNull(),
    textSr: text('text_sr').notNull(),
    textRu: text('text_ru').notNull(),
    // 'best' | 'acceptable' | 'poor'
    quality: text('quality').notNull(),
    feedbackSr: text('feedback_sr').notNull(),
    feedbackRu: text('feedback_ru').notNull(),
    // References a sceneId or endingId within the same quest.
    nextSceneId: text('next_scene_id').notNull(),
    position: integer('position').notNull(),
  },
  (t) => [unique('quest_choices_scene_choice').on(t.sceneRowId, t.choiceId)],
);

export const questEndings = pgTable(
  'quest_endings',
  {
    id: serial('id').primaryKey(),
    textId: integer('text_id')
      .notNull()
      .references(() => texts.id, { onDelete: 'cascade' }),
    endingId: text('ending_id').notNull(),
    // 'success' | 'partial'
    type: text('type').notNull(),
    titleSr: text('title_sr').notNull(),
    titleRu: text('title_ru').notNull(),
    textSr: text('text_sr').notNull(),
    textRu: text('text_ru').notNull(),
    position: integer('position').notNull(),
  },
  (t) => [unique('quest_endings_text_ending').on(t.textId, t.endingId)],
);

export const questVocabulary = pgTable(
  'quest_vocabulary',
  {
    id: serial('id').primaryKey(),
    textId: integer('text_id')
      .notNull()
      .references(() => texts.id, { onDelete: 'cascade' }),
    sr: text('sr').notNull(),
    ru: text('ru').notNull(),
    exampleSr: text('example_sr').notNull(),
    exampleRu: text('example_ru').notNull(),
    position: integer('position').notNull(),
  },
  (t) => [unique('quest_vocabulary_text_position').on(t.textId, t.position)],
);

export type Text = typeof texts.$inferSelect;
export type NewText = typeof texts.$inferInsert;
export type Paragraph = typeof paragraphs.$inferSelect;
export type NewParagraph = typeof paragraphs.$inferInsert;
export type Quest = typeof quests.$inferSelect;
export type QuestSceneRow = typeof questScenes.$inferSelect;
export type QuestChoiceRow = typeof questChoices.$inferSelect;
export type QuestEndingRow = typeof questEndings.$inferSelect;
export type QuestVocabularyRow = typeof questVocabulary.$inferSelect;
