import { differenceInDays, isValid, parse } from 'date-fns';
import { PHASE_MAP, WORKFORCE_MATRIX, RELATED_ROLES } from './construction-logic.js';

/**
 * Calculates aggregated recruitment demand across all projects.
 * 
 * @param {Array} projects - List of all projects.
 * @returns {Object} { totalUrgent: number, breakdown: Array<{role: string, count: number, projects: []}> }
 */
export const calculateRecruitmentDemand = (projects) => {
    const today = new Date();
    const demandMap = {}; // Role -> { count, projects: Set }

    projects.forEach(p => {
        // 1. Direct Client Demands
        if (p.clientDemands && p.clientDemands.length > 0) {
            p.clientDemands.forEach(demand => {
                if (!demand.startDate) return;
                const start = new Date(demand.startDate);
                if (!isValid(start)) return;

                const diff = differenceInDays(start, today);

                // Focusing on "Urgent" (next 4 weeks) for the Dashboard
                if (diff >= -7 && diff <= 30) {
                    const role = demand.role || "General Labour";
                    if (!demandMap[role]) demandMap[role] = { count: 0, projects: new Set(), urgency: 'B' };

                    demandMap[role].count += (parseInt(demand.quantity) || 1);
                    demandMap[role].projects.add(p.name);
                    if (diff < 14) demandMap[role].urgency = 'A'; // Critical
                }
            });
        }

        // 2. Phase-based Implicit Demand
        if (p.phaseSettings) {
            Object.entries(p.phaseSettings).forEach(([phaseId, settings]) => {
                if (!settings.startDate || settings.skipped) return;

                const start = typeof settings.startDate === 'string' ? new Date(settings.startDate) : settings.startDate;
                if (!isValid(start)) return; // Handle parsing issues in component if complex format

                const diff = differenceInDays(start, today);

                // Look ahead 4 weeks
                if (diff >= 0 && diff <= 28) {
                    const rolesFromMatrix = WORKFORCE_MATRIX?.[phaseId] ? Object.keys(WORKFORCE_MATRIX[phaseId]) : [];
                    rolesFromMatrix.forEach(role => {
                        // Estimate quantity - default to 1 for "Demand Scanning" purpose
                        // In a real app, we'd look at project size 'S/M/L' to guess quantity
                        if (!demandMap[role]) demandMap[role] = { count: 0, projects: new Set(), urgency: 'B' };
                        demandMap[role].count += 1;
                        demandMap[role].projects.add(p.name);
                        if (diff < 14) demandMap[role].urgency = 'A';
                    });
                }
            });
        }
    });

    // Transform map to sorted array
    const breakdown = Object.entries(demandMap).map(([role, data]) => ({
        role,
        count: data.count,
        urgency: data.urgency,
        projects: Array.from(data.projects)
    })).sort((a, b) => {
        if (a.urgency !== b.urgency) return a.urgency.localeCompare(b.urgency); // A before B
        return b.count - a.count;
    });

    const totalUrgent = breakdown.reduce((acc, item) => acc + item.count, 0);

    return { totalUrgent, breakdown };
};

/**
 * Groups projects by a specific key for statistics.
 * @param {Array} projects 
 * @param {String} key 
 */
export const groupProjectsBy = (projects, key = 'region') => {
    const groups = {};
    projects.forEach(p => {
        // Handle "Auckland, NZ" vs "Auckland" normalization if needed
        let val = p[key] || p.location || "Unknown";
        if (val.includes(',')) val = val.split(',')[0].trim();

        if (!groups[val]) groups[val] = 0;
        groups[val]++;
    });
    return Object.entries(groups)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
};
