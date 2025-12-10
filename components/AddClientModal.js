"use client";

import { useState } from "react";
import { X, Save } from "lucide-react";

export default function AddClientModal({ onClose, onSave }) {
    const [formData, setFormData] = useState({
        name: "",
        industry: "",
        status: "Active",
        tier: "Tier 2: Growth Potential",
        activeJobs: 0,
        lastContact: "Today"
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name) return;
        onSave({ ...formData, id: Date.now() });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="text-xl font-bold text-white">Add New Client</h2>
                    <button onClick={onClose} className="close-btn">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label>Client Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Acme Construction"
                            autoFocus
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Industry</label>
                        <input
                            type="text"
                            value={formData.industry}
                            onChange={e => setFormData({ ...formData, industry: e.target.value })}
                            placeholder="e.g. Commercial"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Status</label>
                            <select
                                value={formData.status}
                                onChange={e => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option>Active</option>
                                <option>Key Account</option>
                                <option>At Risk</option>
                                <option>Prospect</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Tier</label>
                            <select
                                value={formData.tier}
                                onChange={e => setFormData({ ...formData, tier: e.target.value })}
                            >
                                <option>Tier 1: Key Account</option>
                                <option>Tier 2: Growth Potential</option>
                                <option>Tier 3: Niche</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={onClose} className="btn-cancel">Cancel</button>
                        <button type="submit" className="btn-save">
                            <Save size={16} /> Save Client
                        </button>
                    </div>
                </form>
            </div>

            <style jsx>{`
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.8);
                    backdrop-filter: blur(4px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    padding: 1rem;
                }

                .modal-content {
                    background: #1e293b;
                    border: 1px solid var(--border);
                    border-radius: var(--radius-md);
                    width: 100%;
                    max-width: 500px;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                }

                .modal-header {
                    padding: 1.5rem;
                    border-bottom: 1px solid var(--border);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .close-btn {
                    background: none;
                    border: none;
                    color: var(--text-muted);
                    cursor: pointer;
                }

                .modal-form {
                    padding: 1.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1.25rem;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }

                label {
                    font-size: 0.875rem;
                    color: var(--text-muted);
                    font-weight: 500;
                }

                input, select {
                    background: rgba(0, 0, 0, 0.2);
                    border: 1px solid var(--border);
                    border-radius: 4px;
                    padding: 0.75rem;
                    color: white;
                    font-size: 0.95rem;
                }

                input:focus, select:focus {
                    outline: none;
                    border-color: var(--secondary);
                }

                .form-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 1rem;
                    margin-top: 1rem;
                }

                .btn-cancel {
                    background: transparent;
                    border: 1px solid var(--border);
                    color: var(--text-muted);
                    padding: 0.5rem 1rem;
                    border-radius: 4px;
                    cursor: pointer;
                }

                .btn-save {
                    background: var(--secondary);
                    color: #0f172a;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 4px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
}
