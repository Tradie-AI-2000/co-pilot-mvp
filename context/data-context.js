"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const DataContext = createContext();

export function DataProvider({ children }) {
    // 1. INITIALIZE WITH EMPTY REAL STATE (No Mock Data)
    const [candidates, setCandidates] = useState([]);
    const [clients, setClients] = useState([]);
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [moneyMoves, setMoneyMoves] = useState([]);
    const [serverNudges, setServerNudges] = useState([]);

    const [availableRoles, setAvailableRoles] = useState([
        "Hammerhand", "Formworker", "Steel Fixer", "Concrete Placer", "Labourer", "Carpenter", "Site Manager"
    ]);
    const [placements, setPlacements] = useState([]);
    const [isSyncing, setIsSyncing] = useState(false);
    const [activityLogs, setActivityLogs] = useState([]);
    const [isHydrated, setIsHydrated] = useState(false);

    // --- ENRICHMENT (Fixes Supabase Casing Issues) ---
    const enrichCandidateData = (candidate) => {
        const residency = candidate.residency || "Unknown";
        // Handle compliance safely
        const compliance = candidate.compliance || {};
        const fName = candidate.firstName || candidate.first_name || "";
        const lName = candidate.lastName || candidate.last_name || "";

        return {
            ...candidate,
            // Handle snake_case from DB vs camelCase in Frontend
            firstName: fName,
            lastName: lName,
            status: candidate.status || "available",
            projectId: candidate.projectId || candidate.project_id || null,
            cvUrl: candidate.cvUrl || candidate.cv_url || null,
            name: `${fName} ${lName}`.trim() || "Unknown Candidate",

            // Ensure numbers for math and consistency with schema keys
            chargeOutRate: candidate.chargeOutRate || candidate.charge_out_rate || "0",
            chargeRate: parseFloat(candidate.chargeOutRate || candidate.charge_out_rate || 0),
            payRate: parseFloat(candidate.payRate || candidate.pay_rate || 0),
            guaranteedHours: parseFloat(candidate.guaranteedHours || candidate.guaranteed_hours || 0),

            // Managers & Employer
            recruiter: candidate.recruiter || "Unassigned",
            candidateManager: candidate.candidateManager || candidate.candidate_manager || "Unassigned",
            currentEmployer: candidate.currentEmployer || candidate.current_employer || "Available",
            currentProject: candidate.currentProject || candidate.current_project || null,
            siteAddress: candidate.siteAddress || candidate.site_address || null,

            isMobile: residency.toLowerCase().includes('work visa') ||
                residency.toLowerCase().includes('filipino') ||
                residency.toLowerCase().includes('mobile'),

            // Compliance unpacking
            siteSafeExpiry: compliance.siteSafeExpiry || null,
            visaExpiry: candidate.visaExpiry || candidate.visa_expiry || null,
            workSafeExpiry: candidate.workSafeExpiry || candidate.work_safe_expiry || null,
            tickets: compliance.tickets || []
        };
    };

    const enrichProjectData = (project) => {
        console.log("Raw Project from DB:", project.name, "Demands:", project.client_demands || project.clientDemands);
        return {
            ...project,
            // Header Info
            assetOwner: project.assetOwner || project.asset_owner || "",

            // Managers
            projectDirector: project.projectDirector || project.project_director || "",
            seniorQS: project.seniorQS || project.senior_qs || "",
            siteManager: project.siteManager || project.site_manager || "",
            siteManagerPhone: project.siteManagerPhone || project.site_manager_phone || "",
            safetyOfficer: project.safetyOfficer || project.safety_officer || "",

            // Logistics
            publicTransport: project.publicTransport || project.public_transport || "No",
            gateCode: project.gateCode || project.gate_code || "",

            // Complex Data (JSONB)
            clientDemands: project.clientDemands || project.client_demands || [],
            phaseSettings: project.phaseSettings || project.phase_settings || {},
            assignedCompanyIds: project.assignedCompanyIds || project.assigned_company_ids || [],
            packages: project.packages || project.packages || {}, // Legacy fallback
            labourPrediction: project.labourPrediction || project.labour_prediction || {},

            // SSA Status
            ssaStatus: project.ssaStatus || project.ssa_status || "Pending"
        };
    };

    // --- PURE SUPABASE SYNC ---
    const syncFromSupabase = async () => {
        setIsSyncing(true);
        try {
            console.log("🔄 Syncing with Supabase...");
            const [candRes, projRes, clientRes, nudgeRes] = await Promise.all([
                fetch('/api/candidates').then(res => res.json()),
                fetch('/api/projects').then(res => res.json()),
                fetch('/api/clients').then(res => res.json()),
                fetch('/api/nudges').then(res => res.json())
            ]);
            console.log("🔔 Raw Nudges from DB:", nudgeRes);

            // Set State ONLY if data exists
            if (Array.isArray(candRes)) setCandidates(candRes.map(enrichCandidateData));
            if (Array.isArray(projRes)) setProjects(projRes.map(enrichProjectData));
            if (Array.isArray(clientRes)) setClients(clientRes);

            // Handle Nudges
            if (Array.isArray(nudgeRes)) {
                const mappedNudges = nudgeRes.map(n => ({
                    // 1. Pass the FULL Payload (Crucial for SMS Button)
                    actionPayload: n.actionPayload || n.action_payload || {},

                    // 2. Pass the Date (So sidebar shows "Jan 26")
                    createdAt: n.createdAt || n.created_at || new Date(),

                    // 3. Keep existing mappings
                    id: n.id,
                    type: n.type, // Pass raw type to let UI decide colors
                    // (Optional: Keep your old mapping if you prefer, but raw is safer for the new drawer)
                    // type: n.type === 'PRE_EMPTIVE_STRIKE' ? 'lead' : ... 

                    title: n.title,
                    description: n.description,
                    priority: n.priority, // Pass raw priority (CRITICAL/HIGH)
                    urgency: n.priority === 'CRITICAL' ? 'Critical' : 'High',
                    date: 'ASAP',
                    financialImpact: (n.actionPayload?.impact) || 0,
                    isServer: true
                }));
                setServerNudges(mappedNudges);
                setMoneyMoves(mappedNudges);
            }

        } catch (error) {
            console.error("🚨 [DB_SYNC_FAILED]: Could not fetch data.", error);
        } finally {
            setIsSyncing(false);
        }
    };

    useEffect(() => {
        syncFromSupabase();
        setIsHydrated(true);
    }, []);

    // --- FINANCIAL METRICS (Real Data Only) ---
    const WORK_WEEK_HOURS = 40;
    const BURDEN_MULTIPLIER = 1.30;

    const parseNum = (val) => {
        if (typeof val === 'number') return val;
        if (!val) return 0;
        return parseFloat(String(val).replace(/[^0-9.-]+/g, "")) || 0;
    };

    const financialMetrics = useMemo(() => {
        const activeCandidates = candidates.filter(c => c.status?.toLowerCase() === "on_job");
        const benchCandidates = candidates.filter(c => c.status?.toLowerCase() === "available" && (c.guaranteedHours || 0) > 0);

        const rev = activeCandidates.reduce((sum, c) => sum + (parseNum(c.chargeRate) * WORK_WEEK_HOURS), 0);
        const pay = activeCandidates.reduce((sum, c) => sum + (parseNum(c.payRate) * BURDEN_MULTIPLIER * WORK_WEEK_HOURS), 0);
        const gp = rev - pay;
        const liability = benchCandidates.reduce((sum, c) => sum + (parseNum(c.payRate) * BURDEN_MULTIPLIER * (c.guaranteedHours || 0)), 0);

        return {
            weeklyRevenue: rev,
            weeklyPayroll: pay,
            weeklyGrossProfit: gp,
            benchLiability: liability,
            revenueAtRisk: 0 // Placeholder until dates are manually fixed in DB
        };
    }, [candidates]);

    const { weeklyRevenue, weeklyPayroll, weeklyGrossProfit, benchLiability, revenueAtRisk } = financialMetrics;

    // --- PERSISTENCE HELPERS (Standard) ---
    const persistItem = async (endpoint, method, item, setState, isUpdate = false) => {
        const tempId = item.id || Date.now();

        // Optimistic Update with Enrichment
        setState(prev => {
            let preparedItem = item;
            if (endpoint.includes('candidates')) preparedItem = enrichCandidateData(item);
            if (endpoint.includes('projects')) preparedItem = enrichProjectData(item);

            if (isUpdate) return prev.map(p => p.id === item.id ? { ...p, ...preparedItem } : p);
            return [...prev, { ...preparedItem, id: tempId }];
        });

        try {
            const res = await fetch(endpoint, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item)
            });
            if (res.ok) {
                const saved = await res.json();
                let enrichedSaved = saved;
                if (endpoint.includes('candidates')) enrichedSaved = enrichCandidateData(saved);
                if (endpoint.includes('projects')) enrichedSaved = enrichProjectData(saved);

                setState(prev => prev.map(p => (p.id === (isUpdate ? item.id : tempId) ? enrichedSaved : p)));
                return enrichedSaved;
            }
        } catch (e) {
            console.error(`Error persisting to ${endpoint}:`, e);
        }
    };

    // Standard CRUD wrappers
    const addCandidate = (c) => persistItem('/api/candidates', 'POST', c, setCandidates);
    const updateCandidate = (c) => persistItem('/api/candidates', 'PATCH', c, setCandidates, true);
    const addProject = (p) => persistItem('/api/projects', 'POST', p, setProjects);
    const updateProject = (p) => persistItem('/api/projects', 'PATCH', p, setProjects, true);
    const addClient = (c) => persistItem('/api/clients', 'POST', c, setClients);
    const updateClient = (c) => persistItem('/api/clients', 'PATCH', c, setClients, true);

    const floatCandidate = (candidateId, projectId) => {
        const candidate = candidates.find(c => c.id === candidateId);
        if (candidate && candidate.status === 'available') {
            updateCandidate({ id: candidateId, status: 'Floated' });
        }
    };

    const assignCandidateToProject = async (candidateId, projectId) => {
        const candidate = candidates.find(c => c.id === candidateId);
        if (!candidate) return;
        return updateCandidate({
            id: candidateId,
            projectId: projectId,
            startDate: new Date().toISOString().split('T')[0],
            status: 'on_job'
        });
    };

    const addRole = (roleName) => setAvailableRoles(prev => prev.includes(roleName) ? prev : [...prev, roleName].sort());

    const value = {
        candidates, clients, projects, selectedProject, setSelectedProject, moneyMoves, placements, availableRoles,
        weeklyRevenue, weeklyPayroll, weeklyGrossProfit, benchLiability, revenueAtRisk,
        isSyncing, activityLogs,
        addCandidate, updateCandidate, addProject, updateProject, addClient, updateClient, addRole, floatCandidate,
        assignCandidateToProject,
        syncFromSupabase
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
    const context = useContext(DataContext);
    if (!context) throw new Error('useData must be used within a DataProvider');
    return context;
}