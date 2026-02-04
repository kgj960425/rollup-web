# Hooks 폴더 작업 가이드 (커스텀 훅)

## 📋 목적
재사용 가능한 React 커스텀 훅 관리

## 📁 구조
```
hooks/
├── useAuth.ts          # 인증 상태
├── useGame.ts          # 게임 상태
├── useLobby.ts         # 로비 상태
├── useChat.ts          # 채팅
├── useShop.ts          # 상점
├── useInventory.ts     # 인벤토리
└── useFirestore.ts     # Firestore 실시간 구독
```

---

## 🔐 useAuth.ts

### 기능
Firebase Authentication 상태 관리

### 코드
```typescript
import { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/core/firebase/config';
import * as authAPI from '@/core/firebase/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    
    return unsubscribe;
  }, []);
  
  const loginAnonymously = async () => {
    try {
      setError(null);
      const user = await authAPI.loginAnonymously();
      setUser(user);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };
  
  const loginWithGoogle = async () => {
    try {
      setError(null);
      const user = await authAPI.loginWithGoogle();
      setUser(user);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };
  
  const signOut = async () => {
    try {
      await authAPI.signOut();
      setUser(null);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };
  
  return {
    user,
    loading,
    error,
    loginAnonymously,
    loginWithGoogle,
    signOut,
    isAuthenticated: !!user
  };
}
```

### 사용 예시
```tsx
function LoginPage() {
  const { loginAnonymously, loading } = useAuth();
  
  const handleLogin = async () => {
    await loginAnonymously();
    navigate('/community');
  };
  
  return <button onClick={handleLogin}>게스트로 시작</button>;
}
```

---

## 🎮 useGame.ts

### 기능
게임 상태 실시간 동기화 (Firestore)

### 코드
```typescript
import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/core/firebase/config';
import * as gameAPI from '@/core/api/game';

export function useGame(gameType: string, gameId: string) {
  const [gameState, setGameState] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const gameRef = doc(db, 'active_games', gameId);
    
    const unsubscribe = onSnapshot(
      gameRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setGameState({
            id: snapshot.id,
            ...snapshot.data()
          });
          setLoading(false);
        }
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    
    return unsubscribe;
  }, [gameId]);
  
  const sendAction = async (action: any) => {
    try {
      await gameAPI.sendAction(gameType, gameId, action);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };
  
  const endTurn = async () => {
    try {
      await gameAPI.endTurn(gameType, gameId);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };
  
  return {
    gameState,
    loading,
    error,
    sendAction,
    endTurn,
    currentTurn: gameState?.currentTurn,
    isMyTurn: gameState?.currentTurn === gameState?.myPlayerId
  };
}
```

### 사용 예시
```tsx
function GamePlayPage() {
  const { gameType, gameId } = useParams();
  const { gameState, sendAction, isMyTurn } = useGame(gameType!, gameId!);
  
  const handleAction = (action: any) => {
    if (!isMyTurn) return;
    sendAction(action);
  };
  
  return (
    <div>
      <TurnIndicator isMyTurn={isMyTurn} />
      <GameCanvas state={gameState} onAction={handleAction} />
    </div>
  );
}
```

---

## 🏠 useLobby.ts

### 기능
로비 상태 실시간 동기화

### 코드
```typescript
import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/core/firebase/config';
import * as lobbyAPI from '@/core/api/lobby';

export function useLobby(lobbyId: string) {
  const [lobby, setLobby] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const lobbyRef = doc(db, 'game_lobbies', lobbyId);
    
    const unsubscribe = onSnapshot(
      lobbyRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setLobby({
            id: snapshot.id,
            ...snapshot.data()
          });
          setLoading(false);
        }
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    
    return unsubscribe;
  }, [lobbyId]);
  
  const toggleReady = async () => {
    try {
      await lobbyAPI.toggleReady(lobbyId);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };
  
  const startGame = async () => {
    try {
      await lobbyAPI.startGame(lobbyId);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };
  
  const leaveLobby = async () => {
    try {
      await lobbyAPI.leaveLobby(lobbyId);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };
  
  return {
    lobby,
    loading,
    error,
    players: lobby?.players || [],
    hostId: lobby?.hostId,
    isHost: lobby?.hostId === lobby?.myPlayerId,
    canStart: lobby?.players?.every((p: any) => p.isReady) && 
              lobby?.players?.length >= lobby?.minPlayers,
    toggleReady,
    startGame,
    leaveLobby
  };
}
```

---

## 💬 useChat.ts

### 기능
채팅 메시지 실시간 구독

