import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import RoomListPage from './features/lobby/RoomListPage';
import ProtectedRoute from './components/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/rooms" replace />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/rooms',
    element: (
      <ProtectedRoute>
        <RoomListPage />
      </ProtectedRoute>
    ),
  },
  // 추후 추가될 라우트들
  // {
  //   path: '/room/:roomId',
  //   element: (
  //     <ProtectedRoute>
  //       <WaitingRoom />
  //     </ProtectedRoute>
  //   ),
  // },
  // {
  //   path: '/play/:roomId',
  //   element: (
  //     <ProtectedRoute>
  //       <GameRouter />
  //     </ProtectedRoute>
  //   ),
  // },
]);
