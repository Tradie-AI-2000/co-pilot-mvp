export const enhancedProjects = [
    {
        id: "P001",
        name: "SkyCity Convention Centre Refurbishment",
        description: "Large scale interior refurbishment and structural upgrade of the main convention hall and associated facilities.",
        assetOwner: "SkyCity Entertainment Group",
        address: "88 Federal Street, Auckland CBD, 1010",
        type: "Commercial High-Rise",
        funding: "Private Developer",
        value: "$85M",
        status: "Construction",
        stage: "Won", // legacy field mapping
        sitePresence: 3,
        startDate: "2026-02-01",
        projectDirector: "Sarah Jenkins (021 123 4567)",
        seniorQS: "David Miller (027 555 1212)",
        siteManager: "Mike Ross (022 987 6543)",
        safetyOfficer: "Elena Rodriguez",
        additionalSiteManagers: ["John Carter", "Kelly Smith"],
        incumbentAgency: "Currently using Tradestaff/Hays",
        parking: "Street Only",
        publicTransport: "Yes",
        ppe: ["Hard Hat", "Steel Caps", "Hi-Vis", "Safety Glasses"],
        induction: "Online SiteSafe link required 24hrs prior. 1hr onsite induction Monday 7am.",
        gateCode: "1234#",
        coordinates: { lat: -36.8485, lng: 174.7633 },
        labourPrediction: [
            { month: "Feb", role: "Site Manager", count: 2 },
            { month: "Apr", role: "Framing Carpenter", count: 8 },
            { month: "Jan", role: "Quantity Surveyor", count: 1 }
        ],
        packages: {
            "civilWorks": { name: "HEB Landscapes", status: "Completed", phase: "01_civil", label: "Civil & Excavation" },
            "concrete": { name: "Dominion Constructors", status: "Awarded", phase: "02a_concrete", label: "Concrete Structure" },
            "carpentry": {
                name: "Tendering",
                status: "Tendering",
                phase: "02c_framing",
                label: "Carpentry & Framing",
                commercialValue: 250000,
                laborRequirements: [
                    { id: "lr1", trade: "Carpenter", requiredCount: 3, assignedIds: [] },
                    { id: "lr2", trade: "Formworker", requiredCount: 2, assignedIds: [] }
                ]
            }
        },
        phaseSettings: {
            "01_civil": { startDate: "2026-02-01", offsetWeeks: 2, skipped: false },
            "02a_concrete": { startDate: "2026-03-15", offsetWeeks: 2, skipped: false },
            "02c_framing": { startDate: "2026-04-10", offsetWeeks: 2, skipped: false }
        },
        assignedCompanyIds: [1] // Fletcher
    },
    {
        id: "P002",
        name: "Waikato Expressway Extension",
        description: "Expansion of the existing expressway to four lanes including three nuevo interchanges and bridge structures.",
        assetOwner: "NZ Transport Agency (NZTA)",
        address: "Waikato Expressway Section, Cambridge, 3434",
        type: "Industrial/Shed", // Closest mapping for Infra currently
        funding: "Government/Public",
        value: "$240M",
        status: "Tender",
        stage: "Tender",
        sitePresence: 0,
        startDate: "2026-08-01",
        projectDirector: "Tom Bradley",
        seniorQS: "Linda Wu",
        siteManager: "Pending Award",
        safetyOfficer: "TBD",
        incumbentAgency: "Open Tender",
        parking: "On-site",
        publicTransport: "No",
        ppe: ["Hard Hat", "Steel Caps", "Hi-Vis"],
        induction: "Full day safety training at Cambridge Depot required.",
        coordinates: { lat: -37.892, lng: 175.462 },
        labourPrediction: [],
        packages: {
            "civilWorks": { name: "Tender Review", status: "Tendering", phase: "01_civil", label: "Bulk Earthworks" },
            "piling": { name: "Tender Review", status: "Tendering", phase: "01_civil", label: "Bridge Abutments" }
        },
        phaseSettings: {
            "01_civil": { startDate: "2026-08-01", offsetWeeks: 4, skipped: false }
        },
        assignedCompanyIds: [1] // Fletcher
    },
    {
        id: "P003",
        name: "City Rail Link - Station Fitout",
        description: "Architectural fitout of the underground station platforms including mechanical, electrical, and public art installations.",
        assetOwner: "City Rail Link Ltd",
        address: "Victoria Street West, Auckland CBD",
        type: "Commercial High-Rise",
        funding: "Government/Public",
        value: "$80M",
        status: "Construction",
        stage: "Underway",
        startDate: "2025-06-01",
        projectDirector: "Mark Hamill",
        seniorQS: "Ray Solo",
        siteManager: "David Chen (022 555 1234)",
        safetyOfficer: "Luke Skywalker",
        incumbentAgency: "AWF",
        parking: "Paid Parking",
        publicTransport: "Yes",
        ppe: ["Hard Hat", "Steel Caps", "Hi-Vis", "Safety Glasses"],
        induction: "Rail Industry Worker (RIW) card required for site entry. Induction Tue/Thu 8am.",
        coordinates: { lat: -36.848, lng: 174.761 },
        labourPrediction: [
            { month: "Dec", role: "Electrician", count: 5 },
            { month: "Jan", role: "Trade Assistant", count: 10 }
        ],
        packages: {
            "electrical": {
                name: "Auckland Electrical Ltd",
                status: "On-Site",
                phase: "04a_electrical_rough",
                label: "Main Electrical",
                commercialValue: 80000,
                laborRequirements: [
                    { id: "lr3", trade: "Electrician", requiredCount: 5, assignedIds: [] }
                ]
            },
            "interiors": { name: "Insite Interiors", status: "Awarded", phase: "05a_linings_stopping", label: "Ceiling Systems" }
        },
        phaseSettings: {
            "04a_electrical_rough": { startDate: "2025-06-01", offsetWeeks: 2, skipped: false },
            "04c_hvac": { startDate: "2025-12-01", offsetWeeks: 2, skipped: false },
            "05a_linings_stopping": { startDate: "2026-02-15", offsetWeeks: 2, skipped: false }
        },
        assignedCompanyIds: [2] // Downer
    },
    {
        id: "P004",
        name: "Te Hono Avondale",
        description: "Community library and multi-purpose venue featuring sustainable timber construction and native landscaping.",
        assetOwner: "Auckland Council",
        address: "Racecourse Parade, Avondale",
        type: "Social Housing", // Closest tag for community
        funding: "Government/Public",
        value: "$45M",
        status: "Construction",
        stage: "Foundations",
        startDate: "2025-11-01",
        projectDirector: "Sione Tuipulotu",
        seniorQS: "Mele Kaho",
        siteManager: "Henare Wiki",
        safetyOfficer: "Tania Ngata",
        incumbentAgency: "Unknown",
        parking: "Street Only",
        publicTransport: "Yes",
        ppe: ["Hard Hat", "Steel Caps", "Hi-Vis"],
        induction: "Standard siteSafey induction daily at 7:30am.",
        coordinates: { lat: -36.898, lng: 174.701 },
        labourPrediction: [
            { month: "Nov", role: "Labourer", count: 4 }
        ],
        packages: {
            "civilWorks": { name: "JFC Ltd", status: "Completed", phase: "01_civil", label: "Ground Remediation" },
            "concrete": { name: "Conslab", status: "On-Site", phase: "02a_concrete", label: "Floor Slabs" }
        },
        phaseSettings: {
            "01_civil": { startDate: "2025-11-01", offsetWeeks: 2, skipped: false },
            "02a_concrete": { startDate: "2026-01-20", offsetWeeks: 2, skipped: false }
        },
        assignedCompanyIds: [4] // Hawkins
    },
    {
        id: "P005",
        name: "Sylvia Park Expansion - Retail",
        description: "Construction of a new level of retail space above existing structures, requiring intensive structural steel and glazing.",
        assetOwner: "Kiwi Property Group",
        address: "286 Mount Wellington Highway, Mt Wellington",
        type: "Commercial High-Rise",
        funding: "Private Developer",
        value: "$120M",
        status: "Construction",
        stage: "Structure",
        startDate: "2026-01-15",
        projectDirector: "Chris Evans",
        seniorQS: "Scarlett Johanssen",
        siteManager: "Robert Downey",
        safetyOfficer: "Pepper Potts",
        incumbentAgency: "Tradestaff",
        parking: "Paid Parking",
        publicTransport: "Yes",
        ppe: ["Hard Hat", "Steel Caps", "Hi-Vis", "Safety Glasses"],
        induction: "Induction booked via KPG portal. Site entry via Service Lane 4.",
        coordinates: { lat: -36.915, lng: 174.841 },
        labourPrediction: [],
        packages: {
            "steel": { name: "D&H Steel", status: "On-Site", phase: "02b_steel", label: "Structural Steel" },
            "facade": { name: "Thermosash", status: "Awarded", phase: "03b_facade", label: "Curtain Wall" },
            "roofing": {
                name: "Roofing Industries",
                status: "Tendering",
                phase: "03a_roofing",
                label: "Metal Roofing",
                laborRequirements: [
                    { id: "lr4", trade: "Roofer", requiredCount: 4, assignedIds: [] }
                ]
            }
        },
        phaseSettings: {
            "02b_steel": { startDate: "2026-01-15", offsetWeeks: 2, skipped: false },
            "03a_roofing": { startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], offsetWeeks: 2, skipped: false },
            "03b_facade": { startDate: "2026-03-01", offsetWeeks: 2, skipped: false }
        },
        assignedCompanyIds: [3] // Naylor Love
    },
    {
        id: "P006",
        name: "Datacom Data Centre",
        description: "Tier 4 Data Centre featuring heavy mechanical cooling systems and redundant power infrastructure.",
        assetOwner: "Datacom Group",
        address: "7 Kotuku Drive, Westgate",
        type: "Industrial/Shed",
        funding: "Private Developer",
        value: "$200M",
        status: "Construction",
        stage: "Civil",
        startDate: "2026-03-01",
        projectDirector: "Satya Nadella",
        seniorQS: "Amy Hood",
        siteManager: "Kevin Scott",
        safetyOfficer: "Brad Smith",
        incumbentAgency: "Hays",
        parking: "On-site",
        publicTransport: "No",
        ppe: ["Hard Hat", "Steel Caps", "Hi-Vis", "Safety Glasses"],
        induction: "Police vetting required for site access. Daily induction at 7am.",
        coordinates: { lat: -36.819, lng: 174.597 },
        labourPrediction: [],
        packages: {
            "civilWorks": { name: "Tracks NZ", status: "On-Site", phase: "01_civil", label: "Civil Services" },
            "concrete": {
                name: "Tendering",
                status: "Tendering",
                phase: "02a_concrete",
                label: "Pre-cast Foundations",
                laborRequirements: [
                    { id: "lr5", trade: "Concrete Placer", requiredCount: 6, assignedIds: [] }
                ]
            }
        },
        phaseSettings: {
            "01_civil": { startDate: "2026-03-01", offsetWeeks: 2, skipped: false },
            "02a_concrete": { startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], offsetWeeks: 2, skipped: false }
        },
        assignedCompanyIds: [1] // Fletcher
    },
    {
        id: "P007",
        name: "North Shore Hospital Expansion",
        description: "Modernisation and addition of a new surgical wing with state-of-the-art operating theatres.",
        assetOwner: "Health NZ (Te Whatu Ora)",
        address: "124 Shakespeare Road, Takapuna",
        type: "Healthcare",
        funding: "Government/Public",
        value: "$150M",
        status: "Tender",
        stage: "Signal",
        startDate: "2026-06-01",
        projectDirector: "Dr. Meredith Grey",
        seniorQS: "Miranda Bailey",
        siteManager: "TBD",
        incumbentAgency: "Unknown",
        parking: "Street Only",
        publicTransport: "Yes",
        ppe: ["Hard Hat", "Steel Caps", "Hi-Vis", "Face Mask"],
        induction: "Hospital protocols apply. Vaccine evidence required for entry.",
        coordinates: { lat: -36.784, lng: 174.757 },
        labourPrediction: [],
        packages: {
            "civilWorks": { name: "Planning", status: "Tendering", phase: "01_civil", label: "Demolition" }
        },
        phaseSettings: {
            "01_civil": { startDate: "2026-06-01", offsetWeeks: 4, skipped: false }
        },
        assignedCompanyIds: [] // No client yet
    },
    {
        id: "P008",
        name: "Viaduct Green Apartments",
        description: "6-star green-rated luxury apartments overlooking the Waitemata Harbour, focusing on zero-waste construction.",
        assetOwner: "Precinct Properties",
        address: "Halsey Street, Wynyard Quarter",
        type: "Residential Block",
        funding: "Private Developer",
        value: "$40M",
        status: "Lead",
        stage: "Concept",
        startDate: "TBD",
        projectDirector: "Lord Foster",
        seniorQS: "Zaha Hadid",
        siteManager: "TBD",
        incumbentAgency: "Unknown",
        parking: "Paid Parking",
        publicTransport: "Yes",
        ppe: ["Hard Hat", "Steel Caps", "Hi-Vis"],
        induction: "Sustainability workshop mandatory prior to induction.",
        coordinates: { lat: -36.843, lng: 174.754 },
        labourPrediction: [],
        packages: {},
        phaseSettings: {},
        assignedCompanyIds: [] // No client yet
    },
    // --- Hunter Test: Matchmaker Target ---
    {
        id: "P099",
        name: "Westfield Albany - Fit Out",
        description: "Major retail fit-out for new mall extension.",
        assetOwner: "Scentre Group",
        address: "Don McKinnon Drive, Albany",
        type: "Commercial",
        funding: "Private",
        value: "$15M",
        status: "Construction",
        stage: "Fitout",
        startDate: "2026-01-22", // HUNTER TEST: Starts in 10 Days
        projectDirector: "Test Director",
        seniorQS: "Test QS",
        siteManager: "Test Site Manager",
        safetyOfficer: "TBD",
        incumbentAgency: "None",
        parking: "On-site",
        publicTransport: "Yes",
        ppe: ["Hard Hat", "Steel Caps", "Hi-Vis"],
        induction: "Standard",
        coordinates: { lat: -36.733, lng: 174.708 }, // Albany
        labourPrediction: [],
        packages: {},
        phaseSettings: {
            "05b_carpentry_trim": { startDate: "2026-01-22", offsetWeeks: 4, skipped: false } // Trigger Matchmaker (Carpenters)
        },
        assignedCompanyIds: [99] // Alpha Auckland
    }
];

