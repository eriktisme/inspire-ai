CREATE TYPE "public"."frequency_type" AS ENUM('daily', 'paused');--> statement-breakpoint
CREATE TABLE "preferences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"frequency" "frequency_type" DEFAULT 'daily',
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
