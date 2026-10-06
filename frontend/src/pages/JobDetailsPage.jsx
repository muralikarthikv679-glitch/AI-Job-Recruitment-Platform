import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { jobsAPI, applicationsAPI, candidateAPI, matchingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import MatchScoreBadge from '../components/MatchScoreBadge';
import MatchDetailsModal from '../components/MatchDetailsModal';
import {
  Briefcase,
  MapPin,
  Building,
  DollarSign,
  Calendar,
  Layers,
  CheckCircle2,
  ArrowLeft,
  Globe,
  Send,
  Target
} from 'lucide-react';

export default function JobDetailsPage() {
  const { id } = useParams();
  const { user, isCandidate } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [candidateProfile, setCandidateProfile] = useState(null);
  const [matchDetails, setMatchDetails] = useState(null);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState('');

  useEffect(() => {
    loadJobDetails();
  }, [id]);

  const loadJobDetails = async () => {
    setLoading(true);
    try {
      const res = await jobsAPI.getJobById(id);
      setJob(res.data);

      if (isCandidate) {
        // Check if already applied
        const appRes = await applicationsAPI.getMyApplications();
        const applied = appRes.data.some((a) => a.jobId === Number(id));
        setIsApplied(applied);

        // Fetch candidate profile for match breakdown
        const profileRes = await candidateAPI.getProfile();
        setCandidateProfile(profileRes.data);

        if (profileRes.data?.id) {
          const matchRes = await matchingAPI.previewMatch(profileRes.data.id, id);
          setMatchDetails(matchRes.data);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setApplying(true);
    try {
      await applicationsAPI.apply(id);
      setIsApplied(true);
      setNotificationMsg('Application successfully submitted! Your profile vector has been recorded.');
    } catch (err) {
      setNotificationMsg(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-3">
        <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-400">Loading position details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Job Not Found</h2>
        <Link to="/jobs" className="text-xs font-bold text-indigo-400">
          ← Back to all positions
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-slate-100">
      {/* Back link */}
      <Link
        to="/jobs"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-indigo-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Open Positions
      </Link>

      {notificationMsg && (
        <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-slate-900/90 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl text-xs font-bold bg-indigo-950/60 text-indigo-300 border border-indigo-500/30">
                {job.companyName}
              </span>
              {job.department && (
                <span className="text-xs text-slate-400 font-medium">
                  • {job.department}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {job.title}
            </h1>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                {job.location || 'Remote'}
              </span>
              <span className="flex items-center gap-1">
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
                <span className="flex items-center gap-1">
                  Required Exp: {job.experienceRequired} years
                </span>
              )}
            </div>
          </div>

          {/* Right Match Box for Candidates */}
          {isCandidate && matchDetails && (
            <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 shrink-0 flex flex-col items-center text-center space-y-2">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                Profile Compatibility
              </span>
              <MatchScoreBadge
                score={matchDetails.overallMatchScore}
                size="lg"
                onClick={() => setShowMatchModal(true)}
              />
              <button
                type="button"
                onClick={() => setShowMatchModal(true)}
                className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 underline decoration-indigo-500/50"
              >
                View Vector Analysis →
              </button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-slate-500 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            Requisition published {new Date(job.createdAt).toLocaleDateString()}
          </div>

          <div className="flex items-center gap-3">
            {isCandidate && (
              <button
                onClick={handleApply}
                disabled={isApplied || applying}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  isApplied
                    ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 cursor-default'
                    : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/30'
                }`}
              >
                {isApplied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Applied
                  </>
                ) : applying ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Apply for Position
                  </>
                )}
              </button>
            )}

            {!user && (
              <Link
                to="/login"
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/30"
              >
                Sign In to Apply
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Description & Requirements */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/80 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-400" />
              Role Description
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {job.description}
            </p>

            {job.responsibilities && (
              <div className="pt-4 border-t border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Key Responsibilities
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {job.responsibilities}
                </p>
              </div>
            )}
          </div>

          {/* Required Skills */}
          <div className="bg-slate-900/80 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              Required Skills & Technologies
            </h3>
            <div className="flex flex-wrap gap-2">
              {job.requiredSkills && job.requiredSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl text-xs font-bold bg-slate-800 text-slate-200 border border-slate-700 shadow-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Company Profile & Recruiter Info */}
        <div className="space-y-6">
          <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Building className="w-4 h-4 text-indigo-400" />
              Company Overview
            </h3>
            <div className="space-y-2 text-xs text-slate-300">
              <p className="font-bold text-white text-sm">{job.companyName}</p>
              {job.companyWebsite && (
                <a
                  href={job.companyWebsite}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-indigo-400 font-medium hover:underline"
                >
                  <Globe className="w-3.5 h-3.5" />
                  {job.companyWebsite}
                </a>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
              <p>• Verified Corporate Profile</p>
              <p>• Direct Recruiter Ingestion</p>
              <p>• Automated Screening Enabled</p>
            </div>
          </div>
        </div>
      </div>

      {/* Match details modal */}
      {showMatchModal && matchDetails && (
        <MatchDetailsModal
          matchData={matchDetails}
          jobTitle={job.title}
          candidateName={candidateProfile?.name}
          onClose={() => setShowMatchModal(false)}
        />
      )}
    </div>
  );
}
