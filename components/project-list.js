"use client";

import { useState } from "react";
import { Search, Filter, Building2, Calendar, DollarSign, Layers } from "lucide-react";

export default function ProjectList({ projects, onSelectProject, selectedProjectId }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStage, setFilterStage] = useState("All");
    const [filterTier, setFilterTier] = useState("All");

    const filteredProjects = projects.filter(project => {
        const matchesSearch = (project.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (project.client || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStage = filterStage === "All" || (project.stage || project.status || 'Planning') === filterStage;
        const matchesTier = filterTier === "All" || (project.tier || 'Tier 3') === filterTier;
        return matchesSearch && matchesStage && matchesTier;
    });

    return (
        <div className="project-list-container">
            <div className="list-header">
                <div className="search-bar">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search projects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filters-row">
                    <div className="filter-dropdown">
                        <Filter size={14} className="filter-icon" />
                        <select value={filterStage} onChange={(e) => setFilterStage(e.target.value)}>
                            <option value="All">All Stages</option>
                            <option value="Planning">Planning</option>
                            <option value="Foundation">Foundation</option>
                            <option value="Construction">Construction</option>
                            <option value="Finishing">Finishing</option>
                        </select>
                    </div>
                    <div className="filter-dropdown">
                        <Layers size={14} className="filter-icon" />
                        <select value={filterTier} onChange={(e) => setFilterTier(e.target.value)}>
                            <option value="All">All Tiers</option>
                            <option value="Tier 1">Tier 1</option>
                            <option value="Tier 2">Tier 2</option>
                            <option value="Tier 3">Tier 3</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="list-content">
                {filteredProjects.map((project) => (
                    <div
                        key={project.id}
                        className={`project-card ${selectedProjectId === project.id ? 'selected' : ''}`}
                        onClick={() => onSelectProject(project)}
                    >
                        <div className="card-header">
                            <h3>{project.name}</h3>
                            <div className="badges">
                                <span className={`tier-badge ${(project.tier || 'Tier 3').toLowerCase().replace(' ', '-')}`}>{project.tier || 'Tier 3'}</span>
                                <span className={`status-badge ${(project.status || 'Planning').toLowerCase()}`}>{project.status || 'Planning'}</span>
                            </div>
                        </div>
                        <div className="card-details">
                            <div className="detail-item">
                                <Building2 size={14} />
                                <span>{project.client}</span>
                            </div>
                            <div className="detail-item">
                                <DollarSign size={14} />
                                <span>{project.value}</span>
                            </div>
                            <div className="detail-item">
                                <Calendar size={14} />
                                <span>{project.stage}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <style jsx>{`
                .project-list-container {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    background: var(--surface);
                    border-radius: var(--radius-md);
                    border: 1px solid var(--border);
                    overflow: hidden;
                }

                .list-header {
                    padding: 1rem;
                    border-bottom: 1px solid var(--border);
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .search-bar {
                    position: relative;
                    display: flex;
                    align-items: center;
                }

                .search-icon {
                    position: absolute;
                    left: 0.75rem;
                    color: var(--text-muted);
                }

                .search-bar input {
                    width: 100%;
                    padding: 0.5rem 0.5rem 0.5rem 2.5rem;
                    background: var(--background);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-sm);
                    color: var(--text-main);
                    outline: none;
                }

                .search-bar input:focus {
                    border-color: var(--primary);
                }

                .filters-row {
                    display: flex;
                    gap: 0.5rem;
                }

                .filter-dropdown {
                    position: relative;
                    display: flex;
                    align-items: center;
                    flex: 1;
                }

                .filter-icon {
                    position: absolute;
                    left: 0.75rem;
                    color: var(--text-muted);
                    pointer-events: none;
                }

                .filter-dropdown select {
                    width: 100%;
                    padding: 0.5rem 0.5rem 0.5rem 2.25rem;
                    background: var(--background);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-sm);
                    color: var(--text-main);
                    outline: none;
                    cursor: pointer;
                    appearance: none;
                    font-size: 0.85rem;
                }

                .list-content {
                    flex: 1;
                    overflow-y: auto;
                    padding: 1rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .project-card {
                    padding: 1rem;
                    background: var(--background);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-sm);
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .project-card:hover {
                    border-color: var(--primary);
                    transform: translateY(-2px);
                }

                .project-card.selected {
                    border-color: var(--primary);
                    background: rgba(59, 130, 246, 0.05);
                    box-shadow: 0 0 0 1px var(--primary);
                }

                .card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 0.75rem;
                    gap: 0.5rem;
                }

                .card-header h3 {
                    font-size: 0.95rem;
                    font-weight: 600;
                    color: var(--text-main);
                    margin: 0;
                    line-height: 1.4;
                    flex: 1;
                }

                .badges {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    gap: 0.25rem;
                }

                .status-badge {
                    font-size: 0.7rem;
                    padding: 0.125rem 0.5rem;
                    border-radius: 999px;
                    font-weight: 500;
                    white-space: nowrap;
                }

                .tier-badge {
                    font-size: 0.65rem;
                    padding: 0.125rem 0.4rem;
                    border-radius: 4px;
                    font-weight: 600;
                    text-transform: uppercase;
                    border: 1px solid var(--border);
                    color: var(--text-muted);
                }
                
                .tier-badge.tier-1 { background: rgba(245, 158, 11, 0.1); color: #f59e0b; border-color: rgba(245, 158, 11, 0.2); }
                .tier-badge.tier-2 { background: rgba(59, 130, 246, 0.1); color: #3b82f6; border-color: rgba(59, 130, 246, 0.2); }

                .status-badge.active { background: rgba(16, 185, 129, 0.1); color: #10b981; }
                .status-badge.planning { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
                .status-badge.finishing { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }

                .card-details {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.75rem;
                }

                .detail-item {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    color: var(--text-muted);
                    font-size: 0.8rem;
                }
            `}</style>
        </div>
    );
}
