export const activeJobs = [
    { id: 1, title: "Formwork Carpenter", client: "Fletcher Construction", location: "Auckland CBD", rate: "$45/hr", status: "Urgent", applicants: 12 },
    { id: 2, title: "Site Traffic Management", client: "Downer", location: "North Shore", rate: "$32/hr", status: "Active", applicants: 8 },
    { id: 3, title: "Hammerhand", client: "Naylor Love", location: "Westgate", rate: "$35/hr", status: "Active", applicants: 5 },
    { id: 4, title: "Crane Operator", client: "Hawkins", location: "Airport", rate: "$55/hr", status: "Pending", applicants: 3 },
];

export const marketInsights = [
    { region: "Auckland Central", demand: "High", topRole: "Carpenters", trend: "up" },
    { region: "North Shore", demand: "Medium", topRole: "Laborers", trend: "stable" },
    { region: "South Auckland", demand: "Very High", topRole: "Machine Operators", trend: "up" },
    { region: "West Auckland", demand: "Low", topRole: "Traffic Control", trend: "down" },
];

export const recentPlacements = [
    { id: 1, candidate: "Sam T.", role: "Carpenter", client: "Fletcher", date: "2h ago", fee: "$1,200" },
    { id: 2, candidate: "Mike R.", role: "Laborer", client: "Downer", date: "5h ago", fee: "$800" },
    { id: 3, candidate: "Sarah L.", role: "Traffic Controller", client: "Fulton Hogan", date: "1d ago", fee: "$950" },
];

