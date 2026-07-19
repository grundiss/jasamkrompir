ALTER TABLE "texts" ADD COLUMN "audio_url" text;--> statement-breakpoint
-- Backfill: the seed is insert-only (skips existing slugs), so databases that
-- already shipped this text before it had audio (e.g. an installed desktop DB
-- receiving this as a content update) won't get the track from the seed. Attach
-- it here. Forward-only and safe: touches only the one row, only while empty.
UPDATE "texts" SET "audio_url" = '/audio/ja-se-zovem-ivan.mp3' WHERE "slug" = 'ja-se-zovem-ivan' AND "audio_url" IS NULL;