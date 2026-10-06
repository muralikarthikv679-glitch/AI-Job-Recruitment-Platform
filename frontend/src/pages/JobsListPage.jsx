import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobsAPI, applicationsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import MatchScoreBadge from '../components/MatchScoreBadge';
import MatchDetailsModal from '../components/MatchDetailsModal';
import {
  Search,
  MapPin,
  Briefcase,
  SlidersHorizontal,
  DollarSign,
  Building,
  CheckCircle2,
  Layers,
  ArrowRight,
  Target
} from 'lucide-react';

export default function JobsListPage() {
  const { user, isCandidate } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [minMatchScore, setMinMatchScore] = useState(0);
  const [applyingJobId, setApplyingJobId] = useState(null);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [notificationMsg, setNotificationMsg] = useState('');
  const [selectedMatch, setSelectedMatch] = useState(null);

  useEffect(() => {
    fetchJobs();
    if (isCandidate) {
      fetchMyApplications();
    }
  }, [minMatchScore]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (keyword) params.keyword = keyword;
      if (location) params.location = location;
      if (jobType) params.jobType = jobType;
      if (minMatchScore > 0) params.minMatchScore = minMatchScore;

      const res = await jobsAPI.getJobs(params);
      setJobs(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyApplications = async () => {
    try {
      const res = await applicationsAPI.getMyApplications();
      const ids = new Set(res.data.map((app) => app.jobId));
      setAppliedJobIds(ids);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleApply = async (jobId) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    setApplyingJobId(jobId);
    try {
      await applicationsAPI.apply(jobId);
      setAppliedJobIds((prev) => new Set([...prev, jobId]));
      setNotificationMsg('Application submitted successfully! Your compatibility vector has been recorded.');
      setTimeout(() => setNotificationMsg(''), 4000);
    } catch (err) {
      setNotificationMsg(err.response?.data?.message || 'Failed to submit application');
      setTimeout(() => setNotificationMsg(''), 4000);
    } finally {
      setApplyingJobId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-100">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
            <Target className="w-3.5 h-3.5 text-indigo-400" />
            <span>Algorithmic Skill Matching</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Explore Open Job Requisitions
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
            {isCandidate
              ? 'Positions are automatically ranked by your resume compatibility score using TF-IDF vectorization and skill analysis.'
              : 'Browse active tech openings or sign in as a candidate to see personalized compatibility ratings.'}
          </p>
        </div>
      </div>

      {notificationMsg && (
        <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="bg-slate-900/90 p-5 rounded-3xl border border-slate-800 shadow-xl">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-5 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search by title, skill (e.g. Java, React, Python)..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="sm:col-span-3 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <MapPin className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Location / Remote"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="sm:col-span-2">
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="w-full py-2.5 px-3 bg-slate-800/80 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Job Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full h-full py-2.5 px-4 bg-indigo-600 text-white font-bold text-xs sm:text-sm rounded-xl hover:bg-indigo-500 shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-1.5"
            >
              <Search className="w-4 h-4" />
              Find Openings
            </button>
          </div>
        </form>

        {/* Candidate Match Filter Slider */}
        {isCandidate && (
          <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold text-slate-300">
                Filter by Minimum Compatibility Fit:
              </span>
              <span className="text-xs font-extrabold px-2 py-0.5 rounded-lg bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                {minMatchScore}% +
              </span>
            </div>
            <div className="w-full sm:w-64">
              <input
                type="range"
                min="0"
                max="90"
                step="10"
                value={minMatchScore}
                onChange={(e) => setMinMatchScore(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>

      {/* Jobs Listing */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-medium">Computing compatibility scores...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-slate-900/80 p-12 rounded-3xl border border-slate-800 text-center space-y-3">
          <Briefcase className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No matching positions found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search criteria or lowering the minimum fit filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {jobs.map((job) => {
            const isApplied = appliedJobIds.has(job.id);

            return (
              <div
                key={job.id}
                className="bg-slate-900/80 p-6 sm:p-7 rounded-3xl border border-slate-800 shadow-md hover:border-slate-700 hover:bg-slate-900 transition-all group"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left info */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-indigo-400 bg-indigo-950/60 px-2.5 py-0.5 rounded-lg border border-indigo-500/30">
                        {job.companyName}
                      </span>
                      {job.department && (
                        <span className="text-xs text-slate-400 font-medium">
                          • {job.department}
                        </span>
                      )}
                      <span className="text-xs text-slate-500">
                        • {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <Link to={`/jobs/${job.id}`}>
                      <h2 className="text-lg sm:text-xl font-black text-white group-hover:text-indigo-400 transition-colors">
                        {job.title}
                      </h2>
                    </Link>

                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-400">
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

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed pt-1">
                      {job.description}
                    </p>

                    {/* Skill Tags */}
                    {job.requiredSkills && job.requiredSkills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {job.requiredSkills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right side: Match Score & Apply action */}
                  <div className="flex lg:flex-col items-center lg:items-end justify-between gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800 shrink-0">
                    {isCandidate && job.matchScore !== null && job.matchScore !== undefined && (
                      <div className="flex flex-col items-start lg:items-end">
                        <MatchScoreBadge
                          score={job.matchScore}
                          size="md"
                          showLabel={true}
                        />
                        <span className="text-[10px] text-slate-500 mt-0.5">
                          Calculated from profile vector
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/jobs/${job.id}`}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
                      >
                        Details
                      </Link>

                      {isCandidate && (
                        <button
                          onClick={() => handleApply(job.id)}
                          disabled={isApplied || applyingJobId === job.id}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                            isApplied
                              ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 cursor-default'
                              : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/20'
                          }`}
                        >
                          {isApplied ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              Applied
                            </>
                          ) : applyingJobId === job.id ? (
                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <>
                              <span>Quick Apply</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedMatch && (
        <MatchDetailsModal
          matchData={selectedMatch}
          onClose={() => setSelectedMatch(null)}
        />
      )}
    </div>
  );
}