export const candidates = [
    {
        id: 1,
        firstName: "James",
        lastName: "Wilson",
        phone: "09 123 4567",
        mobile: "021 987 6543",
        email: "james.wilson@example.com",
        otherEmail: "j.wilson.personal@gmail.com",
        address1: "42 Construction Way",
        address2: "Apt 4B",
        suburb: "Mount Wellington",
        state: "Auckland",
        postcode: "1060",
        country: "New Zealand",
        dob: "1985-04-12",
        emergencyContact: "Sarah Wilson",
        emergencyPhone: "021 555 1234",
        currentEmployer: "Fletcher Construction",
        currentPosition: "Certified Carpenter",
        currentWorkType: "Full-time",
        currentSalary: "$85,000",
        idealPosition: "Site Foreman",
        idealWorkType: "Full-time",
        idealSalary: "$95,000",
        internalRating: 4.8,
        status: "Available",
        source: "Seek",
        noticePeriod: "Immediate",
        linkedin: "linkedin.com/in/jameswilson",
        twitter: "@jwilson_builds",
        facebook: "facebook.com/jameswilson",
        residency: "Citizen",
        residencyExpiryDate: "N/A",
        knownAs: "Jim",
        division: "Trades & Labour",
        indigenous: "No",
        emergencyContactRelationship: "Spouse",
        branch: "Auckland Central",
        idealLocation: "Auckland CBD",
        recruiter: "Joe Ward",
        dateCreated: "2024-01-15",
        dateUpdated: "2024-11-20",
        lastNote: "Keen to move into management.",
        chargeOutRate: "$65/hr",
        lat: -36.8882,
        lng: 174.8463,
        role: "Carpenter",
        finishDate: null, // Available now
        compliance: ["Site Safe", "LBP"]
    },
    {
        id: 2,
        firstName: "Peter",
        lastName: "Chen",
        phone: "09 987 6543",
        mobile: "022 123 4567",
        email: "peter.chen@example.com",
        otherEmail: "",
        address1: "15 Queen Street",
        address2: "",
        suburb: "Auckland CBD",
        state: "Auckland",
        postcode: "1010",
        country: "New Zealand",
        dob: "1990-08-25",
        emergencyContact: "Li Chen",
        emergencyPhone: "022 555 9876",
        currentEmployer: "Downer",
        currentPosition: "Hammerhand",
        currentWorkType: "Contract",
        currentSalary: "$32/hr",
        idealPosition: "Carpenter",
        idealWorkType: "Full-time",
        idealSalary: "$38/hr",
        internalRating: 4.5,
        status: "On Job",
        source: "Referral",
        noticePeriod: "None",
        linkedin: "linkedin.com/in/peterchen",
        twitter: "",
        facebook: "",
        residency: "Work Visa",
        residencyExpiryDate: "2026-05-20",
        knownAs: "Pete",
        division: "Trades & Labour",
        indigenous: "No",
        emergencyContactRelationship: "Father",
        branch: "North Shore",
        idealLocation: "North Shore",
        recruiter: "Sarah Jenkins",
        dateCreated: "2024-03-10",
        dateUpdated: "2024-11-18",
        lastNote: "Reliable worker, good feedback from site.",
        chargeOutRate: "$45/hr",
        lat: -36.8485,
        lng: 174.7633,
        role: "Hammerhand",
        finishDate: "2025-12-15", // Finishing soon (Orange Alert)
        compliance: ["Site Safe"]
    },
    {
        id: 3,
        firstName: "Mikaere",
        lastName: "Thompson",
        phone: "09 555 4321",
        mobile: "027 111 2222",
        email: "mikaere.t@example.com",
        otherEmail: "",
        address1: "88 Manukau Road",
        address2: "",
        suburb: "Manukau",
        state: "Auckland",
        postcode: "2104",
        country: "New Zealand",
        dob: "1982-11-30",
        emergencyContact: "Aroha Thompson",
        emergencyPhone: "027 333 4444",
        currentEmployer: null,
        currentPosition: null,
        currentWorkType: "Unemployed",
        currentSalary: "N/A",
        idealPosition: "Site Foreman",
        idealWorkType: "Contract",
        idealSalary: "$60/hr",
        internalRating: 5.0,
        status: "Available",
        source: "LinkedIn",
        noticePeriod: "Immediate",
        linkedin: "linkedin.com/in/mikaerethompson",
        twitter: "",
        facebook: "",
        residency: "Citizen",
        residencyExpiryDate: "N/A",
        knownAs: "Mik",
        division: "Construction Management",
        indigenous: "Yes",
        emergencyContactRelationship: "Sister",
        branch: "South Auckland",
        idealLocation: "South Auckland",
        recruiter: "Joe Ward",
        dateCreated: "2023-11-05",
        dateUpdated: "2024-11-21",
        lastNote: "Highly experienced, ready to start immediately.",
        chargeOutRate: "$85/hr",
        lat: -36.9900,
        lng: 174.8800,
        role: "Site Foreman",
        finishDate: null, // Available now
        compliance: ["Site Safe", "LBP", "First Aid"]
    },
    {
        id: 4,
        firstName: "Sione",
        lastName: "Latu",
        mobile: "021 555 8888",
        email: "sione.latu@example.com",
        suburb: "Henderson",
        state: "Auckland",
        currentEmployer: "Naylor Love",
        currentPosition: "Steel Fixer",
        chargeOutRate: "$55/hr",
        internalRating: 4.2,
        status: "On Job",
        lat: -36.8800,
        lng: 174.6300,
        role: "Steel Fixer",
        finishDate: "2026-03-01", // Long term (Green)
        compliance: ["Site Safe"]
    },
    {
        id: 5,
        firstName: "Liam",
        lastName: "O'Connor",
        mobile: "022 444 7777",
        email: "liam.oc@example.com",
        suburb: "Albany",
        state: "Auckland",
        currentEmployer: "Hawkins",
        currentPosition: "Crane Operator",
        chargeOutRate: "$75/hr",
        internalRating: 4.9,
        status: "On Job",
        lat: -36.7200,
        lng: 174.7000,
        role: "Crane Operator",
        finishDate: "2026-01-20", // Short term (Blue)
        compliance: ["Site Safe", "Crane Ticket"]
    },
    {
        id: 6,
        firstName: "Sarah",
        lastName: "Davis",
        mobile: "021 333 6666",
        email: "sarah.d@example.com",
        suburb: "Remuera",
        state: "Auckland",
        currentEmployer: "Fletcher",
        currentPosition: "Quantity Surveyor",
        chargeOutRate: "$110/hr",
        internalRating: 4.7,
        status: "On Job",
        lat: -36.8700,
        lng: 174.7800,
        role: "Quantity Surveyor",
        finishDate: "2025-12-10", // Finishing VERY soon (Orange)
        compliance: ["Site Safe", "Degree"]
    },
    {
        id: 7,
        firstName: "Ravi",
        lastName: "Patel",
        mobile: "027 222 5555",
        email: "ravi.p@example.com",
        suburb: "Avondale",
        state: "Auckland",
        currentEmployer: null,
        currentPosition: "Electrician",
        chargeOutRate: "$60/hr",
        internalRating: 4.4,
        status: "Available",
        lat: -36.8900,
        lng: 174.6800,
        role: "Electrician",
        finishDate: null,
        compliance: ["EWRB", "Site Safe"]
    },
    {
        id: 8,
        firstName: "Tom",
        lastName: "Baker",
        mobile: "021 999 0000",
        email: "tom.b@example.com",
        suburb: "Takapuna",
        state: "Auckland",
        currentEmployer: "Dempsey Wood",
        currentPosition: "Machine Operator",
        chargeOutRate: "$50/hr",
        internalRating: 4.0,
        status: "On Job",
        lat: -36.7900,
        lng: 174.7700,
        role: "Machine Operator",
        finishDate: "2026-06-01", // Long term (Green)
        compliance: ["WTR", "Site Safe"]
    }
];

