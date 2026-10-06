import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { chatAPI, candidateAPI, recruiterAPI, jobsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  MessageSquare,
  Send,
  ArrowLeft,
  User,
  Briefcase,
  Clock,
  CheckCircle2
} from 'lucide-react';

export default function ChatPage() {
  const [searchParams] = useSearchParams();
  const recipientUserId = searchParams.get('candidateId') || searchParams.get('userId');
  const jobId = searchParams.get('jobId');

  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadConversation();
  }, [recipientUserId, jobId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversation = async () => {
    if (!recipientUserId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      if (jobId) {
        const jobRes = await jobsAPI.getJobById(jobId);
        setJob(jobRes.data);
      }

      const msgRes = await chatAPI.getConversation(recipientUserId, jobId);
      setMessages(msgRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !recipientUserId) return;

    setSending(true);
    try {
      const payload = {
        recipientId: Number(recipientUserId),
        jobId: jobId ? Number(jobId) : null,
        content: newMessage.trim(),
      };

      const res = await chatAPI.sendMessage(payload);
      setMessages((prev) => [...prev, res.data]);
      setNewMessage('');
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-slate-100">
      <Link
        to={user?.role === 'RECRUITER' ? '/recruiter/dashboard' : '/candidate/applications'}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-indigo-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[75vh]">
        {/* Chat Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-indigo-600/30">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">
                Direct Recruiter & Candidate Communication
              </h3>
              {job && (
                <span className="text-xs text-indigo-400 font-bold flex items-center gap-1">
                  <Briefcase className="w-3 h-3" />
                  Requisition: {job.title}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-950/40">
          {loading ? (
            <div className="py-20 text-center space-y-2">
              <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-500">Loading conversation history...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-20 space-y-2">
              <MessageSquare className="w-10 h-10 text-slate-700 mx-auto" />
              <p className="text-xs font-bold text-slate-300">Start the conversation</p>
              <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                Send a direct message regarding interview scheduling, qualifications, or next steps.
              </p>
            </div>
          ) : (
            messages.map((m) => {
              const isMine = m.senderId === user?.userId;

              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[10px] text-slate-500 mb-1 px-1">
                    {isMine ? 'You' : m.senderName} • {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <div
                    className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                      isMine
                        ? 'bg-indigo-600 text-white rounded-tr-none'
                        : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Box */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-800 bg-slate-900 flex gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={!recipientUserId}
            className="flex-1 p-3 bg-slate-800 border border-slate-700 rounded-2xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={sending || !newMessage.trim() || !recipientUserId}
            className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 disabled:opacity-50 transition-all flex items-center gap-1.5"
          >
            {sending ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
