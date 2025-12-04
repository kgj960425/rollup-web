import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import { useAuth } from '../../../contexts/AuthContext';
import { useRooms } from '../../../hooks/useRooms';
import type { Room, GameType } from '../../../types/common';
import './RoomListPage.css';

// 게임 타입 정보 (추후 Firestore에서 가져오도록 변경)
const GAME_TYPES: GameType[] = [
  {
    id: 'yacht',
    name: '야추 다이스',
    description: '5개의 주사위로 점수를 겨루는 게임',
    minPlayers: 1,
    maxPlayers: 4,
    thumbnailUrl: '',
    isActive: true,
  },
  {
    id: 'lexio',
    name: '렉시오',
    description: '카드 조합으로 승부하는 전략 게임',
    minPlayers: 2,
    maxPlayers: 4,
    thumbnailUrl: '',
    isActive: false,
  },
  {
    id: 'exploding',
    name: '익스플로딩 키튼',
    description: '폭탄을 피해 생존하는 카드 게임',
    minPlayers: 2,
    maxPlayers: 5,
    thumbnailUrl: '',
    isActive: false,
  },
];

const RoomListPage = () => {
  const [selectedGame, setSelectedGame] = useState<string>('yacht');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [creating, setCreating] = useState(false);

  const { user } = useAuth();
  const { rooms, loading, error } = useRooms({ gameType: selectedGame });
  const navigate = useNavigate();

  const selectedGameInfo = GAME_TYPES.find((g) => g.id === selectedGame);

  const handleCreateRoom = async () => {
    if (!user) return;

    setCreating(true);
    try {
      const roomData = {
        gameType: selectedGame,
        hostId: user.uid,
        hostNickname: user.displayName || '익명',
        maxPlayers,
        status: 'waiting',
        createdAt: serverTimestamp(),
        players: [
          {
            id: user.uid,
            nickname: user.displayName || '익명',
            isReady: false,
            isConnected: true,
          },
        ],
      };

      const docRef = await addDoc(collection(db, 'rooms'), roomData);
      navigate(`/room/${docRef.id}`);
    } catch (err) {
      console.error('Failed to create room:', err);
      alert('방 생성에 실패했습니다.');
    } finally {
      setCreating(false);
      setShowCreateModal(false);
    }
  };

  const handleJoinRoom = (room: Room) => {
    navigate(`/room/${room.id}`);
  };

  return (
    <div className="room-list-container">
      <div className="room-list-content">
        {/* 게임 선택 탭 */}
        <div className="game-tabs">
          {GAME_TYPES.map((game) => (
            <button
              key={game.id}
              className={`game-tab ${selectedGame === game.id ? 'active' : ''} ${!game.isActive ? 'disabled' : ''}`}
              onClick={() => game.isActive && setSelectedGame(game.id)}
              disabled={!game.isActive}
            >
              <span className="game-tab-name">{game.name}</span>
              {!game.isActive && <span className="coming-soon">준비중</span>}
            </button>
          ))}
        </div>

        {/* 게임 정보 & 방 생성 */}
        <div className="game-info-bar">
          <div className="game-description">
            <h2>{selectedGameInfo?.name}</h2>
            <p>{selectedGameInfo?.description}</p>
            <span className="player-count">
              {selectedGameInfo?.minPlayers}~{selectedGameInfo?.maxPlayers}명
            </span>
          </div>
          <button
            className="btn btn-primary btn-create"
            onClick={() => setShowCreateModal(true)}
          >
            + 방 만들기
          </button>
        </div>

        {/* 방 목록 */}
        <div className="rooms-section">
          <h3>대기 중인 방 ({rooms.length})</h3>

          {loading ? (
            <div className="loading-state">방 목록을 불러오는 중...</div>
          ) : error ? (
            <div className="error-state">{error}</div>
          ) : rooms.length === 0 ? (
            <div className="empty-state">
              <p>대기 중인 방이 없습니다.</p>
              <p>새로운 방을 만들어보세요!</p>
            </div>
          ) : (
            <div className="room-grid">
              {rooms.map((room) => (
                <div key={room.id} className="room-card">
                  <div className="room-card-header">
                    <span className="room-host">{room.hostNickname}의 방</span>
                    <span className="room-status">대기중</span>
                  </div>
                  <div className="room-card-body">
                    <div className="room-players">
                      <span className="player-icon">👥</span>
                      <span>
                        {room.players?.length || 1} / {room.maxPlayers}
                      </span>
                    </div>
                  </div>
                  <button
                    className="btn btn-join"
                    onClick={() => handleJoinRoom(room)}
                    disabled={room.players?.length >= room.maxPlayers}
                  >
                    {room.players?.length >= room.maxPlayers ? '인원 초과' : '참가하기'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 방 생성 모달 */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>새 방 만들기</h3>
              <button className="modal-close" onClick={() => setShowCreateModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>게임</label>
                <input type="text" value={selectedGameInfo?.name} disabled />
              </div>
              <div className="form-group">
                <label>최대 인원</label>
                <select
                  value={maxPlayers}
                  onChange={(e) => setMaxPlayers(Number(e.target.value))}
                >
                  {Array.from(
                    { length: (selectedGameInfo?.maxPlayers || 4) - (selectedGameInfo?.minPlayers || 1) + 1 },
                    (_, i) => (selectedGameInfo?.minPlayers || 1) + i
                  ).map((num) => (
                    <option key={num} value={num}>
                      {num}명
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setShowCreateModal(false)}
              >
                취소
              </button>
              <button
                className="btn btn-primary"
                onClick={handleCreateRoom}
                disabled={creating}
              >
                {creating ? '생성 중...' : '방 만들기'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomListPage;
