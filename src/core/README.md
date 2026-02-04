# Core 폴더 작업 가이드 (핵심 로직)

## 📋 목적
플랫폼의 핵심 기능 및 유틸리티 관리

## 📁 구조
```
core/
├── firebase/                # Firebase 설정
│   ├── config.ts            # Firebase 초기화
│   ├── auth.ts              # 인증 헬퍼
│   └── firestore.ts         # Firestore 헬퍼
│
├── api/                     # API 클라이언트
│   ├── client.ts            # Axios 인스턴스
│   ├── auth.ts              # 인증 API
│   ├── lobby.ts             # 로비 API
│   ├── game.ts              # 게임 API
│   ├── shop.ts              # 상점 API
│   └── plugins.ts           # 플러그인 API
│
├── plugins/                 # 플러그인 시스템
│   ├── PluginManager.ts     # 플러그인 관리
│   ├── CacheManager.ts      # IndexedDB 캐싱
│   ├── AssetLoader.ts       # 에셋 로딩
│   └── VersionManager.ts    # 버전 관리
│
└── utils/                   # 유틸리티
    ├── storage.ts           # LocalStorage 헬퍼
    ├── date.ts              # 날짜 포맷팅
    └── validators.ts        # 유효성 검사
```

---

## 🔥 firebase/ - Firebase 설정

### config.ts
```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Firebase 앱 초기화
export const app = initializeApp(firebaseConfig);

// 서비스 초기화
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

### auth.ts (헬퍼 함수)
```typescript
import { 
  signInAnonymously,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  User
} from 'firebase/auth';
import { auth } from './config';

export const loginAnonymously = async (): Promise<User> => {
  const result = await signInAnonymously(auth);
  return result.user;
};

export const loginWithGoogle = async (): Promise<User> => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
};

export const signOut = async (): Promise<void> => {
  await firebaseSignOut(auth);
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

export const getIdToken = async (): Promise<string> => {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');
  return await user.getIdToken();
};
```

### firestore.ts (헬퍼 함수)
```typescript
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Timestamp
} from 'firebase/firestore';
import { db } from './config';

// 문서 가져오기
export const getDocument = async (
  collectionName: string,
  docId: string
) => {
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
};

// 문서 저장
export const setDocument = async (
  collectionName: string,
  docId: string,
  data: any
) => {
  const docRef = doc(db, collectionName, docId);
  await setDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now()
  });
};

// 실시간 구독
export const subscribeToCollection = (
  collectionName: string,
  conditions: any[],
  callback: (data: any[]) => void
) => {
  let q = query(collection(db, collectionName));
  
  conditions.forEach(condition => {
    if (condition.type === 'where') {
      q = query(q, where(condition.field, condition.op, condition.value));
    } else if (condition.type === 'orderBy') {
      q = query(q, orderBy(condition.field, condition.direction));
    } else if (condition.type === 'limit') {
      q = query(q, limit(condition.value));
    }
  });
  
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(data);
  });
};
```

---

## 🌐 api/ - API 클라이언트

### client.ts (Axios 설정)
```typescript
import axios from 'axios';
import { getIdToken } from '../firebase/auth';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 요청 인터셉터 (JWT 토큰 자동 추가)
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await getIdToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Failed to get token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 (에러 처리)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 인증 오류 처리
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### lobby.ts (로비 API)
```typescript
import apiClient from './client';

export const createLobby = async (data: {
  gameType: string;
  maxPlayers: number;
  settings?: any;
}) => {
  const response = await apiClient.post('/api/lobby/create', data);
  return response.data;
};

export const joinLobby = async (lobbyId: string) => {
  const response = await apiClient.post(`/api/lobby/${lobbyId}/join`);
  return response.data;
};

export const leaveLobby = async (lobbyId: string) => {
  const response = await apiClient.post(`/api/lobby/${lobbyId}/leave`);
  return response.data;
};

export const toggleReady = async (lobbyId: string) => {
  const response = await apiClient.post(`/api/lobby/${lobbyId}/ready`);
  return response.data;
};

export const startGame = async (lobbyId: string) => {
  const response = await apiClient.post(`/api/lobby/${lobbyId}/start`);
  return response.data;
};
```

