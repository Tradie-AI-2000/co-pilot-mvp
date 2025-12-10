export const enhancedProjects = [
    {
        id: "P001",
        name: "SkyCity Convention Centre Refurbishment",
        location: "Auckland CBD",
        stage: "Won",
        value: "$50M - $100M",
        estFees: "$15k",
        sitePresence: 3,
        startDate: "2026-02-01",
        incumbentAgency: "Currently using Tradestaff/Hays",
        labourPrediction: [
            { month: "Feb", role: "Site Manager", count: 2 },
            { month: "Apr", role: "Hammerhand", count: 8 },
            { month: "Jan", role: "Quantity Surveyor", count: 1 }
        ],
        assignedCompanyIds: [1] // Fletcher
    },
    {
        id: "P002",
        name: "Waikato Expressway Extension",
        location: "Waikato",
        stage: "Tender",
        value: "$200M+",
        estFees: "$45k",
        sitePresence: 0,
        startDate: "TBD",
        incumbentAgency: "Open Tender",
        labourPrediction: [],
        assignedCompanyIds: [1] // Fletcher
    },
    {
        id: "P003",
        name: "City Rail Link - Station Fitout",
        location: "Auckland CBD",
        stage: "Underway",
        value: "$80M",
        startDate: "2025-06-01",
        incumbentAgency: "AWF",
        labourPrediction: [
            { month: "Dec", role: "Electrician", count: 5 },
            { month: "Jan", role: "Trade Assistant", count: 10 }
        ],
        assignedCompanyIds: [2] // Downer
    },
    {
        id: "P004",
        name: "Te Hono Avondale",
        location: "Avondale",
        stage: "Foundations",
        value: "$45M",
        startDate: "2025-11-01",
        incumbentAgency: "Unknown",
        labourPrediction: [
            { month: "Nov", role: "Labourer", count: 4 }
        ],
        assignedCompanyIds: [4] // Hawkins
    }
];

