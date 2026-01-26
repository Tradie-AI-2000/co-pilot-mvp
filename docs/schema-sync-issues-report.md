# Schema Sync Issues Report
**Generated:** 2026-01-26  
**Status:** Critical - Multiple case mismatches and type inconsistencies detected

---

## 🚨 Critical Issues

### 1. Date vs Timestamp Type Mismatch

**Impact:** HIGH - Data insertion/query failures

| Field | Schema Definition | Database Reality | Fix Required |
|-------|------------------|------------------|--------------|
| `candidates.startDate` | `date('start_date')` | `timestamp with time zone` | Change schema to `timestamp` |
| `candidates.finishDate` | `date('finish_date')` | `timestamp with time zone` | Change schema to `timestamp` |
| `candidates.visaExpiry` | `date('visa_expiry')` | `timestamp with time zone` | Change schema to `timestamp` |
| `projects.startDate` | `date('start_date')` | `timestamp with time zone` | Change schema to `timestamp` |
| `projects.completionDate` | `date('completion_date')` | `timestamp with time zone` | Change schema to `timestamp` |
| `clients.lastContact` | `date('last_contact')` | `timestamp with time zone` | Change schema to `timestamp` |
| `clients.createdAt` | `date('created_at')` | `timestamp with time zone` | Change schema to `timestamp` |
| `candidates.createdAt` | `date('created_at')` | `timestamp with time zone` | Change schema to `timestamp` |
| `projects.createdAt` | `date('created_at')` | `timestamp with time zone` | Change schema to `timestamp` |

---

### 2. Missing Fields in Schema

**Impact:** HIGH - Runtime errors when accessing undefined fields

| Field | Used In | Line | Status |
|-------|---------|------|--------|
| `candidates.workSafeExpiry` | `app/api/cron/generate-nudges/route.ts` | 76 | ❌ Not in schema |
| `projects.ssaStatus` | `app/api/cron/generate-nudges/route.ts` | 99 | ❌ Not in schema |
| `candidates.currentProject` | `app/api/cron/generate-nudges/route.ts` | 42 | ❌ Not in schema |
| `candidates.siteAddress` | `app/api/cron/generate-nudges/route.ts` | 43 | ❌ Not in schema |

**Recommendation:** Either add these fields to schema OR remove references from code.

---

### 3. Missing Fields in Database Migration

**Impact:** MEDIUM - Fields defined but not persisted

| Field | Schema Line | Migration Status |
|-------|-------------|------------------|
| `candidates.cvUrl` → `cv_url` | 144 | ❌ Missing from migration |
| `clients.clientOwner` → `client_owner` | 59 | ❌ Missing from migration |

**Action:** Generate new migration to add these columns.

---

### 4. CamelCase/Snake_Case Mapping

**Impact:** LOW - Currently handled by enrichment functions, but adds complexity

Your `data-context.js` handles this with enrichment functions:

```javascript
// ✅ GOOD - Handles both cases
firstName: candidate.firstName || candidate.first_name || ""
projectDirector: project.projectDirector || project.project_director || ""
```

**However**, there are duplicate assignments in `enrichCandidateData`:

```javascript
// Line 35-36
firstName: candidate.firstName || candidate.first_name || "",
lastName: candidate.lastName || candidate.last_name || "",
// Line 40-42 - DUPLICATE ASSIGNMENT
firstName: fName,
lastName: lName,
```

---

## 🔧 Immediate Action Items

### Priority 1: Fix Date/Timestamp Mismatch

**File:** `lib/db/schema.ts`

Replace all `date()` with `timestamp()` for these fields:
- All `*_date` fields in `candidates`, `projects`, `clients`
- All `created_at` fields

### Priority 2: Add Missing Fields to Schema

Add to `candidates` table:
```typescript
workSafeExpiry: timestamp('work_safe_expiry', { withTimezone: true }),
currentProject: text('current_project'),
siteAddress: text('site_address'),
```

Add to `projects` table:
```typescript
ssaStatus: text('ssa_status').default('Pending'),
```

### Priority 3: Generate Migration for Missing Columns

Run:
```bash
npx drizzle-kit generate:pg
```

Then apply:
```bash
npx drizzle-kit push:pg
```

### Priority 4: Clean Up Data Context

Remove duplicate assignments in `enrichCandidateData` (lines 40-42).

