import { NextResponse } from 'next/server';
import { candidates } from '../../../services/mock-data';

export async function GET() {
    // Return candidates with their tickets/qualifications
    // This allows agents to 'read' the exposed tickets
    return NextResponse.json(candidates);
}

export async function POST(request) {
    const data = await request.json();
    // In a real app, save to DB. Here we just echo back.
    return NextResponse.json({ success: true, data });
}
