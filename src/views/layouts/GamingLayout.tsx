import { Outlet } from 'react-router-dom';
import './GamingLayout.css';

export default function GamingLayout() {
  return (
    <div className="gaming-layout">
      <main className="gaming-main">
        <Outlet />
      </main>
    </div>
  );
}
