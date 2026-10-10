import React, { useState, useEffect } from 'react';
import { healthAPI, getActiveApiBaseUrl, setCustomApiBaseUrl, CLOUD_BACKEND_URL, LOCAL_BACKEND_URL } from '../services/api';
import { AlertCircle, RefreshCw, Server, CheckCircle2, Settings, ExternalLink } from 'lucide-react';

export default function BackendStatusAlert({ error, onRetry }) {
  const [activeUrl, setActiveUrl] = useState(getActiveApiBaseUrl());
  const [checking, setChecking] = useState(false);
  const [pingStatus, setPingStatus] = useState(null); // 'SUCCESS', 'FAILED', null
  const [showConfig, setShowConfig] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    setActiveUrl(getActiveApiBaseUrl());
  }, []);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && checking) {
      handleTestConnection();
    }
    return () => clearTimeout(timer);
  }, [countdown, checking]);

  const handleTestConnection = async (targetUrl = activeUrl) => {
    setChecking(true);
    setPingStatus(null);
    try {
      await healthAPI.checkHealth(targetUrl);
      setPingStatus('SUCCESS');
      if (onRetry) {
        setTimeout(() => onRetry(), 800);
      }
    } catch (e) {
      setPingStatus('FAILED');
    } finally {
      setChecking(false);
    }
  };

  const handleStartWakeCountdown = () => {
    setCountdown(20);
    setChecking(true);
  };

  const handleSelectUrl = (url) => {
    setCustomApiBaseUrl(url);
    setActiveUrl(getActiveApiBaseUrl());
    setPingStatus(null);
    handleTestConnection(url || getActiveApiBaseUrl());
  };

  const isLocal = activeUrl.includes('localhost') || activeUrl.includes('127.0.0.1') || activeUrl === '/api';

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-rose-500/30 p-4 space-y-3 shadow-xl backdrop-blur-md">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 shrink-0 mt-0.5">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h4 className="text-xs sm:text-sm font-bold text-rose-200">
              {error || 'Unable to connect to TalentFlow Backend Service'}
            </h4>
            <button
              type="button"
              onClick={() => setShowConfig(!showConfig)}
              className="text-[11px] font-semibold text-slate-400 hover:text-indigo-400 flex items-center gap-1 transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>{showConfig ? 'Hide Settings' : 'Server Settings'}</span>
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            {isLocal
              ? 'Connecting to local backend. Make sure your Spring Boot server is running on port 8080.'
              : 'Free-tier cloud backends spin down when idle and take ~30-50 seconds to boot up on initial request.'}
          </p>

          <div className="flex items-center gap-2 mt-2.5 text-[11px] text-slate-400">
            <Server className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="truncate">
              Target: <code className="text-indigo-300 font-mono bg-slate-800 px-1.5 py-0.5 rounded">{activeUrl}</code>
            </span>
            {pingStatus === 'SUCCESS' && (
              <span className="text-emerald-400 font-bold flex items-center gap-1 ml-auto">
                <CheckCircle2 className="w-3.5 h-3.5" /> Online
              </span>
            )}
            {pingStatus === 'FAILED' && (
              <span className="text-rose-400 font-bold flex items-center gap-1 ml-auto">
                <AlertCircle className="w-3.5 h-3.5" /> Unreachable
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/80">
        <button
          type="button"
          disabled={checking || countdown > 0}
          onClick={() => handleTestConnection()}
          className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${checking ? 'animate-spin' : ''}`} />
          <span>{checking ? 'Checking Connection...' : 'Ping Server / Retry'}</span>
        </button>

        {!isLocal && (
          <button
            type="button"
            disabled={countdown > 0}
            onClick={handleStartWakeCountdown}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 flex items-center gap-1.5 transition-all"
          >
            <span>{countdown > 0 ? `Auto-retrying in ${countdown}s...` : 'Wake Cloud Backend (~30s)'}</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => handleSelectUrl(isLocal ? CLOUD_BACKEND_URL : LOCAL_BACKEND_URL)}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs border border-slate-700 flex items-center gap-1.5 ml-auto transition-all"
        >
          <span>Switch to {isLocal ? 'Cloud (Render)' : 'Local (localhost:8080)'}</span>
        </button>
      </div>

      {/* Server Config Accordion */}
      {showConfig && (
        <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs space-y-2 animate-in fade-in">
          <label className="block font-bold text-slate-300">Custom Backend API URL</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. http://localhost:8080/api or https://your-backend.com/api"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="flex-1 p-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={() => {
                if (customInput.trim()) {
                  handleSelectUrl(customInput.trim());
                  setCustomInput('');
                }
              }}
              className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs"
            >
              Apply
            </button>
            <button
              type="button"
              onClick={() => handleSelectUrl(null)}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg text-xs border border-slate-700"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
