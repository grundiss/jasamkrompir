import type { TextDetail, TextListResponse } from '@jasamkrompir/shared';
import { asc, eq } from 'drizzle-orm';
import type { FastifyInstance } from 'fastify';
import { ensureSeeded } from '../content/seed.js';
import { paragraphs, texts } from '../db/schema.js';

// Content API for the bilingual Serbian reader.
//   GET /api/texts       → the list of texts (titles only)
//   GET /api/texts/:id   → one text with its aligned paragraphs
// The seed content is ensured on list, so a fresh database serves real content
// on first load without a separate seeding step.
export async function textsRoutes(app: FastifyInstance): Promise<void> {
  app.get('/api/texts', async (): Promise<TextListResponse> => {
    await ensureSeeded(app.db);

    const rows = await app.db
      .select({
        id: texts.id,
        slug: texts.slug,
        titleSr: texts.titleSr,
        titleRu: texts.titleRu,
      })
      .from(texts)
      .orderBy(asc(texts.position), asc(texts.id));

    return { texts: rows };
  });

  app.get<{ Params: { id: string } }>('/api/texts/:id', async (request, reply) => {
    const id = Number(request.params.id);
    if (!Number.isInteger(id)) {
      reply.code(400);
      return { error: 'BadRequest', message: 'Invalid text id' };
    }

    const [text] = await app.db.select().from(texts).where(eq(texts.id, id)).limit(1);
    if (!text) {
      reply.code(404);
      return { error: 'NotFound', message: 'Text not found' };
    }

    const rows = await app.db
      .select({ sr: paragraphs.sr, ru: paragraphs.ru })
      .from(paragraphs)
      .where(eq(paragraphs.textId, id))
      .orderBy(asc(paragraphs.position));

    const detail: TextDetail = {
      id: text.id,
      slug: text.slug,
      titleSr: text.titleSr,
      titleRu: text.titleRu,
      createdAt: text.createdAt.toISOString(),
      paragraphs: rows,
    };
    return detail;
  });
}
