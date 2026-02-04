# Components 폴더 작업 가이드

## 📋 목적
재사용 가능한 UI 컴포넌트 관리

## 📁 구조
```
components/
├── common/                  # 공통 컴포넌트
│   ├── Button.tsx
│   ├── Modal.tsx
│   ├── Loading.tsx
│   ├── Navbar.tsx
│   └── ErrorBoundary.tsx
│
├── chat/                    # 채팅 시스템
│   ├── ChatBox.tsx          # 채팅창 메인
│   ├── ChatInput.tsx        # 입력 영역
│   ├── ChatMessage.tsx      # 메시지 아이템
│   ├── EmoticonPicker.tsx   # 이모티콘 선택
│   ├── SoundPicker.tsx      # 사운드 선택
│   └── ChatSoundPlayer.tsx  # 사운드 재생
│
├── lobby/                   # 로비 관련
│   ├── PlayerList.tsx       # 플레이어 목록
│   ├── PlayerCard.tsx       # 플레이어 카드
│   ├── GameSettings.tsx     # 게임 설정
│   └── ReadyButton.tsx      # 준비 버튼
│
├── game/                    # 게임 관련
│   ├── GameCanvas.tsx       # 3D 캔버스 래퍼
│   ├── TurnIndicator.tsx    # 턴 표시기
│   ├── Scoreboard.tsx       # 점수판
│   └── GameTimer.tsx        # 타이머
│
└── shop/                    # 상점 관련
    ├── ShopCategory.tsx     # 카테고리 탭
    ├── ShopItem.tsx         # 아이템 카드
    ├── ItemPreview.tsx      # 아이템 미리보기
    ├── PurchaseModal.tsx    # 구매 모달
    └── InventoryPanel.tsx   # 인벤토리 패널
```

---

## 📦 common/ - 공통 컴포넌트

### Button.tsx
**Props:**
```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}
```

**사용 예시:**
```tsx
<Button variant="primary" size="large" onClick={handleClick}>
  시작하기
</Button>
```

### Modal.tsx
**Props:**
```tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}
```

**기능:**
- [ ] ESC 키로 닫기
- [ ] 배경 클릭으로 닫기
- [ ] 애니메이션 (fade in/out)
- [ ] Portal 사용 (document.body에 렌더링)

### Loading.tsx
**Props:**
```tsx
interface LoadingProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  fullscreen?: boolean;
}
```

**종류:**
- 스피너 로딩
- 스켈레톤 로딩
- 프로그레스 바

### Navbar.tsx
**필수 기능:**
- [ ] 로고 (클릭 시 홈)
- [ ] 메뉴 아이템
- [ ] 사용자 정보 (아바타, 이름)
- [ ] 드롭다운 메뉴 (설정, 로그아웃)
- [ ] 재화 표시 (코인/젬)
- [ ] 반응형 (모바일: 햄버거 메뉴)

**Props:**
```tsx
interface NavbarProps {
  user?: {
    id: string;
    displayName: string;
    avatar?: string;
  };
  currency?: {
    coins: number;
    gems: number;
  };
}
```

### ErrorBoundary.tsx
**필수 기능:**
- [ ] 에러 캐치
- [ ] 에러 로깅 (Sentry 등)
- [ ] Fallback UI
- [ ] 재시도 버튼

```tsx
<ErrorBoundary fallback={<ErrorFallback />}>
  <App />
</ErrorBoundary>
```

---

## 💬 chat/ - 채팅 시스템

### ChatBox.tsx
**Props:**
```tsx
interface ChatBoxProps {
  roomId: string;
  roomType: 'lobby' | 'game';
}
```

**필수 기능:**
- [ ] 메시지 목록 (스크롤)
- [ ] 자동 스크롤 (새 메시지)
- [ ] 입력창
- [ ] 이모티콘 버튼
- [ ] 사운드 버튼
- [ ] Firestore onSnapshot 연동

**구조:**
```tsx
<div className="chat-box">
  <div className="messages-container">
    {messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
  </div>
  <ChatInput onSend={handleSend} />
</div>
```

