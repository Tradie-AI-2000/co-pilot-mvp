"use client";
import { X, Mail, Phone, Calendar, MapPin, Building, ExternalLink } from 'lucide-react';

export function TenderModal({ tender, isOpen, onClose }) {
    if (!isOpen || !tender) return null;

    const stakeholders = tender.stakeholders || [];

    const handleEmail = (sh) => {
        const subject = `Inquiry re: ${tender.title}`;
        const body = `Hi ${sh.name},\n\nI saw the ${tender.title} project and wanted to connect regarding labour requirements.\n\nBest,\n[Your Name]`;
        window.open(`mailto:${sh.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}><X size={20} /></button>
                
                <div className="modal-header">
                    <span className="badge">{tender.status}</span>
                    <h2>{tender.title}</h2>
                    <div className="meta-row">
                        <span><Building size={14}/> {tender.client}</span>
                        <span><MapPin size={14}/> {tender.location}</span>
                        <span><Calendar size={14}/> Closing: {tender.closingDate ? new Date(tender.closingDate).toLocaleDateString() : 'TBC'}</span>
                    </div>
                </div>

                <div className="modal-body">
                    <div className="section description">
                        <h3>Description</h3>
                        <p>{tender.description || "No description provided."}</p>
                    </div>

                    <div className="section stakeholders">
                        <h3>Stakeholders ({stakeholders.length})</h3>
                        <div className="stakeholder-list">
                            {stakeholders.length === 0 && <p className="empty-state">No stakeholders listed.</p>}
                            {stakeholders.map(sh => (
                                <div key={sh.id} className="stakeholder-item">
                                    <div className="sh-info">
                                        <h4>{sh.name}</h4>
                                        <span>{sh.role}</span>
                                    </div>
                                    <div className="sh-actions">
                                        {sh.email && (
                                            <button onClick={() => handleEmail(sh)} className="action-btn email">
                                                <Mail size={14} /> Email
                                            </button>
                                        )}
                                        {sh.phone && (
                                            <a href={`tel:${sh.phone}`} className="action-btn phone">
                                                <Phone size={14} /> Call
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {tender.sourceUrl && (
                        <div className="section link">
                            <a href={tender.sourceUrl} target="_blank" rel="noopener noreferrer" className="source-link">
                                View Source <ExternalLink size={14} />
                            </a>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .modal-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    backdrop-filter: blur(2px);
                }
                .modal-content {
                    background: var(--surface);
                    width: 90%;
                    max-width: 700px;
                    max-height: 90vh;
                    overflow-y: auto;
                    border-radius: var(--radius-lg);
                    border: 1px solid var(--border);
                    position: relative;
                    animation: slideUp 0.2s ease-out;
                }
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .close-btn {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    background: transparent;
                    border: none;
                    color: var(--text-muted);
                    cursor: pointer;
                }
                .modal-header {
                    padding: 1.5rem;
                    border-bottom: 1px solid var(--border);
                    background: var(--bg-secondary);
                }
                .badge {
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    background: var(--primary);
                    color: white;
                    padding: 0.25rem 0.5rem;
                    border-radius: 4px;
                }
                h2 { margin: 0.5rem 0; font-size: 1.5rem; color: var(--text-main); }
                .meta-row {
                    display: flex;
                    gap: 1.5rem;
                    color: var(--text-secondary);
                    font-size: 0.9rem;
                }
                .meta-row span { display: flex; align-items: center; gap: 0.4rem; }
                
                .modal-body { padding: 1.5rem; }
                .section { margin-bottom: 2rem; }
                h3 { font-size: 1rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 1rem; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; }
                p { line-height: 1.6; color: var(--text-main); }

                .stakeholder-list { display: flex; flex-direction: column; gap: 1rem; }
                .stakeholder-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem;
                    background: var(--bg-secondary);
                    border-radius: var(--radius-md);
                }
                .sh-info h4 { margin: 0; color: var(--text-main); }
                .sh-info span { font-size: 0.9rem; color: var(--text-muted); }
                .sh-actions { display: flex; gap: 0.5rem; }
                .action-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                    padding: 0.5rem 0.8rem;
                    border-radius: var(--radius-sm);
                    font-size: 0.85rem;
                    text-decoration: none;
                    cursor: pointer;
                    border: none;
                    font-weight: 500;
                    transition: opacity 0.2s;
                }
                .action-btn.email { background: #3b82f6; color: white; }
                .action-btn.phone { background: #10b981; color: white; }
                .action-btn:hover { opacity: 0.9; }

                .source-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: var(--primary);
                    text-decoration: none;
                    font-weight: 500;
                }
            `}</style>
        </div>
    );
}
