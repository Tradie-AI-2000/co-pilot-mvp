"use client";

import { useState } from 'react';
import { X, MessageSquare, Copy, Check, MapPin, User, Clock, HardHat, FileText, ArrowRight } from 'lucide-react';

export default function DeploymentPacket({ placement, candidate, project, onClose }) {
    const [copied, setCopied] = useState(false);

    const generateMessage = () => {
        const siteAddress = project.address || "Not Specified";
        const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteAddress)}`;
        
        const ppeList = project.ppe && project.ppe.length > 0
            ? project.ppe.map(item => `- ${item}`).join('\n')
            : '- Standard PPE (Hard Hat, Steel Caps, Hi-Vis)';

        return `*✅ JOB CONFIRMED: ${project.name}*\n\n` +
               `Hi ${candidate.firstName}, your assignment is confirmed!\n\n` +
               `*Start Date:* ${placement.startDate || 'ASAP'}\n` +
               `*Start Time:* 8:00 AM (Please arrive 15 mins early)\n\n` +
               `*📍 Location:*\n` +
               `${siteAddress}\n` +
               `*Google Maps:* ${mapLink}\n\n` +
               `*👤 Site Contact:*\n` +
               `${project.siteManager || 'Report to Site Office'}\n\n` +
               `*🦺 Required Gear (PPE):*\n` +
               `${ppeList}\n\n` +
               `*📝 Health & Safety Link:*\n` +
               `https://www.sitesafe.org.nz/guides--resources/a-z-safety-topics/ (Placeholder)\n\n` +
               `Please confirm you have received this. Good luck on your first day!`;
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generateMessage());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!placement || !candidate || !project) return null;

    return (
        <div className="blaster-overlay">
            <div className="blaster-modal">
                <div className="blaster-header">
                    <div className="flex items-center gap-2">
                        <MessageSquare size={20} className="text-emerald-400" />
                        <h2 className="text-lg font-bold text-white uppercase tracking-tight">Digital Deployment Packet</h2>
                    </div>
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="blaster-content">
                    <p className="text-xs text-slate-400 mb-4">
                        Message ready to be sent to **{candidate.firstName} {candidate.lastName}** for deployment at **{project.name}**.
                    </p>

                    <div className="message-preview">
                        <pre className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                            {generateMessage()}
                        </pre>
                    </div>
                </div>

                <div className="blaster-footer">
                    <button className="secondary-btn" onClick={onClose}>Finish</button>
                    <button className="primary-btn" onClick={handleCopy}>
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                        {copied ? 'Copied to Clipboard!' : 'Copy & Send via WhatsApp'}
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
          z-index: 1200;
        }

        .blaster-modal {
          width: 450px;
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
          background: rgba(16, 185, 129, 0.1);
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
          max-height: 300px;
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
          background: #10b981;
          color: white;
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
