import { fetchPublic, fetchWithAuth } from './api';

export const authApi = {
    // Public 엔드포인트 (인증 불필요)
    testPublic: () => fetchPublic('/api/auth/public'),
    
    // Protected 엔드포인트 (인증 필요)
    testProtected: () => fetchWithAuth('/api/auth/protected'),
};