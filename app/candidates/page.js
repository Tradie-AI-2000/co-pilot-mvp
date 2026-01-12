"use client";

import { useState, useMemo, useEffect } from 'react';
import Card from "../../components/card.js";
import { Search, Filter, Map, List, Plus, Download, Upload, CheckCircle, MapPin, Briefcase, Zap, Users, ChevronRight, Calendar, LayoutGrid, Table, X } from "lucide-react";
import { useData } from "../../context/data-context.js"; // Import context hook
import CandidateDashboard from "../../components/candidate-dashboard.js";
import CandidateMap from "../../components/candidate-map.js";
import SquadBuilder from "../../components/squad-builder.js";
import RegionGrid from "../../components/region-grid.js";
import TradeGrid from "../../components/trade-grid.js";
import CandidateModal from "../../components/candidate-modal.js";
import WeeklyCheckinWidget from "../../components/weekly-checkin-widget.js";
import BenchRoster from "../../components/bench-roster.js";
import HotListModal from "../../components/hot-list-modal.js";
import { FinishingSoonWidget, ClientDemandWidget, SharePointModal } from "../../components/sharepoint-mirror-widgets.js";
import { mockSharePointData } from "../../services/enhanced-mock-data.js";


export default function CandidatesPage() {
  const { candidates, addCandidate, updateCandidate, deploySquad, projects, isLoading } = useData(); // Consume context

  // Local UI State
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list', 'table', 'map', 'squads', 'check-ins'
  const [squads, setSquads] = useState([]); // Squads can remain local for now or move to context if needed

  // Hot List State
  const [isHotListOpen, setIsHotListOpen] = useState(false);
  const [selectedHotList, setSelectedHotList] = useState([]);

  // Hierarchy State
  const [viewLevel, setViewLevel] = useState('regions'); // 'regions', 'trades', 'candidates'
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [dashboardFilter, setDashboardFilter] = useState(null);

  // SharePoint Mirror State
  const [mirrorModal, setMirrorModal] = useState({ isOpen: false, type: null });

  // Auto-switch to table view on Bench Filter
  useEffect(() => {
    if (dashboardFilter === 'Available' || dashboardFilter === 'Finishing Soon') {
      setViewMode('table');
    }
  }, [dashboardFilter]);

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
      if (viewMode === 'table') return true; // Show all in table mode by default if no dashboard filter
      if (!selectedRegion) return false; // Don't show any candidates if no region is selected at candidate level
      if (!selectedTrade) return false; // Don't show any candidates if no trade is selected at candidate level

      return c.state === selectedRegion && c.role === selectedTrade;
    });
  }, [candidates, dashboardFilter, selectedRegion, selectedTrade, viewMode]);

  const handleCandidateClick = (candidate) => {
    setSelectedCandidate(candidate);
  };

  const closeCandidateModal = () => {
    setSelectedCandidate(null);
  };

  const handleSaveCandidate = (updatedCandidate) => {
    const exists = candidates.some(c => c.id === updatedCandidate.id);
    if (exists) {
      updateCandidate(updatedCandidate);
    } else {
      addCandidate(updatedCandidate);
    }
    setSelectedCandidate(updatedCandidate);
  };

  const handleAddCandidate = () => {
    setSelectedCandidate({
      id: Date.now(),
      firstName: "",
      lastName: "",
      status: "Available",
      dateCreated: new Date().toISOString().split('T')[0],
      dateUpdated: new Date().toISOString().split('T')[0],
    });
  };

  const handleBulkExport = () => {
    if (candidates.length === 0) return;
    const headers = Object.keys(candidates[0]).join(",");
    const rows = candidates.map(c => Object.values(c).map(v => `"${v}"`).join(","));
    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "candidates_export.csv";
    link.click();
  };

  const handleBulkImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv";
    input.onchange = (e) => {
      if (e.target.files[0]) console.info('Mock Import: ' + e.target.files[0].name);
    };
    input.click();
  };

  const handleGenerateHotList = (selected) => {
    setSelectedHotList(selected);
    setIsHotListOpen(true);
  };

  return (
    <>
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
          {/* SharePoint Mirror Portals */}
          <div className="mirror-portals-grid">
            <FinishingSoonWidget
              data={mockSharePointData.finishingSoon}
              onExpand={() => setMirrorModal({ isOpen: true, type: 'finishingSoon' })}
            />
            <ClientDemandWidget
              data={mockSharePointData.clientDemand}
              onExpand={() => setMirrorModal({ isOpen: true, type: 'clientDemand' })}
            />
          </div>

          {!isLoading && (
            <CandidateDashboard
              candidates={candidates}
              onStatusClick={(status) => {
                setDashboardFilter(status);
                setViewLevel('candidates');
                setSelectedRegion(null);
                setSelectedTrade(null);
              }}
            />
          )}

          <div className="view-controls">
            <div className="toggle-group">
              <button className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>
                <LayoutGrid size={18} /> Grid
              </button>
              <button className={`toggle-btn ${viewMode === 'table' ? 'active' : ''}`} onClick={() => setViewMode('table')}>
                <Table size={18} /> Roster
              </button>
              <button className={`toggle-btn ${viewMode === 'map' ? 'active' : ''}`} onClick={() => setViewMode('map')}>
                <Map size={18} /> Map
              </button>
              <button className={`toggle-btn ${viewMode === 'squads' ? 'active' : ''}`} onClick={() => setViewMode('squads')}>
                <Users size={18} /> Squads
              </button>
              <button className={`toggle-btn ${viewMode === 'check-ins' ? 'active' : ''}`} onClick={() => setViewMode('check-ins')}>
                <Calendar size={18} /> Check-ins
              </button>
            </div>

            {/* Filter Breadcrumbs if active */}
            {dashboardFilter && (
              <div className="filter-badge">
                Showing: <strong>{dashboardFilter}</strong>
                <button onClick={() => { setDashboardFilter(null); setViewMode('list'); }}><X size={14} /></button>
              </div>
            )}
          </div>

          {viewMode === 'table' ? (
            <BenchRoster
              candidates={filteredCandidates}
              onGenerateHotList={handleGenerateHotList}
            />
          ) : viewMode === 'check-ins' ? (
            <div className="checkin-view-wrapper">
              <WeeklyCheckinWidget />
            </div>
          ) : viewMode === 'squads' ? (
            <SquadBuilder
              candidates={candidates}
              projects={projects}
              squads={squads}
              setSquads={setSquads}
              onDeploySquad={(squad, project) => {
                deploySquad(squad, project);
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
            <>
              {viewLevel !== 'regions' && (
                <div className="breadcrumb-nav">
                  <button onClick={() => { setViewLevel('regions'); setSelectedRegion(null); setSelectedTrade(null); setDashboardFilter(null); }} className="breadcrumb-tag root">Regions</button>
                  {selectedRegion && <ChevronRight size={14} className="text-slate-600" />}
                  {selectedRegion && (
                    <button onClick={() => { setViewLevel('trades'); setSelectedTrade(null); }} className={`breadcrumb-tag ${!selectedTrade ? 'active' : ''}`}>
                      {selectedRegion}
                    </button>
                  )}
                  {selectedTrade && (
                    <>
                      <ChevronRight size={14} className="text-slate-600" />
                      <span className="breadcrumb-tag active">{selectedTrade}</span>
                    </>
                  )}
                </div>
              )}

              {viewLevel === 'regions' && <RegionGrid candidates={candidates} onRegionClick={(region) => { setSelectedRegion(region); setViewLevel('trades'); }} />}
              {viewLevel === 'trades' && <TradeGrid candidates={candidates.filter(c => c.state === selectedRegion)} onTradeClick={(trade) => { setSelectedTrade(trade); setViewLevel('candidates'); }} regionName={selectedRegion} />}
              {viewLevel === 'candidates' && (
                <div className="flex flex-col gap-4">
                  {isLoading ? (
                    Array(4).fill(0).map((_, i) => <div key={i} className="skeleton-card"><div className="skeleton-avatar"></div><div className="skeleton-info"><div className="skeleton-line w-40"></div><div className="skeleton-line w-24"></div></div><div className="skeleton-meta"></div></div>)
                  ) : (
                    filteredCandidates.map((candidate) => {
                      const isReady = candidate.status === "Available";
                      let statusColorClass = "";
                      if (candidate.status === "Available") statusColorClass = "status-red";
                      else if (candidate.finishDate) {
                        const diffDays = Math.ceil((new Date(candidate.finishDate) - new Date()) / (1000 * 60 * 60 * 24));
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
                              {isReady && <div className="ready-indicator" title="Ready to Deploy"><CheckCircle size={12} fill="var(--secondary)" color="#0f172a" /></div>}
                            </div>
                            <div className="candidate-info">
                              <h3 className="candidate-name">{candidate.firstName} {candidate.lastName}</h3>
                              <div className="candidate-details-grid">
                                <div className="detail-item"><span className="label">Role:</span><span className="value">{candidate.role || 'None'}</span></div>
                                <div className="detail-item">
                                  <span className="label">Status:</span>
                                  <div className="flex flex-col">
                                    <span className={`value status-text ${statusColorClass}`}>
                                      {candidate.status === "Available" ? "On Bench" : candidate.status}
                                    </span>
                                    {candidate.finishDate && candidate.status !== "Available" && (
                                      <span className="text-[0.65rem] text-orange-400 font-mono mt-0.5">
                                        Ends: {candidate.finishDate}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="detail-item"><span className="label">Pay:</span><span className="value">${candidate.payRate || 0}/hr</span></div>
                                <div className="detail-item"><span className="label">Charge:</span><span className="value highlight">${candidate.chargeRate || 0}/hr</span></div>
                              </div>
                            </div>
                            <div className="candidate-meta">
                              <div className="meta-item"><MapPin size={16} /><span>{candidate.suburb}, {candidate.state}</span></div>
                              <div className="meta-item"><Briefcase size={16} className="text-slate-400" /><span>{candidate.currentEmployer || 'Available'}</span></div>
                            </div>
                            <button className="view-btn" onClick={(e) => { e.stopPropagation(); handleCandidateClick(candidate); }}>View Profile</button>
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

        {selectedCandidate && (
          <CandidateModal
            candidate={selectedCandidate}
            squads={squads}
            projects={projects}
            onClose={closeCandidateModal}
            onSave={(updatedCandidate) => {
              handleSaveCandidate(updatedCandidate);
            }}
          />
        )}

        {isHotListOpen && (
          <HotListModal
            candidates={selectedHotList}
            onClose={() => setIsHotListOpen(false)}
          />
        )}

        <SharePointModal
          isOpen={mirrorModal.isOpen}
          type={mirrorModal.type}
          data={mirrorModal.type ? mockSharePointData[mirrorModal.type] : null}
          onClose={() => setMirrorModal({ isOpen: false, type: null })}
        />

        <style jsx>{`
          .mirror-portals-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 1.5rem;
              margin-bottom: 1rem;
          }
        .status-text.status-blue { color: #3b82f6; }
        .status-text.status-green { color: #10b981; }
        
        .candidates-container { 
          display: flex; 
          flex-direction: column; 
          gap: 2rem; 
          position: relative;
          max-width: 1600px;
          margin: 0 auto;
        }

        .page-header { 
          display: flex; 
          justify-content: space-between; 
          align-items: center;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border);
        }

        .header-actions { 
          display: flex; 
          gap: 1rem; 
          align-items: center; 
        }

        /* Antigravity Button Styles */
        .action-btn, .toggle-btn, .view-btn { 
          appearance: none;
          display: flex; 
          align-items: center; 
          gap: 0.5rem; 
          background: rgba(30, 41, 59, 0.4); 
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid var(--border); 
          color: var(--text-muted); 
          padding: 0.6rem 1.2rem; 
          border-radius: var(--radius-md); 
          cursor: pointer; 
          transition: all 0.2s ease; 
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .action-btn:hover, .toggle-btn:hover, .view-btn:hover { 
          border-color: var(--secondary); 
          color: var(--secondary); 
          box-shadow: 0 0 15px rgba(0, 242, 255, 0.1);
          background: rgba(30, 41, 59, 0.6);
        }

        .action-btn.primary { 
          background: rgba(0, 242, 255, 0.1); 
          color: var(--secondary); 
          border-color: rgba(0, 242, 255, 0.3); 
        }

        .action-btn.primary:hover { 
          background: rgba(0, 242, 255, 0.2); 
          box-shadow: 0 0 20px rgba(0, 242, 255, 0.2);
        }

        /* Toggle Group Override */
        .toggle-group {
          display: inline-flex;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          overflow: hidden;
          padding: 2px;
        }

        .toggle-btn {
          border: none;
          background: transparent;
          border-radius: 4px;
          color: var(--text-muted);
          padding: 0.5rem 1rem;
        }
        
        .toggle-btn.active {
          background: var(--surface);
          color: var(--secondary);
          border: 1px solid var(--border);
          box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }

        .search-bar { 
          display: flex; 
          align-items: center; 
          background: rgba(15, 23, 42, 0.6); 
          border: 1px solid var(--border); 
          border-radius: var(--radius-md); 
          padding: 0.5rem 1rem; 
          width: 400px; 
          gap: 0.75rem; 
          transition: border-color 0.2s;
        }
        
        .search-bar:focus-within {
          border-color: var(--secondary);
        }

        .search-bar input { 
          background: none; 
          border: none; 
          color: var(--text-main); 
          flex: 1; 
          outline: none; 
          font-size: 0.9rem;
        }

        .search-icon { color: var(--text-muted); }
        .filter-btn { background: none; border: none; color: var(--text-muted); cursor: pointer; transition: color 0.2s; }
        .filter-btn:hover { color: var(--secondary); }

        .candidates-list { display: flex; flex-direction: column; gap: 1.5rem; }

        /* Candidate Card - Antigravity Style */
        .candidate-card { 
          background: linear-gradient(135deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.6) 100%);
          backdrop-filter: blur(10px);
          border: 1px solid var(--border);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
          cursor: pointer; 
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
          border-radius: var(--radius-lg);
          overflow: hidden;
        }
        
        .candidate-card:hover { 
          border-color: var(--secondary); 
          transform: translateY(-4px) scale(1.005); 
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4), 0 0 15px rgba(0, 242, 255, 0.05);
        }

        .candidate-card :global(.card-content) { 
          padding: 1.5rem; 
        }

        .candidate-row { display: flex; align-items: center; gap: 2rem; }

        .candidate-avatar { 
          width: 56px; 
          height: 56px; 
          border-radius: 50%; 
          background: rgba(15, 23, 42, 0.8); 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          font-weight: 700; 
          font-size: 1.2rem; 
          color: var(--secondary); 
          border: 1px solid var(--border); 
          position: relative; 
          flex-shrink: 0; 
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.5);
        }

        .ready-indicator { 
          position: absolute; 
          bottom: 0; 
          right: 0; 
          background: rgba(15, 23, 42, 0.9); 
          border-radius: 50%; 
          display: flex; 
          padding: 2px;
          border: 1px solid var(--border);
          box-shadow: 0 0 10px var(--secondary);
        }

        .candidate-info { flex: 3; display: flex; flex-direction: column; gap: 0.75rem; }
        
        .candidate-name { 
          font-weight: 700; 
          color: white; 
          font-size: 1.25rem; 
          letter-spacing: -0.02em;
        }

        .candidate-details-grid { 
          display: grid; 
          grid-template-columns: repeat(2, 1fr); 
          gap: 0.5rem 2rem; 
          font-size: 0.9rem; 
        }

        .detail-item { display: flex; gap: 0.75rem; align-items: center; }
        .label { color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; min-width: 60px; }
        .value { color: var(--text-main); font-weight: 500; }
        .value.highlight { color: var(--secondary); font-weight: 700; text-shadow: 0 0 10px rgba(0, 242, 255, 0.3); }

        .candidate-meta { 
          flex: 1; 
          display: flex; 
          flex-direction: column; 
          gap: 0.75rem; 
          justify-content: center; 
          border-left: 1px solid var(--border);
          padding-left: 2rem;
        }

        .meta-item { display: flex; align-items: center; gap: 0.75rem; color: var(--text-muted); font-size: 0.9rem; }

        /* Breadcrumbs - Path Tags */
        .breadcrumb-nav {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 2rem;
        }
        
        .breadcrumb-tag {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid var(--border);
          color: var(--text-muted);
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .breadcrumb-tag:hover {
          color: white;
          border-color: var(--text-muted);
        }
        
        .breadcrumb-tag.active {
          background: rgba(0, 242, 255, 0.1);
          color: var(--secondary);
          border-color: var(--secondary);
        }
        
        .breadcrumb-tag.root {
          padding-left: 0.5rem;
        }

        .skeleton-card { background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 1.5rem; display: flex; align-items: center; gap: 2rem; animation: pulse 1.5s infinite ease-in-out; }
        .skeleton-avatar { width: 56px; height: 56px; border-radius: 50%; background: rgba(255, 255, 255, 0.05); }
        .skeleton-info { flex: 2; display: flex; flex-direction: column; gap: 0.75rem; }
        .skeleton-line { height: 12px; background: rgba(255, 255, 255, 0.05); border-radius: 4px; }
        .w-40 { width: 160px; }
        .w-24 { width: 96px; }
        .skeleton-meta { flex: 2; height: 20px; background: rgba(255, 255, 255, 0.05); border-radius: 4px; }
        @keyframes pulse { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }
        .checkin-view-wrapper { max-width: 800px; margin: 0 auto; width: 100%; }
        
        .filter-badge {
            background: var(--secondary);
            color: #0f172a;
            padding: 0.25rem 0.75rem;
            border-radius: 99px;
            font-size: 0.8rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: 600;
            margin-left: 1rem;
        }
        
        .filter-badge button {
            background: none;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
        }
        
        .view-controls {
            display: flex;
            align-items: center;
            margin-bottom: 1rem;
        }
      `}</style>
      </div>
    </>
  );
}
