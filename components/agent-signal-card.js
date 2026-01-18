export default function AgentSignalCard({ name, icon, signal, meta }) {
    const signalColors = {
        success: 'var(--secondary)',
        caution: 'var(--accent)',
        urgent: 'var(--signal-urgent)',
        predict: 'var(--signal-predict)',
        neutral: 'var(--text-muted)'
    };

    return (
        <div className="agent-card glass-panel p-4">
            <div className="flex justify-between items-start">
                <span className="text-xl">{icon}</span>
                <div className="signal-dot" style={{ background: signalColors[signal] }} />
            </div>
            <h3 className="text-sm font-bold mt-2">{name}</h3>
            <p className="text-xs text-muted mt-1">{meta}</p>

            <style jsx>{`
        .agent-card { border-radius: var(--radius-sm); transition: var(--transition-fast); }
        .signal-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          box-shadow: 0 0 10px currentColor;
        }
      `}</style>
        </div>
    );
}