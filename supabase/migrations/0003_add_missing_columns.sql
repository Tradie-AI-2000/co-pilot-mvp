-- Add missing columns to candidates table
ALTER TABLE "candidates" ADD COLUMN IF NOT EXISTS "cv_url" text;
ALTER TABLE "candidates" ADD COLUMN IF NOT EXISTS "current_employer" text;
ALTER TABLE "candidates" ADD COLUMN IF NOT EXISTS "current_project" text;
ALTER TABLE "candidates" ADD COLUMN IF NOT EXISTS "site_address" text;
ALTER TABLE "candidates" ADD COLUMN IF NOT EXISTS "work_safe_expiry" timestamp with time zone;

-- Add missing column to clients table
ALTER TABLE "clients" ADD COLUMN IF NOT EXISTS "client_owner" text;

-- Add missing column to projects table
ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "ssa_status" text DEFAULT 'Pending';
