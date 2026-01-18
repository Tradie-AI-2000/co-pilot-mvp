"use client";
import { useState, useEffect } from 'react';
import { useData } from "@/context/data-context";
import ReactMarkdown from 'react-markdown';
import { getProjectSize } from "@/services/construction-logic"; // Import your logic!

export default function BoardroomChat({ agentId, onSignalUpdate }) {
    const {
        candidates,
        projects,
        clients,
        weeklyRevenue,
        weeklyGrossProfit,
        revenueAtRisk,
        moneyMoves
    } = useData();

    const [messages, setMessages] = useState([
        { role: 'assistant', text: "🔄 **Initializing Command Protocols...** Establishing link with Board Members..." }
    ]);
    const [input, setInput] = useState('');
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        if (weeklyRevenue !== undefined) {
            triggerInitialBriefing();
        }
    }, [weeklyRevenue]);

    // Helper to determine Financial Week (Simple version)
    const getFinancialWeek = () => {
        const today = new Date();
        const month = today.toLocaleString('default', { month: 'long' }); // e.g., "January"
        const day = today.getDate();

        // Rough logic: Week 1 (1-7), Week 2 (8-14), etc.
        const weekNum = Math.ceil(day / 7);
        return `${month}_Week_${weekNum}`; // Result: "January_Week_3"
    };

    // --- THE OMNISCIENT CONTEXT BUILDER ---
    const constructBoardContext = () => {

        const currentPeriod = getFinancialWeek(); // <--- NEW: Calculate the period

        // A. Financials
        const impliedWeeklyTarget = 6000;
        const financials = {
            weeklyRevenue: weeklyRevenue || 0,
            weeklyGrossProfit: weeklyGrossProfit || 0,
            revenueAtRisk: revenueAtRisk || 0,
            variance: (weeklyRevenue || 0) - impliedWeeklyTarget,
            status: (weeklyRevenue || 0) < impliedWeeklyTarget ? "DEFICIT" : "SURPLUS",
            currentPeriod: currentPeriod, // <--- NEW: Send this to Agent
            isHolidayMode: ["January_Week_1", "January_Week_2", "December_Week_4"].includes(currentPeriod)
        };

        // B. Risks (Crash-Proof)
        const criticalRisks = moneyMoves
            .filter(m => m.urgency === 'Critical' || m.urgency === 'High')
            .map(m => {
                let desc = m.description || "";
                if (desc.includes && desc.includes('expires in -')) {
                    desc = desc.replace(/expires in -(\d+) days/, (match, days) => `EXPIRED ${days} days ago`);
                }
                return {
                    type: m.type,
                    title: m.title,
                    description: desc,
                    impact: m.financialImpact
                };
            });

        // C. Projects (Full Fidelity)
        const activeProjectsMapped = projects
            .filter(p => p.status !== 'Completed')
            .map(p => {
                // 1. Client & Tier Resolution
                const targetId = p.clientId || p.assignedCompanyIds?.[0];
                const realClient = clients.find(c => c.id === targetId) || {};

                // Normalize Tier (e.g., "1" -> "Tier 1")
                let rawTier = p.tier || realClient.tier || "3";
                const formattedTier = rawTier.toString().toLowerCase().includes('tier') ? rawTier : `Tier ${rawTier}`;

                // 2. Phase Intelligence
                const currentPhaseObj = p.phases?.find(ph => ph.status === 'In Progress') || p.phases?.[0];
                const phaseName = currentPhaseObj ? currentPhaseObj.name : "Planning";

                // 3. Contact Resolution (The "Brian Redpath" Fix)
                // We check project.siteManager first (from add-project-modal.js), then fallback to client defaults
                const primaryContact = p.siteManager || p.projectDirector || realClient.mainContact || "Site Manager";

                return {
                    id: p.id,
                    name: p.name || p.title,
                    client: p.client || realClient.name || "Unknown",
                    value: p.financialData?.totalValue || p.value || "Unknown",
                    sizeClass: getProjectSize(p.value || "0"), // S/M/L/XL from your logic
                    currentPhase: phaseName,
                    tier: formattedTier,
                    region: p.region || p.location || "Auckland",
                    contacts: {
                        manager: primaryContact,
                        director: p.projectDirector || "Unknown",
                        safety: p.safetyOfficer || "Unknown"
                    },
                    splits: {
                        clientOwner: realClient.clientOwner || "Unknown",
                        accountManager: realClient.accountManager || realClient.clientOwner || "Unknown"
                    }
                };
            });

        // D. The Workforce (Now includes EVERYONE + Finish Dates)
        const workforceMapped = candidates
            .map(c => {
                // Calculate "Days Until Finish" for the Radar
                let daysUntilFinish = null;
                if (c.finishDate) {
                    const finish = new Date(c.finishDate);
                    const today = new Date();
                    const diffTime = finish - today;
                    daysUntilFinish = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                }

                return {
                    id: c.id,
                    name: `${c.firstName} ${c.lastName}`,
                    role: c.role,
                    status: c.status, // "Available" or "On Job"
                    location: c.location || c.suburb || "Auckland",
                    // Critical for Redeployment Radar:
                    currentProject: c.projectId || "Unassigned",
                    finishDate: c.finishDate || null,
                    daysUntilFinish: daysUntilFinish,
                    compliance: {
                        visa: c.visaExpiry ? `Expires: ${c.visaExpiry}` : "Check Status",
                        residency: c.residency || "Unknown",
                        siteSafe: c.siteSafeExpiry ? `Valid until ${c.siteSafeExpiry}` : "None/Expired"
                    },
                    tickets: c.tickets || [],
                    rating: c.internalRating || "N/A",
                    financials: {
                        payRate: c.payRate || 0,
                        chargeRate: c.chargeRate || 0,
                        guaranteedHours: c.guaranteedHours || 40
                    },
                    splits: {
                        recruiter: c.recruiter || "Unknown",
                        candidateManager: c.candidateManager || c.recruiter || "Unknown"
                    }
                };
            });

        return {
            financials, // Contains the new 'currentPeriod'
            criticalRisks,
            projects: activeProjectsMapped,
            candidates: workforceMapped, // <--- Sent as 'candidates' but now contains everyone
            timestamp: new Date().toLocaleString()
        };
    };

    const triggerInitialBriefing = async () => {
        await sendMessage("SYSTEM_STARTUP_BRIEFING", true);
    };

    const sendMessage = async (overrideText = null, isSystem = false) => {
        const textToSend = overrideText || input;
        if (!textToSend) return;

        if (!isSystem) {
            setMessages(prev => [...prev, { role: 'user', text: textToSend }]);
            setInput('');
        }

        setIsSending(true);

        try {
            const contextPayload = constructBoardContext();

            const res = await fetch('/api/agent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: textToSend,
                    agentId: 'stellar-gm',
                    context: contextPayload
                })
            });

            if (!res.ok) throw new Error("Agent link broken");

            const data = await res.json();
            const agentText = data.chat_response || data.response || "Comms received, but output was garbled.";

            setMessages(prev => {
                if (isSystem) return [{ role: 'assistant', text: agentText }];
                return [...prev, { role: 'assistant', text: agentText }];
            });

            if (data.signal_updates && onSignalUpdate) {
                onSignalUpdate(data.signal_updates);
            }

        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'assistant', text: "⚠️ **CRITICAL FAILURE:** Comm Link Severed. " + error.message }]);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="chat-container">
            <div className="message-list custom-scrollbar p-6">
                {messages.map((m, i) => (
                    <div key={i} className={`msg-bubble ${m.role}`}>
                        <span className="role-label">{m.role === 'assistant' ? 'GM JARVIS' : 'JOE'}</span>
                        <div className="markdown-content">
                            <ReactMarkdown
                                components={{
                                    strong: ({ node, ...props }) => <span className="highlight-data" {...props} />,
                                    ul: ({ node, ...props }) => <ul className="briefing-list" {...props} />,
                                    li: ({ node, ...props }) => <li className="briefing-item" {...props} />,
                                    h3: ({ node, ...props }) => <h3 className="section-header" {...props} />
                                }}
                            >
                                {m.text}
                            </ReactMarkdown>
                        </div>
                    </div>
                ))}
                {isSending && (
                    <div className="msg-bubble assistant">
                        <span className="role-label">GM JARVIS</span>
                        <span className="animate-pulse text-xs text-secondary">Consulting Board...</span>
                    </div>
                )}
            </div>

            <div className="input-area">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Send command to the Board..."
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    disabled={isSending}
                />
                <button onClick={() => sendMessage()} disabled={isSending}>
                    {isSending ? '...' : 'TRANSMIT'}
                </button>
            </div>

            <style jsx global>{`
        /* Reuse your existing styles */
        .markdown-content { font-size: 0.9rem; line-height: 1.6; color: var(--text-main); }
        .section-header { font-size: 0.8rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); margin-top: 1.2rem; margin-bottom: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 4px; }
        .highlight-data { color: var(--secondary); font-weight: 700; }
        .briefing-list { padding-left: 1rem; margin-bottom: 0.5rem; }
        .briefing-item { margin-bottom: 0.25rem; list-style-type: square; }
        .briefing-item::marker { color: var(--accent); }
        .chat-container { display: flex; flex-direction: column; height: 100%; }
        .message-list { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 1.5rem; }
        .msg-bubble { max-width: 85%; padding: 1rem 1.5rem; border-radius: 8px; background: rgba(255,255,255,0.03); }
        .msg-bubble.assistant { align-self: flex-start; border-left: 2px solid var(--secondary); }
        .msg-bubble.user { align-self: flex-end; text-align: right; border-right: 2px solid var(--accent); }
        .role-label { font-size: 0.6rem; font-weight: 800; color: var(--secondary); letter-spacing: 0.1em; display: block; margin-bottom: 0.5rem; }
        .msg-bubble.user .role-label { color: var(--accent); }
        .input-area { padding: 1.5rem; border-top: 1px solid var(--border); background: rgba(0,0,0,0.2); display: flex; gap: 1rem; }
        input { flex: 1; background: transparent; border: none; outline: none; color: white; font-family: var(--font-geist-mono); font-size: 0.9rem; }
        button { background: var(--secondary); color: var(--primary); font-weight: 800; font-size: 0.7rem; padding: 0.5rem 1.5rem; border-radius: 4px; border: none; cursor: pointer; }
        button:hover { filter: brightness(1.1); }
        button:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>
        </div>
    );
}