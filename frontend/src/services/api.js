import axios from 'axios';

export const CLOUD_BACKEND_URL = 'https://ai-job-recruitment-platform-7p1t.onrender.com/api';
export const LOCAL_BACKEND_URL = 'http://localhost:8080/api';

export function resolveBaseUrl() {
  const custom = typeof window !== 'undefined' ? localStorage.getItem('talentflow_api_url') : null;
  if (custom && custom.trim()) {
    return custom.trim().endsWith('/') ? custom.trim().slice(0, -1) : custom.trim();
  }

  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && envUrl.trim()) {
    return envUrl.trim().endsWith('/') ? envUrl.trim().slice(0, -1) : envUrl.trim();
  }

  // If running locally in dev or local browser, default to '/api' (proxied to localhost:8080)
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return '/api';
  }

  return CLOUD_BACKEND_URL;
}

const api = axios.create({
  baseURL: resolveBaseUrl(),
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Allow updating the active base URL dynamically
export function setCustomApiBaseUrl(url) {
  if (typeof window !== 'undefined') {
    if (url) {
      localStorage.setItem('talentflow_api_url', url);
    } else {
      localStorage.removeItem('talentflow_api_url');
    }
  }
  api.defaults.baseURL = resolveBaseUrl();
}

export function getActiveApiBaseUrl() {
  return api.defaults.baseURL || resolveBaseUrl();
}

// Attach JWT Bearer token to every request if available
api.interceptors.request.use(
  (config) => {
    config.baseURL = resolveBaseUrl();
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for session expiry handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Optional: Handle 401 unauth
    }
    return Promise.reject(error);
  }
);

export const healthAPI = {
  checkHealth: async (targetUrl) => {
    const url = targetUrl || getActiveApiBaseUrl();
    const cleanUrl = url.endsWith('/') ? url.slice(0, -1) : url;
    return axios.get(`${cleanUrl}/health`, { timeout: 10000 });
  },
};

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

export const candidateAPI = {
  getProfile: () => api.get('/candidate/profile'),
  getProfileById: (id) => api.get(`/candidate/profile/${id}`),
  updateProfile: (profileData) => api.put('/candidate/profile', profileData),
  uploadResume: (formData) => api.post('/candidate/resume', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

export const recruiterAPI = {
  getProfile: () => api.get('/recruiter/profile'),
  getProfileById: (id) => api.get(`/recruiter/profile/${id}`),
  updateProfile: (profileData) => api.put('/recruiter/profile', profileData),
};

export const jobsAPI = {
  getJobs: (params) => api.get('/jobs', { params }),
  getJobById: (id) => api.get(`/jobs/${id}`),
  getMyJobs: () => api.get('/jobs/recruiter/my-jobs'),
  createJob: (jobData) => api.post('/jobs', jobData),
  updateJob: (id, jobData) => api.put(`/jobs/${id}`, jobData),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
};

export const applicationsAPI = {
  apply: (jobId) => api.post(`/applications/apply/${jobId}`),
  getMyApplications: () => api.get('/applications/my-applications'),
  getApplicantsForJob: (jobId) => api.get(`/applications/job/${jobId}`),
  getAllRecruiterApplications: () => api.get('/applications/recruiter/all'),
  updateStatus: (id, data) => api.put(`/applications/${id}/status`, data),
  getMatchScoreDetails: (id) => api.get(`/applications/${id}/match-score`),
};

export const matchingAPI = {
  previewMatch: (candidateId, jobId) =>
    api.get('/matching/preview', { params: { candidateId, jobId } }),
};

export const analyticsAPI = {
  getRecruiterAnalytics: () => api.get('/analytics/recruiter'),
};

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  toggleUserStatus: (userId) => api.put(`/admin/users/${userId}/toggle-status`),
};

export const notificationAPI = {
  getNotifications: () => api.get('/notifications'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
};

export const chatAPI = {
  getConversation: (userId, jobId) =>
    api.get(`/chat/conversation/${userId}`, { params: { jobId } }),
  sendMessage: (messageData) => api.post('/chat/send', messageData),
};

export default api;