### game.ts (게임 API)
```typescript
import apiClient from './client';

export const sendAction = async (
  gameType: string,
  gameId: string,
  action: any
) => {
  const response = await apiClient.post(
    `/api/game/${gameType}/${gameId}/action`,
    action
  );
  return response.data;
};

export const endTurn = async (gameType: string, gameId: string) => {
  const response = await apiClient.post(
    `/api/game/${gameType}/${gameId}/end-turn`
  );
  return response.data;
};

export const endGame = async (gameType: string, gameId: string) => {
  const response = await apiClient.post(
    `/api/game/${gameType}/${gameId}/end`
  );
  return response.data;
};
```

### shop.ts (상점 API)
```typescript
import apiClient from './client';

export const getShopCategories = async () => {
  const response = await apiClient.get('/api/shop/categories');
  return response.data;
};

export const getShopItems = async (params?: {
  categoryId?: string;
  type?: string;
}) => {
  const response = await apiClient.get('/api/shop/items', { params });
  return response.data;
};

export const purchaseItem = async (itemId: string) => {
  const response = await apiClient.post('/api/shop/purchase', { item_id: itemId });
  return response.data;
};

export const getUserInventory = async () => {
  const response = await apiClient.get('/api/inventory');
  return response.data;
};
```

### plugins.ts (플러그인 API)
```typescript
import apiClient from './client';

export const getAvailablePlugins = async () => {
  const response = await apiClient.get('/api/plugins/available');
  return response.data;
};

export const getPluginManifest = async (gameType: string) => {
  const response = await apiClient.get(`/api/plugins/${gameType}/manifest`);
  return response.data;
};

export const trackPluginInstall = async (gameType: string) => {
  const response = await apiClient.post(`/api/plugins/${gameType}/track-install`);
  return response.data;
};
```

---

## 🔌 plugins/ - 플러그인 시스템

### PluginManager.ts
```typescript
import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface PluginDB extends DBSchema {
  plugins: {
    key: string;
    value: {
      gameType: string;
      version: string;
      code: Blob;
      checksum: string;
      installedAt: string;
    };
  };
  assets: {
    key: string;
    value: {
      gameType: string;
      path: string;
      data: Blob;
      checksum: string;
    };
  };
  metadata: {
    key: string;
    value: any;
  };
}

export class PluginManager {
  private db: IDBPDatabase<PluginDB> | null = null;
  
  async init(): Promise<void> {
    this.db = await openDB<PluginDB>('rollup-plugins', 1, {
      upgrade(db) {
        db.createObjectStore('plugins', { keyPath: 'gameType' });
        db.createObjectStore('assets', { keyPath: ['gameType', 'path'] });
        db.createObjectStore('metadata', { keyPath: 'key' });
      }
    });
  }
  
  async isInstalled(gameType: string): Promise<boolean> {
    if (!this.db) await this.init();
    const plugin = await this.db!.get('plugins', gameType);
    return !!plugin;
  }
  
  async needsUpdate(gameType: string, latestVersion: string): Promise<boolean> {
    if (!this.db) await this.init();
    const plugin = await this.db!.get('plugins', gameType);
    if (!plugin) return true;
    return plugin.version !== latestVersion;
  }
  
  async install(
    gameType: string,
    manifest: any,
    onProgress?: (progress: number) => void
  ): Promise<void> {
    if (!this.db) await this.init();
    
    // 1. 코드 다운로드
    onProgress?.(10);
    const codeBlob = await this.downloadCode(manifest.codeUrl);
    
    // 2. 체크섬 검증
    onProgress?.(30);
    const isValid = await this.verifyChecksum(codeBlob, manifest.codeChecksum);
    if (!isValid) throw new Error('Checksum mismatch');
    
    // 3. 저장
    onProgress?.(50);
    await this.db!.put('plugins', {
      gameType,
      version: manifest.version,
      code: codeBlob,
      checksum: manifest.codeChecksum,
      installedAt: new Date().toISOString()
    });
    
    // 4. 에셋 다운로드
    const assets = manifest.assets || [];
    for (let i = 0; i < assets.length; i++) {
      const progress = 50 + (40 * (i + 1) / assets.length);
      onProgress?.(progress);
      
      await this.downloadAsset(gameType, assets[i]);
    }
    
    onProgress?.(100);
  }
  
  async load(gameType: string): Promise<any> {
    if (!this.db) await this.init();
    
    const plugin = await this.db!.get('plugins', gameType);
    if (!plugin) throw new Error('Plugin not installed');
    
    // Blob을 JavaScript 모듈로 변환
    const url = URL.createObjectURL(plugin.code);
    const module = await import(/* @vite-ignore */ url);
    URL.revokeObjectURL(url);
    
    return module.default;
  }
  
  async uninstall(gameType: string): Promise<void> {
    if (!this.db) await this.init();
    
    // 플러그인 삭제
    await this.db!.delete('plugins', gameType);
    
    // 에셋 삭제
    const assets = await this.db!.getAllFromIndex('assets', 'gameType', gameType);
    for (const asset of assets) {
      await this.db!.delete('assets', [gameType, asset.path]);
    }
  }
  
  async getCacheSize(): Promise<number> {
    if (!this.db) await this.init();
    
    let totalSize = 0;
    
    // 플러그인 크기
    const plugins = await this.db!.getAll('plugins');
    for (const plugin of plugins) {
      totalSize += plugin.code.size;
    }
    
    // 에셋 크기
    const assets = await this.db!.getAll('assets');
    for (const asset of assets) {
      totalSize += asset.data.size;
    }
    
    return totalSize;
  }
  
  private async downloadCode(url: string): Promise<Blob> {
    const response = await fetch(url);
    return await response.blob();
  }
  
  private async downloadAsset(gameType: string, asset: any): Promise<void> {
    const response = await fetch(asset.url);
    const blob = await response.blob();
    
    await this.db!.put('assets', {
      gameType,
      path: asset.path,
      data: blob,
      checksum: asset.checksum
    });
  }
  
  private async verifyChecksum(blob: Blob, expectedChecksum: string): Promise<boolean> {
    const arrayBuffer = await blob.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex === expectedChecksum;
  }
}

export const pluginManager = new PluginManager();
```

