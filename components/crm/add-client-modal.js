"use client";

import { useState } from "react";
import { X, Save } from "lucide-react";

export default function AddClientModal({ onClose, onSave }) {
    const [formData, setFormData] = useState({
        name: "",
        industry: "",
        region: "Auckland",
        address: "",
        website: "",
        status: "Active",
        tier: "Tier 2: Growth Potential",
        contactName: "",
        contactRole: "",
        contactEmail: "",
        contactPhone: "",
        // 👇 NEW: Default to today's date (YYYY-MM-DD) for the input field
        lastContact: new Date().toISOString().split('T')[0]
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name) return;

        // Extract Tier number (e.g., "Tier 2: Growth" -> "2")
        const tierMatch = formData.tier.match(/\d+/);
        const tierValue = tierMatch ? tierMatch[0] : '3';

        const newClient = {
            name: formData.name,
            industry: formData.industry,
            region: formData.region,
            address: formData.address,
            website: formData.website,
            phone: formData.contactPhone,
            email: formData.contactEmail,
            status: formData.status,
            tier: tierValue,
            activeJobs: 0,
            // 👇 UPDATED: Uses your manual input (or defaults to today)
            last_contact: formData.lastContact,
            keyContacts: formData.contactName ? [{
                name: formData.contactName,
                role: formData.contactRole,
                email: formData.contactEmail,
                phone: formData.contactPhone,
                influence: "Neutral"
            }] : [],
        };

        onSave(newClient);
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
                    {/* Section 1: Company Details */}
                    <div className="section-block">
                        <h3 className="text-sm font-bold text-secondary uppercase mb-3">Company Details</h3>
                        <div className="form-group mb-3">
                            <label>Client Name *</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Acme Construction Ltd"
                                autoFocus
                                required
                            />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Industry / Trade Channel</label>
                                <select
                                    value={formData.industry}
                                    onChange={e => setFormData({ ...formData, industry: e.target.value })}
                                >
                                    <option value="">Select Industry...</option>
                                    <option value="Builder">Builder</option>
                                    <option value="Formwork">Formwork & Concrete</option>
                                    <option value="Civil">Civil Infrastructure</option>
                                    <option value="Electrical">Electrical</option>
                                    <option value="Plumber">Plumbing / HVAC</option>
                                    <option value="Flooring">Flooring & Tiling</option>
                                    <option value="Interior">Interiors (Gib/Paint)</option>
                                    <option value="Glazier">Glazing (Windows/Doors)</option>
                                    <option value="Landscaping">Landscaping</option>
                                    <option value="Demolition">Demolition</option>
                                    <option value="Fire">Passive Fire</option>
                                    <option value="Other">Other / General</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Region</label>
                                <select
                                    value={formData.region}
                                    onChange={e => setFormData({ ...formData, region: e.target.value })}
                                >
                                    <option>Auckland</option>
                                    <option>Waikato</option>
                                    <option>Bay of Plenty</option>
                                    <option>Northland</option>
                                    <option>Wellington</option>
                                    <option>Christchurch</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group mt-3">
                            <label>Head Office Address</label>
                            <input
                                type="text"
                                value={formData.address}
                                onChange={e => setFormData({ ...formData, address: e.target.value })}
                                placeholder="e.g. 123 Builder Lane, Penrose"
                            />
                        </div>
                    </div>

                    {/* Section 2: Primary Contact */}
                    <div className="section-block mt-4">
                        <h3 className="text-sm font-bold text-secondary uppercase mb-3">Primary Contact</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Contact Name</label>
                                <input
                                    type="text"
                                    value={formData.contactName}
                                    onChange={e => setFormData({ ...formData, contactName: e.target.value })}
                                    placeholder="e.g. John Doe"
                                />
                            </div>
                            <div className="form-group">
                                <label>Role</label>
                                <input
                                    type="text"
                                    value={formData.contactRole}
                                    onChange={e => setFormData({ ...formData, contactRole: e.target.value })}
                                    placeholder="e.g. Director"
                                />
                            </div>
                        </div>
                        <div className="form-row mt-3">
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={formData.contactEmail}
                                    onChange={e => setFormData({ ...formData, contactEmail: e.target.value })}
                                    placeholder="john@acme.co.nz"
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone</label>
                                <input
                                    type="tel"
                                    value={formData.contactPhone}
                                    onChange={e => setFormData({ ...formData, contactPhone: e.target.value })}
                                    placeholder="021 123 4567"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Classification & Dates */}
                    <div className="section-block mt-4">
                        <h3 className="text-sm font-bold text-secondary uppercase mb-3">Classification & Activity</h3>
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

                        {/* 👇 NEW FIELD: Last Contact Date */}
                        <div className="form-group mt-3">
                            <label>Last Contact Date</label>
                            <input
                                type="date"
                                value={formData.lastContact}
                                onChange={e => setFormData({ ...formData, lastContact: e.target.value })}
                                className="w-full bg-[#0f172a] border border-gray-700 rounded p-2 text-white"
                            />
                        </div>
                    </div>

                    <div className="form-actions mt-6">
                        <button type="button" onClick={onClose} className="btn-cancel">Cancel</button>
                        <button type="submit" className="btn-save">
                            <Save size={16} /> Create Client
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
                    background: rgba(0, 0, 0, 0.85);
                    backdrop-filter: blur(5px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    padding: 1rem;
                }

                .modal-content {
                    background: #1e293b;
                    border: 1px solid var(--border);
                    border-radius: var(--radius-lg);
                    width: 100%;
                    max-width: 600px;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                    max-height: 90vh;
                    overflow-y: auto;
                }

                .modal-header {
                    padding: 1.5rem;
                    border-bottom: 1px solid var(--border);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: #0f172a;
                    position: sticky;
                    top: 0;
                    z-index: 10;
                }

                .close-btn {
                    background: none;
                    border: none;
                    color: var(--text-muted);
                    cursor: pointer;
                }
                .close-btn:hover { color: white; }

                .modal-form {
                    padding: 1.5rem;
                }

                .section-block {
                    background: rgba(15, 23, 42, 0.3);
                    padding: 1rem;
                    border-radius: 8px;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.4rem;
                }

                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }

                label {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    font-weight: 600;
                    text-transform: uppercase;
                }

                input, select {
                    background: #0f172a;
                    border: 1px solid var(--border);
                    border-radius: 6px;
                    padding: 0.75rem;
                    color: white;
                    font-size: 0.9rem;
                    width: 100%;
                }

                input:focus, select:focus {
                    outline: none;
                    border-color: var(--secondary);
                    box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.1);
                }

                .form-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 1rem;
                    padding-top: 1rem;
                    border-top: 1px solid var(--border);
                }

                .btn-cancel {
                    background: transparent;
                    border: 1px solid var(--border);
                    color: var(--text-muted);
                    padding: 0.6rem 1.2rem;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 600;
                }
                .btn-cancel:hover { background: rgba(255,255,255,0.05); color: white; }

                .btn-save {
                    background: var(--secondary);
                    color: #0f172a;
                    border: none;
                    padding: 0.6rem 1.2rem;
                    border-radius: 6px;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .btn-save:hover { background: #34d399; transform: translateY(-1px); }
            `}</style>
        </div>
    );
}