export const enhancedClients = [
    {
        id: 1,
        name: "Fletcher Construction",
        industry: "Builder", // Updated from Commercial
        region: "Auckland", // New field
        activeJobs: 5,
        status: "Key Account", // Maps to Active
        lastContact: "2025-12-01", // FIXED: Was "Yesterday", set to >30 days for Tier 1 Defense
        pipelineStage: "Active",
        tier: "1", // Tier 1: Generals
        contractStatus: "Active PSA - expires 01/01/2027",
        projectIds: ["P001", "P002", "P006"],
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
            { id: 1, text: "Follow up on MSA renewal", completed: false, dueDate: new Date().toISOString().split('T')[0] }, // DUE TODAY
            { id: 2, text: "Schedule lunch with Sarah", completed: true, dueDate: "2025-11-18" }
        ]
    },
    {
        id: 2,
        name: "Downer NZ",
        industry: "Civil", // Mapped to Civil/Infrastructure
        region: "Waikato",
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
        tasks: [
            { id: 3, text: "Send updated rate card for Machine Operators", completed: false, dueDate: new Date().toISOString().split('T')[0] } // DUE TODAY
        ]
    },
    {
        id: 3,
        name: "Naylor Love",
        industry: "Builder",
        region: "Auckland",
        activeJobs: 2,
        status: "Active",
        lastContact: "1 week ago",
        pipelineStage: "Contacted",
        tier: "2",
        contractStatus: "Negotiating PSA",
        projectIds: ["P005"],
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
        tasks: [
            { id: 1, text: "Follow up with Steve re: Tauranga Cool Store", completed: false, dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], urgency: "High" }
        ]
    },
    {
        id: 4,
        name: "Hawkins",
        industry: "Builder",
        region: "Waikato",
        activeJobs: 0,
        status: "At Risk", // Inactive
        lastContact: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
        pipelineStage: "Lead",
        tier: "3", // Tier 3: Specialists
        contractStatus: "Expired",
        projectIds: ["P004"],
        network: [
            { id: 1, name: "Fletcher Construction", relation: "Competitor" }
        ],
        actionAlerts: [{ type: "warning", message: "Contract Expires" }],
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
    // --- Dormant Client (Archaeologist Target) ---
    {
        id: 5,
        name: "Icon Co",
        industry: "Formwork",
        region: "Auckland",
        activeJobs: 0,
        status: "Dormant", // Never Used / Inactive
        lastContact: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 95 days ago
        pipelineStage: "Dormant",
        tier: "1",
        contractStatus: "Active PSA",
        projectIds: ["P009"], // Need to ensure this exists or is handled
        network: [],
        actionAlerts: [{ type: "risk", message: "Dormant > 90 Days" }],
        hiringInsights: { avgTimeToHire: "14 days", mostHiredRole: "Steel Fixer", commonFeedback: "High volume user" },
        keyContacts: [
            {
                name: "Tom Builders", role: "Site Manager", influence: "User", phone: "021 111 2222",
                relationshipDNA: { iceBreaker: "Loves fishing", beverage: "Beer", commStyle: "Phone", personality: "Gruff" }
            }
        ],
        siteLogistics: { ppe: "Standard", induction: "Online", parking: "None" },
        financials: { ytdRevenue: "$250,000", avgFee: "$15,000", lastActivity: "2025-09-01" }, // Old date
        notes: [],
        tasks: []
    },
    {
        id: 6,
        name: "Thermosash",
        industry: "Glazier",
        region: "Auckland",
        activeJobs: 1,
        status: "Active",
        lastContact: "Yesterday",
        pipelineStage: "Active",
        tier: "2",
        contractStatus: "Active",
        projectIds: [],
        network: [],
        actionAlerts: [],
        hiringInsights: {},
        keyContacts: [],
        siteLogistics: {},
        financials: {},
        notes: [],
        tasks: []
    },
    {
        id: 7,
        name: "D&H Steel",
        industry: "Formwork", // Mapped to Structure
        region: "BoP",
        activeJobs: 2,
        status: "Active",
        lastContact: "Today",
        pipelineStage: "Active",
        tier: "2",
        contractStatus: "Active",
        projectIds: [],
        network: [],
        actionAlerts: [],
        hiringInsights: {},
        keyContacts: [],
        siteLogistics: {},
        financials: {},
        notes: [],
        tasks: []
    },
    {
        id: 8,
        name: "Roofing Industries",
        industry: "Door & Windows", // Mapped loosely
        region: "Northland",
        activeJobs: 0,
        status: "Never Used",
        lastContact: "Never",
        pipelineStage: "Prospect",
        tier: "3",
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
    },
    // --- Hunter Test: Relationship Decay ---
    {
        id: 99,
        name: "Alpha Auckland",
        industry: "Construction",
        region: "Auckland",
        activeJobs: 2,
        status: "Active",
        lastContact: "2025-12-23", // HUNTER TEST: 20 Days ago (Tier 1 Risk)
        pipelineStage: "Active",
        tier: "1",
        contractStatus: "Preferred Supplier",
        projectIds: ["P099"],
        network: [],
        actionAlerts: [],
        hiringInsights: { avgTimeToHire: "10 days", mostHiredRole: "Carpenter" },
        keyContacts: [{ name: "John Alpha", role: "Director", phone: "021 999 888", influence: "Champion" }],
        siteLogistics: {},
        financials: { ytdRevenue: "$500,000", avgFee: "$15,000", lastActivity: "2025-12-20" },
        notes: [],
        tasks: []
    }
];

