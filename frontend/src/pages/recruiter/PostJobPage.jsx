import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { jobsAPI } from '../../services/api';
import {
  Briefcase,
  ArrowLeft,
  CheckCircle2,
  Plus,
  X,
  Building,
  DollarSign,
  MapPin,
  Clock,
  Layers,
  Target
} from 'lucide-react';

export default function PostJobPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: '',
    department: '',
    description: '',
    responsibilities: '',
    requiredSkills: [],
    experienceRequired: 3.0,
    location: '',
    jobType: 'Full-time',
    salaryRange: '$120,000 - $150,000 / year',
    status: 'ACTIVE',
  });

  const [skillInput, setSkillInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const suggestedSkills = [
    'Java', 'Spring Boot', 'React', 'TypeScript', 'JavaScript',
    'Python', 'Machine Learning', 'Docker', 'Kubernetes', 'AWS',
    'MySQL', 'PostgreSQL', 'Microservices', 'REST API', 'Git', 'Redis'
  ];

  useEffect(() => {
    if (isEditMode) {
      loadJobToEdit();
    }
  }, [id]);

  const loadJobToEdit = async () => {
    setLoading(true);
    try {
      const res = await jobsAPI.getJobById(id);
      setFormData(res.data);
    } catch (e) {
      setError('Failed to load requisition details for editing');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = (skill) => {
    const s = (skill || skillInput).trim();
    if (s && !formData.requiredSkills.includes(s)) {
      setFormData({
        ...formData,
        requiredSkills: [...formData.requiredSkills, s],
      });
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      requiredSkills: formData.requiredSkills.filter((s) => s !== skillToRemove),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.requiredSkills.length === 0) {
      setError('Please specify at least 1 required technical skill.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      if (isEditMode) {
        await jobsAPI.updateJob(id, formData);
      } else {
        await jobsAPI.createJob(formData);
      }
      navigate('/recruiter/jobs');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save job requisition.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-3">
        <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-400">Loading requisition form...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-slate-100">
      <Link
        to="/recruiter/jobs"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-indigo-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Managed Requisitions
      </Link>

      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-2xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
          <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
          <span>Requisition Engineering</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
          {isEditMode ? 'Edit Requisition' : 'Create Job Opening'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Specify target technical skills, responsibilities, and experience tier for vector matching
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-bold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-slate-900/90 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6">
        {/* Title and Department */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
              Job Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Senior Full Stack Java Engineer"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
              Department / Business Unit
            </label>
            <input
              type="text"
              placeholder="e.g. Enterprise Cloud Solutions"
              value={formData.department || ''}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full p-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Location, Job Type, Exp, Salary */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
              Location
            </label>
            <input
              type="text"
              placeholder="San Francisco / Remote"
              value={formData.location || ''}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full p-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
              Job Type
            </label>
            <select
              value={formData.jobType}
              onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
              className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
              Required Exp (Yrs)
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              value={formData.experienceRequired || 0}
              onChange={(e) => setFormData({ ...formData, experienceRequired: Number(e.target.value) })}
              className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
              Salary Range
            </label>
            <input
              type="text"
              placeholder="$130k - $160k"
              value={formData.salaryRange || ''}
              onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })}
              className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Required Skills Management */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-300 uppercase">
            Required Technical Skills (Used for TF-IDF & Skill Vector Matching) *
          </label>

          <div className="flex flex-wrap gap-2 mb-2 p-3 bg-slate-800/80 border border-slate-700 rounded-2xl min-h-[50px]">
            {formData.requiredSkills.map((skill, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-indigo-950/60 text-indigo-300 border border-indigo-500/30 shadow-sm"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:text-rose-400 font-bold"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
            {formData.requiredSkills.length === 0 && (
              <span className="text-xs text-slate-500 italic self-center">
                No skills added yet. Add below or pick suggestions.
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type a skill (e.g. Spring Boot, PyTorch, Docker) and press Enter..."
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
              className="flex-1 p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={() => handleAddSkill()}
              className="px-5 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-500 shadow-md shadow-indigo-600/30"
            >
              Add Skill
            </button>
          </div>

          {/* Quick Suggestions Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase mr-1">Quick Add:</span>
            {suggestedSkills.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleAddSkill(s)}
                className="text-[11px] font-medium px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              >
                + {s}
              </button>
            ))}
          </div>
        </div>

        {/* Job Description */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
            Requisition Description *
          </label>
          <textarea
            required
            rows={5}
            placeholder="Describe the opportunity, core project scope, and company vision..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
          />
        </div>

        {/* Responsibilities */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
            Key Responsibilities & Qualifications
          </label>
          <textarea
            rows={4}
            placeholder="- Architect scalable microservices&#10;- Optimize database performance&#10;- Collaborate with cross-functional product teams"
            value={formData.responsibilities || ''}
            onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
            className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
            Requisition Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full sm:w-60 p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs sm:text-sm font-semibold text-white"
          >
            <option value="ACTIVE">Active (Ingesting Applications)</option>
            <option value="CLOSED">Closed (Archived)</option>
            <option value="DRAFT">Draft</option>
          </select>
        </div>

        {/* Submit button */}
        <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
          <Link
            to="/recruiter/jobs"
            className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-bold hover:bg-slate-800"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 shadow-md shadow-indigo-600/30 disabled:opacity-50"
          >
            {submitting ? 'Saving Requisition...' : isEditMode ? 'Update Requisition' : 'Publish Requisition'}
          </button>
        </div>
      </form>
    </div>
  );
}
