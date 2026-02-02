import { describe, it, expect, vi } from 'vitest';
import { analyzeProjectRisk } from '../../services/risk-logic.js';

describe('risk-logic', () => {
    it('should detect no risk when dates are far in the future', () => {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 100);
        
        const project = {
            ssaExpiry: futureDate.toISOString(),
            systemReviewDate: futureDate.toISOString()
        };

        const result = analyzeProjectRisk(project);
        expect(result.hasRisk).toBe(false);
        expect(result.expiringItems).toHaveLength(0);
    });

    it('should detect critical risk for SSA expiry within 7 days', () => {
        const nearFuture = new Date();
        nearFuture.setDate(nearFuture.getDate() + 2);

        const project = {
            ssaExpiry: nearFuture.toISOString()
        };

        const result = analyzeProjectRisk(project);
        expect(result.hasRisk).toBe(true);
        expect(result.expiringItems[0].severity).toBe('Critical');
        expect(result.expiringItems[0].item).toContain('SSSP');
    });

    it('should detect high risk for documents expiring between 7 and 28 days', () => {
        const midFuture = new Date();
        midFuture.setDate(midFuture.getDate() + 20);

        const project = {
            systemReviewDate: midFuture.toISOString()
        };

        const result = analyzeProjectRisk(project);
        expect(result.hasRisk).toBe(true);
        expect(result.expiringItems[0].severity).toBe('High');
    });

    it('should handle safetyDocuments array', () => {
        const nearFuture = new Date();
        nearFuture.setDate(nearFuture.getDate() + 5);

        const project = {
            safetyDocuments: [
                { name: 'Induction', expiryDate: nearFuture.toISOString() }
            ]
        };

        const result = analyzeProjectRisk(project);
        expect(result.hasRisk).toBe(true);
        expect(result.expiringItems).toHaveLength(1);
        expect(result.expiringItems[0].item).toBe('Induction');
    });

    it('should ignore invalid dates', () => {
        const project = {
            ssaExpiry: 'invalid-date'
        };

        const result = analyzeProjectRisk(project);
        expect(result.hasRisk).toBe(false);
    });
});
