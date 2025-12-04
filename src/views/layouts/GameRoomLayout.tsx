import { Outlet } from 'react-router-dom';
import './GameRoomLayout.css';

export default function GameRoomLayout() {
  return (
    <div className="gameroom-layout">
      <header className="gameroom-header">
        <div className="gameroom-title">대기실</div>
      </header>
      <main className="gameroom-main">
        <Outlet />
      </main>
    </div>
  );
}
