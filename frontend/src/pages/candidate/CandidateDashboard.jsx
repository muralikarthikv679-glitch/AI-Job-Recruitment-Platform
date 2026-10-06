import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { candidateAPI, jobsAPI, applicationsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import ResumeUploadModal from './ResumeUploadModal';
import MatchScoreBadge from '../../components/MatchScoreBadge';
import {
  User,
  FileText,
  Briefcase,
  Layers,
  CheckCircle2,
  Clock,
  Award,
  UploadCloud,
  Edit3,
  MapPin,
  Phone,
  Mail,
  GraduationCap,
  ArrowRight,
  Target
} from 'lucide-react';

export default function CandidateDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [applications, setApplications] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [newSkill, setNewSkill] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [profileRes, appRes, jobsRes] = await Promise.all([
        candidateAPI.getProfile(),
        applicationsAPI.getMyApplications(),
        jobsAPI.getJobs({}),
      ]);

      setProfile(profileRes.data);
      setEditForm(profileRes.data);
      setApplications(appRes.data);

      // Top matching jobs sorted by match score
      const sorted = [...jobsRes.data]
        .filter((j) => j.matchScore !== null)
        .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
        .slice(0, 3);
      setRecommendedJobs(sorted);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await candidateAPI.updateProfile(editForm);
      setProfile(res.data);
      setIsEditing(false);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      const updatedSkills = [...(editForm.skills || []), newSkill.trim()];
      setEditForm({ ...editForm, skills: updatedSkills });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill) => {
    const updated = editForm.skills.filter((s) => s !== skill);
    setEditForm({ ...editForm, skills: updated });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-3">
        <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-400">Loading candidate portal...</p>
      </div>
    );
  }

  const shortlistedCount = applications.filter((a) => a.status === 'SHORTLISTED' || a.status === 'INTERVIEW_SCHEDULED').length;
  const hiredCount = applications.filter((a) => a.status === 'HIRED').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-100">
      {/* Top Banner with Profile & Action */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-extrabold text-2xl flex items-center justify-center uppercase shadow-lg shadow-indigo-600/30">
            {profile?.name?.charAt(0) || 'C'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black">{profile?.name}</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                Candidate Profile
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              {profile?.headline || 'Add your professional headline'}
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 mt-2">
              {profile?.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  {profile.location}
                </span>
              )}
              {profile?.experienceYears && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  {profile.experienceYears} Years Exp
                </span>
              )}
              {profile?.email && (
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  {profile.email}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload & Ingest Resume</span>
          </button>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <Edit3 className="w-4 h-4" />
            <span>{isEditing ? 'Cancel Editing' : 'Edit Profile'}</span>
          </button>
        </div>
      </div>

      {/* Stats Quick Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 bg-slate-900/80 rounded-3xl border border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Applied</span>
            <p className="text-2xl font-black text-white mt-1">{applications.length}</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-blue-950/50 border border-blue-500/30 text-blue-400 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 bg-slate-900/80 rounded-3xl border border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Shortlisted / Interview</span>
            <p className="text-2xl font-black text-amber-400 mt-1">{shortlistedCount}</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-amber-950/50 border border-amber-500/30 text-amber-400 flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 bg-slate-900/80 rounded-3xl border border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Offers Accepted</span>
            <p className="text-2xl font-black text-emerald-400 mt-1">{hiredCount}</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Edit Form Drawer if active */}
      {isEditing && (
        <form onSubmit={handleSaveProfile} className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-indigo-500/40 shadow-2xl space-y-4 animate-in fade-in">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-indigo-400" />
            Edit Profile Credentials & Skills
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Headline</label>
              <input
                type="text"
                value={editForm.headline || ''}
                onChange={(e) => setEditForm({ ...editForm, headline: e.target.value })}
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Experience (Years)</label>
              <input
                type="number"
                step="0.5"
                value={editForm.experienceYears || ''}
                onChange={(e) => setEditForm({ ...editForm, experienceYears: Number(e.target.value) })}
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Education</label>
              <input
                type="text"
                value={editForm.education || ''}
                onChange={(e) => setEditForm({ ...editForm, education: e.target.value })}
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Location</label>
              <input
                type="text"
                value={editForm.location || ''}
                onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Professional Summary</label>
            <textarea
              rows={3}
              value={editForm.summary || ''}
              onChange={(e) => setEditForm({ ...editForm, summary: e.target.value })}
              className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Skills Tags</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {editForm.skills?.map((s, idx) => (
                <span
                  key={idx}
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-950 text-indigo-300 border border-indigo-500/30 flex items-center gap-1"
                >
                  {s}
                  <button type="button" onClick={() => handleRemoveSkill(s)} className="hover:text-rose-400 font-bold">
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add skill tag..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                className="flex-1 p-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-500"
              >
                Add
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 shadow-md shadow-indigo-600/30"
            >
              {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      )}

      {/* Main Grid: Skills on Left, Top Matches on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Candidate Skills & Summary */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/80 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-400" />
                Technical Skills Vector Profile ({profile?.skills?.length || 0})
              </h3>
              <button
                onClick={() => setShowUploadModal(true)}
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300"
              >
                Re-Parse Resume →
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {profile?.skills && profile.skills.length > 0 ? (
                profile.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl text-xs font-bold bg-slate-800 text-slate-200 border border-slate-700 shadow-sm"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700 text-center w-full">
                  <p className="text-xs text-slate-400">No skills indexed yet.</p>
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="mt-2 text-xs font-bold text-indigo-400 hover:underline"
                  >
                    Upload Resume Document →
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-900/80 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              Summary & Credentials
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {profile?.summary || 'No summary added yet. Ingest your resume or click Edit Profile.'}
            </p>
            {profile?.education && (
              <div className="pt-3 border-t border-slate-800 flex items-center gap-2 text-xs text-slate-400 font-medium">
                <GraduationCap className="w-4 h-4 text-indigo-400" />
                <span>{profile.education}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Top Recommended Matches */}
        <div className="space-y-6">
          <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Target className="w-4 h-4 text-indigo-400" />
                Top Compatibility Openings
              </h3>
              <Link to="/jobs" className="text-xs font-bold text-indigo-400 hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {recommendedJobs.length > 0 ? (
                recommendedJobs.map((job) => (
                  <Link
                    key={job.id}
                    to={`/jobs/${job.id}`}
                    className="block p-3.5 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 hover:border-indigo-500/30 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <span className="text-[10px] font-bold text-indigo-400">{job.companyName}</span>
                        <h4 className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
                          {job.title}
                        </h4>
                        <span className="text-[10px] text-slate-400">{job.location || 'Remote'}</span>
                      </div>
                      <MatchScoreBadge score={job.matchScore} size="sm" showLabel={false} />
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-xs text-slate-500">No positions matched yet.</p>
              )}
            </div>

            <Link
              to="/candidate/applications"
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-colors flex items-center justify-center gap-1.5 mt-2"
            >
              <Layers className="w-3.5 h-3.5" />
              View Application Pipeline
            </Link>
          </div>
        </div>
      </div>

      {showUploadModal && (
        <ResumeUploadModal
          onComplete={loadDashboardData}
          onClose={() => setShowUploadModal(false)}
        />
      )}
    </div>
  );
}
