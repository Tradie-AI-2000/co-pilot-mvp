"use client";

import { useState } from "react";
import { X, User, Send, MapPin, Calendar, CheckCircle, AlertCircle, Briefcase, ChevronRight } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import CandidateModal from "./candidate-modal.js";
import FloatCandidateModal from "./float-candidate-modal.js";

export default function MatchListModal({ isOpen, onClose, matchData }) {
    const [selectedCandidate, setSelectedCandidate] = useState(null); // For Profile View
    const [floatCandidate, setFloatCandidate] = useState(null); // For Float Action

    if (!isOpen || !matchData) return null;

    const { candidates, role, project, client, phase, startsIn } = matchData;

    // Sort: Available first, then Finishing Soon (closest date first)
    const sortedCandidates = [...candidates].sort((a, b) => {
        if (a.status === 'Available' && b.status !== 'Available') return -1;
        if (a.status !== 'Available' && b.status === 'Available') return 1;
        // If both finishing soon, sort by date
        if (a.finishDate && b.finishDate) {
            return new Date(a.finishDate) - new Date(b.finishDate);
        }
        return 0;
    });

    return (
        <div className="modal-overlay">
            <div className="match-modal glass-panel">
                {/* Header */}
                <div className="modal-header">
                    <div className="header-content">
                        <div className="flex items-center gap-3 mb-1">
                            <span className="role-badge">{matchData.count}x {role}</span>
                            <span className="text-slate-400 text-sm">needed for</span>
                        </div>
                        <h2 className="text-xl font-black text-white">{project}</h2>
                        <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
                            <Briefcase size={14} /> {client}
                            <span className="dot">•</span>
                            <span className={startsIn <= 7 ? "text-rose-400 font-bold" : "text-emerald-400 font-bold"}>
                                Starts in {startsIn} Days
                            </span>
                        </div>
                    </div>
                    <button onClick={onClose} className="close-btn"><X size={24} /></button>
                </div>

                {/* List */}
                <div className="modal-body custom-scrollbar">
                    <div className="list-header">
                        <span>Candidate</span>
                        <span>Status</span>
                        <span>Location</span>
                        <span className="text-right">Action</span>
                    </div>
                    
                    {sortedCandidates.map(c => {
                        const isMobile = c.isMobile || c.residency?.includes('Visa');
                        const isExactRole = c.role === role;
                        
                        return (
                            <div key={c.id} className="candidate-row group">
                                <div className="c-info">
                                    <div className="c-avatar">{c.firstName[0]}{c.lastName[0]}</div>
                                    <div>
                                        <div className="c-name">{c.firstName} {c.lastName}</div>
                                        <div className="c-role">
                                            {c.role} 
                                            {!isExactRole && <span className="text-amber-400 text-[10px] ml-2">(Related)</span>}
                                        </div>
                                    </div>
                                </div>

                                <div className="c-status">
                                    {c.status === 'Available' ? (
                                        <span className="status-pill available">Available Now</span>
                                    ) : (
                                        <div className="flex flex-col">
                                            <span className="status-pill finishing">Finishing</span>
                                            <span className="text-[10px] text-slate-500 mt-0.5">
                                                {c.finishDate ? format(new Date(c.finishDate), 'd MMM') : 'Soon'}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="c-location">
                                    <div className="flex items-center gap-1">
                                        <MapPin size={12} className={isMobile ? "text-purple-400" : "text-slate-500"} />
                                        <span>{isMobile ? "Mobile Crew" : c.region || c.location || "Local"}</span>
                                    </div>
                                </div>

                                <div className="c-actions">
                                    <button 
                                        className="btn-icon" 
                                        title="View Profile"
                                        onClick={() => setSelectedCandidate(c)}
                                    >
                                        <User size={16} />
                                    </button>
                                    <button 
                                        className="btn-float"
                                        onClick={() => setFloatCandidate(c)}
                                    >
                                        Float <Send size={12} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Nested Modals */}
            {selectedCandidate && (
                <CandidateModal
                    candidate={selectedCandidate}
                    projects={[]} // Pass projects if needed for context
                    squads={[]}
                    onClose={() => setSelectedCandidate(null)}
                    onSave={() => setSelectedCandidate(null)} // Read-only mode mostly
                />
            )}

            {floatCandidate && (
                <FloatCandidateModal
                    isOpen={!!floatCandidate}
                    candidate={floatCandidate}
                    onClose={() => setFloatCandidate(null)}
                    prefilledData={{
                        clientId: matchData.clientId,
                        projectId: matchData.projectId,
                        currentPhase: matchData.currentPhase
                    }}
                />
            )}

            <style jsx>{`
                .modal-overlay {
                    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0, 0, 0, 0.8); backdrop-filter: blur(4px);
                    display: flex; align-items: center; justify-content: center;
                    z-index: 1050;
                }
                .match-modal {
                    width: 800px; max-width: 95vw; height: 80vh; max-height: 700px;
                    background: #0f172a; border: 1px solid var(--border);
                    display: flex; flex-direction: column; overflow: hidden;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
                }
                .modal-header {
                    padding: 1.5rem 2rem; border-bottom: 1px solid var(--border);
                    display: flex; justify-content: space-between; align-items: flex-start;
                    background: rgba(30, 41, 59, 0.5);
                }
                .role-badge {
                    background: var(--secondary); color: #0f172a; font-weight: 800;
                    font-size: 0.75rem; padding: 2px 8px; border-radius: 4px; text-transform: uppercase;
                }
                .dot { color: var(--border); }
                .close-btn { color: var(--text-muted); transition: color 0.2s; }
                .close-btn:hover { color: white; }

                .modal-body { flex: 1; overflow-y: auto; padding: 0; }
                
                .list-header {
                    display: grid; grid-template-columns: 2fr 1fr 1fr 1fr;
                    padding: 1rem 2rem; border-bottom: 1px solid var(--border);
                    font-size: 0.75rem; font-weight: 700; color: var(--text-muted);
                    text-transform: uppercase; letter-spacing: 0.05em;
                    background: rgba(15, 23, 42, 0.8); position: sticky; top: 0;
                }

                .candidate-row {
                    display: grid; grid-template-columns: 2fr 1fr 1fr 1fr;
                    padding: 1rem 2rem; border-bottom: 1px solid var(--border);
                    align-items: center; transition: background 0.2s;
                }
                .candidate-row:hover { background: rgba(255, 255, 255, 0.03); }

                .c-info { display: flex; align-items: center; gap: 1rem; }
                .c-avatar {
                    width: 36px; height: 36px; border-radius: 50%;
                    background: rgba(255,255,255,0.1); color: white;
                    display: flex; align-items: center; justify-content: center;
                    font-weight: 700; font-size: 0.8rem; border: 1px solid var(--border);
                }
                .c-name { color: white; font-weight: 600; font-size: 0.9rem; }
                .c-role { color: var(--text-muted); font-size: 0.8rem; }

                .status-pill {
                    font-size: 0.7rem; font-weight: 700; padding: 2px 8px; border-radius: 10px;
                    text-transform: uppercase; display: inline-block;
                }
                .status-pill.available { background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.2); }
                .status-pill.finishing { background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.2); }

                .c-location { font-size: 0.85rem; color: var(--text-muted); }

                .c-actions { display: flex; justify-content: flex-end; gap: 0.5rem; }
                .btn-icon {
                    width: 32px; height: 32px; border-radius: 6px;
                    display: flex; align-items: center; justify-content: center;
                    background: rgba(255,255,255,0.05); color: var(--text-muted);
                    transition: all 0.2s;
                }
                .btn-icon:hover { background: rgba(255,255,255,0.1); color: white; }
                
                .btn-float {
                    display: flex; align-items: center; gap: 0.5rem;
                    padding: 0 1rem; height: 32px; border-radius: 6px;
                    background: var(--secondary); color: #0f172a;
                    font-size: 0.75rem; font-weight: 800; text-transform: uppercase;
                    transition: all 0.2s;
                }
                .btn-float:hover { background: white; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0, 242, 255, 0.2); }
            `}</style>
        </div>
    );
}
