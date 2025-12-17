"use client";

import { useState, useMemo } from 'react';
import Card from "@/components/Card";
import { Search, Filter, Map, List, Plus, Download, Upload, CheckCircle, MapPin, Briefcase, Zap, Users, ChevronRight } from "lucide-react";
import { useData } from "@/context/DataContext"; // Import context hook
import CandidateDashboard from "@/components/CandidateDashboard";
import CandidateMap from "@/components/CandidateMap";
import SquadBuilder from "@/components/SquadBuilder";
import RegionGrid from "@/components/RegionGrid";
import TradeGrid from "@/components/TradeGrid";
import CandidateModal from "@/components/CandidateModal";

export default function CandidatesPage() {
  const { candidates, addCandidate, updateCandidate, deploySquad, projects, isLoading } = useData(); // Consume context

  // Local UI State
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list', 'map', 'squads'
  const [squads, setSquads] = useState([]); // Squads can remain local for now or move to context if needed

  // Hierarchy State
  const [viewLevel, setViewLevel] = useState('regions'); // 'regions', 'trades', 'candidates'
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [dashboardFilter, setDashboardFilter] = useState(null);

  const filteredCandidates = useMemo(() => {
    return candidates.filter(c => {
      if (dashboardFilter) {
        if (dashboardFilter === 'Available') return c.status === 'Available';
        if (dashboardFilter === 'Finishing Soon') {
          if (!c.finishDate || c.status === 'Available') return false;
          const today = new Date();
          const finish = new Date(c.finishDate);
          const diff = (finish - today) / (1000 * 60 * 60 * 24);
          return diff >= 0 && diff <= 14;
        }
        return true; // Total Pool shows all
      }
      if (!selectedRegion) return false; // Don't show any candidates if no region is selected at candidate level
      if (!selectedTrade) return false; // Don't show any candidates if no trade is selected at candidate level

      return c.state === selectedRegion && c.role === selectedTrade;
    });
  }, [candidates, dashboardFilter, selectedRegion, selectedTrade]);

  const handleCandidateClick = (candidate) => {
    setSelectedCandidate(candidate);
  };

  const closeCandidateModal = () => {
    setSelectedCandidate(null);
  };

  // Handle Saving Candidate (Add or Edit)
  // Handle Saving Candidate (Add or Edit)
  const handleSaveCandidate = (updatedCandidate) => {
    // Check if candidate actually exists in the list (to distinguish new vs edit)
    const exists = candidates.some(c => c.id === updatedCandidate.id);

    if (exists) {
      // Edit Mode
      updateCandidate(updatedCandidate);
    } else {
      // Add Mode
      addCandidate(updatedCandidate);
    }
    setSelectedCandidate(updatedCandidate);
  };

  const handleAddCandidate = () => {
    setSelectedCandidate({
      id: Date.now(),
      firstName: "",
      lastName: "",
      knownAs: "",
      dob: "",
      phone: "",
      mobile: "",
      email: "",
      otherEmail: "",
      address1: "",
      address2: "",
      suburb: "",
      state: "",
      postcode: "",
      country: "",
      residency: "",
      residencyExpiryDate: "",
      indigenous: "",
      currentEmployer: "",
      currentPosition: "",
      currentWorkType: "",
      currentSalary: "",
      chargeOutRate: "",
      noticePeriod: "",
      idealPosition: "",
      idealWorkType: "",
      idealSalary: "",
      idealLocation: "",
      emergencyContact: "",
      emergencyContactRelationship: "",
      emergencyPhone: "",
      linkedin: "",
      twitter: "",
      facebook: "",
      source: "",
      recruiter: "",
      branch: "",
      division: "",
      internalRating: 0,
      status: "Available",
      dateCreated: new Date().toISOString().split('T')[0],
      dateUpdated: new Date().toISOString().split('T')[0],
      lastNote: ""
    });
  };

  const handleBulkExport = () => {
    if (candidates.length === 0) {
      console.warn("Cannot export an empty candidate list.");
      return;
    }
    const headers = Object.keys(candidates[0]).join(",");

    // Explicit map to avoid potential syntax issues with template literals in some parsers
    const rows = candidates.map(c => {
      return Object.values(c).map(v => '"' + v + '"').join(",");
    });

    const csvContent = [headers, ...rows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "candidates_export.csv";
    link.click();
  };

  const handleBulkImport = () => {
    // Mock import functionality
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        console.info('Mock Import: Successfully imported ' + file.name);
      }
    };
    input.click();
  };

  return (
    <div className="candidates-container">
      <header className="page-header">
        <h1 className="text-3xl font-bold text-white">Candidate Pool</h1>
        <div className="header-actions">
          <button className="action-btn primary" onClick={handleAddCandidate}>
            <Plus size={18} /> Add Candidate
          </button>
          <button className="action-btn" onClick={handleBulkExport}>
            <Download size={18} /> Export
          </button>
          <button className="action-btn" onClick={handleBulkImport}>
            <Upload size={18} /> Import
          </button>
          <div className="search-bar">
            <Search size={20} className="search-icon" />
            <input type="text" placeholder="Search by skill, name, or location..." />
            <button className="filter-btn">
              <Filter size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="candidates-list">
        {/* Dashboard Section */}
        {!isLoading && (
          <CandidateDashboard
            candidates={candidates} // Pass context candidates
            onStatusClick={(status) => {
              setDashboardFilter(status);
              setViewLevel('candidates');
              setSelectedRegion(null);
              setSelectedTrade(null);
            }}
          />
        )}

        {/* View Toggle & Filters */}
        <div className="view-controls">
          <div className="toggle-group">
            <button
              className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <List size={18} /> List
            </button>
            <button
              className={`toggle-btn ${viewMode === 'map' ? 'active' : ''}`}
              onClick={() => setViewMode('map')}
            >
              <Map size={18} /> Map
            </button>
            <button
              className={`toggle-btn ${viewMode === 'squads' ? 'active' : ''}`}
              onClick={() => setViewMode('squads')}
            >
              <Users size={18} /> Squads
            </button>
          </div>
        </div>

        {viewMode === 'squads' ? (
          <SquadBuilder
            candidates={candidates}
            projects={projects}
            squads={squads}
            setSquads={setSquads}
            onDeploySquad={(squad, project) => {
              deploySquad(squad, project); // Use context action
              console.info('Successfully deployed ' + squad.name + ' to ' + project.name + '!');
            }}
          />
        ) : viewMode === 'map' ? (
          <CandidateMap
            candidates={candidates}
            projects={projects}
            onCandidateClick={handleCandidateClick}
          />
        ) : (
          /* LIST VIEW HIERARCHY */
          <>
            {/* Breadcrumbs */}
            {viewLevel !== 'regions' && (
              <div className="flex items-center gap-2 mb-6 text-sm text-slate-400">
                <button onClick={() => { setViewLevel('regions'); setSelectedRegion(null); setSelectedTrade(null); setDashboardFilter(null); }} className="hover:text-white transition-colors">Regions</button>
                {selectedRegion && <ChevronRight size={14} />}
                {selectedRegion && (
                  <button onClick={() => { setViewLevel('trades'); setSelectedTrade(null); }} className={`hover:text-white transition-colors ${!selectedTrade ? 'text-white font-bold' : ''}`}>
                    {selectedRegion}
                  </button>
                )}
                {selectedTrade && (
                  <>
                    <ChevronRight size={14} />
                    <span className="text-white font-bold">{selectedTrade}</span>
                  </>
                )}
              </div>
            )}

            {/* Hierarchy Views */}
            {viewLevel === 'regions' && (
              <RegionGrid
                candidates={candidates}
                onRegionClick={(region) => {
                  setSelectedRegion(region);
                  setViewLevel('trades');
                }}
              />
            )}

            {viewLevel === 'trades' && (
              <TradeGrid
                candidates={candidates.filter(c => c.state === selectedRegion)}
                onTradeClick={(trade) => {
                  setSelectedTrade(trade);
                  setViewLevel('candidates');
                }}
                regionName={selectedRegion}
              />
            )}

            {viewLevel === 'candidates' && (
              <div className="flex flex-col gap-4">
                {isLoading ? (
                  // Skeleton Loading State
                  Array(4).fill(0).map((_, i) => (
                    <div key={i} className="skeleton-card">
                      <div className="skeleton-avatar"></div>
                      <div className="skeleton-info">
                        <div className="skeleton-line w-40"></div>
                        <div className="skeleton-line w-24"></div>
                      </div>
                      <div className="skeleton-meta"></div>
                    </div>
                  ))
                ) : (
                  // Use the memoized list for rendering
                  filteredCandidates.map((candidate) => {
                    const isReady = candidate.status === "Available";

                    // Traffic Light Logic
                    let statusColorClass = "";
                    if (candidate.status === "Available") statusColorClass = "status-red";
                    else if (candidate.finishDate) {
                      const today = new Date();
                      const finish = new Date(candidate.finishDate);
                      const diffDays = Math.ceil((finish - today) / (1000 * 60 * 60 * 24));
                      if (diffDays <= 14) statusColorClass = "status-orange";
                      else if (diffDays <= 60) statusColorClass = "status-blue";
                      else statusColorClass = "status-green";
                    } else {
                      statusColorClass = "status-green";
                    }

                    return (
                      <Card key={candidate.id} className={`candidate-card ${statusColorClass}`} onClick={() => handleCandidateClick(candidate)}>
                        <div className="candidate-row">
                          <div className="candidate-avatar">
                            {candidate.firstName?.[0]}{candidate.lastName?.[0]}
                            {isReady && (
                              <div className="ready-indicator" title="Ready to Deploy">
                                <CheckCircle size={12} fill="var(--secondary)" color="#0f172a" />
                              </div>
                            )}
                          </div>

                          <div className="candidate-info">
                            <h3 className="candidate-name">{candidate.firstName} {candidate.lastName}</h3>
                            <div className="candidate-details-grid">
                              <div className="detail-item">
                                <span className="label">Role:</span>
                                <span className="value">{candidate.role || candidate.currentPosition || 'None'}</span>
                              </div>
                              <div className="detail-item">
                                <span className="label">Status:</span>
                                <span className={`value status-text ${statusColorClass}`}>
                                  {candidate.status === "Available" ? "On Bench" :
                                    candidate.finishDate ? ("Finishes " + candidate.finishDate) : "On Job"}
                                </span>
                              </div>
                              <div className="detail-item">
                                <span className="label">Salary:</span>
                                <span className="value">{candidate.currentSalary || 'N/A'}</span>
                              </div>
                              <div className="detail-item">
                                <span className="label">Charge Out:</span>
                                <span className="value highlight">{candidate.chargeOutRate || 'N/A'}</span>
                              </div>
                            </div>
                          </div>

                          <div className="candidate-meta">
                            <div className="meta-item">
                              <MapPin size={16} />
                              <span>{candidate.suburb}, {candidate.state}</span>
                            </div>
                            <div className="meta-item">
                              <Briefcase size={16} className="text-slate-400" />
                              <span>{candidate.currentEmployer || 'Available'}</span>
                            </div>
                          </div>

                          {/* Match Score */}
                          <div className="match-score">
                            <div className="score-label">
                              <Zap size={12} className="text-rose-500" /> Match
                            </div>
                            <div className="score-value text-gradient">{candidate.matchScore}%</div>
                          </div>

                          <div className={`status-badge ${candidate.status.toLowerCase().replace(' ', '-')}`}>
                            {candidate.status}
                          </div>

                          <button className="view-btn" onClick={(e) => {
                            e.stopPropagation();
                            handleCandidateClick(candidate);
                          }}>View Profile</button>
                        </div>
                      </Card>
                    );
                  })
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Detailed Candidate Modal */}
      {selectedCandidate && (
        <CandidateModal
          candidate={selectedCandidate}
          squads={squads} // Pass squads
          projects={projects} // Pass projects
          onClose={closeCandidateModal}
          onSave={(updatedCandidate) => {
            // Handle Squad Assignment (still local for now)
            if (updatedCandidate.squadId && updatedCandidate.squadId !== selectedCandidate.squadId) {
              setSquads(prev => prev.map(s => {
                // Remove from old squad if exists
                if (s.id === selectedCandidate.squadId) {
                  return { ...s, members: s.members.filter(m => m.id !== updatedCandidate.id) };
                }
                // Add to new squad
                if (s.id === updatedCandidate.squadId) {
                  // Avoid duplicates
                  if (s.members.find(m => m.id === updatedCandidate.id)) return s;
                  return { ...s, members: [...s.members, updatedCandidate] };
                }
                return s;
              }));
            } else if (!updatedCandidate.squadId && selectedCandidate.squadId) {
              // Remove from squad if cleared
              setSquads(prev => prev.map(s => {
                if (s.id === selectedCandidate.squadId) {
                  return { ...s, members: s.members.filter(m => m.id !== updatedCandidate.id) };
                }
                return s;
              }));
            }

            handleSaveCandidate(updatedCandidate); // Use the new handler
          }}
        />
      )}

      <style jsx>{`
        .status-text.status-blue { color: #3b82f6; }
        .status-text.status-green { color: #10b981; }

        .candidates-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          position: relative;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--surface);
          border: 1px solid var(--border);
          color: var(--text-main);
          padding: 0.5rem 1rem;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: var(--transition-fast);
          font-size: 0.875rem;
        }

        .action-btn:hover {
          border-color: var(--secondary);
          color: var(--secondary);
        }

        .action-btn.primary {
          background: var(--secondary);
          color: #0f172a;
          border-color: var(--secondary);
          font-weight: 600;
        }

        .action-btn.primary:hover {
          background: var(--secondary-light);
        }

        .search-bar {
          display: flex;
          align-items: center;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 0.5rem 1rem;
          width: 400px;
          gap: 0.75rem;
        }

        .search-bar input {
          background: none;
          border: none;
          color: var(--text-main);
          flex: 1;
          outline: none;
        }

        .search-icon { color: var(--text-muted); }
        .filter-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
        }

        .candidates-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .candidate-card {
          cursor: pointer;
          transition: transform 0.2s, border-color 0.2s;
        }
        
        .candidate-card:hover {
          border-color: var(--secondary);
          transform: translateY(-2px);
        }

        .candidate-card :global(.card-content) {
          padding: 1rem 1.5rem;
        }

        .candidate-row {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .candidate-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: var(--primary-light);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          color: var(--secondary);
          border: 1px solid var(--border);
          position: relative;
          flex-shrink: 0;
        }

        .ready-indicator {
          position: absolute;
          bottom: -2px;
          right: -2px;
          background: white;
          border-radius: 50%;
          display: flex;
        }

        .candidate-info {
          flex: 3;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .candidate-name {
          font-weight: 600;
          color: var(--text-main);
          font-size: 1.1rem;
        }

        .candidate-details-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.25rem 1rem;
          font-size: 0.85rem;
        }

        .detail-item {
          display: flex;
          gap: 0.5rem;
        }

        .detail-item.label {
          color: var(--text-muted);
          min-width: 70px;
        }

        .detail-item.value {
          color: var(--text-main);
          font-weight: 500;
        }
        
        .detail-item.value.highlight {
          color: var(--secondary);
          font-weight: 600;
        }

        .candidate-meta {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          justify-content: center;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-muted);
          font-size: 0.875rem;
        }

        .match-score {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-right: 1.5rem;
        }

        .score-label {
          font-size: 0.65rem;
          text-transform: uppercase;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 2px;
        }

        .score-value {
          font-size: 1.25rem;
          font-weight: 800;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 500;
          min-width: 100px;
          text-align: center;
        }

        .status-badge.available { background: rgba(16, 185, 129, 0.2); color: #6ee7b7; }
        .status-badge.on-job { background: rgba(56, 189, 248, 0.2); color: #7dd3fc; }

        .view-btn {
          background: transparent;
          border: 1px solid var(--border);
          color: var(--text-main);
          padding: 0.5rem 1rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .view-btn:hover {
          border-color: var(--secondary);
          color: var(--secondary);
        }

        /* Skeleton Loading */
        .skeleton-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid transparent;
          border-radius: var(--radius-md);
          padding: 1rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          animation: pulse 1.5s infinite ease-in-out;
        }

        .skeleton-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
        }

        .skeleton-info {
          flex: 2;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .skeleton-line {
          height: 12px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }

        .w-40 { width: 160px; }
        .w-24 { width: 96px; }

        .skeleton-meta {
          flex: 2;
          height: 20px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }

        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