export const enhancedClients = [
    {
        id: 1,
        name: "Fletcher Construction",
        industry: "Commercial",
        activeJobs: 5,
        status: "Key Account",
        lastContact: "Yesterday",
        pipelineStage: "Active",
        tier: "1", // Tier 1: Generals
        contractStatus: "Active PSA - expires 01/01/2027",
        projectIds: ["P001", "P002"],
        network: [
            { id: 4, name: "Hawkins", relation: "Competitor" },
            { id: 2, name: "Downer NZ", relation: "JV Partner" }
        ],
        actionAlerts: [
            { type: "warning", message: "Contract Expires in 30 days" },
            { type: "info", message: "Quarterly Review due next week" }
        ],
        hiringInsights: {
            avgTimeToHire: "24 days",
            mostHiredRole: "Site Manager",
            commonFeedback: "Requires detailed work history"
        },
        keyContacts: [
            {
                name: "Sarah Jenkins",
                role: "Hiring Manager",
                influence: "Champion",
                lastContact: "2025-11-20",
                phone: "021 123 4567",
                relationshipDNA: {
                    iceBreaker: "Son plays U15 rugby for North Harbour",
                    beverage: "Flat White (Oat Milk)",
                    commStyle: "Email first. Detailed summaries.",
                    personality: "Detail-oriented, appreciates data."
                }
            },
            {
                name: "Mike Ross",
                role: "Project Director",
                influence: "Blocker",
                lastContact: "2025-10-15",
                phone: "027 987 6543",
                relationshipDNA: {
                    iceBreaker: "Keen fisherman (Snapper in the Hauraki)",
                    beverage: "Speight's",
                    commStyle: "Frosty at first. Short calls only. No emails.",
                    personality: "Old school, hates waffle."
                }
            }
        ],
        siteLogistics: {
            ppe: "Lace-up boots ONLY. White hard hats. High-vis vest (Class 2).",
            induction: "Online SiteSafe link required 24hrs prior. 1hr onsite induction Monday 7am.",
            parking: "Side street only. No onsite parking. Towaway zones on Nelson St."
        },
        financials: {
            ytdRevenue: "$145,000",
            avgFee: "$12,500",
            lastActivity: "2025-11-20"
        },
        notes: [
            { id: 1, text: "Discussed upcoming project in CBD. They need a strong QS.", date: "2025-11-20", author: "Joe" },
            { id: 2, text: "Sent rate card for 2026", date: "2025-11-15", author: "Joe" },
            { id: 3, text: "Complaint about PPE from one of the temps.", date: "2025-11-10", author: "Joe" }
        ],
        tasks: [
            { id: 1, text: "Follow up on MSA renewal", completed: false, dueDate: "2025-12-01" },
            { id: 2, text: "Schedule lunch with Sarah", completed: true, dueDate: "2025-11-18" }
        ]
    },
    {
        id: 2,
        name: "Downer NZ",
        industry: "Infrastructure",
        activeJobs: 3,
        status: "Active",
        lastContact: "2 days ago",
        pipelineStage: "Proposal",
        tier: "2", // Tier 2: Package Holders
        contractStatus: "Standard T&Cs",
        projectIds: ["P003"],
        network: [
            { id: 1, name: "Fletcher Construction", relation: "JV Partner" }
        ],
        actionAlerts: [],
        hiringInsights: {
            avgTimeToHire: "18 days",
            mostHiredRole: "Machine Operator",
            commonFeedback: "Quick to offer"
        },
        keyContacts: [
            {
                name: "David Chen",
                role: "Operations Manager",
                influence: "Budget Holder",
                phone: "022 555 1234",
                relationshipDNA: {
                    iceBreaker: "Huge Warriors fan",
                    beverage: "Long Black",
                    commStyle: "Text/Call preferred. Quick decisions.",
                    personality: "Direct, results-driven."
                }
            }
        ],
        siteLogistics: {
            ppe: "Standard PPE. Steel cap boots.",
            induction: "Onsite induction only (30 mins).",
            parking: "Onsite parking available."
        },
        financials: {
            ytdRevenue: "$85,000",
            avgFee: "$8,000",
            lastActivity: "2025-11-19"
        },
        notes: [],
        tasks: []
    },
    {
        id: 3,
        name: "Naylor Love",
        industry: "Commercial",
        activeJobs: 2,
        status: "Active",
        lastContact: "1 week ago",
        pipelineStage: "Contacted",
        tier: "2",
        contractStatus: "Negotiating PSA",
        projectIds: [],
        network: [],
        actionAlerts: [{ type: "info", message: "PSA Negotiation in progress" }],
        hiringInsights: {
            avgTimeToHire: "30 days",
            mostHiredRole: "Carpenter",
            commonFeedback: "Strict compliance checks"
        },
        keyContacts: [],
        siteLogistics: {
            ppe: "Standard PPE.",
            induction: "TBC",
            parking: "TBC"
        },
        financials: { ytdRevenue: "$45,000", avgFee: "$9,000", lastActivity: "2025-11-10" },
        notes: [],
        tasks: []
    },
    {
        id: 4,
        name: "Hawkins",
        industry: "Construction",
        activeJobs: 1,
        status: "At Risk",
        lastContact: "3 weeks ago",
        pipelineStage: "Lead",
        tier: "3", // Tier 3: Specialists
        contractStatus: "Expired",
        projectIds: ["P004"],
        network: [
            { id: 1, name: "Fletcher Construction", relation: "Competitor" }
        ],
        actionAlerts: [{ type: "warning", message: "Contract Expired" }],
        hiringInsights: {
            avgTimeToHire: "45 days",
            mostHiredRole: "Site Engineer",
            commonFeedback: "Budget constraints"
        },
        keyContacts: [],
        siteLogistics: {
            ppe: "Standard PPE.",
            induction: "TBC",
            parking: "TBC"
        },
        financials: { ytdRevenue: "$12,000", avgFee: "$12,000", lastActivity: "2025-10-30" },
        notes: [],
        tasks: []
    },
];
