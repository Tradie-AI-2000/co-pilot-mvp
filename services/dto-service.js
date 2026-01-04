/**
 * Data Transfer Object (DTO) Service
 * 
 * This service handles the transformation of internal data entities into public-facing
 * objects suitable for the Client Portal (Stellar Connect).
 * 
 * SECURITY CRITICAL: Ensure NO sensitive financial data (pay rates, margins) or 
 * private notes leak into these public objects.
 */

export const ClientCandidateDTO = {
    /**
     * Converts an internal Candidate object to a public-safe version.
     * @param {Object} candidate - The internal candidate object
     * @returns {Object} - The sanitized public candidate object
     */
    toPublic: (candidate) => {
        if (!candidate) return null;

        // Compliance Badges
        const badges = [];
        if (candidate.compliance && candidate.compliance.includes("Site Safe")) {
            badges.push("Site Safe");
        }
        if (candidate.compliance && candidate.compliance.includes("LBP")) {
            badges.push("LBP");
        }
        if (candidate.residency === "Citizen" || candidate.residency === "Resident") {
            badges.push("Residency Verified");
        }

        return {
            id: candidate.id,
            displayName: `${candidate.firstName} ${candidate.lastName ? candidate.lastName[0] + '.' : ''}`,
            role: candidate.role,
            // Use chargeRate as the public 'rate' (what the client pays)
            rate: candidate.chargeRate, 
            location: candidate.suburb || candidate.state,
            badges: badges,
            rating: candidate.satisfactionRating || 5,
            isAvailable: candidate.status === "Available",
            // Mask detailed dates, just show availability
            availability: candidate.status === "Available" ? "Immediate" : (candidate.finishDate ? `Available from ${candidate.finishDate}` : "On Job")
        };
    }
};

export const ClientProjectDTO = {
    /**
     * Converts an internal Project object to a public-safe version.
     * @param {Object} project - The internal project object
     * @returns {Object} - The sanitized public project object
     */
    toPublic: (project) => {
        if (!project) return null;

        return {
            id: project.id,
            name: project.name,
            location: project.location,
            stage: project.stage,
            // Only expose start date, not financials like 'estFees'
            startDate: project.startDate,
            // Exclude: value, incumbentAgency, internal notes
        };
    }
};