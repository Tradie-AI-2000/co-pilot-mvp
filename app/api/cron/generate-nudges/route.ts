import { NextResponse } from 'next/server';
import { NudgeEngineRunner } from '../../../../services/nudge-engine/runner';

export async function GET() {
    try {
        const runner = new NudgeEngineRunner();
        const result = await runner.execute();

        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 500 });
        }

        return NextResponse.json(result);

    } catch (error: any) {
        console.error("CRON ERROR:", error);
        return NextResponse.json({ error: error.message, detail: error.stack }, { status: 500 });
    }
}