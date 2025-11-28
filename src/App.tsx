import { Suspense } from 'react';
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Loading from './views/pages/common/Loading';
// import { useResponsiveLogger } from "./utils/useResponsiveLogger";

// Layouts
import LoginLayout from './views/layouts/LoginLayout';
import LobbyLayout from './views/layouts/LobbyLayout';
// import WaitingRoomLayout from '../src/layouts/WaitingRoomLayout';
// import PlayRoomLayout from '../src/layouts/PlayRoomLayout';

// Pages
import Login from './views/pages/auth/LoginPage';
import TestPage from './views/pages/common/TestPage';
// import RoomList from './pages/RoomList';
// import WaitingRoom from './pages/WaitingRoom';
// import useAuthCheck from "./hooks/useAuthCheck.tsx";
// import UserProfileEditor from "./pages/UserProfileEditor.tsx";


function App() {
  return (
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* 로그인 레이아웃 */}
          <Route element={<LoginLayout />}>
            <Route path="/login" element={<Login />} />
            {/* <Route path="/signup" element={<Signup />} /> */}
          </Route>

          {/* 로비/기본 레이아웃 */}
          <Route element={<LobbyLayout />}>
            <Route path="/TestPage" element={<TestPage/>} />
            {/* <Route path="/" element={<RoomList />} /> */}
          </Route>

          {/* 기본 경로 → 로그인으로 리다이렉트 */}
          <Route path="/" element={<Navigate to="/login" />} />
          {/* 없는 페이지 리다이렉트 */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Suspense>
  );
}

export default App;
