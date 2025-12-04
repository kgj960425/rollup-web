import type { User as FirebaseUser } from 'firebase/auth';

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, nickname: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

export interface Room {
  id: string;
  title: string;           // 방 제목
  gameType: string;        // 게임 종류
  hostId: string;
  hostNickname: string;
  currentPlayers: number;  // 현재 인원
  maxPlayers: number;      // 최대 인원
  status: 'waiting' | 'playing' | 'finished';
  timeLimit: number;       // 시간 제한 (분 단위, 0이면 무제한)
  isSpecial: boolean;      // 특수 방 여부
  specialType?: string;    // 특수 유형 (예: '랭크', '친선', '토너먼트' 등)
  createdAt: Date;
  players: Player[];
}

export interface Player {
  id: string;
  nickname: string;
  isReady: boolean;
  isConnected: boolean;
}

export interface GameType {
  id: string;
  name: string;
  description: string;
  minPlayers: number;
  maxPlayers: number;
  thumbnailUrl: string;
  isActive: boolean;
}

export const firebaseUserToUser = (firebaseUser: FirebaseUser): User => ({
  uid: firebaseUser.uid,
  email: firebaseUser.email,
  displayName: firebaseUser.displayName,
  photoURL: firebaseUser.photoURL,
});
