import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Placeholder content table. The real content model is not designed yet — this
// single trivial table keeps the whole data stack (Drizzle schema → generated
// migration → PGlite/Postgres → API) exercised at the "Hello World" stage.
// Replace it when the real content model exists.
export const greetings = pgTable('greetings', {
  id: serial('id').primaryKey(),
  text: text('text').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export type Greeting = typeof greetings.$inferSelect;
export type NewGreeting = typeof greetings.$inferInsert;
