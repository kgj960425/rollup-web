import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import type { Room } from '../types/common';

interface UseRoomsOptions {
  gameType?: string;
  status?: 'waiting' | 'playing' | 'finished';
  showAll?: boolean; // 모든 상태의 방 표시
}

export const useRooms = (options: UseRoomsOptions = {}) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    try {
      const roomsRef = collection(db, 'rooms');

      // 쿼리 조건 구성
      const constraints: ReturnType<typeof where | typeof orderBy>[] = [];

      // 특정 상태 필터 (showAll이 아닌 경우)
      if (!options.showAll && options.status) {
        constraints.push(where('status', '==', options.status));
      } else if (!options.showAll) {
        // 기본: 대기 중 + 게임 중인 방만 표시 (종료된 방 제외)
        constraints.push(where('status', 'in', ['waiting', 'playing']));
      }

      // 게임 타입 필터
      if (options.gameType) {
        constraints.push(where('gameType', '==', options.gameType));
      }

      // 최신순 정렬
      constraints.push(orderBy('createdAt', 'desc'));

      const q = query(roomsRef, ...constraints);

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const roomList: Room[] = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
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
            };
          });

          setRooms(roomList);
          setLoading(false);
        },
        (err) => {
          console.error('Error fetching rooms:', err);
          setError('방 목록을 불러오는데 실패했습니다.');
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('Error setting up rooms listener:', err);
      setError('방 목록을 불러오는데 실패했습니다.');
      setLoading(false);
    }
  }, [options.gameType, options.status, options.showAll]);

  return { rooms, loading, error };
};