export const clients = [
    {
        id: 1,
        name: "Fletcher Construction",
        industry: "Commercial",
        activeJobs: 5,
        status: "Key Account",
        lastContact: "Yesterday",
        pipelineStage: "Active",
        tier: "Tier 1: Key Account",
        contractStatus: "Active PSA - expires 01/01/2027",
        hiringInsights: {
            avgTimeToHire: "24 days",
            mostHiredRole: "Site Manager",
            commonFeedback: "Requires detailed work history"
        },
        keyContacts: [
            { name: "Sarah Jenkins", role: "Hiring Manager", preference: "Email first", phone: "021 123 4567" },
            { name: "Mike Ross", role: "Project Director", preference: "Call for senior roles", phone: "027 987 6543" }
        ],
        projects: [
            {
                id: "proj-001",
                name: "SkyCity Convention Centre Refurbishment",
                location: "Auckland CBD",
                stage: "Won",
                value: "$50M - $100M",
                startDate: "2026-02-01",
                primaryContact: "Sarah Jenkins",
                labourPrediction: [
                    { role: "Site Manager", count: 2, start: "2026-02-01", urgency: "High" },
                    { role: "Hammerhand", count: 8, start: "2026-04-01", urgency: "Medium" },
                    { role: "Quantity Surveyor", count: 1, start: "2026-01-15", urgency: "High" }
                ]
            },
            {
                id: "proj-002",
                name: "Waikato Expressway Extension",
                location: "Waikato",
                stage: "Tender",
                value: "$200M+",
                startDate: "TBD",
                primaryContact: "Mike Ross",
                labourPrediction: []
            }
        ],
        financials: {
            ytdRevenue: "$145,000",
            avgFee: "$12,500",
            lastActivity: "2025-11-20"
        },
        recruitmentActivity: {
            openJobs: [
                { id: 1, title: "Senior Site Manager", posted: "2 weeks ago", status: "Interviewing" },
                { id: 2, title: "Crane Operator", posted: "3 days ago", status: "Sourcing" }
            ],
            recentPlacements: [
                { id: 1, candidate: "James Wilson", role: "Foreman", date: "2025-10-15", fee: "$15,000" },
                { id: 2, candidate: "Sam T.", role: "Carpenter", date: "2025-09-28", fee: "$4,500" }
            ]
        },
        notes: [
            { id: 1, text: "Discussed upcoming project in CBD. They need a strong QS.", date: "2025-11-20", author: "Joe" },
            { id: 2, text: "Sent rate card for 2026", date: "2025-11-15", author: "Joe" }
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
        tier: "Tier 2: Growth Potential",
        contractStatus: "Standard T&Cs",
        hiringInsights: {
            avgTimeToHire: "18 days",
            mostHiredRole: "Machine Operator",
            commonFeedback: "Quick to offer"
        },
        keyContacts: [
            { name: "David Chen", role: "Operations Manager", preference: "Text/Call", phone: "022 555 1234" }
        ],
        projects: [
            {
                id: "proj-003",
                name: "City Rail Link - Station Fitout",
                location: "Auckland CBD",
                stage: "Underway",
                value: "$80M",
                startDate: "2025-06-01",
                primaryContact: "David Chen",
                labourPrediction: [
                    { role: "Electrician", count: 5, start: "2025-12-01", urgency: "High" },
                    { role: "Trade Assistant", count: 10, start: "2026-01-10", urgency: "Medium" }
                ]
            }
        ],
        financials: {
            ytdRevenue: "$85,000",
            avgFee: "$8,000",
            lastActivity: "2025-11-19"
        },
        recruitmentActivity: {
            openJobs: [
                { id: 3, title: "Class 4 Driver", posted: "1 week ago", status: "Shortlisting" }
            ],
            recentPlacements: [
                { id: 3, candidate: "Mike R.", role: "Laborer", date: "2025-11-01", fee: "$2,500" }
            ]
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
        tier: "Tier 2: Growth Potential",
        contractStatus: "Negotiating PSA",
        hiringInsights: {
            avgTimeToHire: "30 days",
            mostHiredRole: "Carpenter",
            commonFeedback: "Strict compliance checks"
        },
        keyContacts: [],
        projects: [],
        financials: { ytdRevenue: "$45,000", avgFee: "$9,000", lastActivity: "2025-11-10" },
        recruitmentActivity: { openJobs: [], recentPlacements: [] },
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
        tier: "Tier 3: Niche",
        contractStatus: "Expired",
        hiringInsights: {
            avgTimeToHire: "45 days",
            mostHiredRole: "Site Engineer",
            commonFeedback: "Budget constraints"
        },
        keyContacts: [],
        projects: [],
        financials: { ytdRevenue: "$12,000", avgFee: "$12,000", lastActivity: "2025-10-30" },
        recruitmentActivity: { openJobs: [], recentPlacements: [] },
        notes: [],
        tasks: []
    },
];

export const projects = [
    {
        id: "proj-101",
        name: "SkyCity Convention Centre Refurbishment",
        client: "Fletcher Construction",
        tier: "Tier 1",
        region: "Auckland CBD",
        coordinates: { lat: -36.8484, lng: 174.7622 },
        value: "$85M",
        status: "Active",
        stage: "Construction",
        startDate: "2025-02-01",
        completionDate: "2026-11-30",
        phases: [
            { name: "Planning", start: "2024-08-01", end: "2025-01-31", status: "Completed" },
            { name: "Demolition", start: "2025-02-01", end: "2025-04-30", status: "Completed" },
            { name: "Construction", start: "2025-05-01", end: "2026-06-30", status: "In Progress", progress: 45 },
            { name: "Fitout", start: "2026-04-01", end: "2026-10-30", status: "Upcoming" },
            { name: "Handover", start: "2026-11-01", end: "2026-11-30", status: "Upcoming" }
        ],
        subContractors: [
            { trade: "Demolition", name: "Ward Demolition" },
            { trade: "Electrical", name: "Aotea Electric" },
            { trade: "HVAC", name: "Aquaheat" }
        ],
        contactTriggers: [
            { id: 1, date: "2026-03-15", contact: "Bill (Site Mgr)", message: "Check formworker requirements for Fitout phase", urgency: "High" },
            { id: 2, date: "2026-05-01", contact: "Sarah (Project Lead)", message: "Confirm electrical labor schedule", urgency: "Medium" }
        ],
        hiringSignals: [
            { role: "Carpenters", count: 15, date: "2026-04-01", urgency: "High", phase: "Fitout" },
            { role: "Electricians", count: 8, date: "2026-05-15", urgency: "Medium", phase: "Fitout" }
        ],
        description: "Major refurbishment of the convention centre including new breakout spaces and updated AV infrastructure."
    },
    {
        id: "proj-102",
        name: "North Shore Hospital Tower 3",
        client: "Hawkins",
        tier: "Tier 1",
        region: "North Shore",
        coordinates: { lat: -36.7833, lng: 174.7500 },
        value: "$120M",
        status: "Active",
        stage: "Construction",
        startDate: "2024-11-01",
        completionDate: "2026-08-30",
        phases: [
            { name: "Groundworks", start: "2024-11-01", end: "2025-03-31", status: "Completed" },
            { name: "Structure", start: "2025-04-01", end: "2025-12-31", status: "In Progress", progress: 60 },
            { name: "Facade", start: "2025-10-01", end: "2026-03-31", status: "Upcoming" },
            { name: "Fitout", start: "2026-02-01", end: "2026-07-31", status: "Upcoming" }
        ],
        subContractors: [
            { trade: "Civil", name: "Dempsey Wood" },
            { trade: "Concrete", name: "Livefirm" }
        ],
        contactTriggers: [],
        hiringSignals: [
            { role: "Steel Fixers", count: 12, date: "2025-06-01", urgency: "High", phase: "Structure" },
            { role: "Crane Operators", count: 2, date: "2025-05-15", urgency: "Medium", phase: "Structure" }
        ],
        description: "New 8-storey clinical services building."
    },
    {
        id: "proj-103",
        name: "Drury Logistics Hub",
        client: "Naylor Love",
        tier: "Tier 2",
        region: "South Auckland",
        coordinates: { lat: -37.1000, lng: 174.9500 },
        value: "$45M",
        status: "Planning",
        stage: "Planning",
        startDate: "2025-06-01",
        completionDate: "2026-02-28",
        phases: [
            { name: "Planning", start: "2025-01-01", end: "2025-05-31", status: "In Progress" },
            { name: "Construction", start: "2025-06-01", end: "2026-01-31", status: "Upcoming" }
        ],
        subContractors: [],
        contactTriggers: [],
        hiringSignals: [
            { role: "Machine Operators", count: 5, date: "2025-06-01", urgency: "Medium", phase: "Construction" }
        ],
        description: "Large scale warehousing and distribution centre."
    },
    {
        id: "proj-104",
        name: "Westgate Social Housing",
        client: "Kāinga Ora",
        tier: "Tier 2",
        region: "West Auckland",
        coordinates: { lat: -36.8286, lng: 174.6119 },
        value: "$35M",
        status: "Tender",
        stage: "Tender",
        startDate: "2025-04-01",
        completionDate: "2026-03-31",
        phases: [
            { name: "Tender", start: "2025-01-01", end: "2025-03-31", status: "In Progress" },
            { name: "Construction", start: "2025-04-01", end: "2026-03-31", status: "Upcoming" }
        ],
        subContractors: [],
        contactTriggers: [],
        hiringSignals: [
            { role: "Carpenters", count: 20, date: "2025-05-01", urgency: "Low", phase: "Construction" }
        ],
        description: "Medium density housing development with 45 units."
    },
    {
        id: "proj-105",
        name: "City Rail Link - Aotea Station",
        client: "Link Alliance",
        tier: "Tier 1",
        region: "Auckland CBD",
        coordinates: { lat: -36.8485, lng: 174.7633 },
        value: "$350M",
        status: "Active",
        stage: "Construction",
        startDate: "2023-01-01",
        completionDate: "2026-12-31",
        phases: [
            { name: "Excavation", start: "2023-01-01", end: "2024-06-30", status: "Completed" },
            { name: "Structure", start: "2024-07-01", end: "2025-12-31", status: "In Progress", progress: 60 },
            { name: "Systems", start: "2025-06-01", end: "2026-09-30", status: "Upcoming" },
            { name: "Fitout", start: "2026-01-01", end: "2026-11-30", status: "Upcoming" }
        ],
        subContractors: [
            { trade: "HVAC", name: "Hastie" },
            { trade: "Electrical", name: "O'Donnell" }
        ],
        contactTriggers: [
            { id: 5, date: "2026-01-20", contact: "Pierre (Project Dir)", urgency: "High", message: "Review systems integration labor plan" }
        ],
        hiringSignals: [
            { role: "HVAC Technicians", count: 15, date: "2026-02-01", urgency: "High", phase: "Systems" },
            { role: "Electricians", count: 20, date: "2026-03-01", urgency: "Critical", phase: "Systems" }
        ],
        description: "Underground station construction including complex structural and systems integration."
    }
];
