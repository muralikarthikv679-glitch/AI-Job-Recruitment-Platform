import React from 'react';
import { Layers, Code2, Database, Cpu, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
                <Layers className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-white text-lg tracking-tight">
                Talent<span className="text-indigo-400">Flow</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enterprise Applicant Tracking System & Vectorized Skill-Matching Engine engineered for high-volume recruitment workflows.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Enterprise Core</h4>
            <ul className="text-xs space-y-2 text-slate-400">
              <li className="hover:text-slate-200 transition-colors">Automated Document Parsing Engine</li>
              <li className="hover:text-slate-200 transition-colors">TF-IDF Vector Cosine Scorer</li>
              <li className="hover:text-slate-200 transition-colors">Algorithmic Candidate Ranking</li>
              <li className="hover:text-slate-200 transition-colors">Multi-Stage ATS Pipeline Tracking</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Architecture</h4>
            <ul className="text-xs space-y-2 text-slate-400">
              <li className="flex items-center gap-1.5"><Code2 className="w-3.5 h-3.5 text-indigo-400"/> Spring Boot 3.3 (Java 17/21+)</li>
              <li className="flex items-center gap-1.5"><Database className="w-3.5 h-3.5 text-emerald-400"/> Spring Data JPA & Hibernate</li>
              <li className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-purple-400"/> Vector Similarity Engine</li>
              <li className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-cyan-400"/> Stateless JWT & RBAC</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Security & Compliance</h4>
            <p className="text-xs leading-relaxed text-slate-400">
              Built with zero-trust role isolation, BCrypt cryptographic password hashing, and documented REST OpenAPI 3.0 endpoints.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 TalentFlow Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <span>Spring Boot Architecture</span>
            <span>•</span>
            <span>RESTful OpenAPI 3.0</span>
            <span>•</span>
            <span>Enterprise Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
