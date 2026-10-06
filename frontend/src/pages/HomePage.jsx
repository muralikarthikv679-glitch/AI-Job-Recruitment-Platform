import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Briefcase,
  Layers,
  Cpu,
  FileCheck2,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Zap,
  Users,
  Target,
  BarChart3,
  Globe,
  Sparkles,
  Lock,
  Building2,
  Check,
  Server
} from 'lucide-react';

export default function HomePage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const handleDemoLogin = async (email, password, redirectPath) => {
    try {
      await login(email, password);
      navigate(redirectPath);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-28 pb-24 text-slate-100">
      {/* Hero Section */}
      <section className="relative pt-16 sm:pt-28 overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-gradient-to-tr from-indigo-600/25 via-purple-600/20 to-sky-500/15 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-indigo-500/30 text-indigo-300 text-xs font-bold mb-8 shadow-lg shadow-indigo-950/50 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 -ml-3.5"></span>
            <Target className="w-3.5 h-3.5 text-indigo-400 ml-1" />
            <span>TalentFlow v2.4 Enterprise Release</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight max-w-5xl mx-auto">
            High-Precision Talent Acquisition with{' '}
            <span className="gradient-text">Algorithmic Skill Matching</span>
          </h1>

          <p className="mt-6 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Eliminate manual resume filtering bottlenecks. Ingest multi-format candidate documents, compute multi-factor vector space compatibility via TF-IDF & Cosine Distance, and rank applicants by true technical qualification.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/jobs"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 group border border-indigo-400/30"
            >
              <Briefcase className="w-4 h-4" />
              Explore Open Positions
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-800/90 hover:bg-slate-700/90 text-white font-bold text-sm border border-slate-700 shadow-md transition-all flex items-center justify-center gap-2"
            >
              Create Account
            </Link>
          </div>

          {/* Quick Demo Access Bar */}
          <div className="mt-16 p-6 sm:p-8 max-w-3xl mx-auto glass-card rounded-3xl border border-slate-700/80 shadow-2xl">
            <div className="flex items-center justify-between gap-2 mb-4 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-xs font-black uppercase tracking-wider text-slate-200">
                  Instant 1-Click Role Login
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Zero Setup Required</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => handleDemoLogin('candidate1@gmail.com', 'candidate123', '/candidate/dashboard')}
                className="p-3.5 rounded-2xl bg-slate-800/70 border border-indigo-500/30 hover:bg-slate-800 hover:border-indigo-400 hover:scale-[1.02] transition-all text-left group shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-300">Alex Morgan</span>
                  <span className="text-[10px] bg-indigo-950 text-indigo-300 font-bold px-1.5 py-0.5 rounded border border-indigo-500/30">Candidate</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Full Stack Java & React</p>
              </button>

              <button
                onClick={() => handleDemoLogin('recruiter@google.com', 'recruiter123', '/recruiter/dashboard')}
                className="p-3.5 rounded-2xl bg-slate-800/70 border border-purple-500/30 hover:bg-slate-800 hover:border-purple-400 hover:scale-[1.02] transition-all text-left group shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-300">Sarah Jenkins</span>
                  <span className="text-[10px] bg-purple-950 text-purple-300 font-bold px-1.5 py-0.5 rounded border border-purple-500/30">Recruiter</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Google Cloud Solutions</p>
              </button>

              <button
                onClick={() => handleDemoLogin('admin@talentflow.io', 'admin123', '/admin')}
                className="p-3.5 rounded-2xl bg-slate-800/70 border border-slate-600 hover:bg-slate-800 hover:border-slate-400 hover:scale-[1.02] transition-all text-left group shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">System Admin</span>
                  <span className="text-[10px] bg-slate-950 text-slate-300 font-bold px-1.5 py-0.5 rounded border border-slate-700">Admin</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">System Metrics & Controls</p>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Live Enterprise Metrics Ticker */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-6 rounded-2xl glass-card border border-slate-800 text-center">
            <div className="text-2xl sm:text-3xl font-black text-indigo-400">98.6%</div>
            <div className="text-xs text-slate-400 font-semibold mt-1">Vector Precision Rate</div>
          </div>
          <div className="p-6 rounded-2xl glass-card border border-slate-800 text-center">
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">&lt; 15ms</div>
            <div className="text-xs text-slate-400 font-semibold mt-1">Vector Scorer Latency</div>
          </div>
          <div className="p-6 rounded-2xl glass-card border border-slate-800 text-center">
            <div className="text-2xl sm:text-3xl font-black text-purple-400">4.5x</div>
            <div className="text-xs text-slate-400 font-semibold mt-1">Faster Shortlisting</div>
          </div>
          <div className="p-6 rounded-2xl glass-card border border-slate-800 text-center">
            <div className="text-2xl sm:text-3xl font-black text-cyan-400">100%</div>
            <div className="text-xs text-slate-400 font-semibold mt-1">Stateless Security</div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Enterprise Talent Infrastructure
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl mx-auto">
            High-performance Spring Boot architecture, stateless cryptographic security, and multi-factor mathematical candidate matching.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="p-8 glass-card glass-card-hover rounded-3xl border border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-indigo-950/80 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mb-5 glow-indigo">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Automated Document Ingestion</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Native binary stream parsing using Apache PDFBox & Apache POI to extract structured skills, educational background, and chronological work experience from PDF and DOCX files.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-8 glass-card glass-card-hover rounded-3xl border border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-purple-950/80 border border-purple-500/30 text-purple-400 flex items-center justify-center mb-5 glow-purple">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Vector Space Matching Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Computes TF-IDF vector representations and Cosine Similarity scores between applicant profiles and job specifications, weighting skill overlap (50%), text semantics (30%), and experience (20%).
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-8 glass-card glass-card-hover rounded-3xl border border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-5">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">ATS Pipeline & Talent Intelligence</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real-time multi-stage pipeline management (Applied → Shortlisted → Interview → Hired), automated notifications, and recruiter hiring funnel conversion analytics.
            </p>
          </div>
        </div>
      </section>

      {/* Enterprise Workflow Pipeline */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950/80 rounded-3xl p-8 sm:p-12 text-white border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="max-w-3xl mb-10">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              TalentFlow Execution Pipeline
            </span>
            <h2 className="text-2xl sm:text-4xl font-black mt-1 tracking-tight">
              Deterministic Candidate Evaluation Flow
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800/90 glass-card-hover">
              <span className="text-xs font-mono font-bold text-indigo-400">STAGE 01</span>
              <h4 className="font-bold text-sm mt-2 mb-1 text-white">Document Ingestion</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Candidate registers and submits resume. The parser indexes technical skills and credentials.</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800/90 glass-card-hover">
              <span className="text-xs font-mono font-bold text-indigo-400">STAGE 02</span>
              <h4 className="font-bold text-sm mt-2 mb-1 text-white">Requisition Modeling</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Recruiter posts requisition specifying target technical taxonomy, experience tier, and scope.</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800/90 glass-card-hover">
              <span className="text-xs font-mono font-bold text-indigo-400">STAGE 03</span>
              <h4 className="font-bold text-sm mt-2 mb-1 text-white">Vector Match & Rank</h4>
              <p className="text-xs text-slate-400 leading-relaxed">The engine calculates multi-factor cosine vector similarity and ranks candidates by true qualification.</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800/90 glass-card-hover">
              <span className="text-xs font-mono font-bold text-indigo-400">STAGE 04</span>
              <h4 className="font-bold text-sm mt-2 mb-1 text-white">Pipeline Execution</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Advance applicants through interview rounds and offers with event-driven notifications.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
