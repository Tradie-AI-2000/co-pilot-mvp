"use client";

import { Construction } from "lucide-react";

export default function MarketPage() {
  return (
    <div className="market-placeholder">
      <div className="content">
        <Construction size={64} className="icon" />
        <h1>Construction Market Intelligence</h1>
        <p>We've moved the real-time project map and tracking to the main <strong>Projects Database</strong>.</p>
        <p className="sub-text">This section will soon house detailed PDF market reports and sector analysis.</p>
        <a href="/projects" className="btn-primary">Go to Projects Dashboard</a>
      </div>

      <style jsx>{`
            .market-placeholder {
                min-height: 80vh;
                display: flex;
                align-items: center;
                justify-content: center;
                text-align: center;
                padding: 2rem;
            }
            .content {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 1.5rem;
                max-width: 500px;
                background: var(--surface);
                padding: 3rem;
                border: 1px solid var(--border);
                border-radius: var(--radius-lg);
            }
            .icon {
                color: var(--secondary);
                margin-bottom: 0.5rem;
            }
            h1 {
                font-size: 1.75rem;
                font-weight: 700;
                color: var(--text-main);
            }
            p {
                color: var(--text-muted);
                line-height: 1.6;
            }
            .sub-text {
                font-size: 0.875rem;
                margin-top: -0.5rem;
            }
            .btn-primary {
                background: var(--primary);
                color: white;
                padding: 0.75rem 1.5rem;
                border-radius: var(--radius-md);
                text-decoration: none;
                font-weight: 600;
                margin-top: 1rem;
                transition: opacity 0.2s;
            }
            .btn-primary:hover {
                opacity: 0.9;
            }
        `}</style>
    </div>
  );
}
