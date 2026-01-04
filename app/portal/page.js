"use client";

import { useState } from "react";
import { Users, Map as MapIcon, ClipboardCheck, DollarSign, LogOut } from "lucide-react";
import PortalDashboard from "../../components/portal/portal-dashboard.js";

export default function PortalPage() {
    // Mock Client Login State
    const clientUser = {
        name: "Sarah Jenkins",
        company: "Fletcher Construction",
        logo: "FC" 
    };

    const [activeTab, setActiveTab] = useState('deploy');

    return (
        <div className="portal-container">
            {/* Portal Sidebar */}
            <aside className="portal-sidebar">
                <div className="brand">
                    <div className="logo-text">
                        <span className="text-white">STELLAR</span>
                        <span className="text-secondary">CONNECT</span>
                    </div>
                    <div className="client-badge">
                        <div className="client-avatar">{clientUser.logo}</div>
                        <div className="client-info">
                            <span className="name">{clientUser.name}</span>
                            <span className="company">{clientUser.company}</span>
                        </div>
                    </div>
                </div>

                <nav className="portal-nav">
                    <button 
                        className={`nav-item ${activeTab === 'deploy' ? 'active' : ''}`}
                        onClick={() => setActiveTab('deploy')}
                    >
                        <MapIcon size={20} /> Click & Deploy
                    </button>
                    <button 
                        className={`nav-item ${activeTab === 'muster' ? 'active' : ''}`}
                        onClick={() => setActiveTab('muster')}
                    >
                        <Users size={20} /> Live Muster
                    </button>
                    <button 
                        className={`nav-item ${activeTab === 'timesheets' ? 'active' : ''}`}
                        onClick={() => setActiveTab('timesheets')}
                    >
                        <ClipboardCheck size={20} /> Timesheets
                    </button>
                    <button 
                        className={`nav-item ${activeTab === 'budget' ? 'active' : ''}`}
                        onClick={() => setActiveTab('budget')}
                    >
                        <DollarSign size={20} /> Budget
                    </button>
                </nav>

                <div className="logout-section">
                    <button className="nav-item logout">
                        <LogOut size={20} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="portal-main">
                {activeTab === 'deploy' && <PortalDashboard />}
                {activeTab !== 'deploy' && (
                    <div className="placeholder-view">
                        Feature coming soon to Stellar Connect.
                    </div>
                )}
            </main>

            <style jsx>{`
                .portal-container {
                    display: flex;
                    height: 100vh;
                    background: #0f172a;
                    color: white;
                }

                .portal-sidebar {
                    width: 260px;
                    background: #1e293b;
                    border-right: 1px solid var(--border);
                    display: flex;
                    flex-direction: column;
                    padding: 1.5rem;
                }

                .brand {
                    margin-bottom: 3rem;
                }

                .logo-text {
                    font-size: 1.2rem;
                    font-weight: 800;
                    letter-spacing: 0.05em;
                    margin-bottom: 1.5rem;
                }

                .client-badge {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.75rem;
                    background: rgba(255,255,255,0.05);
                    border-radius: 8px;
                    border: 1px solid var(--border);
                }

                .client-avatar {
                    width: 32px;
                    height: 32px;
                    background: var(--secondary);
                    color: #0f172a;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 4px;
                }

                .client-info {
                    display: flex;
                    flex-direction: column;
                }

                .client-info .name { font-size: 0.85rem; font-weight: 600; }
                .client-info .company { font-size: 0.7rem; color: var(--text-muted); }

                .portal-nav {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    flex: 1;
                }

                .nav-item {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.75rem 1rem;
                    background: transparent;
                    border: none;
                    color: var(--text-muted);
                    font-size: 0.9rem;
                    font-weight: 500;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.2s;
                    text-align: left;
                }

                .nav-item:hover {
                    background: rgba(255,255,255,0.05);
                    color: white;
                }

                .nav-item.active {
                    background: var(--secondary);
                    color: #0f172a;
                    font-weight: 700;
                }

                .nav-item.logout {
                    color: #ef4444;
                }
                .nav-item.logout:hover {
                    background: rgba(239, 68, 68, 0.1);
                }

                .portal-main {
                    flex: 1;
                    overflow-y: auto;
                    background: #0f172a;
                }

                .placeholder-view {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    color: var(--text-muted);
                    font-style: italic;
                }
            `}</style>
        </div>
    );
}
