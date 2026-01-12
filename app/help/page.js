"use client";

import { BookOpen, AlertCircle, FileText, CheckCircle, Clock, Zap, Target } from "lucide-react";

export default function HelpPage() {
    return (
        <div className="help-container">
            {/* Sidebar TOC */}
            <div className="toc-sidebar">
                <h3 className="toc-header">Help Desk</h3>
                <nav className="toc-nav">
                    <a href="#philosophy" className="toc-link">The Philosophy</a>
                    <a href="#dashboard" className="toc-link">Dashboard (The Farm)</a>
                    <a href="#bd" className="toc-link">BD (The Hunt)</a>
                    <a href="#logic" className="toc-link">Logic Engines</a>
                    <a href="#data" className="toc-link">Data Dictionary</a>
                    <a href="#tutorials" className="toc-link">Tutorials</a>
                </nav>
            </div>

            {/* Main Content */}
            <div className="content-area">
                <header className="page-header">
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <BookOpen className="text-secondary" /> User Manual & Documentation
                    </h1>
                    <p className="text-slate-400 mt-2">
                        The complete guide to operating the Stellar Recruitment Co-Pilot.
                    </p>
                </header>

                {/* SECTION A: PHILOSOPHY */}
                <section id="philosophy" className="doc-section">
                    <h2>The Philosophy: Farm vs. Hunt</h2>
                    <div className="grid grid-cols-2 gap-6 mt-4">
                        <div className="concept-card">
                            <div className="card-icon bg-blue-500/10 text-blue-400"><CheckCircle size={24} /></div>
                            <h3>The Farm (Dashboard)</h3>
                            <p>
                                <strong>Goal:</strong> Operational Excellence.<br />
                                This is where you manage what you <em>already have</em>.
                                Keep current workers happy, fill active orders, and monitor compliance.
                                If it's on the dashboard, it's a "Now" problem.
                            </p>
                        </div>
                        <div className="concept-card">
                            <div className="card-icon bg-rose-500/10 text-rose-400"><Target size={24} /></div>
                            <h3>The Hunt (BD Page)</h3>
                            <p>
                                <strong>Goal:</strong> Revenue Generation.<br />
                                This is where you find what you <em>don't have yet</em>.
                                Identify future gaps, prevent margin loss ("The Bleed"), and execute high-velocity calls.
                                If it's on the BD page, it's a "Future" opportunity.
                            </p>
                        </div>
                    </div>
                </section>

                {/* SECTION B: PAGE GUIDE */}
                <section id="dashboard" className="doc-section">
                    <h2>Page-by-Page Guide</h2>

                    <div className="page-block">
                        <h3>1. Main Dashboard</h3>
                        <ul className="feature-list">
                            <li><strong>Purpose:</strong> Your morning "Status Check". Is the desk stable?</li>
                            <li><strong>Key Metrics:</strong> Active Headcount, Unfilled Orders, Revenue at Risk (Vacant Roles).</li>
                            <li><strong>Core Actions:</strong> Check the "Activity Feed" for urgent alerts. View the "Territory Map" to see live site distribution.</li>
                        </ul>
                    </div>

                    <div className="page-block">
                        <h3>2. Projects</h3>
                        <ul className="feature-list">
                            <li><strong>Purpose:</strong> Managing the pipeline of construction sites.</li>
                            <li><strong>Key Features:</strong> "Phase Tracking" (Civil &gt; Structure &gt; Fitout). This drives the Matchmaker engine.</li>
                            <li><strong>Core Actions:</strong> Update project phases. Add new sites from leads.</li>
                        </ul>
                    </div>

                    <div className="page-block">
                        <h3>3. CRM (Clients)</h3>
                        <ul className="feature-list">
                            <li><strong>Purpose:</strong> Relationship management database.</li>
                            <li><strong>Key Features:</strong> Tiering system (1-3). Contact details. Linked projects.</li>
                            <li><strong>Core Actions:</strong> Update "Last Contact" dates. Assign Tiers to drive the "Relationship Decay" engine.</li>
                        </ul>
                    </div>

                    <div id="bd" className="page-block highlight">
                        <h3>4. Business Dev (The Hunter Deck)</h3>
                        <ul className="feature-list">
                            <li><strong>Purpose:</strong> The "War Room" for growth.</li>
                            <li><strong>Zone 1: The Bleed:</strong> Retention risk. Workers finishing in &lt;14 days.</li>
                            <li><strong>Zone 2: Matchmaker:</strong> Auto-matches finishing workers to new project phases.</li>
                            <li><strong>Zone 3: Decay:</strong> Clients you haven't spoken to in too long.</li>
                            <li><strong>Zone 4: Power Block:</strong> A focused "Dialer Mode" for executing calls.</li>
                        </ul>
                    </div>
                </section>

                {/* SECTION C: LOGIC ENGINES */}
                <section id="logic" className="doc-section">
                    <h2>The Logic Engines (Deep Dive)</h2>

                    <div className="logic-card">
                        <h4>🩸 The Bleed (Retention Risk)</h4>
                        <div className="formula">
                            Risk = (Charge Rate - (Pay Rate × 1.30)) × Guaranteed Hours
                        </div>
                        <p>
                            <strong>Trigger:</strong> Candidate 'Finish Date' is within <strong>14 days</strong> of today.<br />
                            <strong>Goal:</strong> Prevent margin loss by redeploying before they hit the bench.
                        </p>
                    </div>

                    <div className="logic-card">
                        <h4>🧩 The Matchmaker</h4>
                        <p>
                            <strong>Trigger:</strong> A Project enters a new Phase (e.g., Structure) in <strong>7-45 days</strong>.<br />
                            <strong>Matching:</strong> Finds candidates with the matching Role (e.g., Carpenter) who are <em>Available</em> or <em>Finishing Soon</em>.<br />
                            <strong>Mobile Override:</strong> If a candidate is tagged "Mobile" (e.g., Filipino Crew), they match ALL projects in the Upper North Island, ignoring local radius checks.
                        </p>
                    </div>

                    <div className="logic-card">
                        <h4>📉 Relationship Decay</h4>
                        <p>
                            <strong>Tier 1 Risk:</strong> No contact &gt; <strong>14 days</strong>.<br />
                            <strong>Tier 2 Risk:</strong> No contact &gt; <strong>30 days</strong>.<br />
                            <strong>Dormant:</strong> No contact &gt; <strong>60 days</strong>.
                        </p>
                    </div>
                </section>

                {/* SECTION D: DATA DICTIONARY */}
                <section id="data" className="doc-section">
                    <h2>Data Dictionary (Google Sheets)</h2>
                    <p className="mb-4 text-slate-400">
                        The app syncs with your Google Sheet. Ensure these specific columns are populated for the logic to work.
                    </p>

                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Sheet Tab</th>
                                    <th>Data Point</th>
                                    <th>Column</th>
                                    <th>Impact</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>Candidates</strong></td>
                                    <td>Role</td>
                                    <td>Col V</td>
                                    <td>Matches against Project Phases.</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>Finish Date</td>
                                    <td>Col AW</td>
                                    <td>Triggers "The Bleed" & Availability.</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>Rates</td>
                                    <td>AA (Pay), AB (Charge)</td>
                                    <td>Calculates Financial Risk.</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>Residency</td>
                                    <td>Col P</td>
                                    <td>"Work Visa" / "Filipino" = Mobile Crew Badge.</td>
                                </tr>
                                <tr className="spacer"><td colSpan="4"></td></tr>
                                <tr>
                                    <td><strong>Clients</strong></td>
                                    <td>Tier</td>
                                    <td>Col D</td>
                                    <td>Determines Decay urgency (1, 2, or 3).</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>Last Contact</td>
                                    <td>Col F</td>
                                    <td>Resets the "Silence" timer.</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>Location</td>
                                    <td>Col W</td>
                                    <td>Used for local proximity matching.</td>
                                </tr>
                                <tr className="spacer"><td colSpan="4"></td></tr>
                                <tr>
                                    <td><strong>Projects</strong></td>
                                    <td>Phase Starts</td>
                                    <td>AF (Civil), AG (Structure), AH (Fitout)</td>
                                    <td>Triggers "The Matchmaker" demand signals.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* SECTION E: TUTORIALS */}
                <section id="tutorials" className="doc-section">
                    <h2>Workflows & Tutorials</h2>

                    <div className="tutorial-block">
                        <h3>⚡ The Morning Routine (15 Mins)</h3>
                        <ol>
                            <li><strong>Open The Hunter Deck (/bd):</strong> Don't look at emails yet.</li>
                            <li><strong>Check The Bleed:</strong> Any red numbers? Deal with these first. They are expiring revenue.</li>
                            <li><strong>Scan Matchmaker:</strong> Any new Cyan cards? These are "Free Money" pitches. Generate the pitch and send.</li>
                            <li><strong>Power Block:</strong> Click "Start Power Block". Call your Top 5 Decay/Risk targets.</li>
                            <li><strong>Switch to Farm:</strong> Once the hunt is done, go to the Main Dashboard to manage the day-to-day operations.</li>
                        </ol>
                    </div>
                </section>
            </div>

            <style jsx>{`
                .help-container {
                    display: flex;
                    height: calc(100vh - 2rem);
                    gap: 2rem;
                    overflow: hidden;
                }

                /* Sidebar TOC */
                .toc-sidebar {
                    width: 240px;
                    flex-shrink: 0;
                    padding: 1.5rem;
                    background: rgba(15, 23, 42, 0.6);
                    border: 1px solid var(--border);
                    border-radius: 12px;
                    display: flex;
                    flex-direction: column;
                }

                .toc-header {
                    font-size: 0.9rem;
                    font-weight: 800;
                    color: white;
                    text-transform: uppercase;
                    margin-bottom: 1.5rem;
                    letter-spacing: 0.05em;
                }

                .toc-nav {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .toc-link {
                    color: var(--text-muted);
                    font-size: 0.85rem;
                    padding: 0.5rem;
                    border-radius: 6px;
                    transition: all 0.2s;
                }

                .toc-link:hover {
                    background: rgba(255, 255, 255, 0.05);
                    color: var(--secondary);
                }

                /* Main Content */
                .content-area {
                    flex: 1;
                    overflow-y: auto;
                    padding-right: 1rem;
                }
                
                .content-area::-webkit-scrollbar { width: 6px; }
                .content-area::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }

                .page-header {
                    margin-bottom: 3rem;
                    padding-bottom: 1.5rem;
                    border-bottom: 1px solid var(--border);
                }

                .doc-section {
                    margin-bottom: 4rem;
                }

                h2 {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: white;
                    margin-bottom: 1.5rem;
                    border-left: 4px solid var(--secondary);
                    padding-left: 1rem;
                }

                h3 {
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: white;
                    margin-bottom: 1rem;
                }

                /* Concept Cards */
                .concept-card {
                    background: rgba(30, 41, 59, 0.4);
                    border: 1px solid var(--border);
                    border-radius: 12px;
                    padding: 1.5rem;
                }

                .card-icon {
                    width: 48px;
                    height: 48px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 1rem;
                }

                .concept-card p {
                    color: var(--text-muted);
                    font-size: 0.9rem;
                    line-height: 1.6;
                }

                /* Page Blocks */
                .page-block {
                    margin-bottom: 2rem;
                    background: rgba(255, 255, 255, 0.02);
                    padding: 1.5rem;
                    border-radius: 8px;
                    border: 1px solid var(--border);
                }

                .page-block.highlight {
                    background: rgba(0, 242, 255, 0.05);
                    border-color: rgba(0, 242, 255, 0.2);
                }

                .feature-list {
                    list-style: disc;
                    padding-left: 1.5rem;
                    color: #cbd5e1;
                    font-size: 0.9rem;
                    line-height: 1.8;
                }

                .feature-list strong {
                    color: white;
                }

                /* Logic Cards */
                .logic-card {
                    background: rgba(15, 23, 42, 0.6);
                    border: 1px solid var(--border);
                    padding: 1.5rem;
                    border-radius: 12px;
                    margin-bottom: 1.5rem;
                }

                .logic-card h4 {
                    font-size: 1rem;
                    font-weight: 700;
                    color: white;
                    margin-bottom: 0.75rem;
                }

                .formula {
                    font-family: monospace;
                    background: rgba(0,0,0,0.3);
                    padding: 0.75rem;
                    border-radius: 6px;
                    color: var(--secondary);
                    margin-bottom: 1rem;
                    border: 1px solid var(--border);
                }

                /* Data Table */
                .table-wrapper {
                    border: 1px solid var(--border);
                    border-radius: 8px;
                    overflow: hidden;
                }

                .data-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 0.9rem;
                }

                .data-table th {
                    background: rgba(255, 255, 255, 0.05);
                    text-align: left;
                    padding: 1rem;
                    font-weight: 700;
                    color: white;
                    border-bottom: 1px solid var(--border);
                }

                .data-table td {
                    padding: 1rem;
                    color: #cbd5e1;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                }

                .data-table tr:last-child td {
                    border-bottom: none;
                }

                .spacer td {
                    background: rgba(0,0,0,0.2);
                    height: 8px;
                    padding: 0;
                }

                /* Tutorial */
                .tutorial-block {
                    background: rgba(16, 185, 129, 0.05);
                    border: 1px solid rgba(16, 185, 129, 0.2);
                    padding: 2rem;
                    border-radius: 12px;
                }

                .tutorial-block ol {
                    list-style: decimal;
                    padding-left: 1.5rem;
                    color: #cbd5e1;
                    line-height: 2;
                }

                .tutorial-block strong {
                    color: #34d399;
                }
            `}</style>
        </div>
    );
}
