"use client";
import { useData } from "@/context/data-context";
import { TrendingUp, TrendingDown, Target, AlertTriangle } from "lucide-react";

export default function FinancialForecastWidget() {
    const { weeklyRevenue } = useData();

    // 1. DYNAMIC TARGETS
    const CURRENT_MONTH = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
    const TARGETS = {
        civil: { budget: 81000, actual: weeklyRevenue * 0.4 }, // Mocking split for demo
        structure: { budget: 45000, actual: weeklyRevenue * 0.6 },
        total: 126000
    };

    const totalVariance = weeklyRevenue - TARGETS.total;
    const variancePercent = ((weeklyRevenue / TARGETS.total) * 100).toFixed(1);
    const isDeficit = totalVariance < 0;

    return (
        <div className="glass-panel p-6">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-sm font-bold text-muted uppercase tracking-wider flex items-center gap-2">
                        <Target size={16} /> 2026 Forecast Tracker
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">{CURRENT_MONTH} • Upper North Island</p>
                </div>
                <div className={`text-right ${isDeficit ? 'text-rose-500' : 'text-emerald-400'}`}>
                    <div className="text-2xl font-bold">
                        {isDeficit ? '-' : '+'}${Math.abs(totalVariance).toLocaleString()}
                    </div>
                    <div className="text-xs font-bold uppercase tracking-wider">
                        {isDeficit ? 'Deficit' : 'Surplus'}
                    </div>
                </div>
            </div>

            {/* Main Progress Bar */}
            <div className="mb-8">
                <div className="flex justify-between text-xs mb-2 font-bold">
                    <span className="text-white">Actual: ${weeklyRevenue.toLocaleString()}</span>
                    <span className="text-slate-400">Target: ${TARGETS.total.toLocaleString()}</span>
                </div>
                <div className="h-4 bg-slate-800 rounded-full overflow-hidden relative border border-white/10">
                    {/* Target Marker Line */}
                    <div className="absolute top-0 bottom-0 w-0.5 bg-white z-10 opacity-50" style={{ left: '100%' }}></div>

                    {/* Actual Bar */}
                    <div
                        className={`h-full transition-all duration-1000 ${isDeficit ? 'bg-gradient-to-r from-rose-600 to-rose-400' : 'bg-gradient-to-r from-emerald-600 to-emerald-400'}`}
                        style={{ width: `${Math.min(variancePercent, 100)}%` }}
                    />
                </div>
            </div>

            {/* Department Breakdown (The "Grit" the Agent looks for) */}
            <div className="grid grid-cols-2 gap-4">
                <DepartmentRow
                    label="01_Civil"
                    actual={TARGETS.civil.actual}
                    budget={TARGETS.civil.budget}
                />
                <DepartmentRow
                    label="02_Structure"
                    actual={TARGETS.structure.actual}
                    budget={TARGETS.structure.budget}
                />
            </div>
        </div>
    );
}

function DepartmentRow({ label, actual, budget }) {
    const percent = Math.round((actual / budget) * 100);
    const isBehind = actual < budget;

    return (
        <div className="bg-white/5 rounded p-3 border border-white/5">
            <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">{label}</span>
                <span className={isBehind ? "text-rose-400" : "text-emerald-400"}>{percent}%</span>
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                    className={`h-full ${isBehind ? 'bg-rose-500' : 'bg-emerald-500'}`}
                    style={{ width: `${Math.min(percent, 100)}%` }}
                />
            </div>
            <div className="mt-1 text-[10px] text-slate-500 flex justify-between">
                <span>${(actual / 1000).toFixed(1)}k</span>
                <span>Target: ${(budget / 1000).toFixed(1)}k</span>
            </div>
        </div>
    );
}