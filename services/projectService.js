import { enhancedClients } from "./enhancedMockData";

// Initial Project Data (Centralized)
let projects = [
    {
        id: 1,
        name: "Te Hono Avondale",
        client: "Hawkins Construction",
        stage: "Foundations",
        progress: 85,
        threshold: 80,
        action: "Prepare Structure Pitch",
        nextStep: "Structure Phase",
        date: "Nov 2025",
        region: "Auckland",
        value: "$45M",
        tradeStack: {
            current: [
                { role: "Labourers", count: 3 },
                { role: "Site Traffic", count: 2 }
            ],
            next: [
                { role: "Carpenters", count: 6 },
                { role: "Glaziers", count: 2 }
            ]
        }
    },
    {
        id: 2,
        name: "Waikato Expressway",
        client: "Fletcher Infrastructure",
        stage: "Structure",
        progress: 45,
        threshold: 80,
        action: "Send Rate Card",
        nextStep: "Procurement",
        date: "Mar 2026",
        region: "Waikato",
        value: "$120M",
        tradeStack: {
            current: [
                { role: "Machine Operators", count: 8 },
                { role: "Drainlayers", count: 4 }
            ],
            next: [
                { role: "Asphalters", count: 12 }
            ]
        }
    },
    {
        id: 3,
        name: "CRL Station Fitout",
        client: "Link Alliance",
        stage: "Finishes",
        progress: 20,
        threshold: 75,
        action: "Call Sarah",
        nextStep: "Commissioning",
        date: "Jan 2026",
        region: "Auckland",
        value: "$80M",
        tradeStack: {
            current: [
                { role: "Electricians", count: 15 },
                { role: "Plumbers", count: 8 }
            ],
            next: [
                { role: "Painters", count: 10 },
                { role: "Cleaners", count: 5 }
            ]
        }
    },
    {
        id: 4,
        name: "Tauranga Hospital Wing",
        client: "Naylor Love",
        stage: "Foundations",
        progress: 10,
        threshold: 80,
        action: "Initial Site Visit",
        nextStep: "Piling",
        date: "Jun 2026",
        region: "Bay of Plenty",
        value: "$65M",
        tradeStack: {
            current: [
                { role: "Site Admin", count: 1 }
            ],
            next: [
                { role: "Labourers", count: 4 }
            ]
        }
    }
];

export const getProjects = () => {
    return projects;
};

export const getWatchlistProjects = () => {
    // In a real app, this might filter by 'isWatchlisted' flag
    // For now, we return the top 3 priority projects
    return projects.slice(0, 3);
};

export const addProject = (newProject) => {
    const project = {
        id: Date.now(),
        ...newProject,
        progress: 0,
        threshold: 80,
        tradeStack: { current: [], next: [] }
    };
    projects = [project, ...projects];
    return project;
};

export const updateProject = (updatedProject) => {
    projects = projects.map(p => p.id === updatedProject.id ? updatedProject : p);
    return updatedProject;
};
