import React from 'react';
import { X, CheckCircle2, AlertCircle, Cpu, BookOpen, Clock, Target, Layers } from 'lucide-react';

export default function MatchDetailsModal({ matchData, jobTitle, candidateName, onClose }) {
  if (!matchData) return null;

  const {
    overallMatchScore,
    skillMatchScore,
    tfidfSimilarityScore,
    experienceMatchScore,
    matchedSkills = [],
    missingSkills = [],
    qualitativeExplanation,
    fitCategory,
  } = matchData;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative bg-slate-900 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-700/80 animate-in zoom-in-95 duration-200 text-slate-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-white">
              Skill Compatibility & Vector Breakdown
            </h3>
            <p className="text-xs text-slate-400">
              {candidateName ? `${candidateName} • ` : ''}
              {jobTitle || 'Requirement Compatibility'}
            </p>
          </div>
        </div>

        {/* Big Overall Score Banner */}
        <div className="bg-gradient-to-r from-indigo-950/70 via-purple-950/50 to-slate-900/80 p-5 rounded-2xl border border-indigo-500/30 mb-6 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
              Overall Compatibility Score
            </span>
            <div className="flex items-baseline gap-2.5 mt-0.5">
              <span className="text-3xl font-black text-white">
                {Math.round(overallMatchScore)}%
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-indigo-600 text-white shadow-sm">
                {fitCategory || 'Evaluated'}
              </span>
            </div>
          </div>
          <Layers className="w-10 h-10 text-indigo-400/40" />
        </div>

        {/* 3 Metric Progress Bars */}
        <div className="space-y-4 mb-6">
          <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
            Scoring Formula Breakdown
          </h4>

          {/* Skill Overlap */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-300 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                Target Skills Alignment (Weight: 50%)
              </span>
              <span className="text-white font-bold">{Math.round(skillMatchScore || 0)}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, skillMatchScore || 0))}%` }}
              />
            </div>
          </div>

          {/* TF-IDF Content Similarity */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                TF-IDF Cosine Vector Similarity (Weight: 30%)
              </span>
              <span className="text-white font-bold">{Math.round(tfidfSimilarityScore || 0)}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, tfidfSimilarityScore || 0))}%` }}
              />
            </div>
          </div>

          {/* Experience Match */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                Experience Seniority Match (Weight: 20%)
              </span>
              <span className="text-white font-bold">{Math.round(experienceMatchScore || 0)}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, experienceMatchScore || 0))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Skills Tag Cloud */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-emerald-950/30 border border-emerald-500/30 rounded-2xl">
            <h5 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Verified Skills ({matchedSkills.length})
            </h5>
            <div className="flex flex-wrap gap-1.5">
              {matchedSkills.length > 0 ? (
                matchedSkills.map((s, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-emerald-900/60 text-emerald-200 border border-emerald-700/50"
                  >
                    {s}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500 italic">No exact skill overlap</span>
              )}
            </div>
          </div>

          <div className="p-4 bg-rose-950/30 border border-rose-500/30 rounded-2xl">
            <h5 className="text-xs font-bold text-rose-400 flex items-center gap-1.5 mb-2">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              Missing / Gap Areas ({missingSkills.length})
            </h5>
            <div className="flex flex-wrap gap-1.5">
              {missingSkills.length > 0 ? (
                missingSkills.map((s, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-rose-900/60 text-rose-200 border border-rose-700/50"
                  >
                    {s}
                  </span>
                ))
              ) : (
                <span className="text-xs text-emerald-400 font-semibold italic">All required skills matched!</span>
              )}
            </div>
          </div>
        </div>

        {/* Qualitative Explanation */}
        {qualitativeExplanation && (
          <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-2xl mb-6">
            <h5 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              Algorithmic Fit Summary
            </h5>
            <p className="text-xs text-slate-300 leading-relaxed">
              {qualitativeExplanation.replace(/\*\*/g, '').replace(/🎯|⚖️|⚠️/g, '').trim()}
            </p>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-colors shadow-lg shadow-indigo-600/20"
        >
          Close Analysis
        </button>
      </div>
    </div>
  );
}
