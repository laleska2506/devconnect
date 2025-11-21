import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (name: string, email: string, password: string, role: string) => {
    const response = await apiClient.post('/auth/register', { name, email, password, role });
    return response.data;
  },
  getMe: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};

interface ProjectFilters {
  status?: string;
  budget_min?: number;
  budget_max?: number;
}

interface CreateProjectData {
  title: string;
  description: string;
  budgetMin: number;
  budgetMax: number;
}

interface ProposalData {
  message: string;
  amount: number;
}

interface UpdateProfileData {
  bio?: string;
  skills?: string[];
  hourlyRate?: number;
}

interface ProfileFilters {
  skills?: string;
  role?: string;
  min_rating?: number;
}

export const projectsApi = {
  list: async (filters?: ProjectFilters) => {
    const response = await apiClient.get('/projects', { params: filters });
    return response.data;
  },
  get: async (id: string) => {
    const response = await apiClient.get(`/projects/${id}`);
    return response.data;
  },
  create: async (data: CreateProjectData) => {
    const response = await apiClient.post('/projects', data);
    return response.data;
  },
  apply: async (projectId: string, data: ProposalData) => {
    const response = await apiClient.post(`/projects/${projectId}/apply`, data);
    return response.data;
  },
};

export const profilesApi = {
  get: async (id: string) => {
    const response = await apiClient.get(`/profiles/${id}`);
    return response.data;
  },
  update: async (id: string, data: UpdateProfileData) => {
    const response = await apiClient.put(`/profiles/${id}`, data);
    return response.data;
  },
  search: async (filters?: ProfileFilters) => {
    const response = await apiClient.get('/profiles', { params: filters });
    return response.data;
  },
};

export default apiClient;

