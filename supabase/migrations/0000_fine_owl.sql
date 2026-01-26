CREATE TYPE "public"."candidate_status" AS ENUM('available', 'on_job', 'placed', 'unavailable', 'Floated');--> statement-breakpoint
CREATE TYPE "public"."nudge_priority" AS ENUM('CRITICAL', 'HIGH', 'MEDIUM', 'LOW');--> statement-breakpoint
CREATE TYPE "public"."nudge_type" AS ENUM('PRE_EMPTIVE_STRIKE', 'CHURN_INTERCEPTOR', 'ZOMBIE_HUNTER', 'CLIENT_STALKER', 'RAINMAKER');--> statement-breakpoint
CREATE TYPE "public"."placement_status" AS ENUM('draft', 'active', 'completed', 'cancelled', 'Unconfirmed');--> statement-breakpoint
CREATE TYPE "public"."project_stage" AS ENUM('Won', 'Tender', 'Pipeline', 'Construction', 'Underway', 'Planning', 'Civil', 'Structure', 'Fitout', 'Concept', 'Foundations', 'Signal');--> statement-breakpoint
CREATE TYPE "public"."project_status" AS ENUM('Active', 'Planning', 'Tender', 'At Risk', 'Lead', 'Construction');--> statement-breakpoint
CREATE TYPE "public"."tier" AS ENUM('1', '2', '3');--> statement-breakpoint
CREATE TABLE "call_scripts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"target_id" uuid NOT NULL,
	"target_type" text NOT NULL,
	"tone" text DEFAULT 'Consultative',
	"script_content" text NOT NULL,
	"generated_by" text DEFAULT 'agent_rainmaker',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "candidates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"mobile" text,
	"suburb" text,
	"state" text,
	"postcode" text,
	"country" text,
	"lat" double precision,
	"lng" double precision,
	"status" "candidate_status" DEFAULT 'available',
	"role" text,
	"trade" text,
	"pay_rate" integer,
	"charge_out_rate" text,
	"guaranteed_hours" integer,
	"residency" text,
	"visa_expiry" timestamp with time zone,
	"internal_rating" double precision,
	"start_date" timestamp with time zone,
	"finish_date" timestamp with time zone,
	"project_id" uuid,
	"compliance" jsonb,
	"recruiter" text,
	"candidate_manager" text,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "candidates_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "clients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"industry" text DEFAULT 'Construction',
	"status" text,
	"tier" "tier" DEFAULT '3',
	"region" text,
	"address" text,
	"website" text,
	"phone" text,
	"email" text,
	"active_jobs" integer DEFAULT 0,
	"last_contact" timestamp with time zone,
	"pipeline_stage" text,
	"contract_status" text,
	"financials" jsonb,
	"key_contacts" jsonb,
	"site_logistics" jsonb,
	"hiring_insights" jsonb,
	"action_alerts" jsonb,
	"network" jsonb,
	"account_manager" text,
	"notes" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "crew_template_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"template_id" uuid NOT NULL,
	"candidate_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "crew_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "internal_roster" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"role" text NOT NULL,
	"division" text,
	"email" text,
	"phone" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_name" text NOT NULL,
	"contact_name" text,
	"contact_role" text,
	"email" text,
	"phone" text,
	"source" text DEFAULT 'Manual',
	"status" text DEFAULT 'Cold',
	"estimated_value" text,
	"last_contacted" timestamp with time zone,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "market_tenders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"client" text,
	"location" text,
	"value" text,
	"closing_date" timestamp with time zone,
	"source_url" text,
	"is_pursuing" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "marketing_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" text,
	"direction" text,
	"topic" text,
	"content" text NOT NULL,
	"media_urls" jsonb DEFAULT '[]'::jsonb,
	"related_tender_id" uuid,
	"related_project_id" uuid,
	"status" text DEFAULT 'Draft',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "nudges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "nudge_type" NOT NULL,
	"priority" "nudge_priority" NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"action_payload" jsonb NOT NULL,
	"consultant_id" uuid,
	"related_project_id" uuid,
	"related_client_id" uuid,
	"related_candidate_id" uuid,
	"is_seen" boolean DEFAULT false,
	"is_actioned" boolean DEFAULT false,
	"snoozed_until" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "placement_groups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"name" text NOT NULL,
	"start_date" timestamp with time zone,
	"status" "placement_status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "placements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"group_id" uuid NOT NULL,
	"candidate_id" uuid NOT NULL,
	"status" "placement_status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"client_id" uuid,
	"location" text,
	"lat" double precision,
	"lng" double precision,
	"value" text,
	"stage" "project_stage",
	"status" "project_status",
	"start_date" timestamp with time zone,
	"completion_date" timestamp with time zone,
	"phases" jsonb,
	"description" text,
	"asset_owner" text,
	"address" text,
	"type" text,
	"funding" text,
	"site_presence" integer DEFAULT 0,
	"project_director" text,
	"senior_qs" text,
	"site_manager" text,
	"site_manager_phone" text,
	"safety_officer" text,
	"incumbent_agency" text,
	"parking" text,
	"public_transport" text,
	"ppe" jsonb,
	"induction" text,
	"gate_code" text,
	"labour_prediction" jsonb,
	"packages" jsonb,
	"phase_settings" jsonb,
	"client_demands" jsonb,
	"assigned_company_ids" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "search_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"consultant_id" uuid NOT NULL,
	"location" text,
	"lat" double precision,
	"lng" double precision,
	"filters" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stakeholders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid,
	"client_id" uuid,
	"name" text NOT NULL,
	"role" text,
	"phone" text,
	"email" text,
	"is_internal" boolean DEFAULT false,
	"internal_user_id" uuid,
	"is_primary" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "candidates" ADD CONSTRAINT "candidates_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "crew_template_members" ADD CONSTRAINT "crew_template_members_template_id_crew_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."crew_templates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "crew_template_members" ADD CONSTRAINT "crew_template_members_candidate_id_candidates_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "marketing_assets" ADD CONSTRAINT "marketing_assets_related_project_id_projects_id_fk" FOREIGN KEY ("related_project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nudges" ADD CONSTRAINT "nudges_consultant_id_users_id_fk" FOREIGN KEY ("consultant_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nudges" ADD CONSTRAINT "nudges_related_project_id_projects_id_fk" FOREIGN KEY ("related_project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nudges" ADD CONSTRAINT "nudges_related_client_id_clients_id_fk" FOREIGN KEY ("related_client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nudges" ADD CONSTRAINT "nudges_related_candidate_id_candidates_id_fk" FOREIGN KEY ("related_candidate_id") REFERENCES "public"."candidates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "placement_groups" ADD CONSTRAINT "placement_groups_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "placements" ADD CONSTRAINT "placements_group_id_placement_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."placement_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "placements" ADD CONSTRAINT "placements_candidate_id_candidates_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "search_logs" ADD CONSTRAINT "search_logs_consultant_id_users_id_fk" FOREIGN KEY ("consultant_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stakeholders" ADD CONSTRAINT "stakeholders_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stakeholders" ADD CONSTRAINT "stakeholders_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stakeholders" ADD CONSTRAINT "stakeholders_internal_user_id_internal_roster_id_fk" FOREIGN KEY ("internal_user_id") REFERENCES "public"."internal_roster"("id") ON DELETE no action ON UPDATE no action;