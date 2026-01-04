"use client";

import React from 'react';
import { useCrew } from '../context/crew-context.js';
import { useData } from '../context/data-context.js';
import { X, Users, DollarSign, Zap, ChevronRight, Trash2, AlertCircle } from 'lucide-react';
import CrewSlot from './crew-slot.js';

export default function CrewBuilderPanel() {
    const {
        draftSquad,
        isPanelOpen,
        setIsPanelOpen,
        clearSquad,
        deploySquad,
        validateCompliance,
        isDeploying,
        metrics
    } = useCrew();

    const { selectedProject } = useData();
    const compliance = validateCompliance();

    const handleDeploy = async () => {
        if (!selectedProject || draftSquad.length === 0) return;

        try {
            await deploySquad(selectedProject, `${selectedProject.name} - Initial Crew`);
        } catch (error) {
            alert(error.message);
        }
    };

    if (!isPanelOpen) {
        return (
            <button
                className="fixed right-4 bottom-4 w-12 h-12 bg-secondary rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-50"
                onClick={() => setIsPanelOpen(true)}
            >
                <Users size={24} color="#0f172a" />
            </button>
        );
    }

    return (
        <aside className="crew-builder-panel">
            <div className="panel-header">
                <div className="flex items-center gap-2">
                    <Zap size={18} className="text-secondary" />
                    <h2 className="text-lg font-bold text-white tracking-tight">SQUAD BUILDER</h2>
                </div>
                <button className="close-btn" onClick={() => setIsPanelOpen(false)}>
                    <X size={18} />
                </button>
            </div>

            <div className="metrics-bar">
                <div className="metric">
                    <Users size={14} className="text-slate-400" />
                    <div className="metric-content">
                        <span className="metric-value">{metrics.headcount}</span>
                        <span className="metric-label">HEADCOUNT</span>
                    </div>
                </div>
                <div className="metric">
                    <DollarSign size={14} className="text-slate-400" />
                    <div className="metric-content">
                        <span className="metric-value">{metrics.totalCost}</span>
                        <span className="metric-label">TOTAL RATE</span>
                    </div>
                </div>
            </div>

            <div className="slots-container">
                {draftSquad.length > 0 ? (
                    <div className="draft-list">
                        {draftSquad.map((candidate, idx) => (
                            <CrewSlot key={candidate.id} candidate={candidate} index={idx} />
                        ))}
                        {/* Show an empty slot as a hint */}
                        <CrewSlot isEmpty />
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-icon">
                            <Users size={32} className="opacity-20" />
                        </div>
                        <p className="text-xs text-slate-500 text-center px-8">
                            Drag candidates from the map to build your squad
                        </p>
                    </div>
                )}
            </div>

            {draftSquad.length > 0 && !compliance.isValid && (
                <div className="compliance-warning-banner">
                    <AlertCircle size={14} />
                    <span>{compliance.nonCompliant.length} members missing Site Safe</span>
                </div>
            )}

            <div className="panel-footer">
                <div className="footer-summary flex justify-between items-center mb-2 px-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Compliance</span>
                    <span className={`text-[10px] font-bold ${compliance.isValid ? 'text-emerald-400' : 'text-red-400'}`}>
                        {draftSquad.length - compliance.nonCompliant.length}/{draftSquad.length} SECURE
                    </span>
                </div>
                <button className="clear-btn" onClick={clearSquad}>
                    <Trash2 size={14} /> Clear
                </button>
                <button
                    className={`deploy-btn ${!compliance.isValid ? 'blocked' : ''}`}
                    disabled={draftSquad.length === 0 || !selectedProject || isDeploying}
                    onClick={handleDeploy}
                >
                    {isDeploying ? 'DEPLOYING...' : !compliance.isValid ? 'COMPLIANCE BLOCKED' : 'DEPLOY SQUAD'}
                    <ChevronRight size={16} />
                </button>
            </div>

            <style jsx>{`
        .crew-builder-panel {
          position: fixed;
          top: 1rem;
          right: 1rem;
          bottom: 1rem;
          width: 320px;
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(12px);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          z-index: 100;
          box-shadow: -10px 0 30px rgba(0,0,0,0.5);
        }

        .panel-header {
          padding: 1rem 1.25rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border);
        }

        .close-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
        }

        .metrics-bar {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1px;
          background: var(--border);
          border-bottom: 1px solid var(--border);
        }

        .metric {
          background: rgba(30, 41, 59, 0.5);
          padding: 0.75rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .metric-content {
          display: flex;
          flex-direction: column;
        }

        .metric-value {
          font-size: 0.9rem;
          font-weight: 800;
          color: white;
        }

        .metric-label {
          font-size: 0.6rem;
          color: var(--text-muted);
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        .slots-container {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .empty-state {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 1rem;
        }

        .draft-list {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
        }

        .panel-footer {
          padding: 1rem;
          border-top: 1px solid var(--border);
          background: rgba(30, 41, 59, 0.4);
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .compliance-warning-banner {
          background: rgba(239, 68, 68, 0.1);
          border-top: 1px solid rgba(239, 68, 68, 0.2);
          border-bottom: 1px solid rgba(239, 68, 68, 0.2);
          padding: 0.5rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #f87171;
          font-size: 0.7rem;
          font-weight: 600;
        }

        .clear-btn {
            background: none;
            border: none;
            color: #ef4444;
            font-size: 0.75rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.25rem;
            cursor: pointer;
            width: fit-content;
            margin: 0 auto;
            opacity: 0.7;
        }

        .clear-btn:hover { opacity: 1; }

        .deploy-btn {
          width: 100%;
          background: var(--secondary);
          color: #0f172a;
          border: none;
          padding: 0.75rem;
          border-radius: var(--radius-md);
          font-weight: 800;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .deploy-btn.blocked {
          background: #ef4444;
          color: white;
        }

        .deploy-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        .deploy-btn:disabled {
          background: var(--border);
          color: var(--text-muted);
          cursor: not-allowed;
          opacity: 0.5;
        }
      `}</style>
        </aside>
    );
}
