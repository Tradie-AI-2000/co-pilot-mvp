"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Map,
  Settings,
  LogOut,
  HardHat,
  DollarSign,
  Target,
  Globe
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Projects", href: "/projects", icon: HardHat },
  { name: "CRM", href: "/crm", icon: Briefcase },
  { name: "Candidates", href: "/candidates", icon: Users },
  { name: "Business Dev", href: "/bd", icon: Target },
  { name: "Market Intel", href: "/market", icon: Map },
  { name: "Financials", href: "/financials", icon: DollarSign },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar glass-panel">
      {/* ... (logo) ... */}
      <div className="logo-container">
        <div className="logo-image-wrapper">
          <img src="/images/logo.png" alt="Stellar Co-Pilot" className="logo-img" />
        </div>
        <p className="logo-sub neon-gradient">Labour Hire Co-Pilot</p>
      </div>

      <nav className="nav-menu">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${isActive ? "active" : ""}`}
            >
              <Icon size={20} />
              <span>{item.name}</span>
              {isActive && <div className="active-indicator" />}
            </Link>
          );
        })}
        
        {/* External Views Section */}
        <div className="mt-4 pt-4 border-t border-slate-700/50">
            <p className="px-4 text-xs text-slate-500 font-bold uppercase mb-2">External Views</p>
            <Link href="/portal" className={`nav-item ${pathname === '/portal' ? 'active' : ''}`}>
                <Globe size={20} />
                <span>Client Portal</span>
            </Link>
        </div>
      </nav>

      {/* ... (user profile) ... */}
      <div className="user-profile">
        <div className="user-avatar">JW</div>
        <div className="user-info">
          <p className="user-name">Joe Ward</p>
          <p className="user-role">Recruitment Consultant</p>
        </div>
        <button className="logout-btn">
          <LogOut size={18} />
        </button>
      </div>

      <style jsx>{`
        .sidebar {
          width: 260px;
          height: calc(100vh - 2rem);
          position: fixed;
          top: 1rem;
          left: 1rem;
          display: flex;
          flex-direction: column;
          padding: 1.5rem;
          z-index: 50;
        }

        .logo-container {
          margin-bottom: 2.5rem;
          text-align: center;
        }

        .logo-image-wrapper {
             width: 100%;
             margin-bottom: 0.5rem;
             display: flex;
             justify-content: center;
        }

        .logo-img {
            max-width: 100%;
            height: auto;
            max-height: 80px; /* Adjust based on logo aspect ratio */
        }

        .logo-sub {
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .neon-gradient {
            background: linear-gradient(90deg, #00f3ff, #ffeb3b);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-fill-color: transparent;
        }

        .nav-menu {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-sm);
          color: var(--text-muted);
          transition: var(--transition-fast);
          position: relative;
          overflow: hidden;
        }

        .nav-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-main);
        }

        .nav-item.active {
          background: rgba(56, 189, 248, 0.1);
          color: var(--secondary);
        }

        .active-indicator {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 60%;
          background: var(--secondary);
          border-radius: 4px 0 0 4px;
          box-shadow: 0 0 10px var(--secondary);
        }

        .user-profile {
          margin-top: auto;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border);
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--secondary), var(--primary));
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.9rem;
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.1);
        }

        .user-info {
          flex: 1;
          overflow: hidden;
        }

        .user-name {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-main);
        }

        .user-role {
          font-size: 0.7rem;
          color: var(--text-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .logout-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 0.5rem;
          border-radius: var(--radius-sm);
          transition: var(--transition-fast);
        }

        .logout-btn:hover {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
        }
      `}</style>
    </aside>
  );
}
