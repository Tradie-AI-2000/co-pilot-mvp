"use client";

import { useState, useEffect } from "react";
import { X, Send, Calculator, User, Building2, FileText, CheckCircle, AlertTriangle, Shield } from "lucide-react";
import { useData } from "../context/data-context.js";
import { checkVisaCompliance, generatePhaseMessage } from "../services/construction-logic.js";

export default function FloatCandidateModal({ candidate, isOpen, onClose, prefilledData }) {
    const { clients, projects, floatCandidate } = useData();

    // Determine initial step: if prefilled from project card, skip to step 2
    const initialStep = prefilledData ? 2 : 1;

    const [step, setStep] = useState(initialStep);
    const [selectedClientId, setSelectedClientId] = useState(prefilledData?.clientId || "");
    const [selectedProjectId, setSelectedProjectId] = useState(prefilledData?.projectId || "");
    const [selectedContact, setSelectedContact] = useState(prefilledData?.siteManagerName || "");
    const [chargeRate, setChargeRate] = useState(candidate?.chargeRate || 0);
    const [payRate, setPayRate] = useState(candidate?.payRate || 0);
    const [message, setMessage] = useState(
        candidate
            ? `Hi,\n\nI'd like to put forward ${candidate.firstName} for the open role. They have strong experience in ${candidate.role} and are available immediately.\n\nPlease find the CV attached.\n\nBest,\nJoe`
            : `Hi,\n\nI'd like to discuss a candidate for your project. Please let me know if you're interested.\n\nBest,\nJoe`
    );

    // Derived Data
    const selectedClient = clients.find(c => c.id === parseInt(selectedClientId));
    const clientContacts = selectedClient?.keyContacts || [];
    const clientProjects = projects.filter(p => p.assignedCompanyIds?.includes(parseInt(selectedClientId)));
    const selectedProject = projects.find(p => p.id === selectedProjectId);

    // Visa Compliance Check
    const complianceCheck = candidate && selectedProject
        ? checkVisaCompliance(candidate, selectedProject)
        : { valid: true, reason: '' };

    const margin = chargeRate - (payRate * 1.3); // 30% burden
    const marginPercent = chargeRate > 0 ? (margin / chargeRate) * 100 : 0;

    // Phase-aware message generation
    useEffect(() => {
        if (isOpen && candidate && selectedProject && prefilledData) {
            const currentPhase = selectedProject.phaseSettings?.currentPhase || prefilledData.currentPhase || '02_structure';
            const siteManagerName = prefilledData.siteManagerName || selectedContact || 'there';
            const phaseMessage = generatePhaseMessage(
                candidate.firstName,
                selectedProject.name,
                currentPhase,
                siteManagerName
            );
            setMessage(phaseMessage);
        }
    }, [isOpen, candidate, selectedProject, prefilledData, selectedContact]);

    if (!isOpen) return null;

    const handleSend = () => {
        if (!candidate) {
            alert('Please select a candidate first');
            return;
        }
        if (!complianceCheck.valid) {
            alert(`Compliance Error: ${complianceCheck.reason}`);
            return;
        }
        floatCandidate(candidate.id, selectedProjectId || null, {
            clientId: selectedClientId,
            contactName: selectedContact,
            chargeRate,
            payRate,
            message
        });
        onClose();
        // In a real app, this would trigger a toast notification
        alert(`Float sent to ${selectedClient?.name}!`);
    };

    return (
        <div className="modal-overlay">
            <div className="float-modal">
                <div className="modal-header">
                    <h3>Float Candidate{candidate ? `: ${candidate.firstName} ${candidate.lastName}` : ''}</h3>
                    <button onClick={onClose} className="close-btn"><X size={20} /></button>
                </div>

                <div className="modal-body">
                    {/* Stepper */}
                    <div className="stepper">
                        <div className={`step ${step >= 1 ? 'active' : ''}`}>1. Target</div>
                        <div className="line"></div>
                        <div className={`step ${step >= 2 ? 'active' : ''}`}>2. Rates</div>
                        <div className="line"></div>
                        <div className={`step ${step >= 3 ? 'active' : ''}`}>3. Send</div>
                    </div>

                    {step === 1 && (
                        <div className="step-content space-y-4">
                            <div className="form-group">
                                <label>Client</label>
                                <select
                                    className="input-field"
                                    value={selectedClientId}
                                    onChange={(e) => setSelectedClientId(e.target.value)}
                                >
                                    <option value="">Select Client...</option>
                                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>

                            {selectedClientId && (
                                <>
                                    <div className="form-group">
                                        <label>Project (Optional)</label>
                                        <select
                                            className="input-field"
                                            value={selectedProjectId}
                                            onChange={(e) => setSelectedProjectId(e.target.value)}
                                        >
                                            <option value="">General Float (No specific project)</option>
                                            {clientProjects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Key Contact</label>
                                        <select
                                            className="input-field"
                                            value={selectedContact}
                                            onChange={(e) => setSelectedContact(e.target.value)}
                                        >
                                            <option value="">Select Contact...</option>
                                            {clientContacts.map(c => <option key={c.name} value={c.name}>{c.name} ({c.role})</option>)}
                                        </select>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {step === 2 && (
                        <div className="step-content space-y-6">
                            <div className="financial-card">
                                <div className="row">
                                    <div className="col">
                                        <label>Pay Rate (Cost)</label>
                                        <input
                                            type="number"
                                            className="input-field"
                                            value={payRate}
                                            onChange={(e) => setPayRate(parseFloat(e.target.value))}
                                        />
                                    </div>
                                    <div className="col">
                                        <label>Charge Rate (Bill)</label>
                                        <input
                                            type="number"
                                            className="input-field highlight"
                                            value={chargeRate}
                                            onChange={(e) => setChargeRate(parseFloat(e.target.value))}
                                        />
                                    </div>
                                </div>
                                <div className="margin-display">
                                    <div className="label">Projected Margin</div>
                                    <div className={`value ${marginPercent < 20 ? 'low' : 'good'}`}>
                                        ${margin.toFixed(2)}/hr ({Math.round(marginPercent)}%)
                                    </div>
                                    <div className="subtext">Based on 30% burden/overhead</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="step-content space-y-4">
                            {/* Visa Compliance Alert */}
                            {!complianceCheck.valid && (
                                <div className="compliance-alert error">
                                    <div className="alert-header">
                                        <AlertTriangle size={20} />
                                        <span className="alert-title">Visa Compliance Error</span>
                                    </div>
                                    <div className="alert-message">
                                        {complianceCheck.reason}
                                    </div>
                                </div>
                            )}

                            {complianceCheck.valid && candidate && selectedProject && (
                                <div className="compliance-alert success">
                                    <div className="alert-header">
                                        <Shield size={20} />
                                        <span className="alert-title">Compliance Check Passed</span>
                                    </div>
                                    <div className="alert-message">
                                        Candidate is eligible for placement in this region.
                                    </div>
                                </div>
                            )}

                            <div className="summary-card">
                                <div className="summary-row">
                                    <Building2 size={14} /> <span>{selectedClient?.name}</span>
                                </div>
                                <div className="summary-row">
                                    <User size={14} /> <span>{selectedContact || 'General Inbox'}</span>
                                </div>
                                <div className="summary-row">
                                    <Calculator size={14} /> <span>${chargeRate}/hr</span>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Message Preview</label>
                                <textarea
                                    className="input-field message-box"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    rows={5}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    {step > 1 && (
                        <button className="btn-secondary" onClick={() => setStep(step - 1)}>Back</button>
                    )}
                    <div className="spacer"></div>
                    {step < 3 ? (
                        <button
                            className="btn-primary"
                            disabled={!selectedClientId}
                            onClick={() => setStep(step + 1)}
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            className="btn-success"
                            onClick={handleSend}
                            disabled={!complianceCheck.valid}
                            title={!complianceCheck.valid ? 'Compliance check failed' : 'Send float to client'}
                        >
                            <Send size={16} /> Send Float
                        </button>
                    )}
                </div>
            </div>

            <style jsx>{`
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1100; /* Above Candidate Modal */
                    backdrop-filter: blur(2px);
                }

                .float-modal {
                    background: #1e293b;
                    width: 450px;
                    border-radius: 12px;
                    border: 1px solid var(--border);
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
                }

                .modal-header {
                    padding: 1.25rem;
                    border-bottom: 1px solid var(--border);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .modal-header h3 {
                    margin: 0;
                    font-size: 1.1rem;
                    color: white;
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

                .stepper {
                    display: flex;
                    align-items: center;
                    margin-bottom: 1.5rem;
                    justify-content: space-between;
                    font-size: 0.8rem;
                    color: var(--text-muted);
                }

                .step.active {
                    color: var(--secondary);
                    font-weight: 700;
                }

                .line {
                    height: 1px;
                    background: var(--border);
                    flex: 1;
                    margin: 0 10px;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .form-group label {
                    font-size: 0.85rem;
                    color: var(--text-muted);
                }

                .input-field {
                    background: rgba(0,0,0,0.2);
                    border: 1px solid var(--border);
                    padding: 0.6rem;
                    border-radius: 6px;
                    color: white;
                    outline: none;
                }

                .input-field.highlight {
                    border-color: var(--secondary);
                    background: rgba(16, 185, 129, 0.05);
                }

                .input-field.message-box {
                    font-family: inherit;
                    font-size: 0.9rem;
                }

                .financial-card {
                    background: rgba(255,255,255,0.03);
                    border: 1px solid var(--border);
                    border-radius: 8px;
                    padding: 1rem;
                }

                .row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                    margin-bottom: 1rem;
                }

                .margin-display {
                    text-align: center;
                    padding-top: 1rem;
                    border-top: 1px dashed var(--border);
                }

                .margin-display .label {
                    font-size: 0.8rem;
                    color: var(--text-muted);
                    text-transform: uppercase;
                }

                .margin-display .value {
                    font-size: 1.5rem;
                    font-weight: 700;
                }

                .value.good { color: #34d399; }
                .value.low { color: #f43f5e; }

                .summary-card {
                    background: rgba(59, 130, 246, 0.1);
                    border: 1px solid rgba(59, 130, 246, 0.2);
                    padding: 1rem;
                    border-radius: 8px;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .summary-row {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.9rem;
                    color: white;
                }

                .modal-footer {
                    padding: 1.25rem;
                    border-top: 1px solid var(--border);
                    display: flex;
                    gap: 1rem;
                }

                .spacer { flex: 1; }

                .btn-secondary {
                    background: transparent;
                    color: var(--text-muted);
                    border: none;
                    cursor: pointer;
                }

                .btn-primary {
                    background: var(--secondary);
                    color: #0f172a;
                    border: none;
                    padding: 0.5rem 1.5rem;
                    border-radius: 6px;
                    font-weight: 600;
                    cursor: pointer;
                }

                .btn-success {
                    background: #10b981;
                    color: white;
                    border: none;
                    padding: 0.5rem 1.5rem;
                    border-radius: 6px;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .btn-primary:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .btn-success:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    background: #6b7280;
                }

                .compliance-alert {
                    padding: 1rem;
                    border-radius: 8px;
                    border: 1px solid;
                    margin-bottom: 1rem;
                }

                .compliance-alert.error {
                    background: rgba(239, 68, 68, 0.1);
                    border-color: rgba(239, 68, 68, 0.3);
                    color: #fca5a5;
                }

                .compliance-alert.success {
                    background: rgba(16, 185, 129, 0.1);
                    border-color: rgba(16, 185, 129, 0.3);
                    color: #6ee7b7;
                }

                .alert-header {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-bottom: 0.5rem;
                }

                .alert-title {
                    font-weight: 600;
                    font-size: 0.9rem;
                }

                .alert-message {
                    font-size: 0.85rem;
                    line-height: 1.5;
                    opacity: 0.9;
                }
            `}</style>
        </div>
    );
}