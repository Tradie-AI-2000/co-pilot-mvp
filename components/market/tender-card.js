"use client";
import { MapPin, DollarSign, Calendar, Maximize2 } from 'lucide-react';

export function TenderCard({ tender, onClick }) {
    return (
        <div 
            className="tender-card"
            onClick={() => onClick(tender)}
        >
            <div className="card-header">
                <span className="badge status">{tender.status}</span>
                <span className="badge region">{tender.region || 'NZ'}</span>
            </div>
            
            <h3>{tender.title}</h3>
            <p className="client">{tender.client}</p>

            <div className="card-meta">
                <div className="meta-item">
                    <MapPin size={14} />
                    <span>{tender.location}</span>
                </div>
                <div className="meta-item">
                    <DollarSign size={14} />
                    <span>{tender.value || 'TBC'}</span>
                </div>
            </div>

            <button className="explode-btn" title="View Details">
                <Maximize2 size={16} />
            </button>

            <style jsx>{`
                .tender-card {
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-md);
                    padding: 1rem;
                    cursor: pointer;
                    transition: all 0.2s;
                    position: relative;
                }
                .tender-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                    border-color: var(--primary);
                }
                .card-header {
                    display: flex;
                    gap: 0.5rem;
                    margin-bottom: 0.75rem;
                }
                .badge {
                    font-size: 0.7rem;
                    padding: 0.2rem 0.5rem;
                    border-radius: 4px;
                    text-transform: uppercase;
                    font-weight: 600;
                }
                .status { background: var(--bg-secondary); color: var(--text-muted); }
                .region { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
                
                h3 {
                    font-size: 1rem;
                    font-weight: 600;
                    margin: 0 0 0.25rem 0;
                    color: var(--text-main);
                    line-height: 1.3;
                }
                .client {
                    font-size: 0.85rem;
                    color: var(--text-muted);
                    margin: 0 0 1rem 0;
                }
                .card-meta {
                    display: flex;
                    gap: 1rem;
                    font-size: 0.8rem;
                    color: var(--text-secondary);
                }
                .meta-item {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                }
                .explode-btn {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    background: transparent;
                    border: none;
                    color: var(--text-muted);
                    opacity: 0;
                    transition: opacity 0.2s;
                }
                .tender-card:hover .explode-btn {
                    opacity: 1;
                }
            `}</style>
        </div>
    );
}
