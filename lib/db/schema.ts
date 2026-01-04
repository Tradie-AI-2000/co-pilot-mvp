import { pgTable, uuid, text, timestamp, pgEnum, integer, doublePrecision, jsonb } from 'drizzle-orm/pg-core';

// Enums
export const placementStatusEnum = pgEnum('placement_status', ['draft', 'active', 'completed', 'cancelled']);
export const candidateStatusEnum = pgEnum('candidate_status', ['available', 'on_job', 'placed', 'unavailable']);
export const projectStageEnum = pgEnum('project_stage', ['Won', 'Tender', 'Pipeline', 'Construction', 'Underway', 'Planning']);
export const projectStatusEnum = pgEnum('project_status', ['Active', 'Planning', 'Tender', 'At Risk']);
export const tierEnum = pgEnum('tier', ['1', '2', '3']);

// Existing Tables (defined for Foreign Key references)

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
