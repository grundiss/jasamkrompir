CREATE TABLE "quest_choices" (
	"id" serial PRIMARY KEY NOT NULL,
	"scene_row_id" integer NOT NULL,
	"choice_id" text NOT NULL,
	"text_sr" text NOT NULL,
	"text_ru" text NOT NULL,
	"quality" text NOT NULL,
	"feedback_sr" text NOT NULL,
	"feedback_ru" text NOT NULL,
	"next_scene_id" text NOT NULL,
	"position" integer NOT NULL,
	CONSTRAINT "quest_choices_scene_choice" UNIQUE("scene_row_id","choice_id")
);
--> statement-breakpoint
CREATE TABLE "quest_endings" (
	"id" serial PRIMARY KEY NOT NULL,
	"text_id" integer NOT NULL,
	"ending_id" text NOT NULL,
	"type" text NOT NULL,
	"title_sr" text NOT NULL,
	"title_ru" text NOT NULL,
	"text_sr" text NOT NULL,
	"text_ru" text NOT NULL,
	"position" integer NOT NULL,
	CONSTRAINT "quest_endings_text_ending" UNIQUE("text_id","ending_id")
);
--> statement-breakpoint
CREATE TABLE "quest_scenes" (
	"id" serial PRIMARY KEY NOT NULL,
	"text_id" integer NOT NULL,
	"scene_id" text NOT NULL,
	"speaker" text NOT NULL,
	"phase_sr" text NOT NULL,
	"phase_ru" text NOT NULL,
	"employee_sr" text NOT NULL,
	"employee_ru" text NOT NULL,
	"prompt_ru" text NOT NULL,
	"position" integer NOT NULL,
	CONSTRAINT "quest_scenes_text_scene" UNIQUE("text_id","scene_id")
);
--> statement-breakpoint
CREATE TABLE "quest_vocabulary" (
	"id" serial PRIMARY KEY NOT NULL,
	"text_id" integer NOT NULL,
	"sr" text NOT NULL,
	"ru" text NOT NULL,
	"example_sr" text NOT NULL,
	"example_ru" text NOT NULL,
	"position" integer NOT NULL,
	CONSTRAINT "quest_vocabulary_text_position" UNIQUE("text_id","position")
);
--> statement-breakpoint
CREATE TABLE "quests" (
	"text_id" integer PRIMARY KEY NOT NULL,
	"description_sr" text NOT NULL,
	"description_ru" text NOT NULL,
	"intro_sr" text NOT NULL,
	"intro_ru" text NOT NULL,
	"objective_sr" text NOT NULL,
	"objective_ru" text NOT NULL,
	"start_scene_id" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "texts" ADD COLUMN "kind" text DEFAULT 'text' NOT NULL;--> statement-breakpoint
ALTER TABLE "quest_choices" ADD CONSTRAINT "quest_choices_scene_row_id_quest_scenes_id_fk" FOREIGN KEY ("scene_row_id") REFERENCES "public"."quest_scenes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_endings" ADD CONSTRAINT "quest_endings_text_id_texts_id_fk" FOREIGN KEY ("text_id") REFERENCES "public"."texts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_scenes" ADD CONSTRAINT "quest_scenes_text_id_texts_id_fk" FOREIGN KEY ("text_id") REFERENCES "public"."texts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_vocabulary" ADD CONSTRAINT "quest_vocabulary_text_id_texts_id_fk" FOREIGN KEY ("text_id") REFERENCES "public"."texts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quests" ADD CONSTRAINT "quests_text_id_texts_id_fk" FOREIGN KEY ("text_id") REFERENCES "public"."texts"("id") ON DELETE cascade ON UPDATE no action;