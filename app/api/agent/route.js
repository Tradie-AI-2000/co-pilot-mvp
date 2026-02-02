import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { message, agentId = 'gm', context = {}, history = [] } = await request.json();
        
        const ADK_HOST = process.env.AGENT_URL || 'http://127.0.0.1:8000';
        const AGENT_MAP = {
            'gm': 'stellar_gm',
            'accountant': 'stellar_accountant',
            'candidate': 'stellar_candidate_mgr',
            'sales': 'stellar_sales_lead',
            'systems': 'stellar_systems_it',
            'immigration': 'stellar_immigration'
        };

        const adkAgentName = AGENT_MAP[agentId] || 'stellar_gm';
        const userId = "joe_local";
        const sessionId = "session_" + (context.id || "default");

        // 1. Ensure Session
        await fetch(`${ADK_HOST}/apps/${adkAgentName}/users/${userId}/sessions/${sessionId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ state: context })
        });

        // 2. Call ADK
        const res = await fetch(`${ADK_HOST}/run`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                app_name: adkAgentName,
                user_id: userId,
                session_id: sessionId,
                new_message: { parts: [{ text: message }] }
            })
        });

        const events = await res.json();
        
        let finalResponse = "";
        // SMARTER FILTER: 
        // We only want events that have content AND are NOT tool call logs.
        // ADK events with 'modelVersion' are usually the final LLM responses.
        for (const event of events) {
            if (event.content && event.content.parts) {
                // Ignore events that are just tool-call notifications
                const isToolLog = event.content.parts.some(p => p.text && p.text.includes("called tool"));
                if (!isToolLog) {
                    const text = event.content.parts.map(p => p.text).join(' ');
                    if (text.trim()) finalResponse = text;
                }
            }
        }

        return NextResponse.json({
            chat_response: finalResponse || "Agent processed the request but returned no text.",
            signal_updates: []
        });

    } catch (error) {
        return NextResponse.json({ chat_response: `**System Error:** Bridge issue (${error.message})` });
    }
}
