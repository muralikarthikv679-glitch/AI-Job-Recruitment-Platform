import axios from 'axios';

const PROD_BACKEND_URL = 'https://ai-job-recruitment-platform-7p1t.onrender.com/api';
const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? '/api' : PROD_BACKEND_URL);
const API_BASE_URL = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT Bearer token to every request if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
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
      // Token expired or invalid
      // localStorage.removeItem('token');
      // localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

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
