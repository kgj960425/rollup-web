import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import { useAuth } from '../../../contexts/AuthContext';
import { useRooms } from '../../../hooks/useRooms';
import type { Room } from '../../../types/common';
import './RoomListPage.css';

// 게임 종류 목록
const GAME_TYPES = [
  { id: 'yacht', name: '야추 다이스' },
  { id: 'lexio', name: '렉시오' },
  { id: 'exploding', name: '익스플로딩 키튼' },
];

const RoomListPage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [roomTitle, setRoomTitle] = useState('');
  const [selectedGame, setSelectedGame] = useState('yacht');
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [timeLimit, setTimeLimit] = useState(0);
  const [isSpecial, setIsSpecial] = useState(false);
  const [specialType, setSpecialType] = useState('');
  const [creating, setCreating] = useState(false);

  const { user } = useAuth();
  const { rooms, loading, error } = useRooms();
  const navigate = useNavigate();

  const getGameName = (gameType: string) => {
    return GAME_TYPES.find(g => g.id === gameType)?.name || gameType;
  };

  const getStatusText = (status: Room['status']) => {
    switch (status) {
      case 'waiting': return '대기중';
      case 'playing': return '게임중';
      case 'finished': return '종료';
      default: return status;
    }
  };

  const getStatusClass = (status: Room['status']) => {
    switch (status) {
      case 'waiting': return 'status-waiting';
      case 'playing': return 'status-playing';
      case 'finished': return 'status-finished';
      default: return '';
    }
  };

  const handleCreateRoom = async () => {
    if (!user) return;

    setCreating(true);
    try {
      const roomData = {
        title: roomTitle || `${user.displayName || '익명'}의 방`,
        gameType: selectedGame,
        hostId: user.uid,
        hostNickname: user.displayName || '익명',
        maxPlayers,
        status: 'waiting',
        timeLimit,
        isSpecial,
        specialType: isSpecial ? specialType : null,
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
    if (room.status === 'playing') {
      alert('이미 게임이 진행 중인 방입니다.');
      return;
    }
    if (room.currentPlayers >= room.maxPlayers) {
      alert('인원이 가득 찼습니다.');
      return;
    }
    navigate(`/room/${room.id}`);
  };

  const openCreateModal = () => {
    setRoomTitle('');
    setSelectedGame('yacht');
    setMaxPlayers(4);
    setTimeLimit(0);
    setIsSpecial(false);
    setSpecialType('');
    setShowCreateModal(true);
  };

  return (
    <div className="room-list-container">
      <div className="room-list-content">
        {/* 헤더: 방 만들기 버튼 */}
        <div className="room-list-header">
          <h2>방 목록</h2>
          <button className="btn btn-primary btn-create" onClick={openCreateModal}>
            + 방 만들기
          </button>
        </div>

        {/* 방 목록 테이블 */}
        <div className="room-table-wrapper">
          {loading ? (
            <div className="loading-state">방 목록을 불러오는 중...</div>
          ) : error ? (
            <div className="error-state">{error}</div>
          ) : rooms.length === 0 ? (
            <div className="empty-state">
              <p>현재 생성된 방이 없습니다.</p>
              <p>새로운 방을 만들어보세요!</p>
            </div>
          ) : (
            <table className="room-table">
              <thead>
                <tr>
                  <th>방 제목</th>
                  <th>게임</th>
                  <th>상태</th>
                  <th>인원</th>
                  <th>시간제한</th>
                  <th>특수</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr
                    key={room.id}
                    className={`room-row ${room.status !== 'waiting' ? 'disabled' : ''}`}
                    onClick={() => handleJoinRoom(room)}
                  >
                    <td className="room-title">{room.title}</td>
                    <td>{getGameName(room.gameType)}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(room.status)}`}>
                        {getStatusText(room.status)}
                      </span>
                    </td>
                    <td>{room.currentPlayers}/{room.maxPlayers}</td>
                    <td>{room.timeLimit > 0 ? `${room.timeLimit}분` : '없음'}</td>
                    <td>
                      {room.isSpecial ? (
                        <span className="special-badge">{room.specialType || '특수'}</span>
                      ) : (
                        '-'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                <label>방 제목</label>
                <input
                  type="text"
                  value={roomTitle}
                  onChange={(e) => setRoomTitle(e.target.value)}
                  placeholder="방 제목을 입력하세요"
                />
              </div>
              <div className="form-group">
                <label>게임 종류</label>
                <select
                  value={selectedGame}
                  onChange={(e) => setSelectedGame(e.target.value)}
                >
                  {GAME_TYPES.map((game) => (
                    <option key={game.id} value={game.id}>
                      {game.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>최대 인원</label>
                <select
                  value={maxPlayers}
                  onChange={(e) => setMaxPlayers(Number(e.target.value))}
                >
                  {[2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num}>
                      {num}명
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>시간 제한</label>
                <select
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(Number(e.target.value))}
                >
                  <option value={0}>없음</option>
                  <option value={10}>10분</option>
                  <option value={20}>20분</option>
                  <option value={30}>30분</option>
                  <option value={60}>60분</option>
                </select>
              </div>
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={isSpecial}
                    onChange={(e) => setIsSpecial(e.target.checked)}
                  />
                  특수 방
                </label>
              </div>
              {isSpecial && (
                <div className="form-group">
                  <label>특수 유형</label>
                  <select
                    value={specialType}
                    onChange={(e) => setSpecialType(e.target.value)}
                  >
                    <option value="">선택하세요</option>
                    <option value="랭크">랭크</option>
                    <option value="친선">친선</option>
                    <option value="토너먼트">토너먼트</option>
                  </select>
                </div>
              )}
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
