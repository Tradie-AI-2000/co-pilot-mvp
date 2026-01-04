"use client";

import { useState, useEffect } from "react";
import { useData } from "../context/data-context.js";
import { Phone, CheckCircle, XCircle, Clock, Zap, Calendar, MessageSquare, ArrowRight, Trophy } from "lucide-react";

export default function GoldenHourMode() {
    const { clients, moneyMoves } = useData();
    const [queue, setQueue] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [callState, setCallState] = useState("idle"); // idle, calling, logged
    const [streak, setStreak] = useState(0);
    const [sessionScore, setSessionScore] = useState(0);
    const [timer, setTimer] = useState(3600); // 60 mins in seconds

    // 1. Build the "Hit List"
    useEffect(() => {
        // Filter clients with Urgent Tasks or Risk triggers
        const priorityIds = moneyMoves
            .filter(m => (m.type === 'risk' || m.type === 'task') && (m.urgency === 'High' || m.urgency === 'Critical'))
            .map(m => m.clientId)
            .filter(Boolean); // Remove undefined

        const hitList = clients.filter(c => priorityIds.includes(c.id) || c.status === 'Key Account');
        
        // Mock data enhancement for the queue
        const enhancedQueue = hitList.map(c => ({
            ...c,
            reason: moneyMoves.find(m => m.clientId === c.id)?.title || "Scheduled Follow-up",
            contactName: c.keyContacts?.[0]?.name || "Primary Contact",
            contactRole: c.keyContacts?.[0]?.role || "Manager"
        }));

        setQueue(enhancedQueue.slice(0, 10)); // Focus on top 10
    }, [clients, moneyMoves]);

    // Timer Logic
    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((t) => (t > 0 ? t - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const currentLead = queue[currentIndex];

    const handleCallStart = () => {
        setCallState("calling");
    };

    const handleOutcome = (outcome) => {
        setCallState("logged");
        
        // Gamification Logic
        if (outcome === 'meeting' || outcome === 'deal') {
            setStreak(s => s + 1);
            setSessionScore(s => s + 50 + (streak * 10));
        } else if (outcome === 'contact') {
            setSessionScore(s => s + 10);
        } else {
            setStreak(0); // Reset streak on bad outcome
        }

        setTimeout(() => {
            if (currentIndex < queue.length - 1) {
                setCurrentIndex(c => c + 1);
                setCallState("idle");
            } else {
                setCallState("finished");
            }
        }, 1500);
    };

    if (!currentLead && callState !== "finished") return <div className="p-10 text-center text-muted">Building your hit list...</div>;

    if (callState === "finished") {
        return (
            <div className="finish-screen">
                <Trophy size={64} className="text-yellow-400 mb-4" />
                <h2>Golden Hour Complete!</h2>
                <div className="stats-grid">
                    <div className="stat">
                        <div className="val">{sessionScore}</div>
                        <div className="lbl">Score</div>
                    </div>
                    <div className="stat">
                        <div className="val">{queue.length}</div>
                        <div className="lbl">Calls Made</div>
                    </div>
                </div>
                <button className="reset-btn" onClick={() => window.location.reload()}>Start New Session</button>
            </div>
        );
    }

    return (
        <div className="golden-hour-container">
            {/* Top HUD */}
            <div className="hud-bar">
                <div className="timer">
                    <Clock size={20} className="text-rose-500 animate-pulse" />
                    <span className="font-mono text-xl font-bold">{formatTime(timer)}</span>
                </div>
                <div className="streak-meter">
                    <div className="flex items-center gap-2">
                        <Zap size={20} className={streak > 2 ? "text-yellow-400 fill-yellow-400" : "text-slate-600"} />
                        <span className="text-lg font-bold">x{streak} Streak</span>
                    </div>
                    <div className="score">Score: {sessionScore}</div>
                </div>
                <div className="progress">
                    Lead {currentIndex + 1} / {queue.length}
                </div>
            </div>

            <div className="main-stage">
                {/* Active Lead Card */}
                <div className="lead-card">
                    <div className="lead-header">
                        <div className="company-info">
                            <h1>{currentLead.name}</h1>
                            <span className="reason-badge">{currentLead.reason}</span>
                        </div>
                        <div className="contact-info">
                            <div className="avatar">{currentLead.contactName[0]}</div>
                            <div>
                                <div className="name">{currentLead.contactName}</div>
                                <div className="role">{currentLead.contactRole}</div>
                            </div>
                        </div>
                    </div>

                    <div className="lead-body">
                        {callState === "calling" ? (
                            <div className="in-call-ui">
                                <div className="avatar-ring">
                                    <div className="avatar-large">{currentLead.contactName[0]}</div>
                                    <div className="ripple"></div>
                                </div>
                                <div className="timer-text">Calling...</div>
                                <div className="script-box">
                                    <strong>Opening Line:</strong>
                                    <p>"Hi {currentLead.contactName.split(' ')[0]}, it's Joe from Stellar. Seeing a lot of movement on the {currentLead.projectIds?.[0] || 'market'} project, wanted to ensure you're covered for the next phase..."</p>
                                </div>
                            </div>
                        ) : callState === "logged" ? (
                            <div className="success-ui">
                                <CheckCircle size={64} className="text-emerald-400 mb-4" />
                                <h2>Logged!</h2>
                                <p>Moving to next lead...</p>
                            </div>
                        ) : (
                            <div className="pre-call-ui">
                                <div className="intel-grid">
                                    <div className="intel-item">
                                        <label>Last Contact</label>
                                        <span>{currentLead.lastContact || 'Never'}</span>
                                    </div>
                                    <div className="intel-item">
                                        <label>Active Jobs</label>
                                        <span>{currentLead.activeJobs}</span>
                                    </div>
                                    <div className="intel-item">
                                        <label>Influence</label>
                                        <span className="text-emerald-400">Champion</span>
                                    </div>
                                </div>
                                <div className="notes-preview">
                                    <label>Last Note:</label>
                                    <p>"{currentLead.notes?.[0]?.text || "No recent notes."}"</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="lead-footer">
                        {callState === "idle" ? (
                            <button className="call-btn" onClick={handleCallStart}>
                                <Phone size={24} /> DIAL NOW
                            </button>
                        ) : callState === "calling" ? (
                            <div className="outcome-buttons">
                                <button className="outcome-btn success" onClick={() => handleOutcome('meeting')}>
                                    <Calendar size={20} /> Meeting Booked
                                </button>
                                <button className="outcome-btn neutral" onClick={() => handleOutcome('contact')}>
                                    <MessageSquare size={20} /> Left Voicemail
                                </button>
                                <button className="outcome-btn fail" onClick={() => handleOutcome('fail')}>
                                    <XCircle size={20} /> No Answer / Not Interested
                                </button>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .golden-hour-container {
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    background: radial-gradient(circle at center, #1e293b 0%, #0f172a 100%);
                    border-radius: var(--radius-lg);
                    overflow: hidden;
                    border: 1px solid var(--border);
                }

                .hud-bar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem 2rem;
                    background: rgba(0,0,0,0.3);
                    border-bottom: 1px solid var(--border);
                }

                .timer { display: flex; align-items: center; gap: 0.5rem; color: white; }
                .streak-meter { display: flex; align-items: center; gap: 2rem; color: white; }
                .score { color: var(--text-muted); font-family: monospace; }
                .progress { color: var(--text-muted); font-size: 0.9rem; }

                .main-stage {
                    flex: 1;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 2rem;
                }

                .lead-card {
                    width: 600px;
                    background: rgba(30, 41, 59, 0.6);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 24px;
                    padding: 2rem;
                    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                }

                .lead-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                    padding-bottom: 1.5rem;
                }

                .company-info h1 { margin: 0; font-size: 1.8rem; color: white; }
                .reason-badge {
                    background: rgba(244, 63, 94, 0.2);
                    color: #f43f5e;
                    padding: 0.25rem 0.75rem;
                    border-radius: 99px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-transform: uppercase;
                }

                .contact-info { display: flex; align-items: center; gap: 1rem; text-align: right; }
                .avatar {
                    width: 48px; height: 48px; border-radius: 50%;
                    background: var(--secondary); color: #0f172a;
                    display: flex; align-items: center; justify-content: center;
                    font-weight: 700; font-size: 1.2rem;
                }
                .name { font-weight: 600; color: white; }
                .role { font-size: 0.8rem; color: var(--text-muted); }

                .lead-body {
                    min-height: 250px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                /* Pre Call UI */
                .pre-call-ui { width: 100%; display: flex; flex-direction: column; gap: 1.5rem; }
                .intel-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; }
                .intel-item { 
                    background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 12px;
                    display: flex; flex-direction: column; align-items: center; text-align: center;
                }
                .intel-item label { font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.5rem; }
                .intel-item span { font-size: 1.1rem; font-weight: 700; color: white; }
                
                .notes-preview {
                    background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.05);
                    padding: 1rem; border-radius: 12px;
                }
                .notes-preview label { font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.5rem; }
                .notes-preview p { font-style: italic; color: #cbd5e1; font-size: 0.9rem; }

                /* In Call UI */
                .in-call-ui { display: flex; flex-direction: column; align-items: center; width: 100%; }
                .avatar-ring { position: relative; width: 100px; height: 100px; margin-bottom: 1.5rem; }
                .avatar-large {
                    width: 100%; height: 100%; border-radius: 50%;
                    background: var(--secondary); color: #0f172a;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 2.5rem; font-weight: 800; position: relative; z-index: 2;
                }
                .ripple {
                    position: absolute; top: 0; left: 0; right: 0; bottom: 0;
                    border-radius: 50%; border: 4px solid var(--secondary);
                    animation: ripple 1.5s infinite ease-out; z-index: 1;
                }
                @keyframes ripple {
                    0% { transform: scale(1); opacity: 1; }
                    100% { transform: scale(1.5); opacity: 0; }
                }
                .timer-text { color: white; font-size: 1.2rem; font-weight: 300; margin-bottom: 2rem; }
                .script-box {
                    background: rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 12px;
                    text-align: center; width: 100%; border-left: 4px solid var(--secondary);
                }
                .script-box p { font-size: 1.1rem; color: white; line-height: 1.5; margin-top: 0.5rem; }

                /* Footer */
                .lead-footer { width: 100%; }
                .call-btn {
                    width: 100%; padding: 1.2rem; background: #10b981; color: white;
                    border: none; border-radius: 12px; font-size: 1.2rem; font-weight: 800;
                    display: flex; align-items: center; justify-content: center; gap: 1rem;
                    cursor: pointer; box-shadow: 0 0 30px rgba(16, 185, 129, 0.4);
                    transition: transform 0.1s;
                }
                .call-btn:hover { transform: scale(1.02); }
                .call-btn:active { transform: scale(0.98); }

                .outcome-buttons { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; }
                .outcome-btn {
                    padding: 1rem; border: none; border-radius: 12px; color: white;
                    font-weight: 700; cursor: pointer; display: flex; flex-direction: column;
                    align-items: center; gap: 0.5rem; font-size: 0.8rem;
                }
                .outcome-btn.success { background: #10b981; }
                .outcome-btn.neutral { background: #3b82f6; }
                .outcome-btn.fail { background: #ef4444; }

                /* Finish Screen */
                .finish-screen {
                    height: 100%; display: flex; flex-direction: column;
                    align-items: center; justify-content: center; color: white;
                }
                .stats-grid { display: flex; gap: 3rem; margin: 2rem 0; }
                .stat { text-align: center; }
                .val { font-size: 3rem; font-weight: 800; }
                .lbl { color: var(--text-muted); text-transform: uppercase; }
                .reset-btn {
                    padding: 1rem 2rem; background: var(--secondary); color: #0f172a;
                    border: none; border-radius: 8px; font-weight: 700; cursor: pointer;
                }
            `}</style>
        </div>
    );
}
