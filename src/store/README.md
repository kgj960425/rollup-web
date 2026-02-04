# Store 폴더 작업 가이드 (전역 상태 관리)

## 📋 목적
Zustand를 사용한 전역 상태 관리

## 📁 구조
```
store/
├── authStore.ts        # 인증 상태
├── gameStore.ts        # 게임 상태
├── uiStore.ts          # UI 상태
└── notificationStore.ts # 알림
```

---

## 🔐 authStore.ts

### 기능
사용자 인증 상태 전역 관리

### 코드
```typescript
import { create } from 'zustand';
import { User } from 'firebase/auth';

interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  clearAuth: () => set({ user: null, loading: false })
}));
```

### 사용 예시
```tsx
function Navbar() {
  const user = useAuthStore(state => state.user);
  
  return (
    <div>
      {user && <span>{user.displayName}</span>}
    </div>
  );
}
```

---

## 🎮 gameStore.ts

### 기능
게임 관련 전역 상태

### 코드
```typescript
import { create } from 'zustand';

interface GameState {
  currentGameType: string | null;
  currentGameId: string | null;
  currentLobbyId: string | null;
  
  setCurrentGame: (gameType: string, gameId: string) => void;
  setCurrentLobby: (lobbyId: string) => void;
  clearGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  currentGameType: null,
  currentGameId: null,
  currentLobbyId: null,
  
  setCurrentGame: (gameType, gameId) => set({
    currentGameType: gameType,
    currentGameId: gameId
  }),
  
  setCurrentLobby: (lobbyId) => set({ currentLobbyId: lobbyId }),
  
  clearGame: () => set({
    currentGameType: null,
    currentGameId: null,
    currentLobbyId: null
  })
}));
```

---

## 🎨 uiStore.ts

### 기능
UI 상태 (모달, 사이드바 등)

### 코드
```typescript
import { create } from 'zustand';

interface UIState {
  // 모달
  isModalOpen: boolean;
  modalContent: React.ReactNode | null;
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;
  
  // 사이드바
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  
  // 로딩
  isGlobalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  // 모달
  isModalOpen: false,
  modalContent: null,
  openModal: (content) => set({ isModalOpen: true, modalContent: content }),
  closeModal: () => set({ isModalOpen: false, modalContent: null }),
  
  // 사이드바
  isSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  
  // 로딩
  isGlobalLoading: false,
  setGlobalLoading: (loading) => set({ isGlobalLoading: loading })
}));
```

### 사용 예시
```tsx
function App() {
  const { isModalOpen, modalContent, closeModal } = useUIStore();
  
  return (
    <>
      <Router />
      {isModalOpen && (
        <Modal onClose={closeModal}>
          {modalContent}
        </Modal>
      )}
    </>
  );
}

// 모달 열기
function SomeComponent() {
  const openModal = useUIStore(state => state.openModal);
  
  const handleClick = () => {
    openModal(<PurchaseModal item={item} />);
  };
}
```

---

## 🔔 notificationStore.ts

### 기능
토스트/알림 메시지 관리

### 코드
```typescript
import { create } from 'zustand';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

interface NotificationState {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  
  addNotification: (notification) => {
    const id = Date.now().toString();
    const newNotification = { ...notification, id };
    
    set((state) => ({
      notifications: [...state.notifications, newNotification]
    }));
    
    // 자동 제거
    if (notification.duration !== 0) {
      setTimeout(() => {
        set((state) => ({
          notifications: state.notifications.filter(n => n.id !== id)
        }));
      }, notification.duration || 3000);
    }
  },
  
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),
  
  clearAll: () => set({ notifications: [] })
}));
```

### 사용 예시
```tsx
// 토스트 컴포넌트
function ToastContainer() {
  const notifications = useNotificationStore(state => state.notifications);
  const removeNotification = useNotificationStore(state => state.removeNotification);
  
  return (
    <div className="toast-container">
      {notifications.map(notification => (
        <Toast
          key={notification.id}
          {...notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
}

// 알림 트리거
function SomeComponent() {
  const addNotification = useNotificationStore(state => state.addNotification);
  
  const handleSuccess = () => {
    addNotification({
      type: 'success',
      message: '구매가 완료되었습니다!',
      duration: 3000
    });
  };
  
  const handleError = () => {
    addNotification({
      type: 'error',
      message: '오류가 발생했습니다.',
      duration: 5000
    });
  };
}
```