---

## 🛠️ utils/ - 유틸리티

### storage.ts
```typescript
export const storage = {
  get<T>(key: string, defaultValue?: T): T | null {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue ?? null;
    try {
      return JSON.parse(item);
    } catch {
      return item as any;
    }
  },
  
  set(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  },
  
  remove(key: string): void {
    localStorage.removeItem(key);
  },
  
  clear(): void {
    localStorage.clear();
  }
};
```

### date.ts
```typescript
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('ko-KR');
};

export const formatDateTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('ko-KR');
};

export const formatRelativeTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  
  if (diffSec < 60) return '방금 전';
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  if (diffDay < 7) return `${diffDay}일 전`;
  return formatDate(d);
};
```

### validators.ts
```typescript
export const isValidEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const isValidUsername = (username: string): boolean => {
  return username.length >= 3 && username.length <= 20;
};

export const isValidPassword = (password: string): boolean => {
  return password.length >= 8;
};
```

---

## ✅ 작업 체크리스트

### Firebase 설정
- [ ] `config.ts` - Firebase 초기화
- [ ] `auth.ts` - 인증 헬퍼
- [ ] `firestore.ts` - Firestore 헬퍼

### API 클라이언트
- [ ] `client.ts` - Axios 설정
- [ ] `auth.ts` - 인증 API
- [ ] `lobby.ts` - 로비 API
- [ ] `game.ts` - 게임 API
- [ ] `shop.ts` - 상점 API
- [ ] `plugins.ts` - 플러그인 API

### 플러그인 시스템
- [ ] `PluginManager.ts` - 플러그인 관리
- [ ] `CacheManager.ts` - 캐싱
- [ ] `AssetLoader.ts` - 에셋 로딩
- [ ] `VersionManager.ts` - 버전 관리

### 유틸리티
- [ ] `storage.ts` - LocalStorage
- [ ] `date.ts` - 날짜 포맷팅
- [ ] `validators.ts` - 유효성 검사

---

## 📝 참고사항

- 환경변수는 `.env` 파일에서 관리
- API 엔드포인트는 개발/프로덕션 분리
- 에러는 적절히 처리하고 로깅
- TypeScript strict 모드 사용
- 단위 테스트 작성 권장
