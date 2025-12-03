import { Suspense, lazy } from 'react';
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Loading from './views/pages/common/Loading';
import { useAuth } from './contexts/AuthContext';

// 로그인 관련
import LoginLayout from './views/layouts/LoginLayout';
import Login from './views/pages/auth/LoginPage';

// 로그인 후 페이지
const LobbyLayout = lazy(() => import('./views/layouts/LobbyLayout'));
const TestPage = lazy(() => import('./views/pages/common/TestPage'));


function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  // 로그인 안됨 → 로그인 라우트만 제공
  if (!user) {
    return (
      <Routes>
        <Route element={<LoginLayout />}>
          <Route path="/login" element={<Login />} />
          {/* <Route path="/signup" element={<Signup />} /> */}
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // 로그인됨 → 메인 라우트 제공
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<LobbyLayout />}>
          <Route path="/TestPage" element={<TestPage />} />
          <Route path="/" element={<Navigate to="/TestPage" replace />} />
          {/* <Route path="/" element={<RoomList />} /> */}
        </Route>
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
