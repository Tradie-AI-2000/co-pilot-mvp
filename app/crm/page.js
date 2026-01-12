"use client";

import { useState, useEffect } from "react";
import { useData } from "../../context/data-context.js";
import EnhancedClientDetailsModal from "../../components/enhanced-client-details-modal.js";
import ClientCard from "../../components/client-card.js";
import AddClientModal from "../../components/add-client-modal.js";
import ClientActionBoard from "../../components/client-action-board.js";
import PlacementTicketModal from "../../components/placement-ticket-modal.js";
import RegionGrid from "../../components/region-grid.js";
import TradeGrid from "../../components/trade-grid.js";
import ClientTierBoard from "../../components/client-tier-board.js";
import { Search, Filter, Plus, Users, Upload, Download, ChevronRight, Home } from "lucide-react";

export default function CRMPage() {
  const { clients, addClient, updateClient, placements } = useData();
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedPlacement, setSelectedPlacement] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Navigation State
  const [viewState, setViewState] = useState('regions'); // regions | types | clients
  const [filters, setFilters] = useState({ region: null, industry: null });

  const handleClientClick = (client) => {
    setSelectedClient(client);
  };

  const handleUpdateClient = (updatedClient) => {
    updateClient(updatedClient);
    setSelectedClient(updatedClient);
  };

  const handleAddClient = (newClient) => {
    addClient(newClient);
    setIsAddModalOpen(false);
  };

  const handleViewDeal = (placementId) => {
    const placement = placements.find(p => p.id === placementId);
    if (placement) setSelectedPlacement(placement);
  };

  // Navigation Handlers
  const selectRegion = (region) => {
    setFilters(prev => ({ ...prev, region }));
    setViewState('trades');
  };

  const selectTrade = (industry) => {
    setFilters(prev => ({ ...prev, industry }));
    setViewState('clients');
  };

  const resetToRegions = () => {
    setFilters({ region: null, industry: null });
    setViewState('regions');
  };

  const resetToTrades = () => {
    setFilters(prev => ({ ...prev, industry: null }));
    setViewState('trades');
  };

  return (
    <div className="crm-container">
      <header className="page-header">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Users className="text-secondary" /> Client Management
        </h1>
        <div className="header-actions">
          <button className="action-btn primary" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={18} /> Add Client
          </button>
          <button className="action-btn">
            <Upload size={18} /> Import
          </button>
          <button className="action-btn">
            <Download size={18} /> Export
          </button>
          <div className="search-bar">
            <Search size={20} className="search-icon" />
            <input type="text" placeholder="Search clients..." />
            <button className="filter-btn">
              <Filter size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Virtual Assistant / Client Action Board */}
      <ClientActionBoard onViewDeal={handleViewDeal} />

      <div className="section-divider">
        <div className="flex items-center gap-2">
            <button onClick={resetToRegions} className={`breadcrumb-item ${viewState === 'regions' ? 'active' : ''}`}>
                <Home size={16} /> Directory
            </button>
            {filters.region && (
                <>
                    <ChevronRight size={16} className="text-slate-600" />
                    <button onClick={resetToTrades} className={`breadcrumb-item ${viewState === 'trades' ? 'active' : ''}`}>
                        {filters.region}
                    </button>
                </>
            )}
            {filters.industry && (
                <>
                    <ChevronRight size={16} className="text-slate-600" />
                    <span className="breadcrumb-item active text-secondary">
                        {filters.industry}
                    </span>
                </>
            )}
        </div>
        <div className="h-px bg-slate-800 flex-1 ml-4"></div>
      </div>

      <div className="content-area">
        {viewState === 'regions' && (
            <RegionGrid clients={clients} onSelectRegion={selectRegion} />
        )}

        {viewState === 'trades' && (
            <TradeGrid clients={clients} region={filters.region} onSelectTrade={selectTrade} />
        )}

        {viewState === 'clients' && (
            <ClientTierBoard 
                clients={clients} 
                region={filters.region} 
                industry={filters.industry} 
                onClientClick={handleClientClick}
            />
        )}
      </div>

      {selectedClient && (
        <EnhancedClientDetailsModal
          client={selectedClient}
          onClose={() => setSelectedClient(null)}
          onUpdate={handleUpdateClient}
        />
      )}

      {selectedPlacement && (
        <PlacementTicketModal
          placement={selectedPlacement}
          onClose={() => setSelectedPlacement(null)}
        />
      )}

      {isAddModalOpen && (
        <AddClientModal
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleAddClient}
        />
      )}

      <style jsx>{`
                .crm-container {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                    height: calc(100vh - 4rem);
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

                .action-btn.primary {
                    background: var(--secondary);
                    color: #0f172a;
                    border-color: var(--secondary);
                    font-weight: 600;
                }

                .search-bar {
                    display: flex;
                    align-items: center;
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-md);
                    padding: 0.5rem 1rem;
                    width: 300px;
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

                .breadcrumb-item {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: none;
                    border: none;
                    color: var(--text-muted);
                    font-weight: 600;
                    cursor: pointer;
                    font-size: 0.9rem;
                    padding: 0.25rem 0.5rem;
                    border-radius: 6px;
                    transition: all 0.2s;
                }

                .breadcrumb-item:hover {
                    color: white;
                    background: rgba(255, 255, 255, 0.05);
                }

                .breadcrumb-item.active {
                    color: white;
                }

                .content-area {
                    flex: 1;
                    overflow-y: auto;
                    min-height: 0;
                    padding-bottom: 2rem;
                }

                /* Modal Styles for Add Client Placeholder */
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }

                .modal-content {
                    background: #0f172a;
                    padding: 2rem;
                    border-radius: var(--radius-md);
                    border: 1px solid var(--border);
                    width: 400px;
                }
            `}</style>
    </div>
  );
}
