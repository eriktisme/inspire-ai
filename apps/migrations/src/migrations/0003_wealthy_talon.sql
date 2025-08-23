ALTER TABLE "preferences" ADD COLUMN "goals" varchar(256)[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE "preferences" ADD COLUMN "themes" varchar(256)[] DEFAULT '{}' NOT NULL;