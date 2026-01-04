"use client";

import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Star, 
  MapPin, 
  Briefcase, 
  Shield, 
  Truck, 
  Wrench, 
  Clock, 
  CheckCircle, 
  X, 
  HardHat,
  Search,
  Filter,
  ArrowLeft,
  FileText,
  Globe,
  Calendar,
  Download
} from 'lucide-react';
import { useData } from "../../context/data-context.js";
import { ClientCandidateDTO } from "../../services/dto-service.js";
import BookingFormModal from "./booking-form-modal.js";

// --- Sub-Components ---

const Badge = ({ label, type }) => {
  return (
    <span className={`badge ${type || 'skill'}`}>
      {label}
      <style jsx>{`
        .badge {
          font-size: 0.65rem;
          text-transform: uppercase;
          font-weight: 700;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          border: 1px solid;
          letter-spacing: 0.05em;
        }
        .badge.safety { border-color: rgba(16, 185, 129, 0.3); color: #34d399; background: rgba(16, 185, 129, 0.1); }
        .badge.license { border-color: rgba(59, 130, 246, 0.3); color: #60a5fa; background: rgba(59, 130, 246, 0.1); }
        .badge.skill { border-color: rgba(249, 115, 22, 0.3); color: #fb923c; background: rgba(249, 115, 22, 0.1); }
      `}</style>
    </span>
  );
};

// Level 1: Role Card
const RoleCard = ({ role, count, onClick }) => (
  <div onClick={onClick} className="role-card glass-panel">
    <div className="icon-wrapper">
      <HardHat size={32} className="role-icon" />
    </div>
    <div>
      <h3 className="role-title">{role}</h3>
      <span className="role-count">{count} Available</span>
    </div>
    <style jsx>{`
      .role-card {
        padding: 2rem;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        text-align: center;
        transition: transform 0.2s, border-color 0.2s;
        height: 200px;
      }
      .role-card:hover {
        transform: translateY(-4px);
        border-color: var(--secondary);
      }
      .icon-wrapper {
        width: 64px;
        height: 64px;
        background: rgba(0, 242, 255, 0.1);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .role-title { font-size: 1.2rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.25rem; }
      .role-count { font-size: 0.9rem; color: var(--text-muted); }
      :global(.role-icon) { color: var(--secondary); }
    `}</style>
  </div>
);

// Level 2: Candidate List Card
const CandidateListCard = ({ candidate, onView }) => (
  <div onClick={onView} className="candidate-card glass-panel">
    <div className="card-header">
      <div>
        <h3 className="card-title">{candidate.displayName}</h3>
        <div className="rating">
          <Star size={12} className="star-icon" />
          <span className="rating-val">{candidate.rating}.0</span>
        </div>
      </div>
      <div className="rate-tag">${candidate.rate.toFixed(2)}</div>
    </div>

    <div className="card-body">
      <div className="info-row">
        <MapPin size={14} /> {candidate.location}
      </div>
      <div className="info-row availability">
        <CheckCircle size={14} /> {candidate.availability}
      </div>
    </div>

    <div className="card-badges">
      {candidate.badges.slice(0, 2).map((b, i) => <Badge key={i} label={b} type="safety" />)}
    </div>
    
    <style jsx>{`
      .candidate-card {
        padding: 1.5rem;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        height: 100%;
        transition: transform 0.2s, border-color 0.2s;
      }
      .candidate-card:hover {
        transform: translateY(-4px);
        border-color: var(--secondary);
      }
      .card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; }
      .card-title { font-size: 1.1rem; font-weight: 700; color: var(--text-main); }
      .rating { display: flex; align-items: center; gap: 4px; margin-top: 4px; font-size: 0.85rem; color: var(--text-muted); }
      :global(.star-icon) { fill: #fbbf24; color: #fbbf24; }
      
      .rate-tag {
        background: var(--primary);
        border: 1px solid var(--border);
        padding: 0.25rem 0.5rem;
        border-radius: 6px;
        font-family: monospace;
        font-weight: 700;
        color: var(--secondary);
      }

      .card-body { margin-bottom: 1rem; display: flex; flex-direction: column; gap: 0.5rem; }
      .info-row { display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; color: var(--text-muted); }
      .info-row.availability { color: #34d399; font-weight: 500; }

      .card-badges { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: auto; }
    `}</style>
  </div>
);

