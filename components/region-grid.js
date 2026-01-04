import { MapPin, Users, ChevronRight } from "lucide-react";

export default function RegionGrid({ candidates, onRegionClick }) {
    // Group candidates by region (using 'state' as proxy for Region)
    const regions = candidates.reduce((acc, candidate) => {
        const region = candidate.state || "Unknown";
        if (!acc[region]) {
            acc[region] = { name: region, count: 0, avatars: [] };
        }
        acc[region].count++;
        if (acc[region].avatars.length < 3) {
            acc[region].avatars.push({
                initials: `${candidate.firstName?.[0] || ''}${candidate.lastName?.[0] || ''}`,
                id: candidate.id
            });
        }
        return acc;
    }, {});

    const regionList = Object.values(regions).sort((a, b) => b.count - a.count);

    return (
        <div className="region-grid">
            {regionList.map((region) => (
                <div
                    key={region.name}
                    onClick={() => onRegionClick(region.name)}
                    className="region-card"
                >
                    <div className="card-top">
                        <div className="icon-badge">
                            <MapPin size={24} />
                        </div>
                        <div className="count-badge">
                            {region.count} Candidates
                        </div>
                    </div>

                    <h3 className="region-title">{region.name}</h3>
                    <p className="region-sub">View available trades</p>

                    <div className="card-footer">
                        <div className="avatars">
                            {region.avatars.map((avatar, i) => (
                                <div key={i} className="avatar">
                                    {avatar.initials}
                                </div>
                            ))}
                            {region.count > 3 && (
                                <div className="avatar more">
                                    +{region.count - 3}
                                </div>
                            )}
                        </div>
                        <div className="arrow-btn">
                            <ChevronRight size={16} />
                        </div>
                    </div>
                </div>
            ))}
            <style jsx>{`
                .region-card {
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-md);
                    padding: 1.5rem;
                    cursor: pointer;
                    transition: all 0.2s;
                    display: flex;
                    flex-direction: column;
                }

                .region-card:hover {
                    border-color: var(--secondary);
                    transform: translateY(-2px);
                    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5);
                }

                .card-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 1rem;
                }

                .icon-badge {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid var(--border);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--secondary);
                }

                .region-card:hover .icon-badge {
                    background: var(--secondary);
                    color: #0f172a;
                    border-color: var(--secondary);
                }

                .count-badge {
                    font-size: 0.75rem;
                    font-weight: 600;
                    padding: 0.25rem 0.75rem;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid var(--border);
                    border-radius: 999px;
                    color: var(--text-muted);
                }

                .region-title {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: white;
                    margin-bottom: 0.25rem;
                }

                .region-sub {
                    font-size: 0.875rem;
                    color: var(--text-muted);
                    margin-bottom: 1.5rem;
                }

                .card-footer {
                    margin-top: auto;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .avatars {
                    display: flex;
                    margin-left: 0.5rem;
                }

                .avatar {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: var(--surface);
                    border: 2px solid var(--surface);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.65rem;
                    font-weight: 700;
                    color: white;
                    margin-left: -0.5rem;
                    background: #334155;
                }

                .avatar.more {
                    background: #1e293b;
                    color: var(--text-muted);
                }

                .arrow-btn {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.03);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--text-muted);
                    transition: all 0.2s;
                }

                .region-card:hover .arrow-btn {
                    background: var(--secondary);
                    color: #0f172a;
                }

                .region-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 2.5rem;
                    width: 100%;
                }

                @media (min-width: 768px) {
                    .region-grid { grid-template-columns: repeat(2, 1fr); }
                }

                @media (min-width: 1024px) {
                    .region-grid { grid-template-columns: repeat(3, 1fr); }
                }
            `}</style>
        </div>
    );
}
