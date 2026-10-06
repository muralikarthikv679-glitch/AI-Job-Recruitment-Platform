import React from 'react';
import { Target, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function MatchScoreBadge({ score, size = 'md', showLabel = true, onClick }) {
  if (score === null || score === undefined) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-semibold bg-slate-800 text-slate-400 border border-slate-700">
        -- Match
      </span>
    );
  }

  const numericScore = Math.round(Number(score));

  let colorClasses = {
    bg: 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400',
    ring: 'text-emerald-500',
    badge: 'bg-emerald-500 text-white',
    label: 'High Match',
    icon: CheckCircle2
  };

  if (numericScore < 55) {
    colorClasses = {
      bg: 'bg-rose-950/40 border-rose-500/30 text-rose-400',
      ring: 'text-rose-500',
      badge: 'bg-rose-500 text-white',
      label: 'Low Match',
      icon: AlertCircle
    };
  } else if (numericScore < 80) {
    colorClasses = {
      bg: 'bg-amber-950/40 border-amber-500/30 text-amber-400',
      ring: 'text-amber-500',
      badge: 'bg-amber-500 text-white',
      label: 'Moderate Fit',
      icon: TrendingUp
    };
  }

  const Icon = colorClasses.icon;

  if (size === 'lg') {
    return (
      <div
        onClick={onClick}
        className={`flex items-center gap-3 p-3.5 rounded-2xl border ${colorClasses.bg} shadow-md backdrop-blur-md ${
          onClick ? 'cursor-pointer hover:border-indigo-500/50 hover:scale-[1.02] transition-all' : ''
        }`}
      >
        <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
          <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-slate-800"
              strokeWidth="3"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className={colorClasses.ring}
              strokeDasharray={`${numericScore}, 100`}
              strokeWidth="3.5"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <span className="absolute font-extrabold text-xs text-white">
            {numericScore}%
          </span>
        </div>
        <div>
          <div className="flex items-center gap-1 font-bold text-xs text-slate-200">
            <Target className="w-3.5 h-3.5 text-indigo-400" />
            <span>Compatibility Fit</span>
          </div>
          <span className="text-xs font-semibold">{colorClasses.label}</span>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border transition-all ${
        colorClasses.bg
      } ${onClick ? 'hover:scale-105 cursor-pointer shadow-sm' : ''}`}
    >
      <Target className="w-3 h-3 text-indigo-400" />
      <span>{numericScore}%</span>
      {showLabel && <span className="opacity-90 font-medium">({colorClasses.label})</span>}
    </button>
  );
}
