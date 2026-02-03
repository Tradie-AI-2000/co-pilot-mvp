"use client";

import React from 'react';
import { useCrew } from '../../context/crew-context.js';
import { User, X, Shield, Hammer, AlertCircle } from 'lucide-react';
import { useDroppable } from '@dnd-kit/core';

export default function CrewSlot({ candidate, index, isEmpty }) {
  const { removeCandidateFromSquad } = useCrew();
  const { setNodeRef, isOver } = useDroppable({
    id: candidate ? `slot-${candidate.id}` : 'crew-builder-drop-zone',
  });

  // Compliance Checkers
  const hasSiteSafe = candidate?.compliance?.includes('Site Safe');
  const hasLBP = candidate?.compliance?.includes('LBP');

  if (isEmpty) {
    return (
      <div
        ref={setNodeRef}
        className={`crew-slot empty ${isOver ? 'active-drop' : ''}`}
      >
        <div className="slot-avatar">
          <User size={16} className="text-slate-600" />
        </div>
        <div className="slot-info">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Empty Slot</span>
          <span className="text-[9px] text-slate-600">Ready for assignment</span>
        </div>
        <style jsx>{`
          .crew-slot.empty {
            border: 1px dashed var(--border);
            opacity: 0.6;
          }
          .active-drop {
            border-color: var(--secondary) !important;
            background: rgba(16, 185, 129, 0.1) !important;
            opacity: 1 !important;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className={`crew-slot filled ${!hasSiteSafe ? 'compliance-alert' : ''}`}>
      <div className="slot-avatar">
        {candidate.firstName?.[0]}{candidate.lastName?.[0]}
      </div>
      <div className="slot-info">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="candidate-name">{candidate.firstName} {candidate.lastName}</span>
            <div className="compliance-badges">
              {hasSiteSafe && <Shield size={10} className="text-emerald-400" />}
              {hasLBP && <Hammer size={10} className="text-blue-400" />}
              {!hasSiteSafe && <AlertCircle size={10} className="text-red-500" />}
            </div>
          </div>
          <button className="remove-btn" onClick={() => removeCandidateFromSquad(candidate.id)}>
            <X size={12} />
          </button>
        </div>
        <div className="candidate-meta">
          <span className="candidate-role">{candidate.role || 'No Role'}</span>
          <span className="candidate-rate text-secondary">{candidate.chargeOutRate}</span>
        </div>
      </div>

      <style jsx>{`
        .crew-slot {
          background: rgba(30, 41, 59, 0.4);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          transition: all 0.2s;
          position: relative;
        }

        .compliance-alert {
          border-color: rgba(239, 68, 68, 0.3) !important;
          background: rgba(239, 68, 68, 0.05) !important;
        }

        .compliance-alert::after {
          content: 'NO SITE SAFE';
          position: absolute;
          top: -2px;
          right: -2px;
          background: #ef4444;
          color: white;
          font-size: 6px;
          font-weight: 900;
          padding: 1px 4px;
          border-radius: 4px;
          opacity: 0.9;
        }

        .filled:hover {
          border-color: var(--secondary);
          background: rgba(16, 185, 129, 0.05);
        }

        .compliance-badges {
          display: flex;
          gap: 4px;
          flex-shrink: 0;
        }

        .slot-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--primary);
          border: 1px solid var(--border);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 700;
          flex-shrink: 0;
        }

        .slot-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .candidate-name {
          font-size: 0.8rem;
          font-weight: 700;
          color: white;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .candidate-meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.7rem;
          color: var(--text-muted);
        }

        .remove-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 2px;
        }

        .remove-btn:hover {
          color: #ef4444;
        }
      `}</style>
    </div>
  );
}


