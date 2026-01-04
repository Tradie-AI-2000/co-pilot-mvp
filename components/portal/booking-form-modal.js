"use client";

import { useState } from "react";
import { X, Calendar, User, Clock, FileText, CheckCircle, ArrowRight } from "lucide-react";

export default function BookingFormModal({ isOpen, onClose, onConfirm, cartItems, projectName }) {
    const [formData, setFormData] = useState({
        startDate: "",
        estDuration: "1 Week",
        projectManager: "",
        supervisor: "",
        timesheetApprover: "",
        specialInstructions: ""
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm(formData);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <div>
                        <h2>Finalize Deployment Details</h2>
                        <p className="subtext">Site: {projectName}</p>
                    </div>
                    <button onClick={onClose} className="close-btn"><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit} className="booking-form">
                    <div className="form-grid">
                        {/* Section 1: Timing */}
                        <div className="form-section">
                            <h3><Calendar size={16} /> Schedule</h3>
                            <div className="input-group">
                                <label>Start Date</label>
                                <input 
                                    type="date" 
                                    required
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                                />
                            </div>
                            <div className="input-group">
                                <label>Estimated Duration</label>
                                <select 
                                    value={formData.estDuration}
                                    onChange={(e) => setFormData({...formData, estDuration: e.target.value})}
                                >
                                    <option>1-3 Days</option>
                                    <option>1 Week</option>
                                    <option>2-4 Weeks</option>
                                    <option>Ongoing</option>
                                </select>
                            </div>
                        </div>

                        {/* Section 2: Contacts */}
                        <div className="form-section">
                            <h3><User size={16} /> Site Contacts</h3>
                            <div className="input-group">
                                <label>Project Manager</label>
                                <input 
                                    type="text" 
                                    placeholder="Name & Phone"
                                    required
                                    value={formData.projectManager}
                                    onChange={(e) => setFormData({...formData, projectManager: e.target.value})}
                                />
                            </div>
                            <div className="input-group">
                                <label>On-Site Supervisor</label>
                                <input 
                                    type="text" 
                                    placeholder="Name & Phone"
                                    required
                                    value={formData.supervisor}
                                    onChange={(e) => setFormData({...formData, supervisor: e.target.value})}
                                />
                            </div>
                            <div className="input-group">
                                <label>Timesheet Approver</label>
                                <input 
                                    type="text" 
                                    placeholder="Name & Email"
                                    required
                                    value={formData.timesheetApprover}
                                    onChange={(e) => setFormData({...formData, timesheetApprover: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-section full-width">
                        <h3><FileText size={16} /> Special Instructions</h3>
                        <textarea 
                            placeholder="Parking info, specific PPE requirements, or site access codes..."
                            rows="3"
                            value={formData.specialInstructions}
                            onChange={(e) => setFormData({...formData, specialInstructions: e.target.value})}
                        ></textarea>
                    </div>

                    <div className="booking-summary">
                        <div className="summary-text">
                            Requesting <strong>{cartItems.length} staff</strong> for <strong>{projectName}</strong>.
                        </div>
                        <button type="submit" className="confirm-btn">
                            Send Request to Recruiter <ArrowRight size={18} />
                        </button>
                    </div>
                </form>
            </div>

            <style jsx>{`
                .modal-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.85);
                    backdrop-filter: blur(8px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }

                .modal-content {
                    background: var(--primary);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-lg);
                    width: 700px;
                    max-height: 90vh;
                    overflow-y: auto;
                    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
                }

                .modal-header {
                    padding: 2rem;
                    border-bottom: 1px solid var(--border);
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    background: rgba(255,255,255,0.03);
                }

                .modal-header h2 { margin: 0; font-size: 1.5rem; color: white; }
                .subtext { margin: 0.25rem 0 0 0; color: var(--secondary); font-weight: 700; text-transform: uppercase; font-size: 0.8rem; }

                .close-btn { background: none; border: none; color: var(--text-muted); cursor: pointer; }

                .booking-form { padding: 2rem; }

                .form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 2rem;
                    margin-bottom: 2rem;
                }

                .form-section h3 {
                    font-size: 0.8rem;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: var(--text-muted);
                    margin-bottom: 1.5rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    border-bottom: 1px solid var(--border);
                    padding-bottom: 0.5rem;
                }

                .input-group {
                    margin-bottom: 1.25rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .input-group label { font-size: 0.85rem; color: var(--text-main); font-weight: 500; }

                .input-group input, .input-group select, textarea {
                    background: rgba(15, 23, 42, 0.6);
                    border: 1px solid var(--border);
                    padding: 0.75rem;
                    border-radius: 6px;
                    color: white;
                    font-size: 0.95rem;
                    outline: none;
                }

                .input-group input:focus, textarea:focus { border-color: var(--secondary); }

                .full-width { grid-column: span 2; }
                textarea { width: 100%; resize: none; }

                .booking-summary {
                    margin-top: 2rem;
                    padding-top: 2rem;
                    border-top: 1px solid var(--border);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .summary-text { font-size: 0.9rem; color: var(--text-muted); }
                .summary-text strong { color: white; }

                .confirm-btn {
                    background: var(--secondary);
                    color: var(--primary);
                    border: none;
                    padding: 1rem 2rem;
                    border-radius: 8px;
                    font-weight: 800;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    transition: transform 0.2s;
                }

                .confirm-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 20px rgba(0, 242, 255, 0.3); }
            `}</style>
        </div>
    );
}
