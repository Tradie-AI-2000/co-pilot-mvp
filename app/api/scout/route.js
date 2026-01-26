// app/api/scout/route.js
import { NextResponse } from 'next/server';
import { generateScoutIntel } from '../../../lib/intel-engine';

export async function GET() {
    try {
        const intel = await generateScoutIntel();
        return NextResponse.json(intel);
    } catch (error) {
        console.error('Scout API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
