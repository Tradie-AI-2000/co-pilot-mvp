import { pgTable, uuid, text, timestamp, date, pgEnum, integer, doublePrecision, jsonb, boolean, decimal } from 'drizzle-orm/pg-core';

// Enums
export const placementStatusEnum = pgEnum('placement_status', ['draft', 'active', 'completed', 'cancelled', 'Unconfirmed']);
export const candidateStatusEnum = pgEnum('candidate_status', ['available', 'on_job', 'placed', 'unavailable', 'Floated']);
export const projectStageEnum = pgEnum('project_stage', ['Won', 'Tender', 'Pipeline', 'Construction', 'Underway', 'Planning', 'Civil', 'Structure', 'Fitout', 'Concept', 'Foundations', 'Signal']);
export const projectStatusEnum = pgEnum('project_status', ['Active', 'Planning', 'Tender', 'At Risk', 'Lead', 'Construction']);
export const tierEnum = pgEnum('tier', ['1', '2', '3']);
export const nudgeTypeEnum = pgEnum('nudge_type', [
    'PRE_EMPTIVE_STRIKE', 'CHURN_INTERCEPTOR', 'ZOMBIE_HUNTER', 'CLIENT_STALKER', 'RAINMAKER', 'TASK', 'COMPLIANCE_RISK'
]);
export const nudgePriorityEnum = pgEnum('nudge_priority', ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']);

// --- CORE TABLES ---

export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const internalRoster = pgTable('internal_roster', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    role: text('role').notNull(),
    division: text('division'),
    email: text('email'),
    phone: text('phone'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// --- NEW: Financial Benchmarks (The Accountant's Rules) ---
export const financialBenchmarks = pgTable('financial_benchmarks', {
    id: uuid('id').primaryKey().defaultRandom(),
    burdenMultiplier: decimal('burden_multiplier').default('1.30'),
    minWeeklyGp: integer('min_weekly_gp').default(400),
    targetMarginPct: decimal('target_margin_pct').default('0.18'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const clients = pgTable('clients', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    industry: text('industry'),
    status: text('status'),
    tier: tierEnum('tier').default('3'),
    region: text('region'),
    address: text('address'),
    website: text('website'),
    phone: text('phone'),
    email: text('email'),
    activeJobs: integer('active_jobs').default(0),
    lastContact: timestamp('last_contact', { withTimezone: true }),
    pipelineStage: text('pipeline_stage'),
    contractStatus: text('contract_status'),
    financials: jsonb('financials'),
    keyContacts: jsonb('key_contacts'),
    siteLogistics: jsonb('site_logistics'),
    hiringInsights: jsonb('hiring_insights'),
    actionAlerts: jsonb('action_alerts'),
    network: jsonb('network'),
    accountManager: text('account_manager'),
    clientOwner: text('client_owner'),
    notes: jsonb('notes'),
    tasks: jsonb('tasks'),
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
    description: text('description'),
    assetOwner: text('asset_owner'),
    address: text('address'),
    type: text('type'),
    funding: text('funding'),
    sitePresence: integer('site_presence').default(0),
    projectDirector: text('project_director'),
    seniorQS: text('senior_qs'),
    siteManager: text('site_manager'),
    siteManagerPhone: text('site_manager_phone'),
    safetyOfficer: text('safety_officer'),
    incumbentAgency: text('incumbent_agency'),
    parking: text('parking'),
    publicTransport: text('public_transport'),
    ppe: jsonb('ppe').$type<string[]>(),
    induction: text('induction'),
    gateCode: text('gate_code'),
    labourPrediction: jsonb('labour_prediction'),
    packages: jsonb('packages'),
    phaseSettings: jsonb('phase_settings'),
    clientDemands: jsonb('client_demands'),
    assignedCompanyIds: jsonb('assigned_company_ids').$type<string[]>(),
    ssaStatus: text('ssa_status').default('Pending'),
    ssaType: text('ssa_type'),
    ssaExpiry: timestamp('ssa_expiry', { withTimezone: true }),
    siteHazards: text('site_hazards'),
    systemReviewDate: timestamp('system_review_date', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const stakeholders = pgTable('stakeholders', {
    id: uuid('id').primaryKey().defaultRandom(),
    projectId: uuid('project_id').references(() => projects.id, { onDelete: 'cascade' }),
    clientId: uuid('client_id').references(() => clients.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    role: text('role'),
    phone: text('phone'),
    email: text('email'),
    isInternal: boolean('is_internal').default(false),
    internalUserId: uuid('internal_user_id').references(() => internalRoster.id),
    isPrimary: boolean('is_primary').default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const candidates = pgTable('candidates', {
    id: uuid('id').primaryKey().defaultRandom(),
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    email: text('email').unique(),
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
    trade: text('trade'),
    // --- NEW: Seniority Level (Junior, Senior, Leading Hand) ---
    seniorityLevel: text('seniority_level'),
    payRate: integer('pay_rate'),
    chargeOutRate: text('charge_out_rate'),
    guaranteedHours: integer('guaranteed_hours'),
    residency: text('residency'),
    visaExpiry: timestamp('visa_expiry', { withTimezone: true }),
    internalRating: doublePrecision('internal_rating'),
    startDate: timestamp('start_date', { withTimezone: true }),
    finishDate: timestamp('finish_date', { withTimezone: true }),
    projectId: uuid('project_id').references(() => projects.id),
    compliance: jsonb('compliance'),
    recruiter: text('recruiter'),
    cvUrl: text('cv_url'),
    candidateManager: text('candidate_manager'),
    currentEmployer: text('current_employer'),
    currentProject: text('current_project'),
    siteAddress: text('site_address'),
    workSafeExpiry: timestamp('work_safe_expiry', { withTimezone: true }),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// --- NEW: Compliance Exceptions (The Sin Bin) ---
export const complianceExceptions = pgTable('compliance_exceptions', {
    id: uuid('id').primaryKey().defaultRandom(),
    candidateId: uuid('candidate_id').references(() => candidates.id),
    projectId: uuid('project_id').references(() => projects.id),
    authorizedBy: uuid('authorized_by').references(() => users.id),
    reason: text('reason').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

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
    // --- NEW: Paying Entity (Employer Lock) ---
    payingEntity: text('paying_entity'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const nudges = pgTable('nudges', {
    id: uuid('id').primaryKey().defaultRandom(),
    type: nudgeTypeEnum('type').notNull(),
    priority: nudgePriorityEnum('priority').notNull(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    actionPayload: jsonb('action_payload').notNull(),
    consultantId: uuid('consultant_id').references(() => users.id),
    relatedProjectId: uuid('related_project_id').references(() => projects.id),
    relatedClientId: uuid('related_client_id').references(() => clients.id),
    relatedCandidateId: uuid('related_candidate_id').references(() => candidates.id),
    isSeen: boolean('is_seen').default(false),
    isActioned: boolean('is_actioned').default(false),
    snoozedUntil: timestamp('snoozed_until', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const searchLogs = pgTable('search_logs', {
    id: uuid('id').primaryKey().defaultRandom(),
    consultantId: uuid('consultant_id').references(() => users.id).notNull(),
    location: text('location'),
    lat: doublePrecision('lat'),
    lng: doublePrecision('lng'),
    filters: jsonb('filters'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const leads = pgTable('leads', {
    id: uuid('id').primaryKey().defaultRandom(),
    companyName: text('company_name').notNull(),
    contactName: text('contact_name'),
    contactRole: text('contact_role'),
    email: text('email'),
    phone: text('phone'),
    source: text('source').default('Manual'),
    status: text('status').default('Cold'),
    estimatedValue: text('estimated_value'),
    lastContacted: timestamp('last_contacted', { withTimezone: true }),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// --- NEW: Market Intelligence (Sales Lead) ---
export const marketTenders = pgTable('market_tenders', {
    id: uuid('id').primaryKey().defaultRandom(),
    title: text('title').notNull(),
    description: text('description'),
    client: text('client'),
    location: text('location'),
    region: text('region'), // Auckland, Northland, Waikato, Bay of Plenty
    sector: text('sector'), // Commercial, Industrial, Residential, etc.
    mainContractor: text('main_contractor'), // Hawkins, Naylor Love, etc.
    status: text('status').default('New'), // New, Qualified, Contacted, Tender, Won, Lost
    value: text('value'), // Display string (e.g. "$50m")
    projectValueRaw: decimal('project_value_raw'), // Numeric for analytics
    subcontractors: jsonb('subcontractors'),
    estimatedStartDate: timestamp('estimated_start_date', { withTimezone: true }),
    closingDate: timestamp('closing_date', { withTimezone: true }),
    sourceUrl: text('source_url'),
    isPursuing: boolean('is_pursuing').default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const marketTenderStakeholders = pgTable('market_tender_stakeholders', {
    id: uuid('id').primaryKey().defaultRandom(),
    tenderId: uuid('tender_id').references(() => marketTenders.id, { onDelete: 'cascade' }),
    name: text('name'),
    role: text('role'),
    email: text('email'),
    phone: text('phone'),
    contactInfo: text('contact_info'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const activityLogs = pgTable('activity_logs', {
    id: uuid('id').primaryKey().defaultRandom(),
    type: text('type').notNull(),
    title: text('title').notNull(),
    description: text('description'),
    meta_data: jsonb('meta_data'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const callScripts = pgTable('call_scripts', {
    id: uuid('id').primaryKey().defaultRandom(),
    targetId: uuid('target_id').notNull(),
    targetType: text('target_type').notNull(),
    tone: text('tone').default('Consultative'),
    scriptContent: text('script_content').notNull(),
    generatedBy: text('generated_by').default('agent_rainmaker'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
