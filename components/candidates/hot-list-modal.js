"use client";

import { useState } from 'react';
import { X, Copy, Check, MessageSquare, Flame } from 'lucide-react';

export default function HotListModal({ candidates, onClose }) {
    const [copied, setCopied] = useState(false);

    const generateHotListMessage = () => {
        const header = "🔥 *HOT SQUAD AVAILABLE IMMEDIATELY* 🔥\n\nHi team, I have a strong crew finishing up this week and ready for new assignments:\n\n";
        
        const list = candidates.map((c, i) => {
            const vehicle = Math.random() > 0.5 ? "Has Vehicle" : "Transport req"; // Mock logic for demo
            const tools = Math.random() > 0.5 ? "Full Tools" : "Basic Tools";
            return `${i + 1}. *${c.firstName}* (${c.role}) - ${c.residency || 'Citizen'}, ${vehicle}, ${tools}. Rate: $${c.chargeRate}/hr`;
        }).join('\n');

        const totalRate = candidates.reduce((sum, c) => sum + (c.chargeRate || 0), 0);
        const footer = `\n\n💰 *Total Squad Rate:* $${totalRate}/hr\n📞 Call me to secure them!`;

        return header + list + footer;
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generateHotListMessage());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!candidates || candidates.length === 0) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="header-title">
                        <Flame size={20} className="text-orange-500" />
                        <h2>Generate Hot List</h2>
                    </div>
                    <button onClick={onClose} className="close-btn"><X size={20} /></button>
                </div>

                <div className="modal-body">
                    <p className="description">
                        Generating blast for <strong>{candidates.length} candidates</strong>. Copy this to WhatsApp or Email.
                    </p>

                    <div className="preview-box">
                        <pre>{generateHotListMessage()}</pre>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn-secondary" onClick={onClose}>Cancel</button>
                    <button className="btn-primary" onClick={handleCopy}>
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                        {copied ? 'Copied!' : 'Copy to Clipboard'}
                    </button>
                </div>
            </div>

            <style jsx>{`
                .modal-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.8);
                    backdrop-filter: blur(4px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1200;
                }

                .modal-content {
                    background: #1e293b;
                    border: 1px solid var(--border);
                    border-radius: 12px;
                    width: 500px;
                    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
                    overflow: hidden;
                }

                .modal-header {
                    padding: 1.25rem;
                    border-bottom: 1px solid var(--border);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: rgba(249, 115, 22, 0.1);
                }

                .header-title {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .header-title h2 {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: white;
                    margin: 0;
                }

                .close-btn {
                    background: none;
                    border: none;
                    color: var(--text-muted);
                    cursor: pointer;
                }

                .modal-body {
                    padding: 1.5rem;
                }

                .description {
                    font-size: 0.9rem;
                    color: var(--text-muted);
                    margin-bottom: 1rem;
                }

                .preview-box {
                    background: rgba(0,0,0,0.3);
                    border: 1px dashed var(--border);
                    padding: 1rem;
                    border-radius: 8px;
                    overflow-x: auto;
                }

                pre {
                    font-family: monospace;
                    font-size: 0.85rem;
                    color: #e2e8f0;
                    white-space: pre-wrap;
                    line-height: 1.5;
                }

                .modal-footer {
                    padding: 1.25rem;
                    border-top: 1px solid var(--border);
                    display: flex;
                    justify-content: flex-end;
                    gap: 1rem;
                    background: rgba(0,0,0,0.2);
                }

                .btn-primary {
                    background: var(--secondary);
                    color: #0f172a;
                    border: none;
                    padding: 0.6rem 1.2rem;
                    border-radius: 6px;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .btn-secondary {
                    background: transparent;
                    color: var(--text-muted);
                    border: 1px solid var(--border);
                    padding: 0.6rem 1.2rem;
                    border-radius: 6px;
                    font-weight: 600;
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
}