### ChatMessage.tsx
**Props:**
```tsx
interface ChatMessageProps {
  message: {
    userId: string;
    userName: string;
    messageType: 'text' | 'emoticon' | 'sound' | 'system';
    textContent?: string;
    emoticonUrl?: string;
    soundUrl?: string;
    timestamp: Timestamp;
  };
}
```

**렌더링:**
- 텍스트: `<p>{text}</p>`
- 이모티콘: `<img src={emoticonUrl} />`
- 사운드: `<div>🔊 사운드 전송됨</div>`
- 시스템: `<div className="system">{text}</div>`

### EmoticonPicker.tsx
**Props:**
```tsx
interface EmoticonPickerProps {
  onSelect: (emoticonId: string) => void;
  onClose: () => void;
}
```

**필수 기능:**
- [ ] 탭 (내 이모티콘 / 상점)
- [ ] 그리드 레이아웃
- [ ] 소유 여부 확인
- [ ] 미리보기 (hover)
- [ ] 검색 기능 (선택)

### SoundPicker.tsx
**Props:**
```tsx
interface SoundPickerProps {
  onSelect: (soundId: string) => void;
  onClose: () => void;
}
```

**필수 기능:**
- [ ] 사운드 목록
- [ ] 미리듣기 버튼
- [ ] 재생 시간 표시
- [ ] 선택 버튼

### ChatSoundPlayer.tsx
**Props:**
```tsx
interface ChatSoundPlayerProps {
  messages: ChatMessage[];
}
```

**필수 기능:**
- [ ] 새 사운드 메시지 감지
- [ ] 자동 재생
- [ ] 볼륨 조절
- [ ] UI 없음 (숨김 컴포넌트)

---

## 🎮 lobby/ - 로비

### PlayerList.tsx
**Props:**
```tsx
interface PlayerListProps {
  players: Player[];
  hostId: string;
  currentUserId: string;
}
```

**표시 정보:**
- [ ] 플레이어 아바타
- [ ] 닉네임
- [ ] 준비 상태 (✓ 또는 ⏳)
- [ ] 호스트 표시 (👑)
- [ ] 나 표시 (강조)

### GameSettings.tsx
**Props:**
```tsx
interface GameSettingsProps {
  gameType: string;
  settings: any;
  isHost: boolean;
  onChange?: (settings: any) => void;
}
```

**설정 항목 (게임별로 다름):**
- 턴 제한 시간
- 점수 목표
- 맵 선택
- 난이도

### ReadyButton.tsx
**Props:**
```tsx
interface ReadyButtonProps {
  isReady: boolean;
  isHost: boolean;
  canStart: boolean;
  onToggleReady: () => void;
  onStart: () => void;
}
```

**로직:**
```tsx
if (isHost) {
  return (
    <Button disabled={!canStart} onClick={onStart}>
      게임 시작
    </Button>
  );
} else {
  return (
    <Button onClick={onToggleReady}>
      {isReady ? '준비 취소' : '준비'}
    </Button>
  );
}
```

---

## 🎯 game/ - 게임

### GameCanvas.tsx
**Props:**
```tsx
interface GameCanvasProps {
  gameType: string;
  gameState: any;
  onAction: (action: any) => void;
}
```

**필수 기능:**
- [ ] Canvas 엘리먼트
- [ ] Babylon.js Scene 초기화
- [ ] 게임 플러그인 로드
- [ ] 리사이즈 핸들링
- [ ] 정리 (cleanup)

**구조:**
```tsx
useEffect(() => {
  const engine = new Engine(canvasRef.current);
  const scene = new Scene(engine);
  
  // 게임 플러그인 초기화
  const game = gameRegistry.get(gameType);
  game.initialize(scene, gameState);
  
  engine.runRenderLoop(() => {
    scene.render();
  });
  
  return () => {
    scene.dispose();
    engine.dispose();
  };
}, [gameType]);
```

### TurnIndicator.tsx
**Props:**
```tsx
interface TurnIndicatorProps {
  currentPlayer: string;
  currentPlayerName: string;
  isMyTurn: boolean;
  timeRemaining?: number;
}
```

