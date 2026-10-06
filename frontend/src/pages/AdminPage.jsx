import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import {
  ShieldCheck,
  Users,
  Briefcase,
  Layers,
  CheckCircle2,
  XCircle,
  UserCheck,
  UserX,
  Mail,
  Calendar,
  Lock
} from 'lucide-react';

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getUsers(),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUser = async (userId) => {
    setActionLoading(userId);
    try {
      await adminAPI.toggleUserStatus(userId);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, enabled: !u.enabled } : u))
      );
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-3">
        <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-400">Loading system admin portal...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-100">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>Root System Administration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Platform Operations & User Controls
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            System metrics, user account moderation, and platform security oversight
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 bg-slate-900/80 rounded-3xl border border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Total Accounts</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{stats?.totalUsers || 0}</span>
            <span className="text-xs text-slate-400">
              ({stats?.totalCandidates || 0} Cand / {stats?.totalRecruiters || 0} Recr)
            </span>
          </div>
        </div>

        <div className="p-5 bg-slate-900/80 rounded-3xl border border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Job Postings</span>
            <Briefcase className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{stats?.totalJobs || 0}</span>
            <span className="text-xs text-emerald-400 font-bold">
              ({stats?.activeJobs || 0} Active)
            </span>
          </div>
        </div>

        <div className="p-5 bg-slate-900/80 rounded-3xl border border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Applications Vectorized</span>
            <Layers className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">
              {stats?.totalApplications || 0}
            </span>
            <span className="text-xs text-slate-400">TF-IDF Processed</span>
          </div>
        </div>

        <div className="p-5 bg-slate-900/80 rounded-3xl border border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Security</span>
            <Lock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-base font-black text-emerald-400">Stateless JWT</span>
            <span className="text-xs text-slate-400">BCrypt 256-bit</span>
          </div>
        </div>
      </div>

      {/* Users Management Table */}
      <div className="bg-slate-900/80 rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-white">Registered Platform Accounts</h3>
            <p className="text-xs text-slate-400">Manage candidate and recruiter active permissions</p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-500/30">
            {users.length} Users
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-800">
              <tr>
                <th className="py-3 px-6">User</th>
                <th className="py-3 px-6">Email</th>
                <th className="py-3 px-6">Role</th>
                <th className="py-3 px-6">Joined Date</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-6 font-bold text-white flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold text-xs flex items-center justify-center uppercase">
                      {u.name.charAt(0)}
                    </div>
                    <span>{u.name}</span>
                  </td>
                  <td className="py-4 px-6 text-slate-300">{u.email}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`font-bold px-2 py-0.5 rounded-md ${
                        u.role === 'ADMIN'
                          ? 'bg-slate-800 text-white border border-slate-700'
                          : u.role === 'RECRUITER'
                          ? 'bg-purple-950/60 text-purple-300 border border-purple-500/30'
                          : 'bg-indigo-950/60 text-indigo-300 border border-indigo-500/30'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-400">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6">
                    {u.enabled ? (
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-bold text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded-md border border-rose-500/30">
                        <XCircle className="w-3 h-3" /> Disabled
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    {u.role !== 'ADMIN' && (
                      <button
                        onClick={() => handleToggleUser(u.id)}
                        disabled={actionLoading === u.id}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                          u.enabled
                            ? 'bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30'
                            : 'bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {actionLoading === u.id
                          ? '...'
                          : u.enabled
                          ? 'Deactivate'
                          : 'Activate'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