export const mockLeads = [
    {
        id: "L001",
        companyName: "China State Construction",
        contactName: "Li Wei",
        contactRole: "Project Director",
        source: "BCI Central",
        status: "Cold",
        estimatedValue: "$200k/yr",
        lastContacted: null,
        notes: "Won the 'Te Kaha' arena project."
    },
    {
        id: "L002",
        companyName: "Besix Watpac",
        contactName: "James O'Connor",
        contactRole: "Construction Manager",
        source: "LinkedIn",
        status: "Warm",
        estimatedValue: "$150k/yr",
        lastContacted: "2025-11-01",
        notes: "Met at conference. Interested in labour hire."
    }
];

export const mockTenders = [
    {
        id: "T001",
        title: "Auckland Airport - Domestic Terminal Upgrade",
        client: "Auckland Airport",
        location: "Mangere",
        value: "$300M",
        closingDate: "2026-03-30",
        description: "Main contract for the domestic terminal integration.",
        sourceUrl: "https://www.tenderlink.com/aucklandairport",
        isPursuing: false
    },
    {
        id: "T002",
        title: "University of Auckland - Recreation Centre",
        client: "UoA",
        location: "Auckland CBD",
        value: "$80M",
        closingDate: "2026-02-15",
        description: "Demolition and new build of rec centre.",
        sourceUrl: "https://www.gets.govt.nz",
        isPursuing: true
    }
];