**표시:**
```tsx
{isMyTurn ? (
  <div className="turn-indicator my-turn">
    당신의 차례입니다!
  </div>
) : (
  <div className="turn-indicator">
    {currentPlayerName}님의 차례
  </div>
)}
```

### Scoreboard.tsx
**Props:**
```tsx
interface ScoreboardProps {
  players: {
    id: string;
    name: string;
    score: number;
    rank?: number;
  }[];
}
```

**표시:**
- 순위별 정렬
- 강조 (1위: 금, 2위: 은, 3위: 동)
- 내 점수 강조

### GameTimer.tsx
**Props:**
```tsx
interface GameTimerProps {
  seconds: number;
  onExpire: () => void;
}
```

**필수 기능:**
- [ ] 카운트다운
- [ ] 시각적 경고 (10초 이하)
- [ ] 사운드 알림 (선택)
- [ ] 만료 시 콜백

---

## 🛒 shop/ - 상점

### ShopCategory.tsx
**Props:**
```tsx
interface ShopCategoryProps {
  categories: Category[];
  selectedCategory: string;
  onChange: (categoryId: string) => void;
}
```

**UI:**
- 탭 형태
- 아이콘 + 이름
- 활성 카테고리 강조

### ShopItem.tsx
**Props:**
```tsx
interface ShopItemProps {
  item: {
    id: string;
    name: string;
    price: number;
    thumbnail: string;
    isAnimated?: boolean;
  };
  owned: boolean;
  onClick: () => void;
}
```

**표시:**
- [ ] 썸네일
- [ ] 이름
- [ ] 가격 (소유 시 "보유 중")
- [ ] 애니메이션 뱃지
- [ ] NEW/추천 뱃지

### ItemPreview.tsx
**Props:**
```tsx
interface ItemPreviewProps {
  item: ShopItem;
}
```

**기능:**
- 큰 이미지/애니메이션
- 설명
- 미리보기 재생 (사운드)

### PurchaseModal.tsx
**Props:**
```tsx
interface PurchaseModalProps {
  item: ShopItem;
  currency: { coins: number; gems: number };
  onClose: () => void;
  onPurchaseSuccess: () => void;
}
```

**기능:**
- [ ] 아이템 정보
- [ ] 가격 표시
- [ ] 보유 재화 표시
- [ ] 부족 시 경고
- [ ] 구매 확인

---

## 🎨 스타일 가이드

### 컴포넌트 CSS 구조
```css
/* 컴포넌트명.module.css */
.container { }
.header { }
.content { }
.footer { }
```

### 공통 클래스
```css
.loading { }
.error { }
.empty-state { }
.disabled { }
.active { }
```

---

## 🔗 의존성

### 필요한 라이브러리
```json
{
  "@babylonjs/core": "3D 렌더링",
  "firebase": "실시간 데이터",
  "idb": "IndexedDB",
  "react-portal": "Modal"
}
```

### 필요한 훅
- `useAuth`
- `useChat`
- `useGame`
- `useLobby`
- `useShop`

---

## 📝 개발 원칙

1. **단일 책임 원칙** - 하나의 컴포넌트는 하나의 역할
2. **Props 검증** - TypeScript 인터페이스 필수
3. **재사용성** - 공통 로직은 훅으로 분리
4. **접근성** - ARIA 속성 추가
5. **성능** - React.memo, useMemo 활용
6. **테스트** - 주요 컴포넌트 단위 테스트

---

## ✅ 우선순위

### 높음 (즉시 필요)
- [ ] Button, Modal, Loading
- [ ] Navbar
- [ ] ChatBox, ChatMessage
- [ ] PlayerList
- [ ] GameCanvas

### 중간 (추후 필요)
- [ ] EmoticonPicker, SoundPicker
- [ ] ShopItem, PurchaseModal
- [ ] TurnIndicator, Scoreboard

### 낮음 (선택)
- [ ] GameTimer
- [ ] ItemPreview
- [ ] 고급 애니메이션
