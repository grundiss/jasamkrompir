CREATE TABLE "paragraphs" (
	"id" serial PRIMARY KEY NOT NULL,
	"text_id" integer NOT NULL,
	"position" integer NOT NULL,
	"sr" text NOT NULL,
	"ru" text NOT NULL,
	CONSTRAINT "paragraphs_text_position" UNIQUE("text_id","position")
);
--> statement-breakpoint
CREATE TABLE "texts" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title_sr" text NOT NULL,
	"title_ru" text NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "texts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
DROP TABLE "greetings" CASCADE;--> statement-breakpoint
ALTER TABLE "paragraphs" ADD CONSTRAINT "paragraphs_text_id_texts_id_fk" FOREIGN KEY ("text_id") REFERENCES "public"."texts"("id") ON DELETE cascade ON UPDATE no action;