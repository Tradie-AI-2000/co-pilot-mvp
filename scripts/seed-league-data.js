
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { db } from '../lib/db/index.js';
import { marketTenders } from '../lib/db/schema.ts';
import { eq } from 'drizzle-orm';

const TOP_BUILDERS = [
    { name: "Hawkins", value: 1238144936, projects: 31, region: "Auckland", sector: "Commercial" },
    { name: "Naylor Love", value: 828901743, projects: 94, region: "Auckland", sector: "Commercial" },
    { name: "LT McGuinness", value: 763530000, projects: 18, region: "Wellington", sector: "Commercial" },
    { name: "Southbase Construction", value: 575946779, projects: 19, region: "Canterbury", sector: "Community" },
    { name: "Summerset", value: 490198029, projects: 5, region: "Waikato", sector: "Residential" },
    { name: "Watts & Hughes", value: 336400000, projects: 62, region: "Bay of Plenty", sector: "Industrial" },
    { name: "Kalmar", value: 305200000, projects: 9, region: "Auckland", sector: "Residential" },
    { name: "Apollo Projects", value: 268150000, projects: 12, region: "Canterbury", sector: "Industrial" },
    { name: "Built", value: 251000000, projects: 2, region: "Auckland", sector: "Commercial" },
    { name: "Fletcher Living", value: 221750000, projects: 4, region: "Auckland", sector: "Residential" }
];

async function seedLeague() {
    console.log("🥒 Pickle Rick: Injecting Construction League Data...");

    // Clear existing tenders to avoid dupes/mess (Optional, but cleaner for this demo)
    // await db.delete(marketTenders); 
    // Actually, let's NOT delete everything, just in case user has real data.
    // We will check if Hawkins exists first.

    const check = await db.select().from(marketTenders).where(eq(marketTenders.mainContractor, "Hawkins"));
    if (check.length > 0) {
        console.log("Data already looks seeded. Skipping to avoid duplicates.");
        process.exit(0);
    }

    const tendersToInsert = [];

    for (const builder of TOP_BUILDERS) {
        // Create a "Flagship" project for each builder
        tendersToInsert.push({
            title: `${builder.name} - Major Project`,
            description: `Flagship project for ${builder.name} from Construction League 2025.`,
            client: "Various",
            location: `${builder.region} CBD`,
            region: builder.region,
            sector: builder.sector,
            mainContractor: builder.name,
            status: "Won", // Since they are "Commenced" in the report
            value: `$${(builder.value / builder.projects).toLocaleString()}`, // Avg value
            projectValueRaw: Math.floor(builder.value / builder.projects).toString(),
            estimatedStartDate: new Date("2024-06-01"), // Retroactive
            isPursuing: false
        });

        // Add a second smaller project for variety if they have many
        if (builder.projects > 10) {
            tendersToInsert.push({
                title: `${builder.name} - Secondary Site`,
                description: `Additional capacity project.`,
                client: "Private Developer",
                location: `${builder.region} Suburbs`,
                region: builder.region,
                sector: builder.sector === "Commercial" ? "Industrial" : "Commercial",
                mainContractor: builder.name,
                status: "Won",
                value: "$5,000,000",
                projectValueRaw: "5000000",
                estimatedStartDate: new Date("2024-09-01"),
                isPursuing: false
            });
        }
    }

    await db.insert(marketTenders).values(tendersToInsert);
    console.log(`✅ Injected ${tendersToInsert.length} league projects.`);
    process.exit(0);
}

seedLeague().catch(err => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
});
