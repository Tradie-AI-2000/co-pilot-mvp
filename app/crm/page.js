"use client";

import { useState, useEffect } from "react";
import { useData } from "@/context/DataContext";
import EnhancedClientDetailsModal from "@/components/EnhancedClientDetailsModal";
import ClientCard from "@/components/ClientCard";
import AddClientModal from "@/components/AddClientModal";
import { Search, Filter, Plus, Users, Upload, Download } from "lucide-react";

export default function CRMPage() {
  const { clients, addClient, updateClient } = useData();
  const [selectedClient, setSelectedClient] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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

      <div className="clients-grid">
        {clients.map(client => (
          <ClientCard
            key={client.id}
            client={client}
            onClick={() => handleClientClick(client)}
          />
        ))}
      </div>

      {selectedClient && (
        <EnhancedClientDetailsModal
          client={selectedClient}
          onClose={() => setSelectedClient(null)}
          onUpdate={handleUpdateClient}
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

                .clients-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
                    gap: 1.5rem;
                    overflow-y: auto;
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
