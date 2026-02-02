import { differenceInDays, parse, isValid } from 'date-fns';

/**
 * Analyzes a project for Health & Safety risks, specifically expiring documents.
 * 
 * @param {Object} project - The project object to analyze.
 * @returns {Object} - { hasRisk: boolean, expiringItems: Array<{ item: string, expiry: string, daysRemaining: number }> }
 */
export const analyzeProjectRisk = (project) => {
    const risks = [];
    const today = new Date();
    const WARNING_THRESHOLD_DAYS = 28; // 4 weeks

    // Helper to check expiry
    const checkExpiry = (itemName, dateString) => {
        if (!dateString) return;

        // Handle various date formats if needed, assuming ISO or standardized
        const date = new Date(dateString);
        if (!isValid(date)) return;

        const daysRemaining = differenceInDays(date, today);

        if (daysRemaining <= WARNING_THRESHOLD_DAYS) {
            risks.push({
                item: itemName,
                expiry: dateString,
                daysRemaining,
                severity: daysRemaining < 7 ? 'Critical' : 'High'
            });
        }
    };

    // 1. Check Site Specific Safety Plan (SSSP/SSA)
    // Assuming project.ssaStatus might have a date attached or we use a separate field
    // If ssaExpiry is not present, we can't check it. Assuming it exists or checking ssaStatus DATE
    if (project.ssaExpiry) {
        checkExpiry("Site Specific Safety Plan (SSSP)", project.ssaExpiry);
    }

    // 2. Check Site Visual/Induction Expiry? 
    // This depends on data shape. Checking generic 'safetyDocuments' array if it exists
    if (project.safetyDocuments && Array.isArray(project.safetyDocuments)) {
        project.safetyDocuments.forEach(doc => {
            checkExpiry(doc.name || "Safety Document", doc.expiryDate);
        });
    }

    // 3. System Review
    if (project.systemReviewDate) {
        checkExpiry("H&S Systems Review", project.systemReviewDate);
    }

    // 4. Fallback/Mock check for ssaStatus if it contains a date (e.g. "Approved until 2023-10-10")
    // This is less robust but handles legacy data strings
    if (project.ssaStatus && project.ssaStatus.includes('Until')) {
        const parts = project.ssaStatus.split('Until');
        if (parts.length > 1) {
            checkExpiry("SSA Status", parts[1].trim());
        }
    }

    return {
        hasRisk: risks.length > 0,
        expiringItems: risks.sort((a, b) => a.daysRemaining - b.daysRemaining)
    };
};
