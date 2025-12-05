import { useState } from 'react';
import { getAuth } from 'firebase/auth';
import { authApi } from '../../../backend/authApi';

const TestPage = () => {
    const [publicResult, setPublicResult] = useState<string>('');
    const [protectedResult, setProtectedResult] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const testPublicApi = async () => {
        setLoading(true);
        try {
            const data = await authApi.testPublic();
            setPublicResult(JSON.stringify(data, null, 2));
        } catch (err) {
            setPublicResult(`Error: ${err}`);
        }
        setLoading(false);
    };

    const testProtectedApi = async () => {
        setLoading(true);
        try {
            const user = getAuth().currentUser;
            if (!user) {
                setProtectedResult('❌ 로그인이 필요합니다!');
                setLoading(false);
                return;
            }
            const data = await authApi.testProtected();
            setProtectedResult(JSON.stringify(data, null, 2));
        } catch (err) {
            setProtectedResult(`Error: ${err}`);
        }
        setLoading(false);
    };

    const user = getAuth().currentUser;

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h1>🧪 API Test Page</h1>
            
            <div style={{ marginBottom: '20px', padding: '10px', background: '#f0f0f0', borderRadius: '8px' }}>
                <strong>현재 로그인:</strong> {user ? `✅ ${user.email}` : '❌ 로그인 안됨'}
            </div>

            <div style={{ marginBottom: '20px' }}>
                <h3>1. Public API</h3>
                <button onClick={testPublicApi} disabled={loading}>
                    /api/auth/public 호출
                </button>
                {publicResult && <pre style={{ background: '#e8f5e9', padding: '10px' }}>{publicResult}</pre>}
            </div>

            <div style={{ marginBottom: '20px' }}>
                <h3>2. Protected API</h3>
                <button onClick={testProtectedApi} disabled={loading}>
                    /api/auth/protected 호출
                </button>
                {protectedResult && <pre style={{ background: '#e3f2fd', padding: '10px' }}>{protectedResult}</pre>}
            </div>
        </div>
    );
};

export default TestPage;