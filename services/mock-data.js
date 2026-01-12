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
        suburb: "Mount Wellington",
        state: "Auckland",
        residency: "Citizen",
        status: "Available",
        recruiter: "Joe Ward",
        role: "Formwork Carpenter",
        payRate: 32.50,
        chargeRate: 55.00,
        guaranteedHours: 30,
        siteSafeExpiry: "2025-05-20", // EXPIRED (Critical)
        satisfactionRating: 5,
        compliance: ["Site Safe", "LBP"]
    },
    {
        id: 2,
        firstName: "Peter",
        lastName: "Chen",
        mobile: "022 123 4567",
        email: "peter.chen@example.com",
        suburb: "Auckland CBD",
        state: "Auckland",
        residency: "Resident",
        status: "On Job",
        recruiter: "Sarah Jenkins",
        role: "Framing Carpenter",
        payRate: 30.00,
        chargeRate: 48.00,
        guaranteedHours: 30,
        finishDate: "2025-12-15",
        siteSafeExpiry: "2026-06-01",
        satisfactionRating: 2, // FLIGHT RISK (Urgent)
        compliance: ["Site Safe"]
    },
    {
        id: 3,
        firstName: "Luis",
        lastName: "Garcia",
        mobile: "022 333 4444",
        email: "l.garcia@stellar.com",
        suburb: "Manukau",
        state: "Auckland",
        residency: "Work Visa",
        status: "Floated",
        role: "Formworker",
        payRate: 34.00,
        chargeRate: 58.00,
        guaranteedHours: 30,
        visaExpiry: "2025-06-05", // EXPIRING SOON (Urgent)
        siteSafeExpiry: "2026-01-10",
        satisfactionRating: 4,
        compliance: ["Site Safe"]
    },
    {
        id: 4,
        firstName: "Sam",
        lastName: "Thompson",
        mobile: "021 555 9999",
        email: "sam.t@example.com",
        suburb: "Henderson",
        state: "Auckland",
        residency: "Citizen",
        status: "Floated",
        role: "Carpenter",
        payRate: 35.00,
        chargeRate: 60.00,
        guaranteedHours: 0,
        siteSafeExpiry: "2027-01-01",
        satisfactionRating: 5,
        compliance: ["Site Safe", "LBP"]
    },
    {
        id: 10,
        firstName: "Luis",
        lastName: "Garcia",
        mobile: "022 333 4444",
        email: "l.garcia@stellar.com",
        suburb: "Manukau",
        state: "Auckland",
        residency: "Work Visa",
        status: "On Job",
        role: "Formworker",
        payRate: 34.00,
        chargeRate: 58.00,
        guaranteedHours: 30,
        visaExpiry: "2025-06-05", // EXPIRING SOON (Urgent)
        siteSafeExpiry: "2026-01-10",
        satisfactionRating: 4,
        compliance: ["Site Safe"]
    },
    {
        id: 11,
        firstName: "Alice",
        lastName: "History",
        mobile: "021 111 2222",
        email: "alice@example.com",
        suburb: "Ponsonby",
        state: "Auckland",
        residency: "Citizen",
        status: "Available",
        recruiter: "Joe Ward",
        role: "Carpenter",
        payRate: 36.00,
        chargeRate: 62.00,
        guaranteedHours: 0,
        siteSafeExpiry: "2025-12-01",
        satisfactionRating: 5,
        compliance: ["Site Safe", "LBP"]
    },
    {
        id: 12,
        firstName: "Bob",
        lastName: "Pipeline",
        mobile: "021 222 3333",
        email: "bob@example.com",
        suburb: "Avondale",
        state: "Auckland",
        residency: "Resident",
        status: "Interviewing",
        recruiter: "Sarah Jenkins",
        role: "Site Manager",
        payRate: 55.00,
        chargeRate: 95.00,
        guaranteedHours: 40,
        siteSafeExpiry: "2026-06-01",
        satisfactionRating: 4,
        compliance: ["Site Safe", "First Aid"]
    }
];

export const clients = [
    // (Keeping legacy clients export for compatibility, though app uses enhancedClients mostly)
    { id: 1, name: "Fletcher Construction", tasks: [] },
    { id: 3, name: "Naylor Love", tasks: [] }
];