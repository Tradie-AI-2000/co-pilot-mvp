import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import * as schema from '@/lib/db/schema';

// Clients
export type Client = InferSelectModel<typeof schema.clients>;
export type NewClient = InferInsertModel<typeof schema.clients>;

// Projects
export type Project = InferSelectModel<typeof schema.projects>;
export type NewProject = InferInsertModel<typeof schema.projects>;

// Candidates
export type Candidate = InferSelectModel<typeof schema.candidates>;
export type NewCandidate = InferInsertModel<typeof schema.candidates>;

// Crew Templates
export type CrewTemplate = InferSelectModel<typeof schema.crewTemplates>;
export type NewCrewTemplate = InferInsertModel<typeof schema.crewTemplates>;
export type CrewTemplateMember = InferSelectModel<typeof schema.crewTemplateMembers>;
export type NewCrewTemplateMember = InferInsertModel<typeof schema.crewTemplateMembers>;

// Placements
export type PlacementGroup = InferSelectModel<typeof schema.placementGroups>;
export type NewPlacementGroup = InferInsertModel<typeof schema.placementGroups>;
export type Placement = InferSelectModel<typeof schema.placements>;
export type NewPlacement = InferInsertModel<typeof schema.placements>;
