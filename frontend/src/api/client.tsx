import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
});

api.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export const login = (data: LoginRequest): Promise<AxiosResponse<LoginResponse>> => {
  return api.post('/api/auth/login', data);
};

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
}

export interface RegisterResponse {
  id: number;
  username: string;
  email: string;
}

export const register = (data: RegisterRequest): Promise<AxiosResponse<RegisterResponse>> => {
  return api.post('/api/auth/register', data);
};

export interface CurrentUserResponse {
  id: number;
  username: string;
  email: string;
}

export const getCurrentUser = (): Promise<AxiosResponse<CurrentUserResponse>> => {
  return api.get('/api/auth/me');
};

export interface UploadDocumentResponse {
  id: number;
  name: string;
  size: number;
  uploaded_at: string;
}

export const uploadDocument = (file: File): Promise<AxiosResponse<UploadDocumentResponse>> => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/api/documents/upload', formData);
};

export interface Document {
  id: number;
  name: string;
  size: number;
  uploaded_at: string;
}

export const listDocuments = (): Promise<AxiosResponse<Document[]>> => {
  return api.get('/api/documents');
};

export const deleteDocument = (id: number): Promise<AxiosResponse<void>> => {
  return api.delete(`/api/documents/${id}`);
};

export interface CreateConversationRequest {
  title: string;
}

export interface CreateConversationResponse {
  id: number;
  title: string;
  created_at: string;
}

export const createConversation = (
  data: CreateConversationRequest
): Promise<AxiosResponse<CreateConversationResponse>> => {
  return api.post('/api/conversations', data);
};

export interface Conversation {
  id: number;
  title: string;
  created_at: string;
}

export const listConversations = (): Promise<AxiosResponse<Conversation[]>> => {
  return api.get('/api/conversations');
};

export interface AIQueryRequest {
  query: string;
  session_id: string;
  user_id: string;
}

export interface AIQueryResponse {
  answer: string;
  sources: string[];
}

export const aiQuery = (data: AIQueryRequest): Promise<AxiosResponse<AIQueryResponse>> => {
  return api.post('/api/ai/query', data);
};

// Auto-added stubs for functions a page imported but the client omitted.
export const createDocument = async (data?: any) => {
  const res = await api.post('/api/documents', data);
  return res.data;
};
export const deleteConversation = async (id: string) => {
  const res = await api.delete(`/api/conversations/${id}`);
  return res.data;
};
export const getConversation = async (id: string) => {
  const res = await api.get(`/api/conversations/${id}`);
  return res.data;
};
export const getDocumentById = async (id: string) => {
  const res = await api.get(`/api/documentbyids/${id}`);
  return res.data;
};
export const updateConversation = async (id: string, data?: any) => {
  const res = await api.put(`/api/conversations/${id}`, data);
  return res.data;
};
export const updateDocument = async (id: string, data?: any) => {
  const res = await api.put(`/api/documents/${id}`, data);
  return res.data;
};
