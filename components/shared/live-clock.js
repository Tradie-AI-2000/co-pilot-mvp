"use client";

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function LiveClock() {
    const [time, setTime] = useState(null);

    useEffect(() => {
        setTime(new Date());
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    if (!time) return null;

    return (
        <div className="live-clock">
            <div className="clock-icon">
                <Clock size={14} className="text-secondary" />
            </div>
            <div className="clock-details">
                <div className="time-string">
                    {time.toLocaleTimeString('en-NZ', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                </div>
                <div className="date-string">
                    {time.toLocaleDateString('en-NZ', { weekday: 'short', day: 'numeric', month: 'short' })}
                </div>
            </div>

            <style jsx>{`
                .live-clock {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.75rem 1rem;
                    background: rgba(0, 0, 0, 0.2);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-md);
                    margin-bottom: 1.5rem;
                }

                .clock-icon {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: rgba(56, 189, 248, 0.1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                .clock-details {
                    display: flex;
                    flex-direction: column;
                }

                .time-string {
                    font-family: var(--font-geist-mono);
                    font-size: 1rem;
                    font-weight: 700;
                    color: white;
                    line-height: 1.2;
                }

                .date-string {
                    font-size: 0.65rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: var(--text-muted);
                }
            `}</style>
        </div>
    );
}
