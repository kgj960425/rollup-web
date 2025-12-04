import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import './WaitingRoomPage.css';

const WaitingRoomPage = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLeaveRoom = () => {
    navigate('/');
  };

  const handleStartGame = () => {
    // TODO: 게임 시작 로직 구현
    navigate(`/game/${roomId}`);
  };

  return (
    <div className="waiting-room">
      <div className="waiting-room-card">
        <div className="waiting-room-header">
          <h2>대기실</h2>
          <span className="room-id">방 ID: {roomId}</span>
        </div>

        <div className="waiting-room-body">
          <div className="players-section">
            <h3>참가자 목록</h3>
            <div className="player-list">
              <div className="player-item host">
                <span className="player-avatar">👤</span>
                <span className="player-name">{user?.displayName || '익명'}</span>
                <span className="player-badge">방장</span>
              </div>
              {/* TODO: 다른 플레이어들 표시 */}
            </div>
          </div>

          <div className="game-settings">
            <h3>게임 설정</h3>
            <p>게임: 야추 다이스</p>
            <p>최대 인원: 4명</p>
          </div>
        </div>

        <div className="waiting-room-footer">
          <button className="btn btn-secondary" onClick={handleLeaveRoom}>
            나가기
          </button>
          <button className="btn btn-primary" onClick={handleStartGame}>
            게임 시작
          </button>
        </div>
      </div>
    </div>
  );
};

export default WaitingRoomPage;