---

## 📦 Zustand 미들웨어

### Persist (LocalStorage 저장)
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  volume: number;
  language: string;
  theme: 'light' | 'dark';
  setVolume: (volume: number) => void;
  setLanguage: (language: string) => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      volume: 0.7,
      language: 'ko',
      theme: 'dark',
      setVolume: (volume) => set({ volume }),
      setLanguage: (language) => set({ language }),
      setTheme: (theme) => set({ theme })
    }),
    {
      name: 'rollup-settings' // LocalStorage 키
    }
  )
);
```

### Devtools (디버깅)
```typescript
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useGameStore = create<GameState>()(
  devtools(
    (set) => ({
      // ... state
    }),
    { name: 'GameStore' }
  )
);
```

---

## 🔄 비동기 액션

### API 호출 포함
```typescript
interface ShopState {
  items: any[];
  loading: boolean;
  error: string | null;
  
  fetchItems: () => Promise<void>;
  purchaseItem: (itemId: string) => Promise<void>;
}

export const useShopStore = create<ShopState>((set, get) => ({
  items: [],
  loading: false,
  error: null,
  
  fetchItems: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/shop/items');
      const data = await response.json();
      set({ items: data.items, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  
  purchaseItem: async (itemId) => {
    try {
      await fetch('/api/shop/purchase', {
        method: 'POST',
        body: JSON.stringify({ item_id: itemId })
      });
      
      // 재조회
      get().fetchItems();
    } catch (error: any) {
      set({ error: error.message });
    }
  }
}));
```

---

## 🎯 선택자 최적화

### 불필요한 리렌더링 방지
```tsx
// ❌ 나쁨 - 전체 상태 구독
const store = useAuthStore();

// ✅ 좋음 - 필요한 것만 구독
const user = useAuthStore(state => state.user);
const setUser = useAuthStore(state => state.setUser);
```

### shallow 비교
```tsx
import { shallow } from 'zustand/shallow';

// 여러 값 구독 시
const { user, loading } = useAuthStore(
  (state) => ({ user: state.user, loading: state.loading }),
  shallow
);
```

---

## ✅ 작업 체크리스트

### 기본 스토어
- [ ] `authStore.ts` - 인증
- [ ] `gameStore.ts` - 게임
- [ ] `uiStore.ts` - UI
- [ ] `notificationStore.ts` - 알림

### 추가 스토어 (필요시)
- [ ] `settingsStore.ts` - 설정
- [ ] `shopStore.ts` - 상점
- [ ] `friendsStore.ts` - 친구

---

## 📝 개발 원칙

1. **단일 책임** - 각 스토어는 하나의 도메인
2. **불변성** - 상태 직접 수정 금지
3. **선택자 최적화** - 필요한 것만 구독
4. **타입 안전성** - TypeScript 인터페이스
5. **미들웨어** - persist, devtools 활용
6. **비동기 처리** - 로딩/에러 상태 관리

---

## 🔗 의존성

```json
{
  "zustand": "^4.4.7"
}
```

---

## 📖 참고 문서

- [Zustand 공식 문서](https://zustand-demo.pmnd.rs/)
- [미들웨어](https://github.com/pmndrs/zustand#middleware)
- [TypeScript 가이드](https://github.com/pmndrs/zustand#typescript)

---

## 💡 팁

### Store 분리 기준
- 관련성: 같은 도메인끼리 그룹화
- 빈도: 자주 변경되는 것끼리
- 범위: 전역 vs 특정 기능

### 언제 Zustand vs useState?
- **Zustand**: 여러 컴포넌트에서 공유
- **useState**: 단일 컴포넌트 내부만
- **Context**: 트리 일부에서만 공유
