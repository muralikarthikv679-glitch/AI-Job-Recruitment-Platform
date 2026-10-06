import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationsAPI } from '../../services/api';
import StatusPipelineBadge from '../../components/StatusPipelineBadge';
import MatchScoreBadge from '../../components/MatchScoreBadge';
import MatchDetailsModal from '../../components/MatchDetailsModal';
import {
  Layers,
  Building,
  Calendar,
  MessageSquare,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Target
} from 'lucide-react';

export default function CandidateApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState(null);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const res = await applicationsAPI.getMyApplications();
      setApplications(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const stages = [
    { key: 'APPLIED', label: '1. Applied' },
    { key: 'SHORTLISTED', label: '2. Shortlisted' },
    { key: 'INTERVIEW_SCHEDULED', label: '3. Interview' },
    { key: 'HIRED', label: '4. Offer / Hired' },
  ];

  const getStageIndex = (status) => {
    if (status === 'APPLIED') return 0;
    if (status === 'SHORTLISTED') return 1;
    if (status === 'INTERVIEW_SCHEDULED') return 2;
    if (status === 'HIRED') return 3;
    return -1;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-3">
        <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-400">Loading your applications pipeline...</p>
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
            <span>Workflow Pipeline Tracking</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            My Active Applications ({applications.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Track stage progressions, vector compatibility scores, and recruiter feedback
          </p>
        </div>

        <Link
          to="/jobs"
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all self-start sm:self-auto"
        >
          Explore More Positions →
        </Link>
      </div>

      {applications.length === 0 ? (
        <div className="bg-slate-900/80 p-12 rounded-3xl border border-slate-800 text-center space-y-3">
          <Layers className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No active applications yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Discover matching job positions and submit your profile in one click!
          </p>
          <Link
            to="/jobs"
            className="inline-block mt-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 shadow-md shadow-indigo-600/20"
          >
            Explore Positions Now
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map((app) => {
            const currentStageIdx = getStageIndex(app.status);
            const isRejected = app.status === 'REJECTED';

            return (
              <div
                key={app.id}
                className="bg-slate-900/80 p-6 sm:p-7 rounded-3xl border border-slate-800 shadow-md space-y-5 hover:border-slate-700 transition-colors"
              >
                {/* Top Title & Status Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-indigo-400 bg-indigo-950/60 px-2.5 py-0.5 rounded-lg border border-indigo-500/30">
                        {app.companyName}
                      </span>
                      <span className="text-xs text-slate-500">
                        • Applied on {new Date(app.appliedDate).toLocaleDateString()}
                      </span>
                    </div>
                    <Link to={`/jobs/${app.jobId}`}>
                      <h2 className="text-lg font-black text-white hover:text-indigo-400 transition-colors">
                        {app.jobTitle}
                      </h2>
                    </Link>
                  </div>

                  <div className="flex items-center gap-3">
                    <MatchScoreBadge
                      score={app.matchScore}
                      size="md"
                      onClick={() =>
                        setSelectedMatch({
                          overallMatchScore: app.matchScore,
                          skillMatchScore: app.skillScore,
                          tfidfSimilarityScore: app.textSimilarityScore,
                          experienceMatchScore: app.experienceScore,
                          qualitativeExplanation: app.matchExplanation,
                          matchedSkills: app.candidateSkills?.filter((s) =>
                            app.jobRequiredSkills?.some((js) => js.toLowerCase() === s.toLowerCase())
                          ) || [],
                          missingSkills: app.jobRequiredSkills?.filter(
                            (js) => !app.candidateSkills?.some((s) => s.toLowerCase() === js.toLowerCase())
                          ) || [],
                        })
                      }
                    />
                    <StatusPipelineBadge status={app.status} />
                  </div>
                </div>

                {/* Visual Pipeline Stepper */}
                {!isRejected ? (
                  <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {stages.map((stage, idx) => {
                        const isCompleted = currentStageIdx >= idx;
                        const isCurrent = currentStageIdx === idx;

                        return (
                          <div
                            key={stage.key}
                            className={`p-2.5 rounded-xl text-center text-xs font-bold transition-all ${
                              isCurrent
                                ? 'bg-indigo-600 text-white shadow-md'
                                : isCompleted
                                ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                                : 'bg-slate-900 text-slate-600 border border-slate-800'
                            }`}
                          >
                            <span className="block truncate">{stage.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-800/60 border border-slate-700 rounded-2xl text-slate-400 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-slate-500" />
                    <span>Application Archived / Closed for this requisition</span>
                  </div>
                )}

                {/* Recruiter Notes snippet if present */}
                {app.recruiterNotes && (
                  <div className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-slate-300">
                    <span className="font-bold text-indigo-300 block mb-0.5">Recruiter Feedback / Notes:</span>
                    <p className="italic leading-relaxed">{app.recruiterNotes}</p>
                  </div>
                )}

                {/* Footer Action */}
                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Last updated {app.updatedDate ? new Date(app.updatedDate).toLocaleDateString() : 'Recently'}
                  </span>

                  <Link
                    to={`/chat?jobId=${app.jobId}&candidateId=${app.candidateUserId}`}
                    className="font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Message Recruiter →
                  </Link>
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
