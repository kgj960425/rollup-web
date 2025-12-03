import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import type { Room } from '../types/common';

interface UseRoomsOptions {
  gameType?: string;
  status?: 'waiting' | 'playing' | 'finished';
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

      // 기본적으로 대기 중인 방만 표시
      const constraints: any[] = [
        where('status', '==', options.status || 'waiting'),
        orderBy('createdAt', 'desc'),
      ];

      // 게임 타입 필터가 있으면 추가
      if (options.gameType) {
        constraints.unshift(where('gameType', '==', options.gameType));
      }

      const q = query(roomsRef, ...constraints);

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const roomList: Room[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
          })) as Room[];

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
  }, [options.gameType, options.status]);

  return { rooms, loading, error };
};