---

## 📊 Full Field Mapping Reference

### Candidates Table

| TypeScript (Code) | Database Column | Type Match | Notes |
|------------------|-----------------|------------|-------|
| `firstName` | `first_name` | ✅ | Mapped correctly |
| `lastName` | `last_name` | ✅ | Mapped correctly |
| `payRate` | `pay_rate` | ✅ | Mapped correctly |
| `chargeOutRate` | `charge_out_rate` | ✅ | Mapped correctly |
| `guaranteedHours` | `guaranteed_hours` | ✅ | Mapped correctly |
| `visaExpiry` | `visa_expiry` | ⚠️ | Type mismatch (date vs timestamp) |
| `internalRating` | `internal_rating` | ✅ | Mapped correctly |
| `startDate` | `start_date` | ⚠️ | Type mismatch (date vs timestamp) |
| `finishDate` | `finish_date` | ⚠️ | Type mismatch (date vs timestamp) |
| `projectId` | `project_id` | ✅ | Mapped correctly |
| `cvUrl` | `cv_url` | ❌ | Missing from migration |
| `candidateManager` | `candidate_manager` | ✅ | Mapped correctly |
| `currentEmployer` | `current_employer` | ✅ | Mapped correctly |
| `createdAt` | `created_at` | ⚠️ | Type mismatch (date vs timestamp) |

### Projects Table

| TypeScript (Code) | Database Column | Type Match | Notes |
|------------------|-----------------|------------|-------|
| `clientId` | `client_id` | ✅ | Mapped correctly |
| `startDate` | `start_date` | ⚠️ | Type mismatch (date vs timestamp) |
| `completionDate` | `completion_date` | ⚠️ | Type mismatch (date vs timestamp) |
| `assetOwner` | `asset_owner` | ✅ | Mapped correctly |
| `sitePresence` | `site_presence` | ✅ | Mapped correctly |
| `projectDirector` | `project_director` | ✅ | Mapped correctly |
| `seniorQS` | `senior_qs` | ✅ | Mapped correctly |
| `siteManager` | `site_manager` | ✅ | Mapped correctly |
| `siteManagerPhone` | `site_manager_phone` | ✅ | Mapped correctly |
| `safetyOfficer` | `safety_officer` | ✅ | Mapped correctly |
| `incumbentAgency` | `incumbent_agency` | ✅ | Mapped correctly |
| `publicTransport` | `public_transport` | ✅ | Mapped correctly |
| `gateCode` | `gate_code` | ✅ | Mapped correctly |
| `labourPrediction` | `labour_prediction` | ✅ | Mapped correctly |
| `phaseSettings` | `phase_settings` | ✅ | Mapped correctly |
| `clientDemands` | `client_demands` | ✅ | Mapped correctly |
| `assignedCompanyIds` | `assigned_company_ids` | ✅ | Mapped correctly |
| `createdAt` | `created_at` | ⚠️ | Type mismatch (date vs timestamp) |

### Clients Table

| TypeScript (Code) | Database Column | Type Match | Notes |
|------------------|-----------------|------------|-------|
| `activeJobs` | `active_jobs` | ✅ | Mapped correctly |
| `lastContact` | `last_contact` | ⚠️ | Type mismatch (date vs timestamp) |
| `pipelineStage` | `pipeline_stage` | ✅ | Mapped correctly |
| `contractStatus` | `contract_status` | ✅ | Mapped correctly |
| `keyContacts` | `key_contacts` | ✅ | Mapped correctly |
| `siteLogistics` | `site_logistics` | ✅ | Mapped correctly |
| `hiringInsights` | `hiring_insights` | ✅ | Mapped correctly |
| `actionAlerts` | `action_alerts` | ✅ | Mapped correctly |
| `accountManager` | `account_manager` | ✅ | Mapped correctly |
| `clientOwner` | `client_owner` | ❌ | Missing from migration |
| `createdAt` | `created_at` | ⚠️ | Type mismatch (date vs timestamp) |

---

## ✅ Next Steps

1. **Review this report** with your team
2. **Backup your database** before making schema changes
3. **Update `lib/db/schema.ts`** to fix date/timestamp types
4. **Add missing fields** to schema
5. **Generate and apply migration**
6. **Test thoroughly** in development environment
7. **Deploy to production** after validation

---

**Report End**
