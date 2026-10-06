import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analyticsAPI, jobsAPI } from '../../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import {
  BarChart3,
  Users,
  Briefcase,
  CheckCircle2,
  Calendar,
  Award,
  TrendingUp,
  PlusCircle,
  Layers,
  ArrowRight,
  Target
} from 'lucide-react';

export default function RecruiterDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, jobsRes] = await Promise.all([
        analyticsAPI.getRecruiterAnalytics(),
        jobsAPI.getMyJobs(),
      ]);
      setAnalytics(analyticsRes.data);
      setJobs(jobsRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-3">
        <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-400">Loading executive analytics...</p>
      </div>
    );
  }

  // Chart Data formatters
  const funnelData = [
    { name: 'Applied', count: analytics?.applicationsByStatus?.APPLIED || 0, fill: '#3b82f6' },
    { name: 'Shortlisted', count: analytics?.shortlistedCount || 0, fill: '#f59e0b' },
    { name: 'Interview', count: analytics?.interviewScheduledCount || 0, fill: '#8b5cf6' },
    { name: 'Hired', count: analytics?.hiredCount || 0, fill: '#10b981' },
    { name: 'Rejected', count: analytics?.rejectedCount || 0, fill: '#64748b' },
  ];

  const skillDemandData = Object.entries(analytics?.topRequiredSkillsDemand || {}).map(([skill, count]) => ({
    name: skill,
    value: count,
  }));

  const COLORS = ['#6366f1', '#a855f7', '#10b981', '#f59e0b', '#38bdf8', '#ec4899', '#14b8a6'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-100">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
            <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Recruitment Analytics & Funnel Oversight</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Executive Hiring Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Monitor applicant volume, candidate compatibility ratings, and market skill distributions
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/recruiter/post-job"
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            Post Requisition
          </Link>
          <Link
            to="/recruiter/jobs"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <Layers className="w-4 h-4" />
            Manage Openings
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 bg-slate-900/80 rounded-3xl border border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Postings</span>
            <div className="p-2 rounded-xl bg-indigo-950/60 border border-indigo-500/30 text-indigo-400">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{analytics?.totalJobsPosted || 0}</span>
            <span className="text-xs text-emerald-400 font-bold">({analytics?.activeJobsCount || 0} active)</span>
          </div>
        </div>

        <div className="p-5 bg-slate-900/80 rounded-3xl border border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Applications</span>
            <div className="p-2 rounded-xl bg-blue-950/60 border border-blue-500/30 text-blue-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">
              {analytics?.totalApplicationsReceived || 0}
            </span>
            <span className="text-xs text-slate-400">received</span>
          </div>
        </div>

        <div className="p-5 bg-slate-900/80 rounded-3xl border border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Fit Rating</span>
            <div className="p-2 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-400">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-purple-400">
              {analytics?.averageMatchScore || 0}%
            </span>
            <span className="text-xs text-slate-400">TF-IDF & skills</span>
          </div>
        </div>

        <div className="p-5 bg-slate-900/80 rounded-3xl border border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Offers Accepted</span>
            <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-400">{analytics?.hiredCount || 0}</span>
            <span className="text-xs text-slate-400">finalized</span>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Hiring Funnel Stages */}
        <div className="bg-slate-900/80 p-6 sm:p-7 rounded-3xl border border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            Candidate Pipeline Conversion Funnel
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <XAxis type="number" stroke="#64748b" allowDecimals={false} />
                <YAxis dataKey="name" type="category" width={80} stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: '12px' }}
                />
                <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Top Demanded Skills Distribution */}
        <div className="bg-slate-900/80 p-6 sm:p-7 rounded-3xl border border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-400" />
            Required Skills Frequency Across Active Requisitions
          </h3>
          <div className="h-64 flex items-center justify-center">
            {skillDemandData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={skillDemandData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={45}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {skillDemandData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-slate-500">No skill distribution data</p>
            )}
          </div>
        </div>
      </div>

      {/* Applications per Job Breakdown */}
      <div className="bg-slate-900/80 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            Active Requisitions & Candidate Ranking Overview
          </h3>
          <Link to="/recruiter/jobs" className="text-xs font-bold text-indigo-400 hover:underline">
            View All ({jobs.length}) →
          </Link>
        </div>

        <div className="divide-y divide-slate-800">
          {jobs.map((job) => (
            <div key={job.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <Link to={`/recruiter/jobs/${job.id}/applicants`}>
                  <h4 className="text-sm font-extrabold text-white hover:text-indigo-400 transition-colors">
                    {job.title}
                  </h4>
                </Link>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                  <span>{job.location || 'Remote'}</span>
                  <span>•</span>
                  <span>{job.jobType || 'Full-time'}</span>
                  <span>•</span>
                  <span>Exp: {job.experienceRequired || 0} yrs</span>
                </div>
              </div>

              <div className="flex items-center gap-4 self-end sm:self-center">
                <div className="text-right">
                  <span className="text-xs font-black text-indigo-400 block">
                    {job.applicantCount || 0} Applicants
                  </span>
                  <span className="text-[10px] text-slate-500">Ranked by Vector Fit</span>
                </div>

                <Link
                  to={`/recruiter/jobs/${job.id}/applicants`}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition-all"
                >
                  <span>Review Ranked Applicants</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
