import type { HelloResponse } from '@jasamkrompir/shared';
import { asc } from 'drizzle-orm';
import type { FastifyInstance } from 'fastify';
import { greetings } from '../db/schema.js';

// The Hello-World content endpoint. Reads the first `greetings` row, seeding it
// with "Hello World!" on first call, so the DB + migration path is exercised
// end-to-end even before any real content exists. Replace with real content
// routes later.
export async function helloRoutes(app: FastifyInstance): Promise<void> {
  app.get('/api/hello', async (): Promise<HelloResponse> => {
    const [existing] = await app.db.select().from(greetings).orderBy(asc(greetings.id)).limit(1);
    if (existing) return { message: existing.text };

    const [created] = await app.db.insert(greetings).values({ text: 'Hello World!' }).returning();
    return { message: created!.text };
  });
}
