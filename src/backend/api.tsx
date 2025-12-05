import { getAuth } from 'firebase/auth';

export const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

// 공통 fetch 함수 (토큰 자동 포함)
export const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
    const auth = getAuth();
    const user = auth.currentUser;
    
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (user) {
        const token = await user.getIdToken();
        (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
};

// 인증 없이 호출
export const fetchPublic = async (endpoint: string, options: RequestInit = {}) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
};