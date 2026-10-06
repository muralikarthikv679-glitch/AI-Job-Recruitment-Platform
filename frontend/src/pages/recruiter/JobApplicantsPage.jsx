import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { applicationsAPI, jobsAPI } from '../../services/api';
import MatchScoreBadge from '../../components/MatchScoreBadge';
import StatusPipelineBadge from '../../components/StatusPipelineBadge';
import MatchDetailsModal from '../../components/MatchDetailsModal';
import {
  Users,
  ArrowLeft,
  Calendar,
  MessageSquare,
  FileText,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Clock,
  Send,
  Edit2,
  Target
} from 'lucide-react';

export default function JobApplicantsPage() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [statusModalApp, setStatusModalApp] = useState(null);
  const [newStatus, setNewStatus] = useState('SHORTLISTED');
  const [notes, setNotes] = useState('');
  const [savingStatus, setSavingStatus] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState('');

  useEffect(() => {
    loadJobAndApplicants();
  }, [jobId]);

  const loadJobAndApplicants = async () => {
    setLoading(true);
    try {
      const [jobRes, appsRes] = await Promise.all([
        jobsAPI.getJobById(jobId),
        applicationsAPI.getApplicantsForJob(jobId),
      ]);
      setJob(jobRes.data);
      setApplicants(appsRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenStatusModal = (app) => {
    setStatusModalApp(app);
    setNewStatus(app.status);
    setNotes(app.recruiterNotes || '');
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!statusModalApp) return;

    setSavingStatus(true);
    try {
      await applicationsAPI.updateStatus(statusModalApp.id, {
        status: newStatus,
        recruiterNotes: notes,
      });

      setNotificationMsg(`Candidate status moved to ${newStatus}. Notification sent!`);
      setTimeout(() => setNotificationMsg(''), 4000);
      setStatusModalApp(null);
      loadJobAndApplicants();
    } catch (e) {
      console.error(e);
    } finally {
      setSavingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-3">
        <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-400">Ranking candidates via TF-IDF & Skill Vectoring Engine...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-slate-100">
      <Link
        to="/recruiter/jobs"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-indigo-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Managed Requisitions
      </Link>

      {/* Header Info */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
            <Target className="w-3.5 h-3.5 text-indigo-400" />
            <span>Automated Candidate Ranking</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Applicants for: {job?.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Applicants automatically ranked by composite TF-IDF, Skill Overlap & Experience Score
          </p>
        </div>

        <div className="px-5 py-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
          <span className="text-xs text-slate-400 block">Total Applicants</span>
          <span className="text-2xl font-black text-white">{applicants.length}</span>
        </div>
      </div>

      {notificationMsg && (
        <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* Ranked Applicants List */}
      {applicants.length === 0 ? (
        <div className="bg-slate-900/80 p-12 rounded-3xl border border-slate-800 text-center space-y-3">
          <Users className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No applicants for this requisition yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Candidates who apply will automatically be scored and ranked here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {applicants.map((app, index) => {
            const rank = index + 1;

            return (
              <div
                key={app.id}
                className="bg-slate-900/80 p-6 sm:p-7 rounded-3xl border border-slate-800 shadow-sm space-y-4 hover:border-slate-700 transition-all group"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Rank & Candidate Details */}
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 shadow-sm ${
                        rank === 1
                          ? 'bg-amber-950/70 text-amber-300 border border-amber-500/40'
                          : rank === 2
                          ? 'bg-slate-800 text-slate-200 border border-slate-700'
                          : rank === 3
                          ? 'bg-orange-950/70 text-orange-300 border border-orange-500/40'
                          : 'bg-slate-900 text-slate-500 border border-slate-800'
                      }`}
                    >
                      #{rank}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-black text-white">
                          {app.candidateName}
                        </h3>
                        <StatusPipelineBadge status={app.status} />
                      </div>

                      <p className="text-xs text-slate-300 font-medium">
                        {app.candidateHeadline || 'Candidate Profile'}
                      </p>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 pt-1">
                        {app.candidateExperienceYears !== null && (
                          <span className="flex items-center gap-1 text-slate-400 font-medium">
                            <Clock className="w-3.5 h-3.5" />
                            {app.candidateExperienceYears} yrs experience
                          </span>
                        )}
                        {app.candidateEducation && (
                          <span className="flex items-center gap-1 text-slate-400 font-medium">
                            <GraduationCap className="w-3.5 h-3.5" />
                            {app.candidateEducation}
                          </span>
                        )}
                        <span>• Applied {new Date(app.appliedDate).toLocaleDateString()}</span>
                      </div>

                      {/* Candidate Skills Pills */}
                      {app.candidateSkills && app.candidateSkills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {app.candidateSkills.slice(0, 8).map((skill, idx) => {
                            const isReq = job?.requiredSkills?.some(
                              (s) => s.toLowerCase() === skill.toLowerCase()
                            );

                            return (
                              <span
                                key={idx}
                                className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-lg ${
                                  isReq
                                    ? 'bg-emerald-950/60 text-emerald-300 font-bold border border-emerald-500/30'
                                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                                }`}
                              >
                                {skill}
                              </span>
                            );
                          })}
                          {app.candidateSkills.length > 8 && (
                            <span className="text-[11px] text-slate-500 self-center">
                              +{app.candidateSkills.length - 8} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Match Score & Stage Controller */}
                  <div className="flex flex-col items-start lg:items-end gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800 shrink-0">
                    <MatchScoreBadge
                      score={app.matchScore}
                      size="lg"
                      onClick={() =>
                        setSelectedMatch({
                          overallMatchScore: app.matchScore,
                          skillMatchScore: app.skillScore,
                          tfidfSimilarityScore: app.textSimilarityScore,
                          experienceMatchScore: app.experienceScore,
                          qualitativeExplanation: app.matchExplanation,
                          matchedSkills: app.candidateSkills?.filter((s) =>
                            job?.requiredSkills?.some((js) => js.toLowerCase() === s.toLowerCase())
                          ) || [],
                          missingSkills: job?.requiredSkills?.filter(
                            (js) => !app.candidateSkills?.some((s) => s.toLowerCase() === js.toLowerCase())
                          ) || [],
                        })
                      }
                    />

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenStatusModal(app)}
                        className="px-3.5 py-1.5 rounded-xl bg-indigo-950/60 hover:bg-indigo-900 text-indigo-300 font-bold text-xs border border-indigo-500/30 flex items-center gap-1.5 transition-all"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        Update Stage
                      </button>

                      <Link
                        to={`/chat?jobId=${jobId}&candidateId=${app.candidateUserId}`}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 flex items-center gap-1.5 transition-all"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                        Chat
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Recruiter Notes snippet if present */}
                {app.recruiterNotes && (
                  <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-2xl text-xs text-slate-300">
                    <span className="font-bold text-slate-200">Recruiter Note: </span>
                    {app.recruiterNotes}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Match Breakdown Modal */}
      {selectedMatch && (
        <MatchDetailsModal
          matchData={selectedMatch}
          jobTitle={job?.title}
          onClose={() => setSelectedMatch(null)}
        />
      )}

      {/* Status Update Modal */}
      {statusModalApp && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-700 animate-in zoom-in-95 text-slate-100">
            <h3 className="text-base font-black text-white mb-1">
              Advance Candidate Pipeline Stage
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Moving {statusModalApp.candidateName} will automatically trigger an automated alert.
            </p>

            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Select Pipeline Stage
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-bold text-white"
                >
                  <option value="APPLIED">1. Applied (Under Review)</option>
                  <option value="SHORTLISTED">2. Shortlisted</option>
                  <option value="INTERVIEW_SCHEDULED">3. Interview Scheduled</option>
                  <option value="HIRED">4. Offer Extended / Hired</option>
                  <option value="REJECTED">5. Application Closed / Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Internal Notes & Evaluation (Optional)
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Cleared round 1 technical interview, advancing to architecture design."
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStatusModalApp(null)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-bold hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingStatus}
                  className="w-1/2 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 shadow-md shadow-indigo-600/30"
                >
                  {savingStatus ? 'Saving...' : 'Confirm Stage'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
