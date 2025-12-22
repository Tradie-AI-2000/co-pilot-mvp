"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { candidates as initialCandidates } from '@/services/mockData';
import { enhancedClients, enhancedProjects as initialProjects } from '@/services/enhancedMockData';
import { PHASE_TEMPLATES, WORKFORCE_MATRIX, getProjectSize } from '@/services/constructionLogic';

const DataContext = createContext();

export function DataProvider({ children }) {
    // Initialize state with mock data
    const [candidates, setCandidates] = useState(initialCandidates);
    const [clients, setClients] = useState(enhancedClients);
    const [projects, setProjects] = useState(initialProjects);

    // --- Actions ---

    const addCandidate = (newCandidate) => {
        setCandidates((prev) => {
            // Check if employer exists, if not, add to clients
            if (newCandidate.currentEmployer && !clients.some(c => c.name === newCandidate.currentEmployer)) {
                addClient({
                    id: Date.now(), // Simple ID generation
                    name: newCandidate.currentEmployer,
                    industry: "Construction", // Default industry
                    status: "New Lead",
                    lastContact: new Date().toISOString().split('T')[0],
                    pipelineStage: "Lead",
                    tier: "3",
                    activeJobs: 0,
                    contractStatus: "None",
                    projectIds: [],
                    network: [],
                    actionAlerts: [],
                    hiringInsights: {},
                    keyContacts: [],
                    siteLogistics: {},
                    financials: {},
                    notes: [],
                    tasks: []
                });
            }
            return [...prev, { ...newCandidate, id: newCandidate.id || Date.now() }];
        });
    };

    const addClient = (newClient) => {
        setClients((prev) => [...prev, { ...newClient, id: newClient.id || Date.now() }]);
    };

    // --- Project Actions ---
    const addProject = (newProject) => {
        // --- Intelligence Generation ---

        // 1. Generate SubContractors from Packages
        const generatedSubContractors = Object.entries(newProject.packages || {})
            .filter(([_, pkg]) => pkg.name)
            .map(([trade, pkg]) => ({
                trade: trade.charAt(0).toUpperCase() + trade.slice(1),
                name: pkg.name
            }));

        // 2. Generate Contact Triggers (Comms Countdown Engine)
        const triggerMap = {
            excavation: "Stop looking for operators",
            structure: "Start Hammer Hands & Formworkers",
            lockUp: "Start Gib Stoppers & Interiors",
            fitOut: "Start Flooring & Painters"
        };
        const generatedTriggers = [];

        // Get the global offset from input or default to 2 weeks
        const weeksOffset = newProject.triggers?.offsetWeeks || 2;
        const msPerDay = 86400000;
        const msOffset = weeksOffset * 7 * msPerDay;

        Object.entries(newProject.triggers || {}).forEach(([key, date]) => {
            if (date && key !== 'offsetWeeks') {
                const phaseDate = new Date(date);
                const alertDate = new Date(phaseDate.getTime() - msOffset);
                const formattedAlertDate = alertDate.toISOString().split('T')[0];

                generatedTriggers.push({
                    id: `trigger-${Date.now()}-${key}`,
                    date: formattedAlertDate, // This is now the "Date to Act", not the phase start date
                    targetDate: date, // The actual phase start date
                    contact: "Virtual PM",
                    message: `${triggerMap[key] || "Phase Trigger"} (Phase starts in ${weeksOffset} weeks)`,
                    urgency: "High"
                });
            }
        });

        // 3. Generate Phases (Smart Logic based on dates)
        const generatedPhases = [];
        const today = new Date();

        if (newProject.startDate) {
            const start = new Date(newProject.startDate);
            let status = "Upcoming";
            let progress = 0;
            if (start <= today) { status = "Completed"; progress = 100; }

            generatedPhases.push({ name: "Excavation", start: newProject.startDate, end: "TBD", status, progress });
        }

        if (newProject.triggers?.structure) {
            const structStart = new Date(newProject.triggers.structure);
            let status = "Upcoming";
            let progress = 0;

            // If today is past the start date, it's in progress
            if (structStart <= today) { status = "In Progress"; progress = 35; }

            generatedPhases.push({
                name: "Structure",
                start: newProject.triggers.structure,
                end: "TBD",
                status,
                progress
            });
        }

        // 4. Generate Hiring Signals (Volume Calculator & Tender Tracker)
        const generatedSignals = [];
        Object.entries(newProject.packages || {}).forEach(([trade, pkg]) => {
            if (pkg.status === "Tendering" || pkg.status === "Open") {
                // Volume Calculator: If no headcount, use Value / $250k
                let count = parseInt(pkg.estimatedHeadcount) || 0;
                if (!count && pkg.commercialValue) {
                    count = Math.ceil(parseInt(pkg.commercialValue) / 250000);
                }
                // Fallback if neither exists
                if (count === 0) count = Math.floor(Math.random() * 5) + 2;

                // Date Awareness: If lead time exists, calculate target date
                let targetDate = "ASAP";
                if (pkg.leadTimeWeeks) {
                    // Assuming 'now' is the baseline, target is 'leadTimeWeeks' from now? 
                    // Or ideally, based on phase start. For now, we state the Lead Time.
                    targetDate = `${pkg.leadTimeWeeks} Wk Lead`;
                }

                generatedSignals.push({
                    role: trade.charAt(0).toUpperCase() + trade.slice(1),
                    count: count,
                    urgency: "High",
                    date: targetDate,
                    phase: "Tender",
                    bidders: pkg.biddingSubcontractors || "None listed", // Tender Tracker
                    value: pkg.commercialValue ? `$${parseInt(pkg.commercialValue).toLocaleString()}` : "N/A"
                });
            }
        });

        const enhancedProject = {
            ...newProject,
            id: newProject.id || `P${Date.now()}`,
            subContractors: [...(newProject.subContractors || []), ...generatedSubContractors],
            contactTriggers: [...(newProject.contactTriggers || []), ...generatedTriggers],
            phases: newProject.phases && newProject.phases.length > 0 ? newProject.phases : generatedPhases,
            hiringSignals: [...(newProject.hiringSignals || []), ...generatedSignals]
        };

        setProjects(prev => [...prev, { ...enhancedProject }]);
    };

    const updateProject = (updatedProject) => {
        setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
    };

    // Update an existing candidate
    const updateCandidate = (updatedCandidate) => {
        setCandidates(prev => prev.map(c => c.id === updatedCandidate.id ? updatedCandidate : c));
    };

    // Update an existing client
    const updateClient = (updatedClient) => {
        setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
    };

    // Deploy a Squad
    const deploySquad = (squad, project) => {
        setCandidates(prev => prev.map(c => {
            const isMember = squad.members.find(m => m.id === c.id);
            if (isMember) {
                return {
                    ...c,
                    status: "On Job",
                    projectId: project.id,
                    currentEmployer: project.client || project.name,
                    suburb: project.location || c.suburb,
                    finishDate: "2026-01-01" // Mock default
                };
            }
            return c;
        }));
    };

    const value = {
        candidates,
        clients,
        projects,
        addCandidate,
        updateCandidate,
        addClient,
        updateClient,
        addProject,
        updateProject,
        deploySquad,
        setCandidates, // Expose setters if direct manipulation is needed (careful)
        setClients,
        setProjects
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
}

export function useData() {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
}
