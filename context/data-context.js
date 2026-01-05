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
        }
    ];

    // Initialize state with default mock data first (SSR safety), then hydrate
    const [candidates, setCandidates] = useState(initialCandidates);
    const [clients, setClients] = useState(initialClients);
    const [projects, setProjects] = useState(initialProjects);
    const [selectedProject, setSelectedProject] = useState(null);
    const [availableRoles, setAvailableRoles] = useState(MASTER_ROLES);
    const [placements, setPlacements] = useState(initialPlacementsData);

    // --- Persistence Logic ---
    useEffect(() => {
        // Hydrate from localStorage on mount
        const localCandidates = localStorage.getItem('stellar_candidates_v2');
        const localClients = localStorage.getItem('stellar_clients_v2');
        const localProjects = localStorage.getItem('stellar_projects_v2');
        const localRoles = localStorage.getItem('stellar_roles_v2');
        const localPlacements = localStorage.getItem('stellar_placements_v2');

        if (localCandidates) setCandidates(JSON.parse(localCandidates));
        if (localClients) setClients(JSON.parse(localClients));
        if (localProjects) setProjects(JSON.parse(localProjects));
        if (localRoles) setAvailableRoles(JSON.parse(localRoles));
        if (localPlacements) setPlacements(JSON.parse(localPlacements));
    }, []);

    // Sync updates to localStorage
    useEffect(() => { localStorage.setItem('stellar_candidates_v2', JSON.stringify(candidates)); }, [candidates]);
    useEffect(() => { localStorage.setItem('stellar_clients_v2', JSON.stringify(clients)); }, [clients]);
    useEffect(() => { localStorage.setItem('stellar_projects_v2', JSON.stringify(projects)); }, [projects]);
    useEffect(() => { localStorage.setItem('stellar_roles_v2', JSON.stringify(availableRoles)); }, [availableRoles]);
    useEffect(() => { localStorage.setItem('stellar_placements_v2', JSON.stringify(placements)); }, [placements]);

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

    const addClient = (newClient) => setClients(prev => [...prev, { ...newClient, id: newClient.id || Date.now() }]);

    const addCandidate = (newCandidate) => {
        if (newCandidate.currentEmployer && !clients.some(c => c.name === newCandidate.currentEmployer)) addClient({ name: newCandidate.currentEmployer, industry: "Construction", status: "New Lead" });
        setCandidates(prev => [...prev, { ...newCandidate, id: newCandidate.id || Date.now() }]);
    };

    const enrichProjectData = (project) => { /* ... (This logic should be reviewed but keeping for now) ... */ return project; };

    const addProject = (newProject) => {
        const richProject = enrichProjectData({ ...newProject, id: newProject.id || `P${Date.now()}` });
        setProjects(prev => [...prev, richProject]);
    };

    const updateProject = (updatedProject) => {
        const richProject = enrichProjectData(updatedProject);
        setProjects(prev => prev.map(p => p.id === updatedProject.id ? richProject : p));
    };

    const updateCandidate = (updatedCandidate) => setCandidates(prev => prev.map(c => c.id === updatedCandidate.id ? updatedCandidate : c));
    const updateClient = (updatedClient) => setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
    const addRole = (roleName) => setAvailableRoles(prev => prev.includes(roleName) ? prev : [...prev, roleName].sort());

    const floatCandidate = (candidateId, projectId, details) => {
        const newPlacement = { id: `pl-${Date.now()}`, candidateId, projectId, status: 'Floated', floatedDate: new Date().toISOString(), weeklyCheckins: [], ...details };
        setPlacements(prev => [...prev, newPlacement]);
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

    const logCheckin = (placementId, moodData) => {
        setPlacements(prev => prev.map(p => {
            if (p.id === placementId) {
                const newCheckin = { checkinDate: new Date().toISOString().split('T')[0], ...moodData };
                return { ...p, weeklyCheckins: [...(p.weeklyCheckins || []), newCheckin] };
            }
            return p;
        }));
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
    };

    const value = {
        candidates, clients, projects, selectedProject, setSelectedProject, moneyMoves, availableRoles, placements,
        weeklyRevenue, weeklyPayroll, benchLiability, weeklyGrossProfit, revenueAtRisk,
        addCandidate, updateCandidate, addClient, updateClient, addProject, updateProject, addRole, floatCandidate, updatePlacementStatus, logCheckin, submitPortalBooking,
        setCandidates, setClients, setProjects
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
    const context = useContext(DataContext);
    if (!context) throw new Error('useData must be used within a DataProvider');
    return context;
}
