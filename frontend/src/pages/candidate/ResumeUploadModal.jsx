import React, { useState, useRef } from 'react';
import { candidateAPI } from '../../services/api';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  X,
  Plus,
  AlertCircle,
  Briefcase,
  Layers
} from 'lucide-react';

export default function ResumeUploadModal({ onComplete, onClose }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      if (
        selected.type === 'application/pdf' ||
        selected.name.endsWith('.pdf') ||
        selected.name.endsWith('.docx') ||
        selected.name.endsWith('.doc') ||
        selected.name.endsWith('.txt')
      ) {
        setFile(selected);
        setError('');
      } else {
        setError('Please select a valid PDF, DOCX, or text file.');
      }
    }
  };

  const handleUploadAndParse = async () => {
    if (!file) return;
    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await candidateAPI.uploadResume(formData);
      setExtractedData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to parse resume. Please check document formatting.');
    } finally {
      setUploading(false);
    }
  };

  const handleAddSkill = () => {
    if (newSkillInput.trim() && extractedData) {
      const updated = [...(extractedData.extractedSkills || []), newSkillInput.trim()];
      setExtractedData({ ...extractedData, extractedSkills: updated });
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    if (extractedData) {
      const updated = extractedData.extractedSkills.filter((s) => s !== skillToRemove);
      setExtractedData({ ...extractedData, extractedSkills: updated });
    }
  };

  const handleFinalSave = async () => {
    if (extractedData) {
      try {
        await candidateAPI.updateProfile({
          headline: extractedData.headline,
          summary: extractedData.summary,
          phone: extractedData.phone,
          education: extractedData.education,
          experienceYears: extractedData.experienceYears,
          skills: extractedData.extractedSkills,
        });
        onComplete();
        onClose();
      } catch (err) {
        setError('Failed to update profile');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative bg-slate-900 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-700/80 animate-in zoom-in-95 duration-200 text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-white">
              Automated Resume Ingestion
            </h3>
            <p className="text-xs text-slate-400">
              Upload your PDF/DOCX resume to auto-index technical skills and credentials
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!extractedData ? (
          /* Upload State */
          <div className="space-y-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${
                file
                  ? 'border-indigo-500 bg-indigo-950/20'
                  : 'border-slate-700 hover:border-indigo-500 hover:bg-slate-800/40'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc,.txt"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 text-indigo-400 flex items-center justify-center mx-auto mb-3">
                {file ? <FileText className="w-6 h-6" /> : <UploadCloud className="w-6 h-6" />}
              </div>

              {file ? (
                <div>
                  <p className="text-xs sm:text-sm font-bold text-white">{file.name}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready to analyze
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-xs sm:text-sm font-bold text-slate-200">
                    Click to browse or drop your resume document
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Supports PDF, DOCX, or TXT up to 15MB
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={handleUploadAndParse}
              disabled={!file || uploading}
              className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Parsing Document Structure...</span>
                </>
              ) : (
                <>
                  <Layers className="w-4 h-4" />
                  <span>Parse & Populate Profile</span>
                </>
              )}
            </button>
          </div>
        ) : (
          /* Extracted Review State */
          <div className="space-y-4 animate-in fade-in">
            <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl flex items-center gap-2 text-emerald-300 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Document indexed successfully! Verify extracted credentials:</span>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Extracted Headline
                </label>
                <input
                  type="text"
                  value={extractedData.headline || ''}
                  onChange={(e) => setExtractedData({ ...extractedData, headline: e.target.value })}
                  className="w-full p-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                    Experience (Years)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={extractedData.experienceYears || ''}
                    onChange={(e) =>
                      setExtractedData({ ...extractedData, experienceYears: Number(e.target.value) })
                    }
                    className="w-full p-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={extractedData.phone || ''}
                    onChange={(e) => setExtractedData({ ...extractedData, phone: e.target.value })}
                    className="w-full p-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Extracted Education
                </label>
                <input
                  type="text"
                  value={extractedData.education || ''}
                  onChange={(e) => setExtractedData({ ...extractedData, education: e.target.value })}
                  className="w-full p-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>

              {/* Skills Tags Extracted */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Indexed Skills ({extractedData.extractedSkills?.length || 0})
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {extractedData.extractedSkills?.map((skill, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-950/60 text-indigo-300 border border-indigo-500/30"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="hover:text-rose-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                {/* Add Custom Skill Tag */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add missing skill (e.g. Docker, Redis)..."
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                    className="flex-1 p-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-3 py-1.5 bg-slate-700 text-white rounded-xl text-xs font-bold hover:bg-slate-600"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setExtractedData(null)}
                className="w-1/3 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-bold hover:bg-slate-800"
              >
                Re-upload
              </button>
              <button
                type="button"
                onClick={handleFinalSave}
                className="w-2/3 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 shadow-md shadow-indigo-600/30"
              >
                Save & Update Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
