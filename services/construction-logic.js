export const PHASE_TEMPLATES = {
    Commercial_Multi_Use: [
        {
            phaseId: "01_civil",
            name: "Civil & Excavation",
            sequenceOrder: 1,
            typicalDurationWeeks: 8,
            recruitmentTriggers: [
                { role: "Excavator Operator", offsetWeeks: -4 },
                { role: "Civil Labourer", offsetWeeks: -1 }
            ]
        },
        {
            phaseId: "02a_concrete",
            name: "Concrete Structure",
            sequenceOrder: 2,
            typicalDurationWeeks: 12,
            recruitmentTriggers: [
                { role: "Formworker", offsetWeeks: -3 },
                { role: "Steel Fixer", offsetWeeks: -2 },
                { role: "Concrete Carpenter", offsetWeeks: -1 }
            ]
        },
        {
            phaseId: "02b_steel",
            name: "Structural Steel",
            sequenceOrder: 3,
            typicalDurationWeeks: 6,
            recruitmentTriggers: [
                { role: "Steel Fixer", offsetWeeks: -2 },
                { role: "Crane Operator", offsetWeeks: -4 }
            ]
        },
        {
            phaseId: "02c_framing",
            name: "Timber Framing",
            sequenceOrder: 4,
            typicalDurationWeeks: 8,
            recruitmentTriggers: [
                { role: "Carpenter", offsetWeeks: -3 }
            ]
        },
        {
            phaseId: "03a_roofing",
            name: "Roofing",
            sequenceOrder: 5,
            typicalDurationWeeks: 4,
            recruitmentTriggers: [
                { role: "Roofer", offsetWeeks: -2 }
            ]
        },
        {
            phaseId: "03b_facade",
            name: "Facade & Glazing",
            sequenceOrder: 6,
            typicalDurationWeeks: 10,
            recruitmentTriggers: [
                { role: "Glazier", offsetWeeks: -4 },
                { role: "Cladder / Facade Tech", offsetWeeks: -3 }
            ]
        },
        {
            phaseId: "03c_scaffolding",
            name: "Scaffolding",
            sequenceOrder: 7,
            typicalDurationWeeks: 4,
            recruitmentTriggers: [
                { role: "Scaffolder", offsetWeeks: -2 }
            ]
        },
        {
            phaseId: "04a_electrical_rough",
            name: "Electrical Rough-in",
            sequenceOrder: 8,
            typicalDurationWeeks: 8,
            recruitmentTriggers: [
                { role: "Electrician", offsetWeeks: -2 }
            ]
        },
        {
            phaseId: "04b_plumbing_rough",
            name: "Plumbing Rough-in",
            sequenceOrder: 9,
            typicalDurationWeeks: 8,
            recruitmentTriggers: [
                { role: "Plumber / Pipe Fitter", offsetWeeks: -2 }
            ]
        },
        {
            phaseId: "04c_hvac",
            name: "HVAC & Mechanical",
            sequenceOrder: 10,
            typicalDurationWeeks: 6,
            recruitmentTriggers: [
                { role: "Duct Installer (HVAC)", offsetWeeks: -2 }
            ]
        },
        {
            phaseId: "05a_linings_stopping",
            name: "Linings & Stopping",
            sequenceOrder: 11,
            typicalDurationWeeks: 8,
            recruitmentTriggers: [
                { role: "GIB Fixer / Plasterer", offsetWeeks: -2 },
                { role: "GIB Stopper", offsetWeeks: -2 }
            ]
        },
        {
            phaseId: "05b_carpentry_trim",
            name: "Carpentry Trim",
            sequenceOrder: 12,
            typicalDurationWeeks: 6,
            recruitmentTriggers: [
                { role: "Carpenter", offsetWeeks: -3 }
            ]
        },
        {
            phaseId: "05c_flooring",
            name: "Flooring",
            sequenceOrder: 13,
            typicalDurationWeeks: 4,
            recruitmentTriggers: [
                { role: "Flooring Installer", offsetWeeks: -2 }
            ]
        },
        {
            phaseId: "05d_painting",
            name: "Painting",
            sequenceOrder: 14,
            typicalDurationWeeks: 6,
            recruitmentTriggers: [
                { role: "Painter", offsetWeeks: -2 }
            ]
        },
        {
            phaseId: "06_handover",
            name: "Defects & Handover",
            sequenceOrder: 15,
            typicalDurationWeeks: 4,
            recruitmentTriggers: [
                { role: "General Labourer / Hammerhand", offsetWeeks: -1 }
            ]
        }
    ]
};

