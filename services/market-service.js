import { db } from '@/lib/db';
import { marketTenders, marketTenderStakeholders } from '@/lib/db/schema';
import { eq, desc, inArray } from 'drizzle-orm';

/**
 * Market Service
 * Handles data access for Market Intelligence
 */

export const marketService = {
    /**
     * Fetch tenders with optional filtering
     * @param {Object} filters - { region, status }
     */
    getTenders: async (filters = {}) => {
        try {
            // DEBUG: Simplified query to isolate column issues
            const query = db.select({
                id: marketTenders.id,
                title: marketTenders.title,
                description: marketTenders.description,
                status: marketTenders.status,
                createdAt: marketTenders.createdAt
            }).from(marketTenders);

            // Filters
            if (filters.region) {
                // Assuming region is a string. If list, use inArray
                // query.where(eq(marketTenders.region, filters.region));
                // Allow "Golden Triangle" logic if needed
            }

            if (filters.status) {
                query.where(eq(marketTenders.status, filters.status));
            }

            // Always order by newest
            query.orderBy(desc(marketTenders.createdAt));

            const tenders = await query;

            // Fetch stakeholders for these tenders
            // Doing a separate query to avoid massive join duplication, then map in JS
            // Or just loop if volume is low. For now, let's just get the tenders.
            // Actually, let's fetch stakeholders for all returned tenders efficiently.

            const tenderIds = tenders.map(t => t.id);
            if (tenderIds.length === 0) return [];

            const stakeholders = await db
                .select()
                .from(marketTenderStakeholders)
                .where(inArray(marketTenderStakeholders.tenderId, tenderIds));

            // Map stakeholders to tenders
            const tendersWithStakeholders = tenders.map(tender => ({
                ...tender,
                stakeholders: stakeholders.filter(s => s.tenderId === tender.id)
            }));

            return tendersWithStakeholders;

        } catch (error) {
            console.error("Error fetching market tenders:", error);
            if (error.code) console.error("DB Error Code:", error.code);
            if (error.hint) console.error("DB Error Hint:", error.hint);
            return []; // Fail safe
        }
    },

    /**
     * Update tender status
     */
    updateStatus: async (id, status) => {
        await db.update(marketTenders)
            .set({ status })
            .where(eq(marketTenders.id, id));
    },

    /**
     * Fetch and parse Google Alerts RSS (Atom)
     */
    getNewsFeed: async () => {
        const RSS_URL = "https://www.google.com/alerts/feeds/17353990683520221159/1796963529093807888";
        try {
            const response = await fetch(RSS_URL, { next: { revalidate: 3600 } }); // Cache for 1 hour
            const xml = await response.text();

            // God-mode Regex Parser (Atom format)
            const entries = [];
            const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
            let match;

            while ((match = entryRegex.exec(xml)) !== null) {
                const content = match[1];
                const title = /<title type="html">([\s\S]*?)<\/title>/.exec(content)?.[1] || "No Title";
                const link = /<link [^>]*href="([^"]+)"/.exec(content)?.[1] || "#";
                const published = /<published>([\s\S]*?)<\/published>/.exec(content)?.[1] || "";
                
                // Clean up HTML entities in title
                const cleanTitle = title.replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&');

                entries.push({
                    id: Math.random().toString(36),
                    title: cleanTitle,
                    link: link,
                    date: published ? new Date(published).toLocaleDateString() : "Recently"
                });
            }

            if (entries.length === 0) {
                return [{
                    id: "welcome",
                    title: "System Ready: Waiting for Google Alerts to trigger...",
                    link: "#",
                    date: new Date().toLocaleDateString()
                }];
            }

            return entries;
        } catch (error) {
            console.error("Error fetching RSS feed:", error);
            return [];
        }
    }
};
