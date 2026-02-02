
import { runProtocol } from '../services/logic-hub.js';

const MOCK_CONTEXT = {
    candidates: [
        { firstName: 'Rick', lastName: 'Sanchez', status: 'Available', guaranteedHours: 40, payRate: 50, region: 'Auckland', mood: 'Negative' },
        { firstName: 'Morty', lastName: 'Smith', status: 'Available', guaranteedHours: 0, payRate: 20, region: 'Auckland', mood: 'Neutral' },
        { firstName: 'Summer', lastName: 'Smith', status: 'On Job', financials: { chargeRate: 60, payRate: 30, guaranteedHours: 40 }, splits: { recruiter: 'Joe', clientOwner: 'Jerry' } },
        { firstName: 'Jerry', lastName: 'Smith', status: 'Available', region: 'Auckland', mood: 'Negative' }
    ],
    projects: [
        { name: 'Union Square', region: 'Auckland', phase: 'Structure' }
    ],
    clients: [
        { name: 'CMP', tier: '1', lastContact: '2025-01-01' } // Old date
    ],
    lastSyncTime: new Date().toISOString()
};

async function test() {
    console.log("🥒 TESTING LOGIC HUB 🥒");

    console.log("\n--- TEST 1: BENCH LIABILITY ---");
    const bench = await runProtocol('BENCH_LIABILITY', MOCK_CONTEXT);
    console.log(JSON.stringify(bench, null, 2));

    console.log("\n--- TEST 2: COMMISSION AUDIT ---");
    const comms = await runProtocol('COMMISSION_AUDIT', MOCK_CONTEXT);
    console.log(JSON.stringify(comms, null, 2));

    console.log("\n--- TEST 3: SQUAD BUILDER ---");
    const squads = await runProtocol('SQUAD_BUILDER', MOCK_CONTEXT);
    console.log(JSON.stringify(squads, null, 2));

    console.log("\n--- TEST 4: FLIGHT RISK ---");
    const risks = await runProtocol('FLIGHT_RISK', MOCK_CONTEXT);
    console.log(JSON.stringify(risks, null, 2));
}

test();
