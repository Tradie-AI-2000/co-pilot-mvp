export const PHASE_TEMPLATES = {
    Commercial_Multi_Use: [
        {
            phaseId: "01_civil",
            name: "Civil, Piling & Excavation",
            sequenceOrder: 1,
            decisionMaker: "Project Manager / Civil Foreman",
            typicalDurationWeeks: 8,
            recruitmentTriggers: [
                { role: "Excavator Operator", offsetWeeks: -4, note: "Early start for earthworks" },
                { role: "Piling Crew (Riggers/Spotters)", offsetWeeks: -3, note: "Critical path item" },
                { role: "Civil Labourer", offsetWeeks: -1, note: "Spotters & drainage assist" }
            ]
        },
        {
            phaseId: "02_structure",
            name: "Structure (Concrete, Steel or Timber)",
            sequenceOrder: 2,
            decisionMaker: "Site Manager / Structure Foreman",
            typicalDurationWeeks: 20,
            recruitmentTriggers: [
                { role: "Formwork Carpenter", offsetWeeks: -3, note: "For concrete slab/column builds" },
                { role: "Framing Carpenter (Timber/CLT)", offsetWeeks: -3, note: "For apartments/townhouse structures" },
                { role: "Steel Fixer", offsetWeeks: -2, note: "Follows the formwork immediately" },
                { role: "Concreter", offsetWeeks: -1, note: "Pour days need large casual numbers" },
                { role: "Crane Operator & Dogman", offsetWeeks: -4, note: "Critical hire. Long lead time." }
            ]
        },
        {
            phaseId: "03_envelope",
            name: "Facade & Envelope",
            sequenceOrder: 3,
            decisionMaker: "Site Manager",
            typicalDurationWeeks: 12,
            recruitmentTriggers: [
                { role: "External Glazier / Curtain Wall Installer", offsetWeeks: -4, note: "Often subcontracted, track the Subbie" },
                { role: "Cladder / Facade Tech", offsetWeeks: -3, note: "High risk work, needs tickets" },
                { role: "Scaffolder", offsetWeeks: -6, note: "Needed before facade starts" }
            ]
        },
        {
            phaseId: "04_services_roughin",
            name: "Services Rough-in",
            sequenceOrder: 3,
            decisionMaker: "Services Manager / M&E Subcontractors",
            typicalDurationWeeks: 10,
            recruitmentTriggers: [
                { role: "Electrician (Cable Puller)", offsetWeeks: -2, note: "Volume labour for cable runs" },
                { role: "Plumber / Pipe Fitter", offsetWeeks: -2, note: "Stack work" },
                { role: "Duct Installer (HVAC)", offsetWeeks: -2, note: "Large crews needed" }
            ]
        },
        {
            phaseId: "05_fitout",
            name: "Internal Fit-out & Finishes",
            sequenceOrder: 4,
            decisionMaker: "Site Foreman / Finishes Foreman",
            typicalDurationWeeks: 16,
            recruitmentTriggers: [
                { role: "Steel Stud Framer (Carpenter)", offsetWeeks: -3, note: "Walls go up first" },
                { role: "Gib Fixer / Plasterer", offsetWeeks: -2, note: "Follows framing/sheeting" },
                { role: "Gib Stopper", offsetWeeks: -2, note: "Critical finish phase before paint" },
                { role: "Internal Glazier / Partitioner", offsetWeeks: -2, note: "Glass partitions for offices/units" },
                { role: "Flooring Installer (Timber/Vinyl)", offsetWeeks: -2, note: "Late stage finish" },
                { role: "Painter", offsetWeeks: -2, note: "Late stage volume" },
                { role: "Cabinet Maker / Joiner", offsetWeeks: -2, note: "Kitchens & joinery install" }
            ]
        },
        {
            phaseId: "06_handover",
            name: "Defects & Handover",
            sequenceOrder: 5,
            decisionMaker: "Site Manager",
            typicalDurationWeeks: 4,
            recruitmentTriggers: [
                { role: "General Labourer (Final Clean)", offsetWeeks: -1, note: "Massive volume for clean up" },
                { role: "Caulker", offsetWeeks: -1, note: "Sealing wet areas" },
                { role: "Maintenance Carpenter", offsetWeeks: -1, note: "Punch list items" }
            ]
        }
    ]
};

export const WORKFORCE_MATRIX = {
    "01_civil": {
        "Excavator Operator": { S: "1-2", M: "2-4", L: "4-8", XL: "10+" },
        "Civil Labourer": { S: "1-2", M: "2-4", L: "5-10", XL: "15+" }
    },
    "02_structure": {
        "Formwork Carpenter": { S: "2-4", M: "5-12", L: "15-30", XL: "40+" },
        "Framing Carpenter (Timber/CLT)": { S: "2-4", M: "5-10", L: "10-20", XL: "30+" }, // Added based on context
        "Steel Fixer": { S: "1-2", M: "3-6", L: "8-15", XL: "25+" },
        "Concreter": { S: "3-5", M: "6-10", L: "12-20", XL: "30+" },
        "Crane Operator & Dogman": { S: "0", M: "1 Team", L: "2 Teams", XL: "4 Teams" }
    },
    "03_envelope": {
        "Scaffolder": { S: "2-3", M: "4-8", L: "10-20", XL: "40+" },
        "External Glazier / Curtain Wall Installer": { S: "0-2", M: "2-6", L: "8-15", XL: "20+" },
        "Cladder / Facade Tech": { S: "0-2", M: "2-6", L: "8-15", XL: "20+" } // Inferred
    },
    "04_services_roughin": {
        "Electrician (Cable Puller)": { S: "2", M: "4-8", L: "15-25", XL: "50+" },
        "Plumber / Pipe Fitter": { S: "2", M: "4-6", L: "10-20", XL: "40+" },
        "Duct Installer (HVAC)": { S: "2", M: "4-8", L: "12-20", XL: "30+" }
    },
    "05_fitout": {
        "Steel Stud Framer (Carpenter)": { S: "2-4", M: "6-12", L: "20-40", XL: "60+" },
        "Gib Fixer / Plasterer": { S: "1-2", M: "3-6", L: "10-15", XL: "25+" }, // Inferred group logic
        "Gib Stopper": { S: "1-2", M: "3-6", L: "10-15", XL: "25+" },
        "Painter": { S: "2-3", M: "4-8", L: "12-20", XL: "30+" },
        "Flooring Installer (Timber/Vinyl)": { S: "1-2", M: "2-4", L: "6-10", XL: "15+" },
        "Internal Glazier / Partitioner": { S: "1-2", M: "2-4", L: "6-10", XL: "15+" }, // Inferred
        "Cabinet Maker / Joiner": { S: "1", M: "2-4", L: "5-10", XL: "15+" } // Inferred
    },
    "06_handover": {
        "General Labourer (Final Clean)": { S: "2", M: "4-6", L: "10-20", XL: "30+" },
        "Caulker": { S: "1", M: "2-3", L: "4-8", XL: "10+" }, // Inferred
        "Maintenance Carpenter": { S: "1", M: "2-3", L: "4-6", XL: "8+" } // Inferred
    }
};

export const getProjectSize = (valueStr) => {
    // Remove $ and M/k, attempt to parse
    if (!valueStr) return "S";

    // Simple heuristic for demo:
    // If user enters "150M", "150000000", etc.
    let value = parseFloat(valueStr.replace(/[^0-9.]/g, ''));

    // Handle "M" notation if exists? 
    // Usually user inputs "150M". 
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
