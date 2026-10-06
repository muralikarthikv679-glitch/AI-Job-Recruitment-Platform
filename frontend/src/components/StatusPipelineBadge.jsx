import React from 'react';
import { Send, CheckCircle2, Calendar, Award, XCircle, Clock } from 'lucide-react';

export default function StatusPipelineBadge({ status }) {
  const configs = {
    APPLIED: {
      label: 'Applied',
      color: 'bg-blue-950/40 text-blue-400 border-blue-500/30',
      icon: Send,
    },
    SHORTLISTED: {
      label: 'Shortlisted',
      color: 'bg-amber-950/40 text-amber-400 border-amber-500/30',
      icon: CheckCircle2,
    },
    INTERVIEW_SCHEDULED: {
      label: 'Interview',
      color: 'bg-purple-950/40 text-purple-400 border-purple-500/30',
      icon: Calendar,
    },
    HIRED: {
      label: 'Hired',
      color: 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30',
      icon: Award,
    },
    REJECTED: {
      label: 'Archived',
      color: 'bg-slate-800/60 text-slate-400 border-slate-700',
      icon: XCircle,
    },
  };

  const config = configs[status] || {
    label: status,
    color: 'bg-slate-800 text-slate-300 border-slate-700',
    icon: Clock,
  };

  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold border backdrop-blur-sm ${config.color}`}>
      <Icon className="w-3.5 h-3.5 shrink-0" />
      {config.label}
    </span>
  );
}
