import axios from 'axios';
import type {
  AuthResponse,
  User,
  Recipe,
  RecipesResponse,
  MealPlan,
  ShoppingList,
} from '@/types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authApi = {
  register: async (data: { email: string; password: string; name?: string }): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (data: { email: string; password: string }): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },
};

// Users API
export const usersApi = {
  getMe: async (): Promise<User> => {
    const response = await api.get('/users/me');
    return response.data;
  },

  updateMe: async (data: { email?: string; password?: string; name?: string }): Promise<User> => {
    const response = await api.put('/users/me', data);
    return response.data;
  },
};

// Recipes API
export const recipesApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    difficulty?: string;
    cookingTime?: number;
  }): Promise<RecipesResponse> => {
    const response = await api.get('/recipes', { params });
    return response.data;
  },

  getOne: async (id: string): Promise<Recipe> => {
    const response = await api.get(`/recipes/${id}`);
    return response.data;
  },

  create: async (formData: FormData): Promise<Recipe> => {
    const response = await api.post('/recipes', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  update: async (id: string, formData: FormData): Promise<Recipe> => {
    const response = await api.put(`/recipes/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/recipes/${id}`);
  },
};

// Meal Plan API
export const mealPlanApi = {
  getAll: async (startDate: string, endDate: string): Promise<MealPlan[]> => {
    const response = await api.get('/meal-plan', {
      params: { startDate, endDate },
    });
    return response.data;
  },

  create: async (data: {
    recipeId: string;
    date: string;
    mealType: string;
  }): Promise<MealPlan> => {
    const response = await api.post('/meal-plan', data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/meal-plan/${id}`);
  },
};

// Shopping List API
export const shoppingListApi = {
  get: async (): Promise<ShoppingList> => {
    const response = await api.get('/shopping-list');
    return response.data;
  },

  generate: async (startDate: string, endDate: string): Promise<ShoppingList> => {
    const response = await api.post('/shopping-list/generate', {
      startDate,
      endDate,
    });
    return response.data;
  },

  toggleItem: async (id: string): Promise<void> => {
    await api.patch(`/shopping-list/items/${id}/toggle`);
  },
};

export default api;