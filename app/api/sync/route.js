import { fetchSheetData, updateSheetRow } from '../../../services/google-sheets';
import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const tab = searchParams.get('tab');

    if (!tab) {
        return NextResponse.json({ error: 'Tab parameter is required' }, { status: 400 });
    }

    try {
        const data = await fetchSheetData(tab);
        return NextResponse.json(data);
    } catch (error) {
        console.error(`API Error (GET /api/sync?tab=${tab}):`, error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { tab, id, data } = body;

        if (!tab || !id || !data) {
            return NextResponse.json({ error: 'Missing required fields (tab, id, data)' }, { status: 400 });
        }

        const updated = await updateSheetRow(tab, id, data);
        return NextResponse.json(updated);
    } catch (error) {
        console.error('API Error (POST /api/sync):', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
