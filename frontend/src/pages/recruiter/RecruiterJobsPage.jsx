import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobsAPI } from '../../services/api';
import {
  Briefcase,
  PlusCircle,
  Users,
  MapPin,
  DollarSign,
  Calendar,
  Layers,
  ArrowRight,
  Trash2,
  Edit,
  Clock
} from 'lucide-react';

export default function RecruiterJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const res = await jobsAPI.getMyJobs();
      setJobs(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (id) => {
    if (window.confirm('Are you sure you want to delete this job requisition?')) {
      try {
        await jobsAPI.deleteJob(id);
        loadJobs();
      } catch (e) {
        console.error(e);
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-3">
        <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-400">Loading job requisitions...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-100">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Requisitions Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Manage Open Requisitions ({jobs.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Review applicant ranking, edit requirements, or publish new role profiles
          </p>
        </div>

        <Link
          to="/recruiter/post-job"
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Requisition</span>
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="bg-slate-900/80 p-12 rounded-3xl border border-slate-800 text-center space-y-3">
          <Briefcase className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No active job requisitions</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Create your first opening to start receiving automatically ranked candidate matches!
          </p>
          <Link
            to="/recruiter/post-job"
            className="inline-block mt-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 shadow-md shadow-indigo-600/20"
          >
            Create Job Requisition
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-slate-900/80 p-6 sm:p-7 rounded-3xl border border-slate-800 shadow-sm hover:border-slate-700 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-indigo-400 bg-indigo-950/60 px-2.5 py-0.5 rounded-lg border border-indigo-500/30">
                    {job.companyName}
                  </span>
                  <span className="text-xs text-slate-500">
                    • Posted {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    job.status === 'ACTIVE'
                      ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    {job.status}
                  </span>
                </div>

                <Link to={`/recruiter/jobs/${job.id}/applicants`}>
                  <h3 className="text-lg font-black text-white hover:text-indigo-400 transition-colors">
                    {job.title}
                  </h3>
                </Link>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                  <span className="flex items-center gap-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    {job.location || 'Remote'}
                  </span>
                  <span className="flex items-center gap-1 font-medium">
                    <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                    {job.jobType || 'Full-time'}
                  </span>
                  {job.salaryRange && (
                    <span className="flex items-center gap-1 font-bold text-emerald-400">
                      <DollarSign className="w-3.5 h-3.5" />
                      {job.salaryRange}
                    </span>
                  )}
                  {job.experienceRequired !== null && (
                    <span className="flex items-center gap-1 font-medium">
                      Exp: {job.experienceRequired} yrs
                    </span>
                  )}
                </div>

                {/* Skill badges */}
                {job.requiredSkills && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {job.requiredSkills.map((s, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800 shrink-0">
                <Link
                  to={`/recruiter/jobs/${job.id}/applicants`}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition-all"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Ranked Applicants ({job.applicantCount || 0})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  to={`/recruiter/edit-job/${job.id}`}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                  title="Edit Requisition"
                >
                  <Edit className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => handleDeleteJob(job.id)}
                  className="p-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-500/30 transition-colors"
                  title="Delete Requisition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
