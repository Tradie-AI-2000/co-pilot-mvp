import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { db } from '../lib/db/index.js';
import { marketTenders, marketTenderStakeholders } from '../lib/db/schema.ts';
import { eq, isNull } from 'drizzle-orm';

async function fixData() {
    console.log("🥒 Pickle Rick: Scrubbing the database...");

    // 1. Delete the ghost stakeholders (empty rows)
    const deleted = await db.delete(marketTenderStakeholders)
        .where(isNull(marketTenderStakeholders.tenderId))
        .returning();
    
    console.log(`Deleted ${deleted.length} ghost stakeholders.`);

    // 2. Find or Create the 'Warehouse Project'
    let tenders = await db.select().from(marketTenders).where(eq(marketTenders.title, 'Warehouse Project'));
    let tenderId;

    if (tenders.length === 0) {
        console.log("Warehouse Project not found, creating it...");
        const newTender = await db.insert(marketTenders).values({
            title: "Warehouse Project",
            description: "Large scale distribution center in Papatoetoe.",
            client: "Foodstuffs",
            location: "Papatoetoe, Auckland",
            region: "Auckland",
            status: "New",
            value: "$53,450,000",
            estimatedStartDate: new Date("2026-06-01"),
            isPursuing: false
        }).returning();
        tenderId = newTender[0].id;
    } else {
        console.log("Found Warehouse Project, updating details...");
        tenderId = tenders[0].id;
        await db.update(marketTenders).set({
            region: "Auckland",
            client: "Foodstuffs",
            location: "Papatoetoe, Auckland",
            description: "Large scale distribution center in Papatoetoe.",
            status: "New", // Ensure it shows in the first column
            subcontractors: [{ trade: "HVAC", name: "Thermosys" }] // Mock sub data
        }).where(eq(marketTenders.id, tenderId));
    }

    // 3. Insert VALID Stakeholders linked to this Tender
    console.log(`Injecting stakeholders for Tender ID: ${tenderId}`);
    
    await db.insert(marketTenderStakeholders).values([
        {
            tenderId: tenderId,
            name: "Gary Construction",
            role: "Project Director",
            email: "gary@example.com",
            phone: "021 123 4567",
            contactInfo: "Late mornings only"
        },
        {
            tenderId: tenderId,
            name: "Sarah Architect",
            role: "Lead Designer",
            email: "sarah@design.co.nz",
            phone: "022 987 6543"
        }
    ]);

    console.log("✅ Data fixed. Wubba Lubba Dub Dub!");
    process.exit(0);
}

fixData().catch(err => {
    console.error("❌ Script failed:", err);
    process.exit(1);
});