// --- Master Role List (Source of Truth) ---
export const MASTER_ROLES = [
    "Carpenter",
    "Concrete Carpenter",
    "Formworker",
    "Glazier",
    "Flooring Installer",
    "Civil Labourer",
    "Excavator Operator",
    "Steel Fixer",
    "Cladder / Facade Tech", // Standardized to match list
    "Roofer",
    "Electrician",
    "Plumber / Pipe Fitter",
    "Duct Installer (HVAC)",
    "GIB Stopper",
    "GIB Fixer / Plasterer",
    "Cabinet Maker / Installer",
    "Painter",
    "General Labourer / Hammerhand",
    "Site Manager", // Kept for logic
    "Quantity Surveyor", // Kept for logic
    "Crane Operator", // Kept for logic
    "Scaffolder" // Kept for logic
];

export const WORKFORCE_MATRIX = {
    "01_civil": {
        "Excavator Operator": { S: "1-2", M: "2-4", L: "4-8", XL: "10+" },
        "Civil Labourer": { S: "1-2", M: "2-4", L: "5-10", XL: "15+" }
    },
    "02a_concrete": {
        "Formworker": { S: "2-4", M: "5-12", L: "15-30", XL: "40+" },
        "Steel Fixer": { S: "1-2", M: "3-6", L: "8-15", XL: "25+" },
        "Concrete Carpenter": { S: "3-5", M: "6-10", L: "12-20", XL: "30+" }
    },
    "02b_steel": {
        "Steel Fixer": { S: "1-2", M: "3-5", L: "5-10", XL: "15+" },
        "Crane Operator": { S: "0", M: "1 Team", L: "2 Teams", XL: "4 Teams" }
    },
    "02c_framing": {
        "Carpenter": { S: "2-4", M: "5-10", L: "10-20", XL: "30+" }
    },
    "03a_roofing": {
        "Roofer": { S: "2", M: "2-4", L: "5-10", XL: "15+" }
    },
    "03b_facade": {
        "Glazier": { S: "2", M: "2-6", L: "8-15", XL: "20+" },
        "Cladder / Facade Tech": { S: "2", M: "2-6", L: "8-15", XL: "20+" }
    },
    "03c_scaffolding": {
        "Scaffolder": { S: "2-3", M: "4-8", L: "10-20", XL: "40+" }
    },
    "04a_electrical_rough": {
        "Electrician": { S: "2", M: "4-8", L: "15-25", XL: "50+" }
    },
    "04b_plumbing_rough": {
        "Plumber / Pipe Fitter": { S: "2", M: "4-6", L: "10-20", XL: "40+" }
    },
    "04c_hvac": {
        "Duct Installer (HVAC)": { S: "2", M: "4-8", L: "12-20", XL: "30+" }
    },
    "05a_linings_stopping": {
        "GIB Fixer / Plasterer": { S: "1-2", M: "3-6", L: "10-15", XL: "25+" },
        "GIB Stopper": { S: "1-2", M: "3-6", L: "10-15", XL: "25+" }
    },
    "05b_carpentry_trim": {
        "Carpenter": { S: "2-4", M: "6-12", L: "20-40", XL: "60+" }
    },
    "05c_flooring": {
        "Flooring Installer": { S: "1-2", M: "2-4", L: "6-10", XL: "15+" }
    },
    "05d_painting": {
        "Painter": { S: "2-3", M: "4-8", L: "12-20", XL: "30+" }
    },
    "06_handover": {
        "General Labourer / Hammerhand": { S: "2", M: "4-6", L: "10-20", XL: "30+" },
        "Carpenter": { S: "1", M: "2-3", L: "4-6", XL: "8+" }
    }
};

export const RELATED_ROLES = {
    "Carpenter": ["Formworker", "Concrete Carpenter", "General Labourer / Hammerhand"],
    "Formworker": ["Carpenter", "Concrete Carpenter"],
    "Concrete Carpenter": ["Carpenter", "Formworker"],
    "Civil Labourer": ["General Labourer / Hammerhand"],
    "General Labourer / Hammerhand": ["Civil Labourer"],
    "Electrician": ["Electrician (Cable Puller)"],
    "Electrician (Cable Puller)": ["Electrician"],
    "GIB Stopper": ["GIB Fixer / Plasterer"],
    "GIB Fixer / Plasterer": ["GIB Stopper"],
    "Excavator Operator": ["Civil Labourer"]
};

