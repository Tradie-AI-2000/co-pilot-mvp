// Mock of the functions in data-context.js for testing logic

const enrichClientData = (client) => {
    // Map Spreadsheet Columns to UI Schema
    let region = client.region || client.Region || client.Location || client.location || "National";
    let industry = client.industry || client.Industry || client.Trade || client.trade || "Construction";
    
    // Normalize Tier (e.g., "Tier 1" -> "1")
    let tier = client.tier || client.Tier || "3";
    if (typeof tier === 'string') {
        tier = tier.replace(/tier\s?/i, '').trim();
    }

    // Parse Project IDs
    let projectIds = client.projectIds || client.ProjectIds || [];
    if (typeof projectIds === 'string') {
        try {
            if (projectIds.startsWith('[')) {
                projectIds = JSON.parse(projectIds);
            } else {
                projectIds = projectIds.split(',').map(id => id.trim()).filter(Boolean);
            }
        } catch (e) {
            projectIds = [];
        }
    }
    if (!Array.isArray(projectIds)) projectIds = [];

    // Parse Notes
    let notes = client.notes || client.Notes || [];
    if (typeof notes === 'string') {
        try {
            if (notes.trim().startsWith('[')) {
                notes = JSON.parse(notes);
            } else if (notes.includes('|')) {
                notes = notes.split('|').map((n, i) => ({
                    id: `note-${i}`,
                    text: n.trim(),
                    date: new Date().toISOString().split('T')[0],
                    author: "System"
                }));
            } else if (notes.trim()) {
                notes = [{
                    id: `note-0`,
                    text: notes.trim(),
                    date: new Date().toISOString().split('T')[0],
                    author: "System"
                }];
            } else {
                notes = [];
            }
        } catch (e) {
            notes = [];
        }
    }
    if (!Array.isArray(notes)) notes = [];

    return {
        ...client,
        region,
        industry,
        tier,
        projectIds,
        notes,
        // New Company Info Fields
        address: client.address || client.Address || "",
        phone: client.phone || client.Phone || client.Mobile || "",
        email: client.email || client.Email || "",
        website: client.website || client.Website || ""
    };
};

const prepareClientForSave = (client) => {
    return {
        ...client,
        // Map UI keys back to likely Spreadsheet Headers (Title Case)
        Address: client.address,
        Phone: client.phone,
        Email: client.email,
        Website: client.website,
        Location: client.region, // Assuming 'Location' is the column header for region
        Region: client.region,   // Redundant but safe if they renamed it
        Tier: client.tier,
        Industry: client.industry,
        Trade: client.industry,
    };
};

// --- TEST CASE: FORM CONSTRUCTION ---

console.log("--- TEST 1: READ from Sheet (Enrichment) ---");

const rawSheetRow = {
    id: "CL-123",
    name: "Form Construction",
    Location: "Tauranga", // Sheet column
    Tier: "Tier 2",       // Sheet column
    Industry: "Builder",  // Sheet column
    Address: "123 Cameron Rd, Tauranga",
    Phone: "07 555 1234",
    Email: "admin@form.co.nz",
    Website: "www.formnz.co.nz",
    ProjectIds: "P001, P005",
    Notes: "Great client|Pay on time"
};

const enrichedClient = enrichClientData(rawSheetRow);
console.log("Enriched Client:", JSON.stringify(enrichedClient, null, 2));

// Assertions
const check = (condition, msg) => console.log(condition ? `✅ PASS: ${msg}` : `❌ FAIL: ${msg}`);

check(enrichedClient.region === "Tauranga", "Region mapped from Location");
check(enrichedClient.tier === "2", "Tier normalized");
check(enrichedClient.address === "123 Cameron Rd, Tauranga", "Address mapped");
check(enrichedClient.phone === "07 555 1234", "Phone mapped");
check(enrichedClient.email === "admin@form.co.nz", "Email mapped");
check(enrichedClient.website === "www.formnz.co.nz", "Website mapped");
check(Array.isArray(enrichedClient.projectIds) && enrichedClient.projectIds.length === 2, "Project IDs parsed");
check(Array.isArray(enrichedClient.notes) && enrichedClient.notes.length === 2, "Notes parsed");


console.log("\n--- TEST 2: WRITE to Sheet (Preparation) ---");

// Simulate UI Edit
const uiClient = {
    ...enrichedClient,
    address: "456 Updated St, Tauranga",
    phone: "021 999 8888",
    region: "Waikato" // Changed region
};

const preparedRow = prepareClientForSave(uiClient);
console.log("Prepared Row for Sheet:", JSON.stringify(preparedRow, null, 2));

check(preparedRow.Address === "456 Updated St, Tauranga", "Address mapped back to Title Case");
check(preparedRow.Phone === "021 999 8888", "Phone mapped back");
check(preparedRow.Location === "Waikato", "Region mapped back to Location");
check(preparedRow.Tier === "2", "Tier mapped back");

console.log("\n--- TEST COMPLETE ---");
