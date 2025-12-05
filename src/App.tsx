import { Suspense, lazy } from 'react';
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Loading from './views/pages/common/Loading';
import { useAuth } from './contexts/AuthContext';

// 로그인 관련 (로그인 전에만 로드)
import LoginLayout from './views/layouts/LoginLayout';
import Login from './views/pages/auth/LoginPage';

// 로그인 후 레이아웃들 (Lazy Loading)
const LobbyLayout = lazy(() => import('./views/layouts/LobbyLayout'));
const GameRoomLayout = lazy(() => import('./views/layouts/GameRoomLayout'));
const GamingLayout = lazy(() => import('./views/layouts/GamingLayout'));

// 로비 페이지들
const RoomListPage = lazy(() => import('./views/pages/lobby/RoomListPage'));
const TestPage = lazy(() => import('./views/pages/common/TestPage'));
// 대기실 페이지들
const WaitingRoomPage = lazy(() => import('./views/pages/room/WaitingRoomPage'));

// 게임 페이지들 (추후 게임별로 분리)
// const YachtGame = lazy(() => import('./views/pages/game/YachtGame'));


function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  // 로그인 안됨 → 로그인 라우트만 제공 (LoginLayout만 로드)
  if (!user) {
    return (
      <Routes>
        <Route element={<LoginLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // 로그인됨 → 각 상황에 맞는 레이아웃 제공
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* 로비 레이아웃 - 방 목록, 상점, 통계 등 */}
        <Route element={<LobbyLayout />}>
          <Route path="/" element={<RoomListPage />} />
          <Route path="/notice" element={<div>공지사항 페이지 (준비중)</div>} />
          <Route path="/stats" element={<div>통계 페이지 (준비중)</div>} />
          <Route path="/shop" element={<div>아이템샵 페이지 (준비중)</div>} />
          <Route path="/help" element={<div>도움말 페이지 (준비중)</div>} />
          <Route path="/testpage" element={<TestPage />} />
        </Route>

        {/* 대기실 레이아웃 - 방 입장 후 게임 시작 전 */}
        <Route element={<GameRoomLayout />}>
          <Route path="/room/:roomId" element={<WaitingRoomPage />} />
        </Route>

        {/* 게임 레이아웃 - 게임 진행 중 */}
        <Route element={<GamingLayout />}>
          <Route path="/game/:roomId" element={<div>게임 화면 (준비중)</div>} />
          {/* 추후 게임별 라우트 추가 */}
          {/* <Route path="/game/:roomId/yacht" element={<YachtGame />} /> */}
        </Route>

        {/* 로그인 페이지 접근 시 홈으로 리다이렉트 */}
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
