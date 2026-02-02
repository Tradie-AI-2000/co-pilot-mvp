"use client";
import { Newspaper, ExternalLink } from 'lucide-react';

export function NewsFeedWidget({ initialNews = [] }) {
    return (
        <div className="news-feed">
            <div className="widget-header">
                <h3><Newspaper size={18} /> Google Market Alerts</h3>
                <span className="live-indicator">
                    <span className="pulse"></span> Live
                </span>
            </div>
            <div className="news-list">
                {initialNews.length === 0 && (
                    <p className="empty">No recent alerts found.</p>
                )}
                {initialNews.map(item => (
                    <a 
                        key={item.id} 
                        href={item.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="news-item"
                    >
                        <h4 dangerouslySetInnerHTML={{ __html: item.title }}></h4>
                        <div className="news-meta">
                            <span>Google Alerts</span>
                            <span>•</span>
                            <span>{item.date}</span>
                            <ExternalLink size={10} className="icon" />
                        </div>
                    </a>
                ))}
            </div>

            <style jsx>{`
                .news-feed {
                    background: var(--surface);
                    border-radius: var(--radius-lg);
                    border: 1px solid var(--border);
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                }
                .widget-header {
                    padding: 1rem;
                    border-bottom: 1px solid var(--border);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .widget-header h3 {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin: 0;
                    font-size: 0.9rem;
                    color: var(--text-main);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .live-indicator {
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                    font-size: 0.7rem;
                    font-weight: 700;
                    color: #10b981;
                    text-transform: uppercase;
                }
                .pulse {
                    width: 6px;
                    height: 6px;
                    background: #10b981;
                    border-radius: 50%;
                    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
                    animation: pulse 2s infinite;
                }
                @keyframes pulse {
                    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
                    70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
                    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
                }
                .news-list {
                    flex: 1;
                    overflow-y: auto;
                    padding: 0.75rem;
                }
                .news-item {
                    display: block;
                    text-decoration: none;
                    margin-bottom: 0.5rem;
                    padding: 0.75rem;
                    border-radius: var(--radius-md);
                    transition: background 0.2s;
                    border: 1px solid transparent;
                }
                .news-item:hover {
                    background: var(--bg-secondary);
                    border-color: var(--border);
                }
                h4 {
                    font-size: 0.85rem;
                    margin: 0 0 0.4rem 0;
                    line-height: 1.4;
                    color: var(--text-main);
                }
                .news-meta {
                    font-size: 0.7rem;
                    color: var(--text-muted);
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                }
                .empty { font-size: 0.8rem; color: var(--text-muted); text-align: center; padding: 2rem; }
            `}</style>
        </div>
    );
}