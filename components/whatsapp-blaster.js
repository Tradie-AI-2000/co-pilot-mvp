"use client";

import React, { useState } from 'react';
import { X, MessageSquare, Copy, ExternalLink, Check } from 'lucide-react';

export default function WhatsAppBlaster({ squad, project, onClose }) {
    const [copied, setCopied] = useState(false);

    const generateMessage = () => {
        const candidateNames = squad.map(c => `- ${c.firstName} ${c.lastName} (${c.role || 'Laborer'})`).join('\n');
        return `*STellar Squad Deployment*\n\nProject: ${project.name}\nLocation: ${project.location || 'Site'}\n\nSquad Members:\n${candidateNames}\n\nPlease confirm availability for start on ${project.startDate ? new Date(project.startDate).toLocaleDateString() : 'ASAP'}.`;
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generateMessage());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="blaster-overlay">
            <div className="blaster-modal">
                <div className="blaster-header">
                    <div className="flex items-center gap-2">
                        <MessageSquare size={20} className="text-secondary" />
                        <h2 className="text-lg font-bold text-white uppercase tracking-tight">Flash Blast Comms</h2>
                    </div>
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="blaster-content">
                    <p className="text-xs text-slate-400 mb-4">
                        Squad successfully deployed to <strong>{project.name}</strong>. Notify candidates via WhatsApp:
                    </p>

                    <div className="message-preview">
                        <pre className="text-[11px] text-emerald-100 whitespace-pre-wrap leading-relaxed">
                            {generateMessage()}
                        </pre>
                    </div>
                </div>

                <div className="blaster-footer">
                    <button className="secondary-btn" onClick={onClose}>Finish</button>
                    <button className="primary-btn" onClick={handleCopy}>
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                        {copied ? 'Copied!' : 'Copy & Blast'}
                    </button>
                </div>
            </div>

            <style jsx>{`
        .blaster-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .blaster-modal {
          width: 400px;
          background: #1e293b;
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
          overflow: hidden;
        }

        .blaster-header {
          padding: 1.25rem;
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

        .blaster-content {
          padding: 1.5rem;
        }

        .message-preview {
          background: rgba(15, 23, 42, 0.5);
          border: 1px solid var(--border);
          padding: 1rem;
          border-radius: var(--radius-md);
          max-height: 200px;
          overflow-y: auto;
        }

        .blaster-footer {
          padding: 1.25rem;
          background: rgba(15, 23, 42, 0.3);
          border-top: 1px solid var(--border);
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
        }

        .primary-btn {
          background: var(--secondary);
          color: #0f172a;
          border: none;
          padding: 0.6rem 1.25rem;
          border-radius: var(--radius-md);
          font-weight: 800;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
        }

        .secondary-btn {
          background: none;
          border: 1px solid var(--border);
          color: white;
          padding: 0.6rem 1.25rem;
          border-radius: var(--radius-md);
          font-weight: 600;
          font-size: 0.8rem;
          cursor: pointer;
        }
      `}</style>
        </div>
    );
}
