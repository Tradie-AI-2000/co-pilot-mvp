"use client";

import { useState, useMemo, useEffect } from 'react';
import Card from "@/components/Card";
import { candidates as initialCandidates, projects } from '@/services/mockData';
import { Search, Filter, Plus, Download, Upload, MapPin, Phone, Mail, Calendar, Clock, DollarSign, Briefcase, User, Edit, Save, X, List, Map, CheckCircle, Star, Zap } from 'lucide-react';
import CandidateDashboard from "@/components/CandidateDashboard";
import CandidateMap from "@/components/CandidateMap";

export default function CandidatesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [candidateList, setCandidateList] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'



  /* ... existing styles ... */

  useEffect(() => {
    // Simulate API fetch with delay for Skeleton Loading
    setTimeout(() => {
      setCandidateList(initialCandidates);
      setIsLoading(false);
    }, 1500);
  }, []);

  const handleCandidateClick = (candidate) => {
    setSelectedCandidate(candidate);
  };

  const closeCandidateModal = () => {
    setSelectedCandidate(null);
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
    const headers = Object.keys(candidateList[0]).join(",");
    const csvContent = [
      headers,
      ...candidateList.map(c => Object.values(c).map(v => `"${v}"`).join(","))
    ].join("\n");

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
        alert(`Mock Import: Successfully imported ${file.name}`);
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
        {!isLoading && <CandidateDashboard candidates={candidateList} />}

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
          </div>
        </div>

        {viewMode === 'map' ? (
          <CandidateMap
            candidates={candidateList}
            projects={projects}
            onCandidateClick={handleCandidateClick}
          />
        ) : (
          isLoading ? (
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
            candidateList.map((candidate) => {
              // Mock Match Score Calculation
              const matchScore = Math.floor(Math.random() * (98 - 75) + 75);
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
                              candidate.finishDate ? `Finishes ${candidate.finishDate}` : "On Job"}
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
                        <Star size={16} className="text-yellow-500" />
                        <span>{candidate.internalRating}</span>
                      </div>
                    </div>

                    {/* Match Score */}
                    <div className="match-score">
                      <div className="score-label">
                        <Zap size={12} className="text-rose-500" /> Match
                      </div>
                      <div className="score-value text-gradient">{matchScore}%</div>
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
          )
        )}
      </div>

      {/* Detailed Candidate Modal */}
      {selectedCandidate && (
        <CandidateModal
          candidate={selectedCandidate}
          onClose={closeCandidateModal}
          onSave={(updatedCandidate) => {
            setCandidateList(prev => {
              const exists = prev.find(c => c.id === updatedCandidate.id);
              if (exists) {
                return prev.map(c => c.id === updatedCandidate.id ? updatedCandidate : c);
              } else {
                return [updatedCandidate, ...prev];
              }
            });
            setSelectedCandidate(updatedCandidate);
          }}
        />
      )}

      <style jsx>{`
        .view-controls {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 1rem;
        }

        .toggle-group {
            display: flex;
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: var(--radius-md);
            padding: 2px;
        }

        .toggle-btn {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            border: none;
            background: transparent;
            color: var(--text-muted);
            cursor: pointer;
            border-radius: var(--radius-sm);
            font-size: 0.875rem;
            font-weight: 500;
        }

        .toggle-btn.active {
            background: var(--secondary);
            color: #0f172a;
        }

        .candidate-card.status-red { border-left: 4px solid #ef4444; }
        .candidate-card.status-orange { border-left: 4px solid #f97316; }
        .candidate-card.status-blue { border-left: 4px solid #3b82f6; }
        .candidate-card.status-green { border-left: 4px solid #10b981; }

        .status-text.status-red { color: #ef4444; }
        .status-text.status-orange { color: #f97316; }
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

        .detail-item .label {
            color: var(--text-muted);
            min-width: 70px;
        }

        .detail-item .value {
            color: var(--text-main);
            font-weight: 500;
        }
        
        .detail-item .value.highlight {
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
            background: rgba(255,255,255,0.02);
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
            background: rgba(255,255,255,0.05);
        }

        .skeleton-info {
            flex: 2;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .skeleton-line {
            height: 12px;
            background: rgba(255,255,255,0.05);
            border-radius: 4px;
        }

        .w-40 { width: 160px; }
        .w-24 { width: 96px; }

        .skeleton-meta {
            flex: 2;
            height: 20px;
            background: rgba(255,255,255,0.05);
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

function CandidateModal({ candidate, onClose, onSave }) {
  const isNew = !candidate.firstName;
  const [isEditing, setIsEditing] = useState(isNew);
  const [formData, setFormData] = useState(candidate);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (isNew) {
      onClose();
    } else {
      setFormData(candidate);
      setIsEditing(false);
    }
  };

  const handleExport = () => {
    const headers = Object.keys(candidate).join(",");
    const values = Object.values(candidate).map(v => `"${v}"`).join(",");
    const csvContent = `${headers}\n${values}`;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${candidate.firstName}_${candidate.lastName}_profile.csv`;
    link.click();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>

        <div className="modal-header">
          <div className="modal-avatar">
            {formData.firstName[0]}{formData.lastName[0]}
          </div>
          <div className="modal-title">
            {isEditing ? (
              <div className="flex gap-2">
                <input
                  className="edit-input title-input"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                />
                <input
                  className="edit-input title-input"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                />
              </div>
            ) : (
              <h2>{formData.firstName} {formData.lastName}</h2>
            )}
            <p className="text-muted">Candidate ID: {formData.id}</p>
          </div>

          <div className="modal-actions">
            {!isEditing ? (
              <>
                <button className="icon-btn" onClick={handleExport} title="Export Candidate">
                  <Download size={18} />
                </button>
                <button className="icon-btn primary" onClick={() => setIsEditing(true)}>
                  <Edit size={18} /> Edit
                </button>
              </>
            ) : (
              <>
                <button className="icon-btn" onClick={handleCancel}>
                  <X size={18} /> Cancel
                </button>
                <button className="icon-btn primary" onClick={handleSave}>
                  <Save size={18} /> Save
                </button>
              </>
            )}
          </div>
        </div>

        <div className="modal-body">
          <div className="info-section">
            <h3>Status & Availability</h3>
            <div className="info-grid">
              <div className="info-field">
                <span className="field-label">Current Status</span>
                {isEditing ? (
                  <select
                    className="edit-input"
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                  >
                    <option value="Available">Available (On Bench)</option>
                    <option value="On Job">On Job</option>
                    <option value="Placed">Placed (Permanent)</option>
                    <option value="Unavailable">Unavailable</option>
                  </select>
                ) : (
                  <span className={`status-badge ${formData.status?.toLowerCase().replace(' ', '-')}`}>
                    {formData.status}
                  </span>
                )}
              </div>

              {(formData.status === "On Job" || formData.status === "Placed") && (
                <>
                  <div className="info-field">
                    <span className="field-label">Finish Date</span>
                    {isEditing ? (
                      <input
                        type="date"
                        className="edit-input"
                        value={formData.finishDate || ''}
                        onChange={(e) => handleChange('finishDate', e.target.value)}
                      />
                    ) : (
                      <span className="field-value">{formData.finishDate || 'N/A'}</span>
                    )}
                  </div>

                  {formData.status === "On Job" && (
                    <div className="info-field">
                      <span className="field-label">Current Project</span>
                      {isEditing ? (
                        <select
                          className="edit-input"
                          value={formData.projectId || ''}
                          onChange={(e) => {
                            const projectId = e.target.value;
                            const project = projects.find(p => p.id === projectId);
                            if (project) {
                              setFormData(prev => ({
                                ...prev,
                                projectId: projectId,
                                currentEmployer: project.client,
                                lat: project.coordinates.lat,
                                lng: project.coordinates.lng,
                                suburb: project.region
                              }));
                            } else {
                              handleChange('projectId', projectId);
                            }
                          }}
                        >
                          <option value="">Select Project...</option>
                          {projects.map(p => (
                            <option key={p.id} value={p.id}>{p.name} ({p.client})</option>
                          ))}
                        </select>
                      ) : (
                        <span className="field-value">
                          {projects.find(p => p.id === formData.projectId)?.name || formData.currentEmployer || 'N/A'}
                        </span>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="info-section">
            <h3>Personal Details</h3>
            <div className="info-grid">
              <InfoField label="First Name" field="firstName" value={formData.firstName} isEditing={isEditing} onChange={handleChange} />
              <InfoField label="Last Name" field="lastName" value={formData.lastName} isEditing={isEditing} onChange={handleChange} />
              <InfoField label="Known As" field="knownAs" value={formData.knownAs} isEditing={isEditing} onChange={handleChange} />
              <InfoField label="Date of Birth" field="dob" value={formData.dob} isEditing={isEditing} onChange={handleChange} />
              <InfoField label="Phone" field="phone" value={formData.phone} isEditing={isEditing} onChange={handleChange} />
              <InfoField label="Mobile" field="mobile" value={formData.mobile} isEditing={isEditing} onChange={handleChange} />
              <InfoField label="Email" field="email" value={formData.email} isEditing={isEditing} onChange={handleChange} />
              <InfoField label="Other Email" field="otherEmail" value={formData.otherEmail} isEditing={isEditing} onChange={handleChange} />
              <InfoField label="Address 1" field="address1" value={formData.address1} isEditing={isEditing} onChange={handleChange} />
              <InfoField label="Address 2" field="address2" value={formData.address2} isEditing={isEditing} onChange={handleChange} />
              <InfoField label="Suburb" field="suburb" value={formData.suburb} isEditing={isEditing} onChange={handleChange} />
              <InfoField label="State" field="state" value={formData.state} isEditing={isEditing} onChange={handleChange} />
              <InfoField label="Postcode" field="postcode" value={formData.postcode} isEditing={isEditing} onChange={handleChange} />
              <InfoField label="Country" field="country" value={formData.country} isEditing={isEditing} onChange={handleChange} />
              <InfoField label="Residency" field="residency" value={formData.residency} isEditing={isEditing} onChange={handleChange} />
              <InfoField label="Residency Expiry" field="residencyExpiryDate" value={formData.residencyExpiryDate} isEditing={isEditing} onChange={handleChange} />
              <InfoField label="Indigenous" field="indigenous" value={formData.indigenous} isEditing={isEditing} onChange={handleChange} />
            </div>
          </div>

          <div className="info-section">
            <h3>Employment & Financials</h3>
            <div className="info-grid">
              <InfoField label="Current Employer" field="currentEmployer" value={formData.currentEmployer} isEditing={isEditing} onChange={handleChange} />
              <InfoField label="Current Position" field="currentPosition" value={formData.currentPosition} isEditing={isEditing} onChange={handleChange} />
              <InfoField label="Current Work Type" field="currentWorkType" value={formData.currentWorkType} isEditing={isEditing} onChange={handleChange} />
              <InfoField label="Current Salary" field="currentSalary" value={formData.currentSalary} isEditing={isEditing} onChange={handleChange} />
              <InfoField label="Charge Out Rate" field="chargeOutRate" value={formData.chargeOutRate} highlight isEditing={isEditing} onChange={handleChange} />
              <InfoField label="Notice Period" field="noticePeriod" value={formData.noticePeriod} isEditing={isEditing} onChange={handleChange} />
            </div>
          </div>

          <div className="info-section">
            <h3>Ideal Role Preferences</h3>
            <div className="info-grid">
              <InfoField label="Ideal Position" field="idealPosition" value={formData.idealPosition} isEditing={isEditing} onChange={handleChange} />
              <InfoField label="Ideal Work Type" field="idealWorkType" value={formData.idealWorkType} isEditing={isEditing} onChange={handleChange} />
              <InfoField label="Ideal Salary" field="idealSalary" value={formData.idealSalary} isEditing={isEditing} onChange={handleChange} />
              <InfoField label="Ideal Location" field="idealLocation" value={formData.idealLocation} isEditing={isEditing} onChange={handleChange} />
            </div>
          </div>

          <div className="info-section">
            <h3>Emergency Contact</h3>
            <div className="info-grid">
              <InfoField label="Contact Name" field="emergencyContact" value={formData.emergencyContact} isEditing={isEditing} onChange={handleChange} />
              <InfoField label="Relationship" field="emergencyContactRelationship" value={formData.emergencyContactRelationship} isEditing={isEditing} onChange={handleChange} />
              <InfoField label="Phone" field="emergencyPhone" value={formData.emergencyPhone} isEditing={isEditing} onChange={handleChange} />
            </div>
          </div>

          <div className="info-section">
            <h3>Socials & Source</h3>
            <div className="info-grid">
              <InfoField label="LinkedIn" field="linkedin" value={formData.linkedin} isLink isEditing={isEditing} onChange={handleChange} />
              <InfoField label="Twitter" field="twitter" value={formData.twitter} isLink isEditing={isEditing} onChange={handleChange} />
              <InfoField label="Facebook" field="facebook" value={formData.facebook} isLink isEditing={isEditing} onChange={handleChange} />
              <InfoField label="Source" field="source" value={formData.source} isEditing={isEditing} onChange={handleChange} />
            </div>
          </div>

          <div className="info-section">
            <h3>Internal Info</h3>
            <div className="info-grid">
              <InfoField label="Recruiter" field="recruiter" value={formData.recruiter} isEditing={isEditing} onChange={handleChange} />
              <InfoField label="Branch" field="branch" value={formData.branch} isEditing={isEditing} onChange={handleChange} />
              <InfoField label="Division" field="division" value={formData.division} isEditing={isEditing} onChange={handleChange} />
              <InfoField label="Internal Rating" field="internalRating" value={formData.internalRating} isEditing={isEditing} onChange={handleChange} />
              <InfoField label="Date Created" field="dateCreated" value={formData.dateCreated} isEditing={isEditing} onChange={handleChange} />
              <InfoField label="Date Updated" field="dateUpdated" value={formData.dateUpdated} isEditing={isEditing} onChange={handleChange} />
              <InfoField label="Last Note" field="lastNote" value={formData.lastNote} fullWidth isEditing={isEditing} onChange={handleChange} />
            </div>
          </div>
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
                justify-content: center;
                align-items: center;
                z-index: 1000;
                backdrop-filter: blur(4px);
            }

            .modal-content {
                background: #1e293b;
                width: 90%;
                max-width: 900px;
                max-height: 90vh;
                border-radius: var(--radius-lg);
                border: 1px solid var(--border);
                display: flex;
                flex-direction: column;
                position: relative;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                overflow: hidden;
            }

            .close-btn {
                position: absolute;
                top: 1rem;
                right: 1.5rem;
                background: none;
                border: none;
                color: var(--text-muted);
                font-size: 2rem;
                cursor: pointer;
                z-index: 10;
                line-height: 1;
            }
            
            .close-btn:hover {
                color: var(--text-main);
            }

            .modal-header {
                padding: 2rem;
                background: rgba(255, 255, 255, 0.03);
                border-bottom: 1px solid var(--border);
                display: flex;
                align-items: center;
                gap: 1.5rem;
            }

            .modal-avatar {
                width: 80px;
                height: 80px;
                border-radius: 50%;
                background: var(--primary-light);
                color: var(--secondary);
                font-size: 2rem;
                font-weight: 700;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 2px solid var(--border);
            }

            .modal-title {
                flex: 1;
            }

            .modal-title h2 {
                font-size: 1.75rem;
                font-weight: 700;
                color: var(--text-main);
                margin: 0;
            }

            .modal-actions {
                display: flex;
                gap: 0.75rem;
                margin-right: 2rem;
            }

            .icon-btn {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                background: transparent;
                border: 1px solid var(--border);
                color: var(--text-main);
                padding: 0.5rem 1rem;
                border-radius: var(--radius-md);
                cursor: pointer;
                transition: var(--transition-fast);
            }

            .icon-btn:hover {
                border-color: var(--secondary);
                color: var(--secondary);
            }

            .icon-btn.primary {
                background: var(--secondary);
                color: #0f172a;
                border-color: var(--secondary);
                font-weight: 600;
            }

            .icon-btn.primary:hover {
                background: var(--secondary-light);
            }

            .modal-body {
                padding: 2rem;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                gap: 2rem;
            }

            .info-section h3 {
                font-size: 1.1rem;
                color: var(--secondary);
                margin-bottom: 1rem;
                border-bottom: 1px solid var(--border);
                padding-bottom: 0.5rem;
            }

            .info-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                gap: 1.5rem;
            }

            .edit-input {
                background: rgba(0, 0, 0, 0.2);
                border: 1px solid var(--border);
                color: var(--text-main);
                padding: 0.25rem 0.5rem;
                border-radius: 4px;
                width: 100%;
                font-size: 0.95rem;
            }

            .edit-input:focus {
                outline: none;
                border-color: var(--secondary);
            }

            .title-input {
                font-size: 1.5rem;
                font-weight: 700;
                padding: 0.25rem;
            }

            .status-badge {
                padding: 0.25rem 0.75rem;
                border-radius: 999px;
                font-size: 0.75rem;
                font-weight: 500;
                display: inline-block;
                text-align: center;
                width: fit-content;
            }

            .status-badge.available { background: rgba(239, 68, 68, 0.2); color: #ef4444; }
            .status-badge.on-job { background: rgba(59, 130, 246, 0.2); color: #3b82f6; }
            .status-badge.placed { background: rgba(16, 185, 129, 0.2); color: #10b981; }
            .status-badge.unavailable { background: rgba(100, 116, 139, 0.2); color: #94a3b8; }
          `}</style>
    </div>
  );
}

function InfoField({ label, value, field, highlight, isLink, fullWidth, isEditing, onChange }) {
  return (
    <div className="info-field" style={fullWidth ? { gridColumn: '1 / -1' } : {}}>
      <span className="field-label">{label}</span>
      {isEditing ? (
        <input
          className="edit-input"
          value={value || ''}
          onChange={(e) => onChange(field, e.target.value)}
        />
      ) : (
        <>
          {isLink && value ? (
            <a href={`https://${value}`} target="_blank" rel="noopener noreferrer" className="field-value link">
              {value}
            </a>
          ) : (
            <span className={`field-value ${highlight ? 'highlight' : ''}`}>{value || '-'}</span>
          )}
        </>
      )}
      <style jsx>{`
                .info-field {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }
                .field-label {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .field-value {
                    color: var(--text-main);
                    font-weight: 500;
                    font-size: 0.95rem;
                    word-break: break-word;
                }
                .field-value.highlight {
                    color: var(--secondary);
                    font-weight: 600;
                }
                .field-value.link {
                    color: var(--primary);
                    text-decoration: underline;
                }
                .field-value.link:hover {
                    color: var(--secondary);
                }
                .edit-input {
                    background: rgba(0, 0, 0, 0.2);
                    border: 1px solid var(--border);
                    color: var(--text-main);
                    padding: 0.25rem 0.5rem;
                    border-radius: 4px;
                    width: 100%;
                    font-size: 0.95rem;
                }
                .edit-input:focus {
                    outline: none;
                    border-color: var(--secondary);
                }
            `}</style>
    </div>
  );
}
