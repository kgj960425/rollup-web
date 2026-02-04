import { useState, useEffect } from 'react';
import { doc, onSnapshot, updateDoc, arrayUnion, arrayRemove, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import type { Room, Player } from '../types/common';

interface UseRoomOptions {
  roomId: string;
  userId: string;
  userNickname: string;
}

export const useRoom = ({ roomId, userId, userNickname }: UseRoomOptions) => {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 방 정보 실시간 구독
  useEffect(() => {
    if (!roomId) return;

    const roomRef = doc(db, 'rooms', roomId);
    
    const unsubscribe = onSnapshot(
      roomRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setRoom({
            id: snapshot.id,
            title: data.title || `${data.hostNickname}의 방`,
            gameType: data.gameType,
            hostId: data.hostId,
            hostNickname: data.hostNickname,
            currentPlayers: data.players?.length || 1,
            maxPlayers: data.maxPlayers,
            status: data.status,
            timeLimit: data.timeLimit || 0,
            isSpecial: data.isSpecial || false,
            specialType: data.specialType,
            createdAt: data.createdAt?.toDate() || new Date(),
            players: data.players || [],
          });
        } else {
          setError('방을 찾을 수 없습니다.');
          setRoom(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching room:', err);
        setError('방 정보를 불러오는데 실패했습니다.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [roomId]);

  // 방 입장
  const joinRoom = async () => {
    if (!roomId || !userId) return;

    try {
      const roomRef = doc(db, 'rooms', roomId);
      const newPlayer: Player = {
        id: userId,
        nickname: userNickname,
        isReady: false,
        isConnected: true,
      };
      
      await updateDoc(roomRef, {
        players: arrayUnion(newPlayer),
      });
    } catch (err) {
      console.error('Failed to join room:', err);
      throw err;
    }
  };

  // 방 퇴장
  const leaveRoom = async () => {
    if (!roomId || !userId || !room) return;

    try {
      const roomRef = doc(db, 'rooms', roomId);
      const currentPlayer = room.players.find(p => p.id === userId);
      
      if (currentPlayer) {
        await updateDoc(roomRef, {
          players: arrayRemove(currentPlayer),
        });
      }

      // 방장이 나가면 방 삭제
      if (room.hostId === userId) {
        await deleteDoc(roomRef);
      }
    } catch (err) {
      console.error('Failed to leave room:', err);
      throw err;
    }
  };

  // 준비 상태 토글
  const toggleReady = async () => {
    if (!roomId || !userId || !room) return;

    try {
      const roomRef = doc(db, 'rooms', roomId);
      const currentPlayer = room.players.find(p => p.id === userId);
      
      if (currentPlayer) {
        // 현재 플레이어 제거 후 준비 상태 변경하여 다시 추가
        const updatedPlayer: Player = {
          ...currentPlayer,
          isReady: !currentPlayer.isReady,
        };
        
        await updateDoc(roomRef, {
          players: room.players.map(p => 
            p.id === userId ? updatedPlayer : p
          ),
        });
      }
    } catch (err) {
      console.error('Failed to toggle ready:', err);
      throw err;
    }
  };

  // 게임 시작 (방장만)
  const startGame = async () => {
    if (!roomId || !room) return;

    // 모든 플레이어가 준비 완료인지 확인
    const allReady = room.players.every(p => p.id === room.hostId || p.isReady);
    if (!allReady) {
      throw new Error('모든 플레이어가 준비 완료되어야 합니다.');
    }

    try {
      const roomRef = doc(db, 'rooms', roomId);
      await updateDoc(roomRef, {
        status: 'playing',
      });
    } catch (err) {
      console.error('Failed to start game:', err);
      throw err;
    }
  };

  // 플레이어 강퇴 (방장만)
  const kickPlayer = async (playerId: string) => {
    if (!roomId || !room || room.hostId !== userId) return;

    try {
      const roomRef = doc(db, 'rooms', roomId);
      const playerToKick = room.players.find(p => p.id === playerId);
      
      if (playerToKick) {
        await updateDoc(roomRef, {
          players: arrayRemove(playerToKick),
        });
      }
    } catch (err) {
      console.error('Failed to kick player:', err);
      throw err;
    }
  };

  return {
    room,
    loading,
    error,
    joinRoom,
    leaveRoom,
    toggleReady,
    startGame,
    kickPlayer,
    isHost: room?.hostId === userId,
    isReady: room?.players.find(p => p.id === userId)?.isReady || false,
  };
};
