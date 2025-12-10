import { jobAdderService } from "./jobadder";
import { activeJobs, marketInsights, recentPlacements, candidates, clients } from "./mockData";

// Helper to check if we are in "Live Mode"
const isLiveMode = () => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem("ja_access_token");
};

export const dataProvider = {
    getDashboardStats: async () => {
        if (isLiveMode()) {
            try {
                const token = localStorage.getItem("ja_access_token");
                // In a real app, we would fetch real stats here. 
                // For now, we'll mix real data calls with some mock structure if needed.
                // This is a placeholder for the complex logic of aggregating stats from API.
                return {
                    activeJobs: activeJobs, // Fallback or map from fetchJobs
                    marketInsights: marketInsights,
                    recentPlacements: recentPlacements
                };
            } catch (e) {
                console.error("Live fetch failed, falling back to mock", e);
            }
        }
        return { activeJobs, marketInsights, recentPlacements };
    },

    getClients: async () => {
        if (isLiveMode()) {
            try {
                const token = localStorage.getItem("ja_access_token");
                const data = await jobAdderService.fetchCompanies(token);
                // Map JobAdder Company model to our UI model
                return data.items.map(c => ({
                    id: c.companyId,
                    name: c.name,
                    industry: c.industry || "General",
                    activeJobs: 0, // API doesn't give this directly in list
                    status: c.status || "Active",
                    lastContact: "Unknown"
                }));
            } catch (e) {
                console.error("Live fetch failed", e);
            }
        }
        return clients;
    },

    getCandidates: async () => {
        if (isLiveMode()) {
            try {
                const token = localStorage.getItem("ja_access_token");
                const data = await jobAdderService.fetchCandidates(token);
                // Map JobAdder Candidate model to our UI model
                return data.items.map(c => ({
                    id: c.candidateId,
                    name: `${c.firstName} ${c.lastName}`,
                    role: c.position || "Candidate",
                    status: c.status || "Available",
                    location: c.address?.city || "Unknown",
                    rating: c.rating || 0
                }));
            } catch (e) {
                console.error("Live fetch failed", e);
            }
        }
        return candidates;
    }
};
