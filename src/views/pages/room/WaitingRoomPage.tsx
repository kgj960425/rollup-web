import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useRoom } from '../../../hooks/useRoom';
import './WaitingRoomPage.css';

// 게임 종류 목록
const GAME_TYPES: Record<string, string> = {
  yacht: '야추 다이스',
  lexio: '렉시오',
  exploding: '익스플로딩 키튼',
};

const WaitingRoomPage = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hasJoined, setHasJoined] = useState(false);

  const {
    room,
    loading,
    error,
    joinRoom,
    leaveRoom,
    toggleReady,
    startGame,
    kickPlayer,
    isHost,
    isReady,
  } = useRoom({
    roomId: roomId || '',
    userId: user?.uid || '',
    userNickname: user?.displayName || '익명',
  });

  // 방 입장 처리
  useEffect(() => {
    if (!roomId || !user || hasJoined || loading) return;

    // 이미 방에 있는 플레이어인지 확인
    const isAlreadyInRoom = room?.players.some(p => p.id === user.uid);

    if (!isAlreadyInRoom && room) {
      joinRoom()
        .then(() => setHasJoined(true))
        .catch((err) => {
          console.error('Failed to join room:', err);
          alert('방 입장에 실패했습니다.');
          navigate('/');
        });
    } else if (isAlreadyInRoom) {
      setHasJoined(true);
    }
  }, [roomId, user, room, loading, hasJoined, joinRoom, navigate]);

  // 방 상태가 playing으로 변경되면 게임 화면으로 이동
  useEffect(() => {
    if (room?.status === 'playing') {
      navigate(`/game/${roomId}`);
    }
  }, [room?.status, roomId, navigate]);

  const handleLeaveRoom = async () => {
    try {
      await leaveRoom();
      navigate('/');
    } catch (err) {
      console.error('Failed to leave room:', err);
      alert('방 퇴장에 실패했습니다.');
    }
  };

  const handleToggleReady = async () => {
    try {
      await toggleReady();
    } catch (err) {
      console.error('Failed to toggle ready:', err);
    }
  };

  const handleStartGame = async () => {
    try {
      await startGame();
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      }
    }
  };

  const handleKickPlayer = async (playerId: string) => {
    if (window.confirm('이 플레이어를 강퇴하시겠습니까?')) {
      try {
        await kickPlayer(playerId);
      } catch (err) {
        console.error('Failed to kick player:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="waiting-room">
        <div className="waiting-room-card">
          <div className="loading-state">방 정보를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="waiting-room">
        <div className="waiting-room-card">
          <div className="error-state">{error || '방을 찾을 수 없습니다.'}</div>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            로비로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  // 모든 플레이어가 준비 완료인지 확인 (방장 제외)
  const allPlayersReady = room.players.every(p => p.id === room.hostId || p.isReady);
  const canStartGame = isHost && room.players.length >= 2 && allPlayersReady;

  return (
    <div className="waiting-room">
      <div className="waiting-room-card">
        <div className="waiting-room-header">
          <h2>{room.title}</h2>
          <span className="room-id">방 ID: {roomId}</span>
        </div>

        <div className="waiting-room-body">
          <div className="players-section">
            <h3>참가자 목록 ({room.players.length}/{room.maxPlayers})</h3>
            <div className="player-list">
              {room.players.map((player) => (
                <div
                  key={player.id}
                  className={`player-item ${player.id === room.hostId ? 'host' : ''} ${player.isReady ? 'ready' : ''}`}
                >
                  <span className="player-avatar">👤</span>
                  <span className="player-name">{player.nickname}</span>
                  {player.id === room.hostId && (
                    <span className="player-badge host-badge">방장</span>
                  )}
                  {player.id !== room.hostId && player.isReady && (
                    <span className="player-badge ready-badge">준비완료</span>
                  )}
                  {!player.isConnected && (
                    <span className="player-badge offline-badge">오프라인</span>
                  )}
                  {isHost && player.id !== room.hostId && (
                    <button
                      className="btn-kick"
                      onClick={() => handleKickPlayer(player.id)}
                      title="강퇴"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="game-settings">
            <h3>게임 설정</h3>
            <p>게임: {GAME_TYPES[room.gameType] || room.gameType}</p>
            <p>최대 인원: {room.maxPlayers}명</p>
            {room.timeLimit > 0 && <p>시간 제한: {room.timeLimit}분</p>}
            {room.isSpecial && <p>특수 방: {room.specialType}</p>}
          </div>
        </div>

        <div className="waiting-room-footer">
          <button className="btn btn-secondary" onClick={handleLeaveRoom}>
            나가기
          </button>

          {!isHost && (
            <button
              className={`btn ${isReady ? 'btn-warning' : 'btn-success'}`}
              onClick={handleToggleReady}
            >
              {isReady ? '준비 취소' : '준비 완료'}
            </button>
          )}

          {isHost && (
            <button
              className="btn btn-primary"
              onClick={handleStartGame}
              disabled={!canStartGame}
              title={!canStartGame ? '모든 플레이어가 준비 완료되어야 합니다 (최소 2명)' : ''}
            >
              게임 시작
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WaitingRoomPage;
