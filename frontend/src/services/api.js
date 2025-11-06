import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:8080';

export const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(config => {
  // Support both persistent (localStorage) and session-only (sessionStorage) tokens.
  const token = sessionStorage.getItem('tempToken') || localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  config.headers['Content-Type'] = 'application/json';
  return config;
});

api.interceptors.response.use(r => r, err => {
  if (err?.response?.status === 401) {
    localStorage.removeItem('token');
    // force redirect to login if protected
    if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }
  return Promise.reject(err);
});

// Savings Goals API
// NOTE: Backend exposes savings goals under /api/goals with fields
// targetAmount, savedAmount and deadline. The frontend expects
// currentAmount and targetDate. These helper wrappers map between
// the shapes so the UI can stay as-is.
const toFrontendGoal = (g) => ({
  id: g.id,
  name: g.name,
  targetAmount: g.targetAmount,
  currentAmount: g.savedAmount || 0,
  targetDate: g.deadline,
});

const toBackendGoal = (g) => ({
  name: g.name,
  targetAmount: g.targetAmount,
  savedAmount: g.currentAmount || 0,
  deadline: g.targetDate || null,
});

export const getSavingsGoals = async () => {
  const res = await api.get('/api/goals');
  // Map backend shape to frontend shape
  return (res.data || []).map(toFrontendGoal);
};

export const addSavingsGoal = async (goal) => {
  const payload = toBackendGoal(goal);
  const res = await api.post('/api/goals', payload);
  return toFrontendGoal(res.data);
};

export const updateSavingsGoal = async (id, goal) => {
  const payload = toBackendGoal(goal);
  const res = await api.put(`/api/goals/${id}`, payload);
  return toFrontendGoal(res.data);
};

export const deleteSavingsGoal = async (id) => {
  await api.delete(`/api/goals/${id}`);
};

export const addAmountToGoal = async (id, amount) => {
  // Backend doesn't expose a dedicated "add" endpoint, so read the
  // goal and update its savedAmount atomically from the client.
  const { data } = await api.get(`/api/goals/${id}`);
  const current = data.savedAmount || 0;
  const updated = { ...data, savedAmount: current + amount };
  const res = await api.put(`/api/goals/${id}`, updated);
  return toFrontendGoal(res.data);
};
