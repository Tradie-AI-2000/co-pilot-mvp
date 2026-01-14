"use client";

import { useState } from "react";
import { ChevronRight, ChevronLeft, Plus, Trash2, Calendar, HardHat, Check } from "lucide-react";

// Mock Data for Packages
const AVAILABLE_PACKAGES = [
    { id: 'civil', label: 'Civil Works' },
    { id: 'structure', label: 'Structure / Concrete' },
    { id: 'framing', label: 'Framing / Carpentry' },
    { id: 'interiors', label: 'Interiors / Fitout' },
    { id: 'cladding', label: 'Cladding' },
    { id: 'landscaping', label: 'Landscaping' }
];

const AVAILABLE_ROLES = [
    { id: 'labourer', label: 'General Labourer' },
    { id: 'carpenter', label: 'Carpenter' },
    { id: 'hammerhand', label: 'Hammerhand' },
    { id: 'site_manager', label: 'Site Manager' },
    { id: 'ewp_operator', label: 'EWP Operator' },
    { id: 'crane_operator', label: 'Crane Operator' },
    { id: 'dogman', label: 'Dogman' },
    { id: 'traffic_controller', label: 'Traffic Controller' }
];

export default function ProjectBuilder() {
    const [step, setStep] = useState(1);
    const [projectData, setProjectData] = useState({
        name: "", address: "", description: "", startDate: "", endDate: "",
        supervisorName: "", supervisorPhone: "", supervisorEmail: "",
        packages: [],
        roles: []
    });

    const updateField = (field, value) => setProjectData(prev => ({ ...prev, [field]: value }));

    // --- PACKAGES LOGIC ---
    const togglePackage = (pkgId, label) => {
        setProjectData(prev => {
            const exists = prev.packages.find(p => p.id === pkgId);
            if (exists) {
                return { ...prev, packages: prev.packages.filter(p => p.id !== pkgId) };
            }
            return { ...prev, packages: [...prev.packages, { id: pkgId, label, startDate: "" }] };
        });
    };

    const updatePackageDate = (pkgId, date) => {
        setProjectData(prev => ({
            ...prev,
            packages: prev.packages.map(p => p.id === pkgId ? { ...p, startDate: date } : p)
        }));
    };

    const [customPkgName, setCustomPkgName] = useState("");
    const addCustomPackage = () => {
        if (!customPkgName.trim()) return;
        const newId = `custom-${Date.now()}`;
        setProjectData(prev => ({
            ...prev,
            packages: [...prev.packages, { id: newId, label: customPkgName, startDate: "" }]
        }));
        setCustomPkgName("");
    };

    // --- ROLES LOGIC ---
    const addRole = (roleId, label) => {
        setProjectData(prev => {
            const exists = prev.roles.find(r => r.id === roleId);
            if (exists) return prev; // prevent dupes, adjust qty instead
            return { ...prev, roles: [...prev.roles, { id: roleId, label, qty: 1, startDate: "" }] };
        });
    };

    const updateRole = (roleId, field, value) => {
        setProjectData(prev => ({
            ...prev,
            roles: prev.roles.map(r => r.id === roleId ? { ...r, [field]: value } : r)
        }));
    };

    const removeRole = (roleId) => {
        setProjectData(prev => ({ ...prev, roles: prev.roles.filter(r => r.id !== roleId) }));
    };


    // --- STEPS RENDER ---
    const renderStep1 = () => (
        <div className="space-y-6 animate-fadeIn">
            <h3 className="text-xl font-bold text-white mb-4">1. Project Specifications</h3>

            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                    <label className="block text-sm text-slate-400 mb-1">Project Name</label>
                    <input type="text" className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                        value={projectData.name} onChange={e => updateField('name', e.target.value)} placeholder="e.g. Westfield Expansion" />
                </div>
                <div className="col-span-2">
                    <label className="block text-sm text-slate-400 mb-1">Address</label>
                    <input type="text" className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                        value={projectData.address} onChange={e => updateField('address', e.target.value)} placeholder="123 Queen St, Auckland" />
                </div>
                <div className="col-span-2">
                    <label className="block text-sm text-slate-400 mb-1">Description</label>
                    <textarea className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white h-24"
                        value={projectData.description} onChange={e => updateField('description', e.target.value)} placeholder="Scope of works..." />
                </div>
                <div>
                    <label className="block text-sm text-slate-400 mb-1">Start Date</label>
                    <input type="date" className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                        value={projectData.startDate} onChange={e => updateField('startDate', e.target.value)} />
                </div>
                <div>
                    <label className="block text-sm text-slate-400 mb-1">End Date (Est.)</label>
                    <input type="date" className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                        value={projectData.endDate} onChange={e => updateField('endDate', e.target.value)} />
                </div>
            </div>

            <div className="border-t border-slate-700 pt-4 mt-6">
                <h4 className="text-white font-semibold mb-3">Site Supervisor Details</h4>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Name</label>
                        <input type="text" className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                            value={projectData.supervisorName} onChange={e => updateField('supervisorName', e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Phone</label>
                        <input type="text" className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                            value={projectData.supervisorPhone} onChange={e => updateField('supervisorPhone', e.target.value)} />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm text-slate-400 mb-1">Email</label>
                        <input type="email" className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                            value={projectData.supervisorEmail} onChange={e => updateField('supervisorEmail', e.target.value)} />
                    </div>
                </div>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6 animate-fadeIn">
            <h3 className="text-xl font-bold text-white mb-4">2. Construction Packages</h3>
            <p className="text-slate-400 text-sm mb-4">Select the phases required for this project.</p>

            <div className="grid grid-cols-2 gap-3 mb-6">
                {AVAILABLE_PACKAGES.map(pkg => (
                    <button key={pkg.id}
                        onClick={() => togglePackage(pkg.id, pkg.label)}
                        className={`p-3 rounded border text-left transition-all ${projectData.packages.find(p => p.id === pkg.id)
                                ? 'bg-secondary/20 border-secondary text-white'
                                : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800'
                            }`}
                    >
                        {pkg.label}
                    </button>
                ))}
            </div>

            <div className="flex gap-2">
                <input type="text" placeholder="Custom Package Name..." className="flex-1 bg-slate-800 border border-slate-700 rounded p-2 text-white"
                    value={customPkgName} onChange={e => setCustomPkgName(e.target.value)}
                />
                <button onClick={addCustomPackage} className="bg-slate-700 hover:bg-slate-600 text-white px-4 rounded font-medium flex items-center gap-2">
                    <Plus size={16} /> Add
                </button>
            </div>

            {projectData.packages.length > 0 && (
                <div className="mt-8">
                    <h4 className="text-white font-bold mb-3">Package Schedule</h4>
                    <div className="space-y-3">
                        {projectData.packages.map(pkg => (
                            <div key={pkg.id} className="flex items-center gap-4 bg-slate-800 p-3 rounded border border-slate-700">
                                <span className="flex-1 text-white font-medium">{pkg.label}</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-slate-400 text-sm">Start:</span>
                                    <input type="date" className="bg-slate-900 border border-slate-700 rounded p-1 text-white text-sm"
                                        value={pkg.startDate} onChange={e => updatePackageDate(pkg.id, e.target.value)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-6 animate-fadeIn">
            <h3 className="text-xl font-bold text-white mb-4">3. Roles & Resources</h3>
            <p className="text-slate-400 text-sm mb-4">Who do you need for this project?</p>

            <div className="flex flex-wrap gap-2 mb-6">
                {AVAILABLE_ROLES.map(role => (
                    <button key={role.id}
                        onClick={() => addRole(role.id, role.label)}
                        className="p-2 text-sm rounded bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 transition-colors"
                    >
                        + {role.label}
                    </button>
                ))}
            </div>

            {projectData.roles.length === 0 ? (
                <div className="text-center p-8 border border-dashed border-slate-700 rounded text-slate-500">
                    No roles selected. Click tags above to add.
                </div>
            ) : (
                <div className="space-y-3">
                    {projectData.roles.map(role => (
                        <div key={role.id} className="grid grid-cols-12 gap-4 items-center bg-slate-800/50 p-3 rounded border border-slate-700">
                            <div className="col-span-4 text-white font-medium">{role.label}</div>

                            <div className="col-span-3 flex items-center gap-2">
                                <span className="text-xs text-slate-500">QTY</span>
                                <input type="number" min="1" className="w-16 bg-slate-900 border border-slate-700 rounded p-1 text-white text-center"
                                    value={role.qty} onChange={e => updateRole(role.id, 'qty', parseInt(e.target.value))}
                                />
                            </div>

                            <div className="col-span-4 flex items-center gap-2">
                                <span className="text-xs text-slate-500">START</span>
                                <input type="date" className="w-full bg-slate-900 border border-slate-700 rounded p-1 text-white text-xs"
                                    value={role.startDate} onChange={e => updateRole(role.id, 'startDate', e.target.value)}
                                />
                            </div>

                            <div className="col-span-1 text-right">
                                <button onClick={() => removeRole(role.id)} className="text-slate-500 hover:text-red-400">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    const renderStep4 = () => (
        <div className="space-y-6 animate-fadeIn">
            <div className="text-center py-6">
                <div className="bg-green-500/20 text-green-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                    <Check size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Ready to Submit?</h3>
                <p className="text-slate-400">Review your project details before sending to Stellar.</p>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 space-y-4">
                <div className="flex justify-between border-b border-slate-700 pb-3">
                    <span className="text-slate-400">Project</span>
                    <span className="text-white font-bold">{projectData.name}</span>
                </div>
                <div className="flex justify-between border-b border-slate-700 pb-3">
                    <span className="text-slate-400">Supervisor</span>
                    <span className="text-white text-right">{projectData.supervisorName}<br /><span className="text-xs font-normal text-slate-500">{projectData.supervisorEmail}</span></span>
                </div>
                <div>
                    <span className="text-slate-400 block mb-2">Requirements</span>
                    <div className="flex flex-wrap gap-2">
                        {projectData.packages.map(p => (
                            <span key={p.id} className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">{p.label}</span>
                        ))}
                    </div>
                </div>
                <div>
                    <span className="text-slate-400 block mb-2">Workforce</span>
                    <div className="space-y-1">
                        {projectData.roles.map(r => (
                            <div key={r.id} className="flex justify-between text-sm">
                                <span className="text-slate-300">{r.qty}x {r.label}</span>
                                <span className="text-slate-500 font-mono">{r.startDate || 'ASAP'}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const handleSubmit = () => {
        console.log("Submitting Project:", projectData);
        alert("Project Request Sent! Your consultant will be in touch shortly.");
        // Reset or redirect
    };

    return (
        <div className="max-w-3xl mx-auto py-10 px-4">
            {/* Stepper */}
            <div className="flex items-center justify-between mb-8 px-10 relative">
                <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-slate-800 -z-10"></div>
                {[1, 2, 3, 4].map(s => (
                    <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border transition-all ${step >= s ? 'bg-secondary text-slate-900 border-secondary' : 'bg-slate-800 text-slate-500 border-slate-700'
                        }`}>
                        {s}
                    </div>
                ))}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-xl min-h-[500px]">
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
                {step === 4 && renderStep4()}
            </div>

            <div className="flex justify-between mt-6">
                <button
                    onClick={() => setStep(s => Math.max(1, s - 1))}
                    className={`px-6 py-2 rounded border border-slate-700 text-slate-300 hover:bg-slate-800 flex items-center gap-2 ${step === 1 ? 'opacity-0 pointer-events-none' : ''}`}
                >
                    <ChevronLeft size={18} /> Back
                </button>

                {step < 4 ? (
                    <button
                        onClick={() => setStep(s => Math.min(4, s + 1))}
                        className="px-6 py-2 rounded bg-secondary text-slate-900 font-bold hover:bg-secondary/90 flex items-center gap-2"
                    >
                        Next <ChevronRight size={18} />
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        className="px-8 py-2 rounded bg-green-500 text-white font-bold hover:bg-green-600 shadow-lg shadow-green-500/20"
                    >
                        Submit Request
                    </button>
                )}
            </div>
        </div>
    );
}