export const mockSharePointData = {
    finishingSoon: {
        lastSynced: "Just Now",
        summary: [
            { code: "TOPUP", description: "30 hour top up", count: 2, color: "#FFFFE0" },
            { code: "EXTLEAVE", description: "On leave", count: 30, color: "#D1E7F2" },
            { code: "NEWPL", description: "Changing assignments", count: 18, color: "#FFDAB9" },
            { code: "LWOP", description: "Leave without pay", count: 5, color: "#E0FFFF" },
            { code: "FINSOON", description: "Imminently finishing (2-3 wk)", count: 2, color: "#FFDEAD" }
        ],
        rows: [
            { code: "TOPUP", name: "Jay Hingada", trade: "Carpenter", client: "Form", endDate: "2025-12-19", location: "Tauranga", notes: "" },
            { code: "TOPUP", name: "Melecio Rillera", trade: "Carpenter", client: "Form", endDate: "2025-12-19", location: "Tauranga", notes: "" },
            { code: "LWP", name: "Charlito Crieta", trade: "Carpenter", client: "Fosters", endDate: "2025-11-21", location: "Hamilton", notes: "Returning Christmas Shutdown" },
            { code: "FINSOON", name: "Julius Delosreyes", trade: "ETA", client: "Feisst", endDate: "2025-12-19", location: "Auckland", notes: "send forced shutdown to 12th" },
            { code: "LWOP", name: "Vicente Guevara", trade: "ETA", client: "McKay", endDate: "2025-12-05", location: "Auckland", notes: "Medical Leave - likely to not renew visa" },
            { code: "EXTLEAVE", name: "Elmer Carpintero", trade: "ETA", client: "Feisst", endDate: "2025-12-19", location: "Waikato", notes: "Christmas shutdown until 12/01" },
            { code: "EXTLEAVE", name: "Edwin Mallari", trade: "ETA", client: "Atkore", endDate: "2025-12-18", location: "Auckland", notes: "Christmas shutdown until 12/01" },
            { code: "EXTLEAVE", name: "Marcelino Farbo", trade: "ETA", client: "Global-fire", endDate: "2025-12-18", location: "Auckland", notes: "Christmas shutdown until 12/01" },
            { code: "NOTICE", name: "Samuele Taukiri", trade: "Scaffolder", client: "Direct", endDate: "2025-12-20", location: "Whangarei", notes: "Relocating" },
            { code: "NEWPL", name: "Lote Lafaele", trade: "General Hand", client: "Naylor Love", endDate: "2025-12-15", location: "Auckland", notes: "Auckland Hospital" }
        ]
    },
    clientDemand: {
        lastSynced: "Just now",
        rows: [
            { role: "Pipefitters", am: "Craig", client: "Economech", location: "Hamilton", start: "TBC", duration: "2-3 weeks", count: 2, status: "Confirmed", fillers: ["Vivencio Celo Jr"] },
            { role: "Registered Electricians", am: "Blair", client: "McKay", location: "NZ Steel", start: "25/11/2025", duration: "3 months", count: 1, status: "Floated AM", fillers: ["Leonard Dela Pena"] },
            { role: "ETA's", am: "Blair", client: "Bishman", location: "Fisher & Paykel", start: "Feb-March", duration: "12+ months", count: 10, status: "Rejected", fillers: ["Fernando Pinote"] },
            { role: "Carpenters", am: "Joe", client: "Form", location: "Tauranga", start: "5th Jan", duration: "ongoing", count: 2, status: "Confirmed", fillers: ["Carlito Hingada", "Roberto Salviterra"] }
        ]
    }
};
