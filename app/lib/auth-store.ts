'use client';

import { create } from 'zustand';

interface User {
    id: number;
    username: string;
    email: string;
}

interface AuthStore {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    hasInitialized: boolean;
    setAuth: (user: User, token: string) => void;
    logout: () => void;
    initAuth: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    hasInitialized: false,

    setAuth: (user: User, token: string) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        set({ user, token, isAuthenticated: true, hasInitialized: true });
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ user: null, token: null, isAuthenticated: false, hasInitialized: true });
    },

    initAuth: () => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            const user = localStorage.getItem('user');
            if (token && user) {
                set({
                    token,
                    user: JSON.parse(user),
                    isAuthenticated: true,
                    hasInitialized: true,
                });
                return;
            }
        }
        set({ user: null, token: null, isAuthenticated: false, hasInitialized: true });
    },
}));
