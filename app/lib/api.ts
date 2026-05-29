'use client';

import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2727/api';

const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add interceptor to include JWT token
apiClient.interceptors.request.use((config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth APIs
export const authAPI = {
    register: (data: { username: string; email: string; password: string }) =>
        apiClient.post('/v1/auth/register', data),

    login: (data: { username: string; password: string }) =>
        apiClient.post('/v1/auth/login', data),
};

// Recipe APIs
export const recipeAPI = {
    getAllRecipes: () => apiClient.get('/recipes'),

    getRecipeById: (id: number) => apiClient.get(`/recipes/${id}`),

    addRecipe: (data: any) => apiClient.post('/recipes', data),

    updateRecipe: (id: number, data: any) =>
        apiClient.put(`/recipes/${id}`, data),

    deleteRecipe: (id: number) => apiClient.delete(`/recipes/${id}`),

    likeRecipe: (id: number) => apiClient.post(`/recipes/${id}/like`),

    dislikeRecipe: (id: number) => apiClient.post(`/recipes/${id}/dislike`),

    commentRecipe: (id: number, data: { comment: string }) =>
        apiClient.post(`/recipes/${id}/comments`, data),
};

export default apiClient;
