"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { candidates as initialCandidates } from '../services/mock-data.js';
import { enhancedClients as initialClients } from '../services/enhanced-mock-data.js';
import { enhancedProjects as initialProjects } from '../services/enhanced-mock-data.js';
import { PHASE_TEMPLATES, WORKFORCE_MATRIX, getProjectSize, MASTER_ROLES, RELATED_ROLES, PHASE_MAP } from '../services/construction-logic.js';

const DataContext = createContext();

export function DataProvider({ children }) {
    // Mock Data for Placements (for testing Flight Risk)
    const initialPlacementsData = [
        {
            id: 'pl-mock-1',
            candidateId: 2, // Peter Chen (from mock-data.js)
            projectId: 'P001', // SkyCity
            status: 'Deployed',
            floatedDate: '2025-11-01',
            weeklyCheckins: [
                { checkinDate: '2025-11-08', clientMood: 'up', candidateMood: 'neutral', notes: 'First week smooth' },
                { checkinDate: '2025-11-15', clientMood: 'neutral', candidateMood: 'down', notes: 'Candidate felt overworked' },
                { checkinDate: '2025-11-22', clientMood: 'neutral', candidateMood: 'down', notes: 'Still unhappy about hours' }, // Triggers Flight Risk
            ]
        },
        {
            id: 'pl-mock-2',
            candidateId: 1, // James Wilson
            projectId: 'P003', // City Rail Link (Downer)
            status: 'Deployed',
            floatedDate: '2025-12-01',
            weeklyCheckins: [
                { checkinDate: '2025-12-08', clientMood: 'up', candidateMood: 'up', notes: 'All good' },
            ]
        },
        {
            id: 'pl-mock-3', // STALLED DEAL
            candidateId: 3, // Luis Garcia (from mock-data.js)
            projectId: 'P005', // Sylvia Park (Naylor Love)
            status: 'Floated',
            floatedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
            weeklyCheckins: []
        },
        {
            id: 'pl-mock-4', // ACTIVE DEAL
            candidateId: 4, // Sam T (from mock-data.js)
            projectId: 'P006', // Datacom (Fletcher)
            status: 'Floated',
            floatedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
            weeklyCheckins: []
        },
        {
            id: 'pl-mock-5', // HISTORICAL
            candidateId: 11, // Alice History
            projectId: 'P001', // SkyCity (Fletcher)
            status: 'Completed',
            startDate: '2025-01-10',
            endDate: '2025-03-20',
            floatedDate: '2024-12-15',
            weeklyCheckins: []
        },
        {
            id: 'pl-mock-6', // PIPELINE
            candidateId: 12, // Bob Pipeline
            projectId: 'P006', // Datacom (Fletcher)
            status: 'Interviewing',
            floatedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            weeklyCheckins: []
        }
    ];

    // Initialize state with default mock data first (SSR safety), then hydrate
    const [candidates, setCandidates] = useState(initialCandidates);
    const [clients, setClients] = useState(initialClients);
    const [projects, setProjects] = useState(initialProjects);
    const [selectedProject, setSelectedProject] = useState(null);
    const [availableRoles, setAvailableRoles] = useState(MASTER_ROLES);
    const [placements, setPlacements] = useState(initialPlacementsData);
    const [isSyncing, setIsSyncing] = useState(false);
    const [activityLogs, setActivityLogs] = useState([]); // NEW: Store activity logs
    const [isHydrated, setIsHydrated] = useState(false); // NEW: Track hydration status

    // --- Cloud Sync Logic ---
    const sanitizeData = (data, prefix) => {
        if (!Array.isArray(data)) return [];
        return data.map((item, idx) => {
            if (!item.id || item.id === "") {
                return { ...item, id: `${prefix}-${Date.now()}-${idx}` };
            }
            return item;
        });
    };

    // --- Enrichment Logic (Flat Sheet -> Complex Object) ---

    // Helper for NZ Date Formats (DD/MM/YYYY)
    const parseFlexibleDate = (dateStr) => {
        if (!dateStr) return "";
        if (typeof dateStr === 'string') {
            // Handle DD-MM-YYYY or DD/MM/YYYY
            const match = dateStr.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
            if (match) {
                const [_, day, month, year] = match;
                // Pad with zeros if needed
                const fmtDay = day.padStart(2, '0');
                const fmtMonth = month.padStart(2, '0');
                return `${year}-${fmtMonth}-${fmtDay}`;
            }
        }
        const d = new Date(dateStr);
        return isNaN(d.getTime()) ? "" : d.toISOString().split('T')[0];
    };

    const enrichCandidateData = (candidate) => {
        // Clean Numerics
        const cleanNumber = (val) => {
            if (typeof val === 'number') return val;
            if (typeof val === 'string') return parseFloat(val.replace(/[^0-9.]/g, '')) || 0;
            return 0;
        };

        // --- HARD-WIRED MAPPING (Columns AA-AC, V, AW, P, R) ---
        // V: Role
        // AA: Pay Rate
        // AB: Charge Rate
        // AC: Guaranteed Hours
        // AW: startDate (Previously Finish Date)
        // P: Residency
        // R: Visa Expiry

        // Check Title Case (Sheet Standard) OR camelCase (Code Standard)
        const payRate = cleanNumber(candidate['Pay Rate'] || candidate.payRate);
        const chargeRate = cleanNumber(candidate['Charge Rate'] || candidate.chargeRate);
        const guaranteedHours = cleanNumber(candidate['Guaranteed Hours'] || candidate.guaranteedHours);

        const role = candidate['Role'] || candidate.role || "Candidate";
        const finishDate = parseFlexibleDate(candidate['Finish Date'] || candidate.finishDate);
        // Explicitly map the new 'startDate' column (Column AW)
        const startDate = parseFlexibleDate(candidate['startDate'] || candidate['Start Date'] || candidate.startDate);
        const residency = candidate['Residency'] || candidate.residency || "Unknown";
        const visaExpiry = parseFlexibleDate(candidate['Visa Expiry'] || candidate.visaExpiry);

        // --- MOBILITY LOGIC ---
        // If residency indicates Visa/Filipino, mark as Mobile Crew
        const isMobile = residency.toLowerCase().includes('work visa') ||
            residency.toLowerCase().includes('filipino') ||
            residency.toLowerCase().includes('mobile');

        // Normalize Country (keep existing logic but sync with new residency check)
        let country = candidate.country || candidate.Country || "NZ";
        if (residency.includes('Filipino')) country = "Philippines";

        return {
            ...candidate,
            role,
            chargeRate,
            payRate,
            guaranteedHours,
            finishDate,
            startDate, // Add mapped start date
            residency,
            visaExpiry,
            country,
            isMobile, // NEW: Mobility Flag
            // Keep other fields
            siteSafeExpiry: parseFlexibleDate(candidate['Site Safe Expiry'] || candidate.siteSafeExpiry),
            // startDate: parseFlexibleDate(candidate['Start Date'] || candidate.startDate) // Removed redundancy
        };
    };

    const enrichClientData = (client) => {
        // --- HARD-WIRED MAPPING (Columns D, F, W, X) ---
        // D: Tier
        // F: Last Contact
        // W: Location (Region)
        // X: Account Manager

        let region = client['Location'] || client.Location || client.region || "National"; // Column W
        let tier = client['Tier'] || client.tier || "3"; // Column D
        // Normalize: "Tier 1" -> "1", 1 -> "1", "1" -> "1"
        tier = String(tier).replace(/tier\s?/i, '').trim();

        // Safe Date Parsing
        let lastContact = parseFlexibleDate(client['Last Contact'] || client.lastContact); // Column F

        let accountManager = client['Account Manager'] || client.accountManager || "Unassigned"; // Column X

        // Basic fields
        let industry = client.industry || client.Industry || "Construction";

        // ... (Keep existing JSON parsing for complex fields if they exist in other columns) ...
        // Parse Project IDs (Handle JSON string or comma-separated)
        let projectIds = client.projectIds || client.ProjectIds || [];
        if (typeof projectIds === 'string') {
            try {
                if (projectIds.startsWith('[')) {
                    projectIds = JSON.parse(projectIds);
                } else {
                    projectIds = projectIds.split(',').map(id => id.trim()).filter(Boolean);
                }
            } catch (e) { projectIds = []; }
        }
        if (!Array.isArray(projectIds)) projectIds = [];

        // Parse Key Contacts
        let keyContacts = client.keyContacts || client.KeyContacts || [];
        if (typeof keyContacts === 'string') {
            try { if (keyContacts.trim().startsWith('[')) keyContacts = JSON.parse(keyContacts); else keyContacts = []; } catch (e) { keyContacts = []; }
        }
        if (!Array.isArray(keyContacts)) keyContacts = [];

        // Parse Site Logistics
        let siteLogistics = client.siteLogistics || client.SiteLogistics || {};
        if (typeof siteLogistics === 'string') {
            try { if (siteLogistics.trim().startsWith('{')) siteLogistics = JSON.parse(siteLogistics); else siteLogistics = {}; } catch (e) { siteLogistics = {}; }
        }

        // Parse Action Alerts
        let actionAlerts = client.actionAlerts || client.ActionAlerts || [];
        if (typeof actionAlerts === 'string') {
            try { if (actionAlerts.trim().startsWith('[')) actionAlerts = JSON.parse(actionAlerts); else actionAlerts = []; } catch (e) { actionAlerts = []; }
        }
        if (!Array.isArray(actionAlerts)) actionAlerts = [];

        // Parse Tasks
        let tasks = client.tasks || client.Tasks || [];
        if (typeof tasks === 'string') {
            try { if (tasks.trim().startsWith('[')) tasks = JSON.parse(tasks); else tasks = []; } catch (e) { tasks = []; }
        }
        if (!Array.isArray(tasks)) tasks = [];

        // Parse Notes
        let notes = client.notes || client.Notes || [];
        if (typeof notes === 'string') {
            try { if (notes.trim().startsWith('[')) notes = JSON.parse(notes); else if (notes.trim()) notes = [{ id: 'n1', text: notes, date: '', author: 'System' }]; else notes = []; } catch (e) { notes = []; }
        }
        if (!Array.isArray(notes)) notes = [];

        return {
            ...client,
            region, // Mapped from W
            tier,   // Mapped from D
            lastContact, // Mapped from F
            accountManager, // Mapped from X
            industry,
            projectIds,
            keyContacts,
            siteLogistics,
            actionAlerts,
            tasks,
            notes,
            // Header mappings for generic fields
            address: client.address || client['Head Office Address'] || "",
            phone: client.phone || client['Main Phone'] || "",
            email: client.email || client['Main Email'] || "",
            website: client.website || client.Website || ""
        };
    };

    const enrichProjectData = (project) => {
        // 1. Construct Phase Settings from Hard-Wired Columns (AF, AG, AH)
        let phaseSettings = project.phaseSettings || {};

        // Map: Civil (AF), Structure (AG), Fitout (AH)
        const civilStart = parseFlexibleDate(project['Civil Start'] || project.civilStart);
        const structureStart = parseFlexibleDate(project['Structure Start'] || project.structureStart);
        const fitoutStart = parseFlexibleDate(project['Fitout Start'] || project.fitoutStart);

        if (civilStart) phaseSettings['01_civil'] = { startDate: civilStart, offsetWeeks: 2, skipped: false };
        if (structureStart) phaseSettings['02a_concrete'] = { startDate: structureStart, offsetWeeks: 2, skipped: false };
        if (fitoutStart) phaseSettings['05a_linings_stopping'] = { startDate: fitoutStart, offsetWeeks: 2, skipped: false };

        // 2. Map Site Manager Phone
        const siteManagerPhone = project.siteManagerPhone || project['Site Manager Phone'] || project['Site Manager Mobile'] || "";

        // 3. Map Client Demands (Handle various column names)
        let clientDemands = project.clientDemands || project['Client Demands'] || [];
        if (typeof clientDemands === 'string') {
            try { clientDemands = JSON.parse(clientDemands); } catch (e) { clientDemands = []; }
        }

        // 4. Generate 'phases' array for UI
        let phases = [];
        let hiringSignals = [];
        let contactTriggers = [];

        if (Object.keys(phaseSettings).length > 0) {
            phases = Object.entries(phaseSettings)
                .filter(([_, settings]) => !settings.skipped)
                .map(([phaseId, settings]) => {
                    const phaseInfo = PHASE_MAP[phaseId];
                    if (!phaseInfo) return null;

                    let status = "Upcoming";
                    let progress = 0;

                    if (settings.startDate) {
                        const start = new Date(settings.startDate);
                        const end = new Date(start);
                        end.setDate(end.getDate() + 28);

                        const today = new Date();
                        if (today > end) { status = "Completed"; progress = 100; }
                        else if (today >= start) {
                            status = "In Progress";
                            progress = Math.min(100, Math.round(((today - start) / (end - start)) * 100));
                        }

                        const daysUntil = Math.ceil((start - today) / (1000 * 60 * 60 * 24));
                        const isApproaching = daysUntil > 0 && daysUntil <= (settings.offsetWeeks || 2) * 7;

                        if (isApproaching) {
                            contactTriggers.push({
                                id: `alert-${project.id}-${phaseId}`,
                                urgency: daysUntil <= 7 ? "Critical" : "High",
                                date: settings.startDate,
                                message: `Phase '${phaseInfo.label}' starts in ${daysUntil} days.`,
                                contact: settings.siteManager || project.siteManager || "Site Manager"
                            });
                        }
                    }

                    return { name: phaseInfo.label, id: phaseId, status, start: settings.startDate, progress };
                })
                .filter(Boolean)
                .sort((a, b) => a.id.localeCompare(b.id));
        }

        return {
            ...project,
            assignedCompanyIds: Array.isArray(project.assignedCompanyIds) ? project.assignedCompanyIds : [],
            phases,
            phaseSettings,
            clientDemands, // Explicitly mapped
            hiringSignals,
            subContractors: [],
            contactTriggers,
            siteManagerPhone,
            region: project.Region || project.Location || project.region // Ensure region is passed for Matchmaker
        };
    };

    // --- PLACEMENT SYNC GENERATOR (Fix for Missing Placements) ---
    const generateImplicitPlacements = (candidatesList, projectsList) => {
        const implicitPlacements = [];

        candidatesList.forEach(candidate => {
            // Check if candidate is Active/On Job and has a Project ID
            // Normalize status check (case insensitive)
            const status = candidate.status || '';
            const isActive = ['on job', 'deployed', 'placed', 'active'].includes(status.toLowerCase());

            if (isActive && candidate.projectId) {
                // Verify project exists
                const projectExists = projectsList.some(p => String(p.id) === String(candidate.projectId));

                if (projectExists) {
                    implicitPlacements.push({
                        id: `pl-implicit-${candidate.id}-${candidate.projectId}`,
                        candidateId: candidate.id,
                        projectId: candidate.projectId,
                        status: 'On Job', // Standardize status for the modal
                        floatedDate: candidate.startDate || new Date().toISOString(), // Fallback
                        startDate: candidate.startDate,
                        endDate: candidate.finishDate,
                        chargeRate: candidate.chargeRate,
                        payRate: candidate.payRate,
                        isImplicit: true // Flag to identify auto-generated records
                    });
                }
            }
        });
        return implicitPlacements;
    };

    const syncFromSheets = async () => {
        setIsSyncing(true);
        try {
            const [projRes, clientRes, candRes] = await Promise.all([
                fetch('/api/sync?tab=Projects').then(res => res.json()),
                fetch('/api/sync?tab=Clients').then(res => res.json()),
                fetch('/api/sync?tab=Candidates').then(res => res.json()),
            ]);

            // Track latest data for placement generation
            let currentProjects = projects;
            let currentCandidates = candidates;

            // Only update if we got valid arrays with content
            if (Array.isArray(projRes) && projRes.length > 0) {
                // Fetch local state directly to avoid stale closure issues during sync
                let localMap = {};
                try {
                    const localStr = localStorage.getItem('stellar_projects_v4');
                    if (localStr) {
                        const parsed = JSON.parse(localStr);
                        parsed.forEach(p => { localMap[p.id] = p; });
                    }
                } catch (e) { console.warn("Failed to read local projects for merge", e); }

                const processedProjects = sanitizeData(projRes, 'P').map(p => {
                    const rich = enrichProjectData(p);
                    // MERGE STRATEGY: Preserve clientDemands from local storage if missing in remote
                    // This handles cases where the backend/sheet lacks the column or failed to save
                    const localP = localMap[rich.id];
                    if (localP && localP.clientDemands && (!rich.clientDemands || rich.clientDemands.length === 0)) {
                        rich.clientDemands = localP.clientDemands;
                    }
                    return rich;
                });
                
                setProjects(processedProjects);
                currentProjects = processedProjects;
            }
            if (Array.isArray(clientRes) && clientRes.length > 0) {
                setClients(sanitizeData(clientRes, 'CL').map(c => enrichClientData(c)));
            }
            if (Array.isArray(candRes) && candRes.length > 0) {
                const syncedCandidates = sanitizeData(candRes, 'C').map(c => enrichCandidateData(c));
                // Merge Mock Candidates (ID 10, 11, 12) so they survive the sync
                const mockCandidates = initialCandidates.filter(mock => !syncedCandidates.some(synced => String(synced.id) === String(mock.id)));
                currentCandidates = [...syncedCandidates, ...mockCandidates];
                setCandidates(currentCandidates);
            }

            // RE-SYNC PLACEMENTS
            // 1. Keep existing "manual" placements (mocks or user-created that aren't implicit)
            // 2. Add new implicit placements from the fresh candidate data
            setPlacements(prevPlacements => {
                const manualPlacements = prevPlacements.filter(p => !p.isImplicit);
                const newImplicit = generateImplicitPlacements(currentCandidates, currentProjects);

                // Deduplicate: Don't add implicit if a manual placement already exists for this candidate+project
                const filteredImplicit = newImplicit.filter(imp =>
                    !manualPlacements.some(man =>
                        String(man.candidateId) === String(imp.candidateId) &&
                        String(man.projectId) === String(imp.projectId)
                    )
                );

                return [...manualPlacements, ...filteredImplicit];
            });

        } catch (error) {
            console.error('Failed to sync from Google Sheets:', error);
        } finally {
            setIsSyncing(false);
        }
    };

    const saveToSheets = async (tab, id, data) => {
        try {
            await fetch('/api/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tab, id, data })
            });
        } catch (error) {
            console.error(`Failed to save ${id} to ${tab}:`, error);
        }
    };

    // --- Persistence Logic ---
    useEffect(() => {
        // 1. Hydrate from localStorage first (for speed)
        const localCandidates = localStorage.getItem('stellar_candidates_v4');
        const localClients = localStorage.getItem('stellar_clients_v4');
        const localProjects = localStorage.getItem('stellar_projects_v4');
        const localRoles = localStorage.getItem('stellar_roles_v4');
        const localPlacements = localStorage.getItem('stellar_placements_v4');

        if (localCandidates) setCandidates(sanitizeData(JSON.parse(localCandidates), 'C'));
        if (localClients) setClients(sanitizeData(JSON.parse(localClients), 'CL').map(c => enrichClientData(c)));
        if (localProjects) setProjects(sanitizeData(JSON.parse(localProjects), 'P').map(p => enrichProjectData(p)));
        if (localRoles) setAvailableRoles(JSON.parse(localRoles));
        if (localPlacements) setPlacements(sanitizeData(JSON.parse(localPlacements), 'PL'));
        const localActivity = localStorage.getItem('stellar_activity_v4');
        if (localActivity) setActivityLogs(JSON.parse(localActivity));

        setIsHydrated(true); // Mark as hydrated

        // 2. Trigger Cloud Sync to get latest
        syncFromSheets();
    }, []);

    // Sync updates to localStorage
    useEffect(() => { localStorage.setItem('stellar_candidates_v4', JSON.stringify(candidates)); }, [candidates]);
    useEffect(() => { localStorage.setItem('stellar_clients_v4', JSON.stringify(clients)); }, [clients]);
    useEffect(() => { localStorage.setItem('stellar_projects_v4', JSON.stringify(projects)); }, [projects]);
    useEffect(() => { localStorage.setItem('stellar_roles_v4', JSON.stringify(availableRoles)); }, [availableRoles]);
    useEffect(() => { localStorage.setItem('stellar_placements_v4', JSON.stringify(placements)); }, [placements]);

    // Only save activityLogs if hydration is complete
    useEffect(() => {
        if (isHydrated) {
            localStorage.setItem('stellar_activity_v4', JSON.stringify(activityLogs));
        }
    }, [activityLogs, isHydrated]);

    // --- Unified Action Engine (formerly moneyMoves) ---
    const [moneyMoves, setMoneyMoves] = useState([]);
    const [serverNudges, setServerNudges] = useState([]);

    // Fetch Server Nudges on Mount
    useEffect(() => {
        fetch('/api/nudges')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    // Map to moneyMoves format
                    const mapped = data.map(n => ({
                        id: n.id,
                        type: n.type === 'PRE_EMPTIVE_STRIKE' ? 'lead' :
                            n.type === 'CHURN_INTERCEPTOR' ? 'risk' :
                                n.type === 'RAINMAKER' ? 'urgent' : 'task',
                        title: n.title,
                        description: n.description,
                        urgency: n.priority === 'CRITICAL' ? 'Critical' :
                            n.priority === 'HIGH' ? 'High' :
                                n.priority === 'MEDIUM' ? 'Medium' : 'Low',
                        date: 'ASAP',
                        rawDate: n.createdAt,
                        financialImpact: n.actionPayload?.impact || 800,
                        isServer: true // Flag to distinguish
                    }));
                    setServerNudges(mapped);
                }
            })
            .catch(err => console.error('Failed to fetch nudges:', err));
    }, []);

    useEffect(() => {
        const triggers = [];
        const today = new Date();
        const twoWeeksFromNow = new Date(today);
        twoWeeksFromNow.setDate(today.getDate() + 14);
        const fourWeeksFromNow = new Date(today);
        fourWeeksFromNow.setDate(today.getDate() + 28);

        // 1. Project Signals (Gaps & Phase Triggers & Buying Signals)
        projects.forEach(project => {
            // Aggregate Hiring Signals (Gaps) - Existing Logic
            if (project.hiringSignals) {
                project.hiringSignals.forEach(signal => {
                    const gap = signal.count;
                    if (gap <= 0) return;
                    const related = RELATED_ROLES[signal.role] || [];
                    const searchRoles = [signal.role, ...related];
                    const supply = candidates.filter(c => searchRoles.includes(c.role) && c.status === "Available").length;
                    let urgency = "Medium", title = `${gap}x ${signal.role} Required`, description = `Phase: ${signal.phase}`;
                    const isSoon = signal.date === "ASAP" || (signal.daysToStart && signal.daysToStart < 14);

                    if (isSoon) { urgency = "Critical"; title = `CRITICAL: ${gap}x ${signal.role} unassigned for ${project.name}`; }
                    else if (supply < gap) { urgency = "High"; title = `RISK: Need ${gap} ${signal.role}. Only ${supply} available!`; }
                    else { urgency = "Medium"; title = `MATCH: ${gap} ${signal.role} needed. ${supply} Available to deploy.`; }

                    // Impact: $800 margin per role required
                    const impact = gap * 800;

                    triggers.push({
                        id: `signal-${project.id}-${signal.role}`,
                        projectId: project.id,
                        projectName: project.name,
                        type: 'signal',
                        title,
                        description,
                        urgency,
                        date: signal.date || 'ASAP',
                        rawDate: project.startDate,
                        financialImpact: impact
                    });
                });
            }

            // NEW: Aggregate Hiring Signals from Packages
            if (project.packages) {
                Object.values(project.packages).forEach(pkg => {
                    if (pkg.laborRequirements) {
                        pkg.laborRequirements.forEach(req => {
                            const assignedCount = (req.assignedIds || []).length;
                            const gap = req.requiredCount - assignedCount;
                            if (gap > 0) {
                                const related = RELATED_ROLES[req.trade] || [];
                                const searchRoles = [req.trade, ...related];
                                const supply = candidates.filter(c => searchRoles.includes(c.role) && c.status === "Available").length;

                                let urgency = "Medium";
                                let title = `${gap}x ${req.trade} Required`;
                                const description = `Package: ${pkg.label}`;

                                // Simple urgency logic based on supply vs demand
                                if (supply < gap) {
                                    urgency = "High";
                                    title = `RISK: Need ${gap} ${req.trade}. Only ${supply} available!`;
                                } else {
                                    title = `MATCH: ${gap} ${req.trade} needed. ${supply} Available.`;
                                }

                                triggers.push({
                                    id: `pkg-gap-${project.id}-${req.id}`,
                                    projectId: project.id,
                                    projectName: project.name,
                                    type: 'signal', // Re-use 'signal' type for consistent icon
                                    title,
                                    description,
                                    urgency,
                                    date: "ASAP",
                                    rawDate: new Date().toISOString(),
                                    financialImpact: gap * 800
                                });
                            }
                        });
                    }
                });
            }
            // Aggregate Contact Triggers - Existing Logic
            if (project.contactTriggers) {
                project.contactTriggers.forEach(trigger => triggers.push({
                    ...trigger,
                    projectId: project.id,
                    projectName: project.name,
                    type: 'trigger',
                    financialImpact: 0 // Relationship calls don't have direct immediate margin impact
                }));
            }

            // Client "Buying Signals" - NEW LOGIC
            Object.entries(project.phaseSettings || {}).forEach(([phaseId, settings]) => {
                if (settings.startDate && !settings.skipped) {
                    const phaseStart = new Date(settings.startDate);
                    const diffDays = Math.ceil((phaseStart - today) / (1000 * 60 * 60 * 24));

                    // Generate Buying Signal if phase is 14-28 days out
                    if (diffDays >= 14 && diffDays <= 28) {
                        const phaseInfo = PHASE_MAP[phaseId];
                        if (phaseInfo) {
                            // Predict roles based on project size and WORKFORCE_MATRIX
                            const projectSize = getProjectSize(project.value);
                            const predictedRoles = WORKFORCE_MATRIX[phaseId];
                            let rolesNeeded = [];
                            let totalPotentialMargin = 0;
                            if (predictedRoles) {
                                for (const role in predictedRoles) {
                                    const countRange = predictedRoles[role][projectSize];
                                    if (countRange) {
                                        rolesNeeded.push(`${role} (${countRange})`);
                                        // Use average of range for impact
                                        const parts = countRange.split('-');
                                        const avgCount = parts.length > 1 ? (parseInt(parts[0]) + parseInt(parts[1])) / 2 : parseInt(parts[0]);
                                        totalPotentialMargin += avgCount * 800;
                                    }
                                }
                            }
                            const rolesText = rolesNeeded.length > 0 ? `Opportunity for: ${rolesNeeded.join(', ')}.` : '';

                            triggers.push({
                                id: `buying-signal-${project.id}-${phaseId}`,
                                projectId: project.id,
                                projectName: project.name,
                                type: 'buying_signal',
                                title: `Buying Signal: ${phaseInfo.label} Phase Approaching`,
                                description: `${project.name} enters '${phaseInfo.label}' in ${diffDays} days. ${rolesText}`,
                                urgency: "Upcoming",
                                date: settings.startDate,
                                rawDate: settings.startDate,
                                financialImpact: totalPotentialMargin
                            });
                        }
                    }
                }
            });
        });

        // 2. Client Actions (Tasks & Risks) - Existing Logic
        clients.forEach(client => {
            if (client.tasks) {
                client.tasks.forEach(task => {
                    if (!task.completed) {
                        const dueDate = new Date(task.dueDate);
                        const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
                        let urgency = diffDays <= 1 ? "Critical" : diffDays <= 3 ? "High" : "Medium";
                        triggers.push({
                            id: `task-${client.id}-${task.id}`,
                            clientId: client.id,
                            type: 'task',
                            title: `Task: ${client.name}`,
                            description: task.text,
                            urgency,
                            date: task.dueDate,
                            rawDate: task.dueDate,
                            financialImpact: 0
                        });
                    }
                });
            }
            if (client.lastContact && client.lastContact.match(/^\d{4}-\d{2}-\d{2}$/)) {
                const diffDays = Math.ceil((today - new Date(client.lastContact)) / (1000 * 60 * 60 * 24));
                if (diffDays > 30) {
                    triggers.push({
                        id: `ghost-${client.id}`,
                        clientId: client.id,
                        type: 'risk',
                        title: `Ghost Risk: ${client.name}`,
                        description: `No contact for ${diffDays} days. Call immediately.`,
                        urgency: "High",
                        date: "ASAP",
                        rawDate: today.toISOString(),
                        financialImpact: 0 // Risk of churn is hard to quantify without active placements
                    });
                }
            }
        });

        // 3. Candidate Actions (Compliance, Visa, Retention) - Existing Logic
        candidates.forEach(candidate => {
            // Helper to get candidate margin
            const getMargin = (c) => {
                const margin = (c.chargeRate || 50) - (c.payRate || 30);
                return margin * 40;
            };

            if (candidate.siteSafeExpiry) {
                const diffDays = Math.ceil((new Date(candidate.siteSafeExpiry) - today) / (1000 * 60 * 60 * 24));
                if (diffDays <= 14) {
                    let urgency = diffDays < 0 ? "Critical" : "High";
                    triggers.push({
                        id: `compliance-${candidate.id}`,
                        candidateId: candidate.id,
                        type: 'compliance',
                        title: diffDays < 0 ? `Compliance Expired: ${candidate.firstName}` : `Compliance Warning: ${candidate.firstName}`,
                        description: diffDays < 0 ? `Site Safe EXPIRED on ${candidate.siteSafeExpiry}.` : `Site Safe expires in ${diffDays} days.`,
                        urgency,
                        date: candidate.siteSafeExpiry,
                        rawDate: candidate.siteSafeExpiry,
                        financialImpact: candidate.status === "On Job" ? getMargin(candidate) : 0
                    });
                }
            }
            if (candidate.visaExpiry && candidate.residency === "Work Visa") {
                const diffDays = Math.ceil((new Date(candidate.visaExpiry) - today) / (1000 * 60 * 60 * 24));
                if (diffDays <= 30) {
                    triggers.push({
                        id: `visa-${candidate.id}`,
                        candidateId: candidate.id,
                        type: 'risk',
                        title: `Visa Expiry: ${candidate.firstName}`,
                        description: `Work Visa expires in ${diffDays} days.`,
                        urgency: diffDays < 14 ? "Critical" : "High",
                        date: candidate.visaExpiry,
                        rawDate: candidate.visaExpiry,
                        financialImpact: candidate.status === "On Job" ? getMargin(candidate) : 0
                    });
                }
            }
            if (candidate.satisfactionRating && candidate.satisfactionRating <= 2) {
                triggers.push({
                    id: `retention-${candidate.id}`,
                    candidateId: candidate.id,
                    type: 'retention',
                    title: `Flight Risk: ${candidate.firstName}`,
                    description: `Low satisfaction (Rating: ${candidate.satisfactionRating}).`,
                    urgency: "High",
                    date: "ASAP",
                    rawDate: today.toISOString(),
                    financialImpact: candidate.status === "On Job" ? getMargin(candidate) : 0
                });
            }

            // Start Date Alerts
            if (candidate.status === "On Job" && candidate.startDate) {
                const startDate = new Date(candidate.startDate);
                const diffDays = Math.ceil((startDate - today) / (1000 * 60 * 60 * 24));

                // Alert if starting within next 7 days or started recently (up to 3 days ago)
                if (diffDays >= -3 && diffDays <= 7) {
                    const project = projects.find(p => p.id === candidate.projectId);
                    const projectName = project ? project.name : "Unknown Project";
                    const isToday = diffDays === 0;
                    const isFuture = diffDays > 0;

                    triggers.push({
                        id: `start-${candidate.id}`,
                        candidateId: candidate.id,
                        type: 'task',
                        title: isToday ? `STARTING TODAY: ${candidate.firstName}` :
                            isFuture ? `Starting Soon: ${candidate.firstName}` :
                                `Started Recently: ${candidate.firstName}`,
                        description: `Starting at ${projectName} on ${candidate.startDate}. Confirm attendance.`,
                        urgency: isToday ? "Critical" : "High",
                        date: candidate.startDate,
                        rawDate: candidate.startDate,
                        financialImpact: getMargin(candidate)
                    });
                }
            }
        });

        // 4. Placement Actions (Flight Risk from Check-ins & Stalled Floats) - NEW LOGIC
        placements.forEach(placement => {
            const candidate = candidates.find(c => c.id === placement.candidateId);
            const getMargin = (c) => {
                if (!c) return 800;
                const margin = (c.chargeRate || 50) - (c.payRate || 30);
                return margin * 40;
            };

            // A. Flight Risk (Deployed)
            if (placement.status === 'Deployed' && placement.weeklyCheckins && placement.weeklyCheckins.length >= 2) {
                const lastTwoCheckins = placement.weeklyCheckins.slice(-2);
                const [last, secondLast] = lastTwoCheckins;
                if (last.candidateMood === 'down' && secondLast.candidateMood === 'down') {
                    const project = projects.find(p => p.id === placement.projectId);
                    if (candidate && project) {
                        triggers.push({
                            id: `flightrisk-checkin-${placement.id}`,
                            placementId: placement.id,
                            candidateId: candidate.id,
                            projectId: project.id,
                            type: 'retention',
                            title: `FLIGHT RISK: ${candidate.firstName} (Check-in)`,
                            description: `${candidate.firstName} at ${project.name} shows 2 consecutive 'down' moods.`,
                            urgency: "Critical",
                            date: today.toISOString(),
                            rawDate: today.toISOString(),
                            financialImpact: getMargin(candidate)
                        });
                    }
                }
            }

            // B. Stalled Deals (Floated > 3 Days)
            if (placement.status === 'Floated') {
                const floatedDate = new Date(placement.floatedDate);
                const diffDays = Math.ceil((today - floatedDate) / (1000 * 60 * 60 * 24));
                if (diffDays > 3) {
                    const project = projects.find(p => p.id === placement.projectId);
                    if (candidate && project) {
                        triggers.push({
                            id: `stalled-float-${placement.id}`,
                            placementId: placement.id,
                            type: 'deal_risk',
                            title: `Stalled Deal: ${candidate.firstName}`,
                            description: `Floated to ${project.name} ${diffDays} days ago. No response.`,
                            urgency: diffDays > 5 ? "High" : "Medium",
                            date: placement.floatedDate,
                            rawDate: placement.floatedDate,
                            financialImpact: getMargin(candidate)
                        });
                    }
                }
            }

            // C. Portal Bookings (Unconfirmed) - NEW
            if (placement.status === 'Unconfirmed') {
                const project = projects.find(p => p.id === placement.projectId);
                if (candidate && project) {
                    triggers.push({
                        id: `portal-confirm-${placement.id}`,
                        placementId: placement.id,
                        type: 'task',
                        title: `Portal Booking: ${candidate.firstName}`,
                        description: `Client booked for ${project.name}. Confirm availability?`,
                        urgency: "Critical",
                        date: "IMMEDIATE",
                        rawDate: today.toISOString(),
                        financialImpact: getMargin(candidate)
                    });
                }
            }
        });

        // Merge Server Nudges
        const allMoves = [...triggers, ...serverNudges];

        const priorityScore = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1, 'Upcoming': 0.5 };
        setMoneyMoves(allMoves.sort((a, b) => (priorityScore[b.urgency] || 0) - (priorityScore[a.urgency] || 0) || new Date(a.rawDate || 0) - new Date(b.rawDate || 0)));
    }, [projects, candidates, clients, placements, serverNudges]);

    // --- Financial Engine ---
    const BURDEN_MULTIPLIER = 1.20;
    const WORK_WEEK_HOURS = 40;

    const activeCandidates = candidates.filter(c => c.status === "On Job");
    const weeklyRevenue = activeCandidates.reduce((sum, c) => sum + ((c.chargeRate || 0) * WORK_WEEK_HOURS), 0);
    const activePayroll = activeCandidates.reduce((sum, c) => sum + ((c.payRate || 0) * BURDEN_MULTIPLIER * WORK_WEEK_HOURS), 0);

    const benchCandidates = candidates.filter(c => c.status === "Available" && c.guaranteedHours > 0);
    const benchLiability = benchCandidates.reduce((sum, c) => sum + ((c.payRate || 0) * BURDEN_MULTIPLIER * (c.guaranteedHours || 30)), 0);

    const weeklyPayroll = activePayroll + benchLiability;
    const weeklyGrossProfit = weeklyRevenue - weeklyPayroll;

    const revenueAtRisk = moneyMoves.reduce((acc, item) => {
        if (item.urgency === 'Critical' || item.urgency === 'High') {
            return acc + (item.financialImpact || 0);
        }
        return acc;
    }, 0);

    // --- Actions ---

    const addClient = (newClient) => {
        const client = { ...newClient, id: newClient.id || `CL-${Date.now()}` };
        setClients(prev => [...prev, client]);
        saveToSheets('Clients', client.id, client);
    };

    const addCandidate = (newCandidate) => {
        const candidate = { ...newCandidate, id: newCandidate.id || `C-${Date.now()}` };
        if (candidate.currentEmployer && !clients.some(c => c.name === candidate.currentEmployer)) {
            addClient({ name: candidate.currentEmployer, industry: "Construction", status: "New Lead" });
        }
        setCandidates(prev => [...prev, candidate]);
        saveToSheets('Candidates', candidate.id, candidate);
    };



    const addProject = (newProject) => {
        const id = newProject.id || `P-${Date.now()}`;
        const richProject = enrichProjectData({ ...newProject, id });
        setProjects(prev => [...prev, richProject]);
        saveToSheets('Projects', id, prepareProjectForSave(richProject));
    };

    const prepareProjectForSave = (project) => {
        return {
            ...project,
            // Map camelCase keys back to Sheet Headers
            'Client Demands': project.clientDemands,
            'Civil Start': project.phaseSettings?.['01_civil']?.startDate || "",
            'Structure Start': project.phaseSettings?.['02a_concrete']?.startDate || "",
            'Fitout Start': project.phaseSettings?.['05a_linings_stopping']?.startDate || "",
            'Site Manager Phone': project.siteManagerPhone || ""
        };
    };

    const updateProject = (updatedProject) => {
        const richProject = enrichProjectData(updatedProject);
        setProjects(prev => prev.map(p => p.id === updatedProject.id ? richProject : p));
        saveToSheets('Projects', updatedProject.id, prepareProjectForSave(richProject));
    };

    const updateCandidate = (updatedCandidate) => {
        setCandidates(prev => prev.map(c => c.id === updatedCandidate.id ? updatedCandidate : c));
        saveToSheets('Candidates', updatedCandidate.id, updatedCandidate);
    };

    const prepareClientForSave = (client) => {
        return {
            ...client,
            // Map UI keys back to likely Spreadsheet Headers (Title Case)
            'Head Office Address': client.address, // Correct Column Name
            'Main Phone': client.phone,           // Correct Column Name
            'Main Email': client.email,           // Correct Column Name
            Website: client.website,
            Location: client.region, // Assuming 'Location' is the column header for region
            Region: client.region,   // Redundant but safe if they renamed it
            Tier: client.tier,
            Industry: client.industry,
            Trade: client.industry,
            // Ensure lists are stringified if needed (updateSheetRow handles objects, but explicit key mapping is good)
        };
    };

    const updateClient = (updatedClient) => {
        setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
        const dataToSave = prepareClientForSave(updatedClient);
        saveToSheets('Clients', updatedClient.id, dataToSave);
    };

    const addRole = (roleName) => setAvailableRoles(prev => prev.includes(roleName) ? prev : [...prev, roleName].sort());

    const floatCandidate = (candidateId, projectId, details) => {
        const newPlacement = { id: `pl-${Date.now()}`, candidateId, projectId, status: 'Floated', floatedDate: new Date().toISOString(), weeklyCheckins: [], ...details };
        setPlacements(prev => [...prev, newPlacement]);
        
        // Update Candidate Status to "Floated" so it appears in Mission Control
        setCandidates(prevCands => prevCands.map(c => 
            c.id === candidateId ? { ...c, status: "Floated" } : c
        ));
    };

    const updatePlacementStatus = (placementId, newStatus) => {
        setPlacements(prev => prev.map(p => {
            if (p.id === placementId) {
                // If deploying, also update the candidate status
                if (newStatus === 'Deployed') {
                    const candidateId = p.candidateId;
                    setCandidates(prevCands => prevCands.map(c =>
                        c.id === candidateId ? { ...c, status: "On Job" } : c
                    ));
                }
                return { ...p, status: newStatus };
            }
            return p;
        }));
    };

    const assignCandidateToProject = (candidateId, projectId, reqId = null) => {
        const project = projects.find(p => p.id === projectId);
        if (!project) return;

        // 1. Update Candidate
        const updatedCandidate = candidates.find(c => c.id === candidateId);
        if (updatedCandidate) {
            const newCand = {
                ...updatedCandidate,
                status: "On Job",
                projectId: projectId,
                currentEmployer: project.client || project.name,
                startDate: new Date().toISOString().split('T')[0]
            };
            updateCandidate(newCand);
        }

        // 2. Update Project (if reqId provided, assign to that requirement)
        if (reqId) {
            // Find the package containing this requirement
            let pkgKeyFound = null;
            let updatedPkgs = { ...project.packages };

            Object.entries(updatedPkgs).forEach(([key, pkg]) => {
                if (pkg.laborRequirements) {
                    const reqIndex = pkg.laborRequirements.findIndex(r => r.id === reqId);
                    if (reqIndex !== -1) {
                        pkgKeyFound = key;
                        const req = pkg.laborRequirements[reqIndex];
                        const newAssignedIds = [...(req.assignedIds || []), candidateId];
                        // Update the specific requirement
                        updatedPkgs[key].laborRequirements[reqIndex] = {
                            ...req,
                            assignedIds: newAssignedIds
                        };
                    }
                }
            });

            if (pkgKeyFound) {
                updateProject({ ...project, packages: updatedPkgs });
            }
        }
    };

    const unassignCandidate = (candidateId, projectId, reqId = null) => {
        // 1. Update Candidate
        const updatedCandidate = candidates.find(c => c.id === candidateId);
        if (updatedCandidate) {
            const newCand = {
                ...updatedCandidate,
                status: "Available",
                projectId: null,
                currentEmployer: null,
                startDate: "",
                finishDate: ""
            };
            updateCandidate(newCand);
        }

        // 2. Update Project (remove from requirement)
        if (reqId) {
            const project = projects.find(p => p.id === projectId);
            if (project) {
                let updatedPkgs = { ...project.packages };
                let found = false;

                Object.entries(updatedPkgs).forEach(([key, pkg]) => {
                    if (pkg.laborRequirements) {
                        const reqIndex = pkg.laborRequirements.findIndex(r => r.id === reqId);
                        if (reqIndex !== -1) {
                            found = true;
                            const req = pkg.laborRequirements[reqIndex];
                            const newAssignedIds = (req.assignedIds || []).filter(id => id !== candidateId);
                            updatedPkgs[key].laborRequirements[reqIndex] = {
                                ...req,
                                assignedIds: newAssignedIds
                            };
                        }
                    }
                });

                if (found) {
                    updateProject({ ...project, packages: updatedPkgs });
                }
            }
        }
    };

    const logCheckin = (placementId, moodData) => {
        setPlacements(prev => prev.map(p => {
            if (p.id === placementId) {
                const newCheckin = { checkinDate: new Date().toISOString().split('T')[0], ...moodData };
                return { ...p, weeklyCheckins: [...(p.weeklyCheckins || []), newCheckin] };
            }
            return p;
        }));
    };

    const logActivity = (type, details) => {
        const newLog = {
            id: `act-${Date.now()}`,
            type, // 'call', 'sms', 'email', 'meeting'
            date: new Date().toISOString(),
            ...details
        };
        setActivityLogs(prev => [newLog, ...prev]);
    };

    const submitPortalBooking = (cartItems, projectId, jobSpecs) => {
        const newPlacements = cartItems.map(item => ({
            id: `pl-portal-${Date.now()}-${item.id}`,
            candidateId: item.id,
            projectId: projectId,
            status: 'Unconfirmed',
            floatedDate: new Date().toISOString(),
            source: 'Portal',
            ...jobSpecs // Capture PM, Supervisor, Approver, Start Date, Duration
        }));

        setPlacements(prev => [...prev, ...newPlacements]);
        // Note: Placements are not currently synced to Sheets in the initial schema, but could be added later.
    };

    const value = {
        candidates, clients, projects, selectedProject, setSelectedProject, moneyMoves, availableRoles, placements,
        weeklyRevenue, weeklyPayroll, benchLiability, weeklyGrossProfit, revenueAtRisk, isSyncing, activityLogs,
        addCandidate, updateCandidate, addClient, updateClient, addProject, updateProject, addRole, floatCandidate, updatePlacementStatus, logCheckin, submitPortalBooking, logActivity,
        assignCandidateToProject, unassignCandidate,
        setCandidates, setClients, setProjects, syncFromSheets
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
    const context = useContext(DataContext);
    if (!context) throw new Error('useData must be used within a DataProvider');
    return context;
}
