ALTER TABLE "clients" ALTER COLUMN "last_contact" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "clients" ALTER COLUMN "last_contact" DROP NOT NULL;