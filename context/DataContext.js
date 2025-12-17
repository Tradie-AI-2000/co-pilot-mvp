"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { candidates as initialCandidates } from '@/services/mockData';
import { enhancedClients, enhancedProjects as initialProjects } from '@/services/enhancedMockData';

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

        // 2. Generate Contact Triggers
        const triggerMap = {
            excavation: "Stop looking for operators",
            structure: "Start Hammer Hands & Formworkers",
            lockUp: "Start Gib Stoppers & Interiors",
            fitOut: "Start Flooring & Painters"
        };
        const generatedTriggers = [];
        Object.entries(newProject.triggers || {}).forEach(([key, date]) => {
            if (date) {
                generatedTriggers.push({
                    id: `trigger-${Date.now()}-${key}`,
                    date: date,
                    contact: "Virtual PM",
                    message: triggerMap[key] || "Phase Trigger",
                    urgency: "High"
                });
            }
        });

        // 3. Generate Phases (Simple logic based on dates)
        const generatedPhases = [];
        if (newProject.startDate) {
            generatedPhases.push({ name: "Excavation", start: newProject.startDate, end: "TBD", status: "Completed", progress: 100 });
        }
        // Mocking logic: If we have a structure trigger, assume structure phase is active
        if (newProject.triggers?.structure) {
            generatedPhases.push({
                name: "Structure",
                start: newProject.triggers.structure,
                end: "TBD",
                status: "In Progress",
                progress: 35
            });
        } else {
            generatedPhases.push({ name: "Structure", start: "TBD", end: "TBD", status: "Upcoming", progress: 0 });
        }

        // 4. Generate Hiring Signals
        const generatedSignals = [];
        Object.entries(newProject.packages || {}).forEach(([trade, pkg]) => {
            if (pkg.status === "Tendering" || pkg.status === "Open") {
                generatedSignals.push({
                    role: trade.charAt(0).toUpperCase() + trade.slice(1),
                    count: Math.floor(Math.random() * 5) + 2, // Mock estimation
                    urgency: "High",
                    date: "ASAP",
                    phase: "Tender"
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
