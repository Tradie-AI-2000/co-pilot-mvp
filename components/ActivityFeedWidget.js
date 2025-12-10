"use client";

import { Phone, Mail, Calendar, MessageSquare, UserPlus } from "lucide-react";

export default function ActivityFeedWidget() {
    const activities = [
        { id: 1, type: "call", user: "Sarah Jenkins", action: "Called about Site Manager role", time: "10m ago" },
        { id: 2, type: "email", user: "Mike Ross", action: "Sent rate card proposal", time: "1h ago" },
        { id: 3, type: "meeting", user: "David Chen", action: "Coffee catch-up scheduled", time: "2h ago" },
        { id: 4, type: "placement", user: "James Wilson", action: "Placed as Hammerhand", time: "4h ago" },
        { id: 5, type: "note", user: "System", action: "Contract expiring warning", time: "5h ago" }
    ];

    const getIcon = (type) => {
        switch (type) {
            case 'call': return <Phone size={14} className="text-sky-400" />;
            case 'email': return <Mail size={14} className="text-purple-400" />;
            case 'meeting': return <Calendar size={14} className="text-emerald-400" />;
            case 'placement': return <UserPlus size={14} className="text-amber-400" />;
            default: return <MessageSquare size={14} className="text-slate-400" />;
        }
    };

    return (
        <div className="activity-feed">
            <h3 className="widget-title">Recent Activity</h3>
            <div className="feed-list">
                {activities.map(activity => (
                    <div key={activity.id} className="feed-item">
                        <div className="icon-box">
                            {getIcon(activity.type)}
                        </div>
                        <div className="content">
                            <div className="action">
                                <span className="user">{activity.user}</span>
                                <span className="desc"> • {activity.action}</span>
                            </div>
                            <div className="time">{activity.time}</div>
                        </div>
                    </div>
                ))}
            </div>

            <style jsx>{`
                .activity-feed {
                    background: rgba(15, 23, 42, 0.6);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-md);
                    padding: 1rem;
                    height: 100%;
                    overflow-y: auto;
                }

                .widget-title {
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: var(--text-muted);
                    margin-bottom: 1rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .feed-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .feed-item {
                    display: flex;
                    gap: 0.75rem;
                    align-items: flex-start;
                }

                .icon-box {
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.05);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                .content {
                    flex: 1;
                }

                .action {
                    font-size: 0.85rem;
                    color: var(--text-main);
                    line-height: 1.4;
                }

                .user {
                    font-weight: 600;
                    color: white;
                }

                .desc {
                    color: var(--text-muted);
                }

                .time {
                    font-size: 0.7rem;
                    color: var(--text-muted);
                    margin-top: 0.1rem;
                }
            `}</style>
        </div>
    );
}
