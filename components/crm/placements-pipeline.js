"use client";

import { User, ChevronRight, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useData } from "../../context/data-context.js";

export default function PlacementsPipeline() {
    const { placements, candidates } = useData();

    // Map real data to stages
    const stages = [
        { 
            id: 1, 
            name: "Floated / Spec CV", 
            color: "blue", 
            candidates: placements
                .filter(p => p.status === 'Floated')
                .map(p => {
                    const c = candidates.find(cand => cand.id === p.candidateId);
                    return { name: c ? `${c.firstName} ${c.lastName[0]}.` : "Unknown", role: c?.role || "Laborer" };
                })
        },
        { 
            id: 2, 
            name: "Client Review", 
            color: "purple", 
            candidates: [] // Placeholder for future status
        },
        { 
            id: 3, 
            name: "Bookings (Pending)", 
            color: "yellow", 
            candidates: placements
                .filter(p => p.status === 'Unconfirmed')
                .map(p => {
                    const c = candidates.find(cand => cand.id === p.candidateId);
                    return { name: c ? `${c.firstName} ${c.lastName[0]}.` : "Unknown", role: c?.role || "Laborer" };
                })
        },
        { 
            id: 4, 
            name: "Deployed (Active)", 
            color: "green", 
            candidates: placements
                .filter(p => p.status === 'Deployed')
                .map(p => {
                    const c = candidates.find(cand => cand.id === p.candidateId);
                    return { name: c ? `${c.firstName} ${c.lastName[0]}.` : "Unknown", role: c?.role || "Laborer" };
                })
        },
    ];

    const totalActive = stages.reduce((sum, s) => sum + s.candidates.length, 0);

    return (
        <div className="pipeline-container">
            <div className="pipeline-header">
                <h3>Deal Flow</h3>
                <span className="total-badge">{totalActive} Active</span>
            </div>

            <div className="pipeline-scroll-area">
                {stages.map((stage) => (
                    <div key={stage.id} className="pipeline-stage">
                        <div className="stage-header">
                            <div className="stage-info">
                                <span className={`status-dot ${stage.color}`}></span>
                                <span className="stage-name">{stage.name}</span>
                            </div>
                            <span className="stage-count">{stage.candidates.length}</span>
                        </div>

                        {/* Visual Bar representation of volume */}
                        <div className="volume-bar-track">
                            <div
                                className={`volume-bar-fill ${stage.color}`}
                                style={{ width: `${Math.min(100, (stage.candidates.length / 10) * 100)}%` }}
                            ></div>
                        </div>

                        <div className="candidate-preview-list">
                            {stage.candidates.slice(0, 3).map((c, i) => (
                                <div key={i} className="mini-candidate-row">
                                    <User size={12} className="text-muted" />
                                    <span className="text-xs">{c.name}</span>
                                    <span className="text-xs text-muted ml-auto">{c.role}</span>
                                </div>
                            ))}
                            {stage.candidates.length > 3 && (
                                <div className="more-row">
                                    +{stage.candidates.length - 3} more...
                                </div>
                            )}
                            {stage.candidates.length === 0 && (
                                <div className="text-[10px] text-slate-600 italic">No active deals</div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <style jsx>{`
        .pipeline-container {
          display: flex;
          flex-direction: column;
          height: 100%; /* Fills the parent column */
          overflow: hidden; /* Prevents container from stretching */
        }

        .pipeline-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          flex-shrink: 0;
        }

        .pipeline-header h3 {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .total-badge {
          font-size: 0.75rem;
          background: rgba(255,255,255,0.1);
          padding: 2px 8px;
          border-radius: 12px;
          color: var(--text-main);
        }

        .pipeline-scroll-area {
          overflow-y: auto; /* INDEPENDENT SCROLLING HERE */
          flex: 1; /* Take remaining height */
          padding-right: 0.5rem; /* Space for scrollbar */
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        /* Scrollbar Styling */
        .pipeline-scroll-area::-webkit-scrollbar {
          width: 4px;
        }
        .pipeline-scroll-area::-webkit-scrollbar-thumb {
          background-color: rgba(255,255,255,0.1);
          border-radius: 4px;
        }

        .pipeline-stage {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 8px;
          padding: 0.75rem;
        }

        .stage-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .stage-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .stage-name {
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text-main);
        }

        .stage-count {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-muted);
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        .status-dot.blue { background: #3b82f6; box-shadow: 0 0 8px rgba(59,130,246,0.5); }
        .status-dot.purple { background: #a855f7; box-shadow: 0 0 8px rgba(168,85,247,0.5); }
        .status-dot.yellow { background: #eab308; box-shadow: 0 0 8px rgba(234,179,8,0.5); }
        .status-dot.green { background: #22c55e; box-shadow: 0 0 8px rgba(34,197,94,0.5); }

        .volume-bar-track {
            height: 4px;
            background: rgba(255,255,255,0.1);
            border-radius: 2px;
            margin-bottom: 0.75rem;
            overflow: hidden;
        }

        .volume-bar-fill {
            height: 100%;
            border-radius: 2px;
        }
        .volume-bar-fill.blue { background: #3b82f6; }
        .volume-bar-fill.purple { background: #a855f7; }
        .volume-bar-fill.yellow { background: #eab308; }
        .volume-bar-fill.green { background: #22c55e; }

        .candidate-preview-list {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
        }

        .mini-candidate-row {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: var(--text-muted);
            padding: 2px 0;
        }

        .more-row {
            font-size: 0.7rem;
            color: var(--text-muted);
            text-align: center;
            padding-top: 4px;
            font-style: italic;
        }
      `}</style>
        </div>
    );
}