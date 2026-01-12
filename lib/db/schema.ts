import { pgTable, uuid, text, timestamp, pgEnum, integer, doublePrecision, jsonb, boolean } from 'drizzle-orm/pg-core';

// Enums
export const placementStatusEnum = pgEnum('placement_status', ['draft', 'active', 'completed', 'cancelled']);
export const candidateStatusEnum = pgEnum('candidate_status', ['available', 'on_job', 'placed', 'unavailable']);
export const projectStageEnum = pgEnum('project_stage', ['Won', 'Tender', 'Pipeline', 'Construction', 'Underway', 'Planning']);
export const projectStatusEnum = pgEnum('project_status', ['Active', 'Planning', 'Tender', 'At Risk']);
export const tierEnum = pgEnum('tier', ['1', '2', '3']);
export const nudgeTypeEnum = pgEnum('nudge_type', [
    'PRE_EMPTIVE_STRIKE', // New Project
    'CHURN_INTERCEPTOR',  // Retention Risk
    'ZOMBIE_HUNTER',      // Dormant Candidate
    'CLIENT_STALKER',     // CRM Decay
    'RAINMAKER'           // Weather Event
]);
export const nudgePriorityEnum = pgEnum('nudge_priority', ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']);

// Existing Tables (defined for Foreign Key references)

export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const clients = pgTable('clients', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    industry: text('industry').default('Construction'),
    status: text('status'), // Lead, Active, Dormant
    tier: tierEnum('tier').default('3'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const projects = pgTable('projects', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    clientId: uuid('client_id').references(() => clients.id),
    location: text('location'),
    lat: doublePrecision('lat'),
    lng: doublePrecision('lng'),
    value: text('value'),
    stage: projectStageEnum('stage'),
    status: projectStatusEnum('status'),
    startDate: timestamp('start_date', { withTimezone: true }),
    completionDate: timestamp('completion_date', { withTimezone: true }),
    phases: jsonb('phases').$type<any[]>(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const candidates = pgTable('candidates', {
    id: uuid('id').primaryKey().defaultRandom(),
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    email: text('email').notNull().unique(),
    phone: text('phone'),
    mobile: text('mobile'),
    suburb: text('suburb'),
    state: text('state'),
    postcode: text('postcode'),
    country: text('country'),
    lat: doublePrecision('lat'),
    lng: doublePrecision('lng'),
    status: candidateStatusEnum('status').default('available'),
    role: text('role'),
    chargeOutRate: text('charge_out_rate'),
    internalRating: doublePrecision('internal_rating'),
    finishDate: timestamp('finish_date', { withTimezone: true }),
    compliance: jsonb('compliance').$type<string[]>(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// New Epic 1 Tables

export const crewTemplates = pgTable('crew_templates', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    description: text('description'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const crewTemplateMembers = pgTable('crew_template_members', {
    id: uuid('id').primaryKey().defaultRandom(),
    templateId: uuid('template_id').references(() => crewTemplates.id, { onDelete: 'cascade' }).notNull(),
    candidateId: uuid('candidate_id').references(() => candidates.id, { onDelete: 'cascade' }).notNull(),
});

export const placementGroups = pgTable('placement_groups', {
    id: uuid('id').primaryKey().defaultRandom(),
    projectId: uuid('project_id').references(() => projects.id, { onDelete: 'cascade' }).notNull(),
    name: text('name').notNull(),
    startDate: timestamp('start_date', { withTimezone: true }),
    status: placementStatusEnum('status').default('draft').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const placements = pgTable('placements', {
    id: uuid('id').primaryKey().defaultRandom(),
    groupId: uuid('group_id').references(() => placementGroups.id, { onDelete: 'cascade' }).notNull(),
    candidateId: uuid('candidate_id').references(() => candidates.id, { onDelete: 'cascade' }).notNull(),
    status: placementStatusEnum('status').default('draft').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const nudges = pgTable('nudges', {
    id: uuid('id').primaryKey().defaultRandom(),
    type: nudgeTypeEnum('type').notNull(),
    priority: nudgePriorityEnum('priority').notNull(),

    // The "Why"
    title: text('title').notNull(),
    description: text('description').notNull(),

    // The "Action" Payload (JSON for flexibility)
    actionPayload: jsonb('action_payload').notNull(),

    // Ownership Logic
    consultantId: uuid('consultant_id').references(() => users.id), // NULL = Open Bounty

    // Links
    relatedProjectId: uuid('related_project_id').references(() => projects.id),
    relatedClientId: uuid('related_client_id').references(() => clients.id),
    relatedCandidateId: uuid('related_candidate_id').references(() => candidates.id),

    // State
    isSeen: boolean('is_seen').default(false),
    isActioned: boolean('is_actioned').default(false),
    snoozedUntil: timestamp('snoozed_until', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const searchLogs = pgTable('search_logs', {
    id: uuid('id').primaryKey().defaultRandom(),
    consultantId: uuid('consultant_id').references(() => users.id).notNull(),
    location: text('location'), // e.g., "Manukau"
    lat: doublePrecision('lat'),
    lng: doublePrecision('lng'),
    filters: jsonb('filters'), // Role, keywords, etc.
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// --- Growth Engine Tables (Wolf of Wall Street) ---

export const leadStatusEnum = pgEnum('lead_status', ['Cold', 'Warm', 'Hot', 'Converted', 'Dead']);
export const leadSourceEnum = pgEnum('lead_source', ['Manual', 'BCI_Central', 'Referral', 'LinkedIn', 'Event']);

export const leads = pgTable('leads', {
    id: uuid('id').primaryKey().defaultRandom(),
    companyName: text('company_name').notNull(),
    contactName: text('contact_name'),
    contactRole: text('contact_role'),
    email: text('email'),
    phone: text('phone'),
    source: leadSourceEnum('source').default('Manual'),
    status: leadStatusEnum('status').default('Cold'),
    estimatedValue: text('estimated_value'), // e.g. "$50k/yr"
    lastContacted: timestamp('last_contacted', { withTimezone: true }),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const marketTenders = pgTable('market_tenders', {
    id: uuid('id').primaryKey().defaultRandom(),
    title: text('title').notNull(),
    description: text('description'),
    client: text('client'), // The entity issuing the tender
    location: text('location'),
    value: text('value'),
    closingDate: timestamp('closing_date', { withTimezone: true }),
    sourceUrl: text('source_url'),
    isPursuing: boolean('is_pursuing').default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const callScripts = pgTable('call_scripts', {
    id: uuid('id').primaryKey().defaultRandom(),
    targetId: uuid('target_id').notNull(), // Can be Lead ID or Client ID
    targetType: text('target_type').notNull(), // 'LEAD' or 'CLIENT'
    tone: text('tone').default('Consultative'), // 'Aggressive', 'Consultative', 'Friendly'
    scriptContent: text('script_content').notNull(),
    generatedBy: text('generated_by').default('agent_rainmaker'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