export const PHASE_MAP = {
    "01_civil": { label: "Civil & Excavation", action: "Mobilize Excavator Operators & Civil Crew" },
    "02a_concrete": { label: "Concrete Structure", action: "Start Formworkers & Steel Fixers" },
    "02b_steel": { label: "Structural Steel", action: "Mobilize Crane & Steel Riggers" },
    "02c_framing": { label: "Timber Framing", action: "Start Framing Carpenter Crews" },
    "03a_roofing": { label: "Roofing", action: "Mobilize Roofing Team" },
    "03b_facade": { label: "Facade & Glazing", action: "Engage Glaziers & Facade Techs" },
    "03c_scaffolding": { label: "Scaffolding", action: "Erect External Scaffolding" },
    "04a_electrical_rough": { label: "Electrical Rough-in", action: "Start Cable Pulling & Rough-in" },
    "04b_plumbing_rough": { label: "Plumbing Rough-in", action: "Start Pipework & Drainage" },
    "04c_hvac": { label: "HVAC & Mechanical", action: "Install Ductwork & Units" },
    "05a_linings_stopping": { label: "Linings & Stopping", action: "Start GIB Fixing & Stopping" },
    "05b_carpentry_trim": { label: "Carpentry Trim", action: "Second Fix Carpentry & Trim" },
    "05c_flooring": { label: "Flooring", action: "Install Specialized Flooring" },
    "05d_painting": { label: "Painting", action: "Start Finishing & Internal Painting" },
    "06_handover": { label: "Handover", action: "Final Clean & Defects Management" }
};

export const getProjectSize = (valueStr) => {
    // Remove $ and M/k, attempt to parse
    if (!valueStr) return "S";

    // Simple heuristic for demo:
    let value = parseFloat(valueStr.replace(/[^0-9.]/g, ''));

    if (valueStr.toUpperCase().includes('M')) {
        // value is already in Millions
    } else if (value > 1000) {
        // Assume raw number, convert to millions
        value = value / 1000000;
    }

    if (value < 5) return "S";
    if (value < 20) return "M";
    if (value < 100) return "L";
    return "XL";
};

// --- Phase & Compliance Helpers ---
import phaseSchema from './construction-phase-schema.json';

export const CONSTRUCTION_LIFECYCLE = phaseSchema.construction_lifecycle;
export const REGIONAL_CONSTRAINTS = phaseSchema.regional_constraints;

export const getTradesForPhase = (phaseId) => {
    return CONSTRUCTION_LIFECYCLE[phaseId]?.primary_trades || [];
};

export const checkVisaCompliance = (candidate, project) => {
    if (!candidate || !project) return { valid: true };

    const isFilipino = candidate.country?.toLowerCase() === 'philippines' ||
        candidate.nationality?.toLowerCase() === 'filipino';

    if (isFilipino) {
        const approvedRegions = REGIONAL_CONSTRAINTS.approved_regions;
        const projectRegion = approvedRegions.find(region =>
            project.location?.toLowerCase().includes(region.toLowerCase()) ||
            project.state?.toLowerCase().includes(region.toLowerCase())
        );

        if (!projectRegion) {
            return {
                valid: false,
                reason: "Visa Violation: Filipino workers restricted to Auckland, Waikato, Northland, and BoP.",
                type: "RESTRICTED_REGION"
            };
        }
    }

    return { valid: true };
};

export const formatWhatsAppLink = (phone) => {
    if (!phone) return null;
    // Remove non-numeric
    let cleaned = phone.replace(/\D/g, '');
    // If starts with 0, replace with 64
    if (cleaned.startsWith('0')) {
        cleaned = '64' + cleaned.substring(1);
    }
    // If doesn't start with 64, prepend 64
    if (!cleaned.startsWith('64')) {
        cleaned = '64' + cleaned;
    }
    return `https://wa.me/${cleaned}`;
};

export const generatePhaseMessage = (candidateName, projectName, currentPhase, siteManagerName) => {
    const phaseData = CONSTRUCTION_LIFECYCLE[currentPhase];

    if (!phaseData) {
        return `Hi ${siteManagerName}, I have ${candidateName} available for ${projectName}. They're ready to start immediately. Can we discuss?`;
    }

    const trades = phaseData.primary_trades.slice(0, 2).join(' and ');
    const phaseLabel = phaseData.label;

    return `Hi ${siteManagerName}, I see you're in the ${phaseLabel} phase at ${projectName}. I have ${candidateName} available - experienced ${trades} ready to deploy. Can we arrange a site meeting?`;
};

export const generateSiteManagerWhatsAppMessage = (siteManagerName, projectName, currentPhase) => {
    const phaseData = CONSTRUCTION_LIFECYCLE[currentPhase];
    const phaseLabel = phaseData?.label || 'current phase';

    return `Hi ${siteManagerName}, I'm checking in regarding the crew at ${projectName}. Everything on track for the ${phaseLabel}?`;
};