### 코드
```typescript
import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '@/core/firebase/config';
import * as chatAPI from '@/core/api/chat';

export function useChat(roomId: string, roomType: 'lobby' | 'game') {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const collectionName = roomType === 'lobby' ? 'game_lobbies' : 'active_games';
    const messagesQuery = query(
      collection(db, collectionName, roomId, 'chat'),
      orderBy('timestamp', 'asc'),
      limit(100)
    );
    
    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgs);
      setLoading(false);
    });
    
    return unsubscribe;
  }, [roomId, roomType]);
  
  const sendMessage = async (data: {
    messageType: 'text' | 'emoticon' | 'sound';
    textContent?: string;
    emoticonId?: string;
    soundId?: string;
  }) => {
    await chatAPI.sendMessage(roomId, roomType, data);
  };
  
  return { messages, loading, sendMessage };
}
```

---

## 🛒 useShop.ts

### 기능
상점 데이터 로드

### 코드
```typescript
import { useState, useEffect } from 'react';
import * as shopAPI from '@/core/api/shop';

export function useShop() {
  const [categories, setCategories] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [featured, setFeatured] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    loadShop();
  }, []);
  
  const loadShop = async () => {
    try {
      const [categoriesRes, itemsRes, featuredRes] = await Promise.all([
        shopAPI.getShopCategories(),
        shopAPI.getShopItems(),
        shopAPI.getShopItems({ featured: true })
      ]);
      
      setCategories(categoriesRes.categories);
      setItems(itemsRes.items);
      setFeatured(featuredRes.items);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const purchaseItem = async (itemId: string) => {
    try {
      const result = await shopAPI.purchaseItem(itemId);
      await loadShop(); // 새로고침
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };
  
  return {
    categories,
    items,
    featured,
    loading,
    error,
    purchaseItem,
    refresh: loadShop
  };
}
```

---

## 🎒 useInventory.ts

### 기능
사용자 인벤토리 관리

### 코드
```typescript
import { useState, useEffect } from 'react';
import * as shopAPI from '@/core/api/shop';

export function useInventory() {
  const [inventory, setInventory] = useState({
    items: [],
    currency: { coins: 0, gems: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    loadInventory();
  }, []);
  
  const loadInventory = async () => {
    try {
      const data = await shopAPI.getUserInventory();
      setInventory({
        items: data.items,
        currency: data.currency
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const hasItem = (itemId: string): boolean => {
    return inventory.items.some((item: any) => item.item_id === itemId);
  };
  
  return {
    inventory,
    loading,
    error,
    currency: inventory.currency,
    hasItem,
    refresh: loadInventory
  };
}
```

---

## 🔥 useFirestore.ts (범용 훅)

### 기능
Firestore 실시간 구독 범용 훅

### 코드
```typescript
import { useState, useEffect } from 'react';
import { 
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  QueryConstraint
} from 'firebase/firestore';
import { db } from '@/core/firebase/config';

export function useFirestore<T>(
  collectionName: string,
  constraints: QueryConstraint[] = []
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const q = query(collection(db, collectionName), ...constraints);
    
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as T[];
        setData(items);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );
    
    return unsubscribe;
  }, [collectionName, ...constraints]);
  
  return { data, loading, error };
}
```

### 사용 예시
```tsx
// 게임 로비 목록
const { data: lobbies, loading } = useFirestore<Lobby>(
  'game_lobbies',
  [
    where('gameType', '==', 'lexio'),
    where('status', '==', 'waiting'),
    orderBy('createdAt', 'desc'),
    limit(20)
  ]
);
```

---

## ✅ 작업 체크리스트

### 인증
- [ ] `useAuth.ts` - 인증 상태 관리

### 게임
- [ ] `useGame.ts` - 게임 상태
- [ ] `useLobby.ts` - 로비 상태

### 채팅 & 소셜
- [ ] `useChat.ts` - 채팅

### 상점
- [ ] `useShop.ts` - 상점
- [ ] `useInventory.ts` - 인벤토리

### 유틸리티
- [ ] `useFirestore.ts` - 범용 Firestore 훅

---

## 📝 개발 원칙

1. **의존성 배열** - useEffect 의존성 정확히 관리
2. **정리 함수** - onSnapshot 구독 해제 필수
3. **에러 처리** - try-catch + 에러 상태 관리
4. **로딩 상태** - 항상 로딩 상태 제공
5. **TypeScript** - 타입 안전성 보장
6. **재사용성** - 범용적으로 사용 가능하게

---

## 🔗 의존성

```json
{
  "firebase": "Firestore 실시간 구독",
  "axios": "API 통신"
}
```

---

## 📖 참고 문서

- [React Hooks 공식 문서](https://react.dev/reference/react)
- [Firebase Firestore 구독](https://firebase.google.com/docs/firestore/query-data/listen)
- [커스텀 훅 패턴](https://react.dev/learn/reusing-logic-with-custom-hooks)