// Level 3: Detailed Profile View
const CandidateDetailView = ({ candidate, onBack, onAdd }) => {
  const richData = {
    travel: "Willing to travel (25km radius)",
    visa: "NZ Citizen / Resident",
    resumeUrl: "#",
    finishDate: candidate.availability.includes("Available") ? null : "2026-02-15" 
  };

  return (
    <div className="detail-view">
      <button onClick={onBack} className="back-btn">
        <ArrowLeft size={18} /> Back to {candidate.role}s
      </button>

      <div className="profile-container glass-panel">
        {/* Header */}
        <div className="profile-header">
          <div className="header-left">
            <div className="avatar-large">
              {candidate.displayName.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h1 className="profile-name">{candidate.displayName}</h1>
              <div className="profile-meta">
                <span><Briefcase size={14} /> {candidate.role}</span>
                <span><MapPin size={14} /> {candidate.location}</span>
                <span className="avail"><CheckCircle size={14} /> {candidate.availability}</span>
              </div>
            </div>
          </div>
          <div className="header-right">
            <div className="big-rate">${candidate.rate.toFixed(2)}</div>
            <span className="rate-label">Hourly Rate</span>
          </div>
        </div>

        <div className="profile-content">
          {/* Left Main */}
          <div className="content-main">
            <section>
              <h3 className="section-head"><Briefcase size={16} /> Skills & Work History</h3>
              <div className="content-box">
                <p>Experienced {candidate.role} with a strong track record in commercial and residential projects. Proven ability to work autonomously and lead small teams.</p>
                <div className="tags-row">
                  {['Commercial', 'Framing', 'Fit-out', 'Concrete'].map(skill => (
                    <span key={skill} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
            </section>

            <section>
              <h3 className="section-head"><Shield size={16} /> Compliance</h3>
              <div className="badge-grid">
                {candidate.badges.map((badge, i) => (
                  <div key={i} className="badge-item">
                    <CheckCircle size={18} className="text-emerald" /> {badge}
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Sidebar */}
          <div className="content-side">
            <div className="side-box">
              <h3 className="section-head small">Availability</h3>
              <div className="side-row">
                <span>Status</span>
                <span className="val">{candidate.availability}</span>
              </div>
              {richData.finishDate && (
                <div className="side-row">
                  <span>Finishing</span>
                  <span className="val orange">{richData.finishDate}</span>
                </div>
              )}
              <div className="divider"></div>
              <div className="side-row icon">
                <Truck size={16} /> {richData.travel}
              </div>
              <div className="side-row icon">
                <Globe size={16} /> {richData.visa}
              </div>
            </div>

            <div className="side-box">
              <h3 className="section-head small">Documents</h3>
              <button className="doc-btn">
                <span className="flex items-center gap-2">
                  <FileText size={16} className="text-blue" />
                  CV / Resume
                </span>
                <Download size={14} />
              </button>
            </div>

            <button onClick={() => onAdd(candidate)} className="add-crew-btn">
              <ShoppingCart size={20} /> Add to Crew
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .detail-view { animation: slideIn 0.3s ease; }
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }

        .back-btn {
          display: flex; align-items: center; gap: 0.5rem;
          background: none; border: none; color: var(--text-muted);
          cursor: pointer; margin-bottom: 1.5rem; font-size: 0.9rem;
        }
        .back-btn:hover { color: var(--text-main); }

        .profile-container { overflow: hidden; }

        .profile-header {
          padding: 2rem;
          background: rgba(15, 23, 42, 0.4);
          border-bottom: 1px solid var(--border);
          display: flex; justify-content: space-between; align-items: flex-start;
        }

        .header-left { display: flex; gap: 1.5rem; }
        .avatar-large {
          width: 80px; height: 80px; background: var(--secondary); color: var(--primary);
          border-radius: 1rem; display: flex; align-items: center; justify-content: center;
          font-size: 2rem; font-weight: 800;
        }
        .profile-name { font-size: 2rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.5rem; }
        .profile-meta { display: flex; gap: 1rem; color: var(--text-muted); font-size: 0.9rem; }
        .profile-meta span { display: flex; align-items: center; gap: 0.4rem; }
        .profile-meta .avail { color: #34d399; font-weight: 500; }

        .header-right { text-align: right; }
        .big-rate { font-size: 2.5rem; font-family: monospace; font-weight: 700; color: var(--secondary); line-height: 1; }
        .rate-label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); }

        .profile-content { display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; padding: 2rem; }
        
        .section-head {
          font-size: 0.9rem; font-weight: 700; color: var(--text-muted);
          text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1rem;
          display: flex; align-items: center; gap: 0.5rem;
        }
        .section-head.small { font-size: 0.8rem; }

        .content-box { background: rgba(15, 23, 42, 0.3); padding: 1.5rem; border-radius: var(--radius-md); border: 1px solid var(--border); }
        .content-box p { color: var(--text-main); line-height: 1.6; margin-bottom: 1rem; }
        
        .tags-row { display: flex; gap: 0.5rem; flex-wrap: wrap; }
        .skill-tag { background: var(--primary-light); padding: 0.25rem 0.75rem; border-radius: 99px; font-size: 0.8rem; border: 1px solid var(--border); }

        .badge-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .badge-item { display: flex; align-items: center; gap: 0.75rem; background: rgba(15, 23, 42, 0.3); padding: 0.75rem; border-radius: var(--radius-md); border: 1px solid var(--border); }
        :global(.text-emerald) { color: #34d399; }
        :global(.text-blue) { color: #3b82f6; }

        .side-box { background: rgba(15, 23, 42, 0.3); padding: 1.5rem; border-radius: var(--radius-md); border: 1px solid var(--border); margin-bottom: 1rem; }
        .side-row { display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 0.75rem; color: var(--text-muted); }
        .side-row.icon { justify-content: flex-start; gap: 0.75rem; align-items: center; }
        .val { color: var(--text-main); font-weight: 500; }
        .val.orange { color: var(--accent); }
        .divider { height: 1px; background: var(--border); margin: 1rem 0; }

        .doc-btn { width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 0.75rem; background: var(--primary); border: 1px solid var(--border); color: white; border-radius: 6px; cursor: pointer; }
        .doc-btn:hover { background: var(--primary-light); }

        .add-crew-btn {
          width: 100%; background: var(--secondary); color: var(--primary);
          border: none; padding: 1rem; border-radius: var(--radius-md);
          font-weight: 800; font-size: 1rem; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          transition: transform 0.2s;
        }
        .add-crew-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 20px rgba(0, 242, 255, 0.3); }
      `}</style>
    </div>
  );
};

// --- Main Layout ---

export default function PortalDashboard() {
  const { candidates, projects, submitPortalBooking } = useData();
  const [viewState, setViewState] = useState('roles'); // roles, list, detail
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [cart, setCart] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);

  // Data Logic
  const availableTalent = candidates.map(c => ClientCandidateDTO.toPublic(c));
  
  // Mock: Only show Fletcher Projects (Client ID 1)
  const clientProjects = projects.filter(p => p.assignedCompanyIds?.includes(1) && p.status === 'Active');

  // Role Aggregation
  const roleCounts = availableTalent.reduce((acc, c) => {
    acc[c.role] = (acc[c.role] || 0) + 1;
    return acc;
  }, {});

  const handleRoleClick = (role) => {
    setSelectedRole(role);
    setViewState('list');
  };

  const handleCandidateClick = (candidate) => {
    setSelectedCandidate(candidate);
    setViewState('detail');
  };

  const handleBackToRoles = () => {
    setViewState('roles');
    setSelectedRole(null);
  };

  const handleBackToList = () => {
    setViewState('list');
    setSelectedCandidate(null);
  };

  const handleAddToCart = (candidate) => {
    if (cart.find(c => c.id === candidate.id)) {
      alert("Already in cart");
      return;
    }
    setCart([...cart, candidate]);
    alert("Added to crew (Soft Hold active for 15m)");
  };

  const handleCheckout = () => {
    if (!selectedProjectId) { alert("Select a site first"); return; }
    setIsBookingFormOpen(true);
  };

  const handleFormConfirm = (jobSpecs) => {
    submitPortalBooking(cart, selectedProjectId, jobSpecs);
    setCart([]);
    setIsBookingFormOpen(false);
    alert("Booking Request Sent!");
  };

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  return (
    <div className="portal-dashboard">
      
      {/* Header Bar */}
      <header className="portal-header glass-panel">
        <div className="header-left">
          <div className="logo-box">
            <HardHat className="text-white" size={24} />
          </div>
          <div>
            <h1 className="header-title">Talent Marketplace</h1>
            <div className="live-indicator">
              <span className="dot"></span>
              Live Inventory
            </div>
          </div>
        </div>

        <div className="header-right">
          {/* Project Selector */}
          <div className="project-select">
            <MapPin size={18} className="text-secondary" />
            <select 
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
            >
                <option value="">Select Deployment Site...</option>
                {clientProjects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                ))}
            </select>
          </div>

          {/* Cart */}
          <button 
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="cart-btn"
          >
            <ShoppingCart size={20} className="cart-icon" />
            <span>Crew</span>
            {cart.length > 0 && (
              <span className="cart-count">{cart.length}</span>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="portal-main">
        
        {/* VIEW 1: ROLES */}
        {viewState === 'roles' && (
          <div className="fade-in">
            <h2 className="page-title">Browse by Role</h2>
            <div className="grid-roles">
              {Object.entries(roleCounts).map(([role, count]) => (
                <RoleCard key={role} role={role} count={count} onClick={() => handleRoleClick(role)} />
              ))}
            </div>
          </div>
        )}

        {/* VIEW 2: LIST */}
        {viewState === 'list' && (
          <div className="slide-in">
            <button onClick={handleBackToRoles} className="back-link">
              <ArrowLeft size={18} /> Back to Roles
            </button>
            <h2 className="page-title">{selectedRole}s</h2>
            <div className="grid-list">
              {availableTalent
                .filter(c => c.role === selectedRole)
                .map(candidate => (
                  <CandidateListCard 
                    key={candidate.id} 
                    candidate={candidate} 
                    onView={() => handleCandidateClick(candidate)}
                  />
                ))}
            </div>
          </div>
        )}

        {/* VIEW 3: DETAIL */}
        {viewState === 'detail' && selectedCandidate && (
          <CandidateDetailView 
            candidate={selectedCandidate} 
            onBack={handleBackToList}
            onAdd={handleAddToCart}
          />
        )}

      </main>

      {isBookingFormOpen && (
          <BookingFormModal 
            isOpen={isBookingFormOpen}
            onClose={() => setIsBookingFormOpen(false)}
            onConfirm={handleFormConfirm}
            cartItems={cart}
            projectName={selectedProject?.name || "Selected Site"}
          />
      )}

      <style jsx>{`
        .portal-dashboard {
          min-height: 100vh;
          background-color: var(--primary);
          color: var(--text-main);
        }

        .portal-header {
          position: sticky; top: 0; z-index: 30;
          height: 80px; padding: 0 1.5rem;
          display: flex; justify-content: space-between; align-items: center;
          background: rgba(15, 23, 42, 0.9);
          border-bottom: 1px solid var(--border);
        }

        .header-left { display: flex; gap: 1rem; align-items: center; }
        .logo-box { width: 40px; height: 40px; background: var(--secondary); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--primary); }
        .header-title { font-size: 1.2rem; font-weight: 700; margin: 0; color: var(--text-main); }
        .live-indicator { font-size: 0.75rem; color: var(--secondary); font-weight: 600; display: flex; align-items: center; gap: 6px; }
        .dot { width: 8px; height: 8px; background: var(--secondary); border-radius: 50%; box-shadow: 0 0 8px var(--secondary); }

        .header-right { display: flex; gap: 1rem; align-items: center; }
        
        .project-select {
          display: flex; align-items: center; gap: 0.5rem;
          background: rgba(30, 41, 59, 0.5); border: 1px solid var(--border);
          padding: 0.5rem 1rem; border-radius: var(--radius-md);
        }
        .project-select select { background: transparent; border: none; color: var(--text-main); font-weight: 600; outline: none; cursor: pointer; }
        :global(.text-secondary) { color: var(--secondary); }

        .cart-btn {
          display: flex; align-items: center; gap: 0.75rem;
          background: var(--primary-light); color: var(--text-main);
          border: 1px solid var(--border); padding: 0.5rem 1rem;
          border-radius: var(--radius-md); font-weight: 700; cursor: pointer;
          position: relative; transition: border-color 0.2s;
        }
        .cart-btn:hover { border-color: var(--secondary); }
        .cart-count {
          position: absolute; top: -8px; right: -8px;
          background: var(--secondary); color: var(--primary);
          width: 20px; height: 20px; border-radius: 50%;
          font-size: 0.7rem; display: flex; align-items: center; justify-content: center;
          font-weight: 800;
        }

        .portal-main { padding: 2rem; max-width: 1400px; margin: 0 auto; }
        .page-title { font-size: 1.5rem; font-weight: 700; margin-bottom: 1.5rem; color: var(--text-main); }
        .back-link { background: none; border: none; color: var(--text-muted); cursor: pointer; display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; font-size: 0.9rem; }
        .back-link:hover { color: var(--text-main); }

        .grid-roles { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1.5rem; }
        .grid-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }

        .fade-in { animation: fadeIn 0.3s ease; }
        .slide-in { animation: slideIn 0.3s ease; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>
    </div>
  );
}