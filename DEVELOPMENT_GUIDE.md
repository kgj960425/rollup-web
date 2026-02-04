# Rollup 프론트엔드 개발 가이드

## 📋 프로젝트 개요

3D 멀티플레이어 턴제 보드게임 플랫폼 - React + TypeScript + Vite

**기술 스택:**
- React 18 + TypeScript
- Vite (빌드)
- Babylon.js (3D)
- Firebase (Auth, Firestore)
- Zustand (상태관리)
- React Router v6

---

## 📁 프로젝트 구조

```
rollup-front/
├── public/                 # 정적 파일
│   ├── assets/            # 이미지, 아이콘
│   └── vite.svg
│
├── src/
│   ├── layouts/           # 레이아웃 컴포넌트 (4개)
│   │   ├── LoginLayout.tsx
│   │   ├── CommunityLayout.tsx
│   │   ├── LobbyLayout.tsx
│   │   └── GameLayout.tsx
│   │
│   ├── pages/             # 페이지 컴포넌트 (15개+)
│   │   ├── auth/          # 로그인, 회원가입
│   │   ├── community/     # 랜딩, 게시판, 상점, 프로필
│   │   ├── game/          # 게임 선택, 로비, 플레이
│   │   └── settings/      # 설정
│   │
│   ├── components/        # 재사용 컴포넌트 (30개+)
│   │   ├── common/        # Button, Modal, Loading, Navbar
│   │   ├── chat/          # 채팅 시스템
│   │   ├── lobby/         # 로비 컴포넌트
│   │   ├── game/          # 게임 UI
│   │   └── shop/          # 상점
│   │
│   ├── games/             # 게임 플러그인
│   │   ├── base.ts
│   │   ├── DynamicGameRegistry.ts
│   │   ├── lexio/
│   │   ├── yacht/
│   │   └── gomoku/
│   │
│   ├── core/              # 핵심 로직
│   │   ├── firebase/      # Firebase 설정
│   │   ├── api/           # API 클라이언트
│   │   ├── plugins/       # 플러그인 매니저
│   │   └── utils/         # 유틸리티
│   │
│   ├── hooks/             # 커스텀 훅 (7개)
│   │   ├── useAuth.ts
│   │   ├── useGame.ts
│   │   ├── useLobby.ts
│   │   ├── useChat.ts
│   │   ├── useShop.ts
│   │   ├── useInventory.ts
│   │   └── useFirestore.ts
│   │
│   ├── store/             # 전역 상태 (Zustand)
│   │   ├── authStore.ts
│   │   ├── gameStore.ts
│   │   ├── uiStore.ts
│   │   └── notificationStore.ts
│   │
│   ├── router/            # 라우팅
│   │   └── index.tsx
│   │
│   ├── styles/            # 스타일
│   │   └── globals.css
│   │
│   ├── App.tsx            # 루트 컴포넌트
│   └── main.tsx           # 진입점
│
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

---

## 🎯 개발 우선순위

### 🔴 Phase 1 - 기본 인프라 (1-2주)

**목표:** 로그인하고 기본 화면 볼 수 있게

#### 1주차
```
✅ 환경 설정
  ├─ Firebase 프로젝트 생성
  ├─ .env 파일 설정
  └─ npm install

✅ 핵심 설정 파일
  ├─ core/firebase/config.ts
  ├─ core/firebase/auth.ts
  └─ core/api/client.ts

✅ 상태 관리
  ├─ store/authStore.ts
  ├─ store/uiStore.ts
  └─ hooks/useAuth.ts

✅ 공통 컴포넌트
  ├─ components/common/Button.tsx
  ├─ components/common/Modal.tsx
  ├─ components/common/Loading.tsx
  └─ components/common/Navbar.tsx
```

#### 2주차
```
✅ 인증 플로우
  ├─ layouts/LoginLayout.tsx
  ├─ pages/auth/LoginPage.tsx
  └─ 게스트/Google 로그인

✅ 커뮤니티 기본
  ├─ layouts/CommunityLayout.tsx
  ├─ pages/community/LandingPage.tsx
  └─ 네비게이션

✅ 라우팅
  └─ router/index.tsx (전체 라우트 설정)
```

---

### 🟠 Phase 2 - 게임 코어 (2-3주)

**목표:** 게임 하나 완전히 동작

#### 3주차
```
✅ 로비 시스템
  ├─ layouts/LobbyLayout.tsx
  ├─ pages/game/GameListPage.tsx
  ├─ pages/game/LobbyPage.tsx
  ├─ hooks/useLobby.ts
  ├─ components/lobby/PlayerList.tsx
  └─ components/lobby/GameSettings.tsx

✅ 채팅 시스템
  ├─ hooks/useChat.ts
  ├─ components/chat/ChatBox.tsx
  ├─ components/chat/ChatMessage.tsx
  └─ components/chat/ChatInput.tsx
```

#### 4주차
```
✅ 게임 플레이 (오목으로 시작)
  ├─ layouts/GameLayout.tsx
  ├─ pages/game/GamePlayPage.tsx
  ├─ hooks/useGame.ts
  ├─ games/base.ts
  ├─ games/gomoku/GomokuGame.ts
  ├─ components/game/GameCanvas.tsx
  ├─ components/game/TurnIndicator.tsx
  └─ components/game/Scoreboard.tsx
```

#### 5주차
```
✅ 게임 플러그인 시스템
  ├─ games/DynamicGameRegistry.ts
  ├─ core/plugins/PluginManager.ts
  ├─ core/plugins/CacheManager.ts
  ├─ pages/game/GameSelectPage.tsx
  └─ pages/game/GameLoadingPage.tsx
```

---

### 🟡 Phase 3 - 상점 & 소셜 (2주)

**목표:** 이모티콘 사고 친구 추가 가능

#### 6주차
```
✅ 상점 시스템
  ├─ pages/community/ShopPage.tsx
  ├─ hooks/useShop.ts
  ├─ hooks/useInventory.ts
  ├─ components/shop/ShopCategory.tsx
  ├─ components/shop/ShopItem.tsx
  └─ components/shop/PurchaseModal.tsx

✅ 채팅 확장 (이모티콘/사운드)
  ├─ components/chat/EmoticonPicker.tsx
  ├─ components/chat/SoundPicker.tsx
  └─ components/chat/ChatSoundPlayer.tsx
```

#### 7주차
```
✅ 프로필 & 친구
  ├─ pages/community/ProfilePage.tsx
  ├─ components/profile/ProfileCard.tsx
  ├─ components/profile/FriendsList.tsx
  └─ API 연동
```

---

### 🟢 Phase 4 - 추가 게임 & 기능 (지속적)

**목표:** 게임 추가 및 기능 개선

```
✅ 게임 추가
  ├─ games/yacht/YachtGame.ts
  ├─ games/lexio/LexioGame.ts
  └─ games/rummikub/RummikubGame.ts

✅ 추가 기능
  ├─ 랭크 시스템
  ├─ 관전 모드
  ├─ 리플레이
  └─ 업적
```

---

## 📝 단계별 체크리스트

### ✅ Step 1: 환경 설정

```bash
# 1. 패키지 설치
cd rollup-front
npm install

# 2. .env 파일 생성
cp .env.example .env
# Firebase 설정 입력

# 3. 개발 서버 실행
npm run dev
```

**확인사항:**
- [ ] http://localhost:3000 접속 가능
- [ ] Firebase 연결 정상
- [ ] 콘솔 에러 없음

---

### ✅ Step 2: Firebase 설정

**파일 생성 순서:**

#### 1. `src/core/firebase/config.ts`
```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

#### 2. `src/core/firebase/auth.ts`
```typescript
import { signInAnonymously, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from './config';

export const loginAnonymously = async () => {
  const result = await signInAnonymously(auth);
  return result.user;
};

export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
};
```

**확인사항:**
- [ ] Firebase 콘솔에서 프로젝트 생성됨
- [ ] Authentication 활성화됨
- [ ] Firestore Database 생성됨
- [ ] .env에 모든 키 입력됨

---

### ✅ Step 3: 기본 컴포넌트

**생성 순서:**

1. **Button.tsx** (가장 기본)
2. **Loading.tsx** (로딩 표시)
3. **Modal.tsx** (팝업)
4. **Navbar.tsx** (네비게이션)

**각 파일의 위치와 역할은 `src/components/README.md` 참고**

**확인사항:**
- [ ] 각 컴포넌트 단독 렌더링 테스트
- [ ] TypeScript 에러 없음
- [ ] Props 전달 정상

---

### ✅ Step 4: 상태 관리

**생성 순서:**

1. **authStore.ts**
```typescript
import { create } from 'zustand';
import { User } from 'firebase/auth';

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user })
}));
```

2. **useAuth.ts**
```typescript
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/core/firebase/config';
import * as authAPI from '@/core/firebase/auth';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
  }, []);
  
  return {
    user,
    loading,
    loginAnonymously: authAPI.loginAnonymously,
    loginWithGoogle: authAPI.loginWithGoogle
  };
}
```

**확인사항:**
- [ ] Zustand 설치됨
- [ ] Store 생성됨
- [ ] Hook 동작함

---

### ✅ Step 5: 라우팅

**src/router/index.tsx**

```typescript
import { createBrowserRouter } from 'react-router-dom';
import { LoginLayout } from '@/layouts/LoginLayout';
import { CommunityLayout } from '@/layouts/CommunityLayout';
import { LoginPage } from '@/pages/auth/LoginPage';
import { LandingPage } from '@/pages/community/LandingPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginLayout />,
    children: [
      { index: true, element: <LoginPage /> }
    ]
  },
  {
    path: '/community',
    element: <CommunityLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'shop', element: <ShopPage /> },
      { path: 'profile', element: <ProfilePage /> }
    ]
  }
]);
```

**확인사항:**
- [ ] 라우트 이동 가능
- [ ] Layout 적용됨
- [ ] 404 처리됨

---

### ✅ Step 6: 로그인 페이지

**pages/auth/LoginPage.tsx**

```typescript
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/Button';

export function LoginPage() {
  const { loginAnonymously, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  
  const handleGuestLogin = async () => {
    await loginAnonymously();
    navigate('/community');
  };
  
  return (
    <div className="login-page">
      <h1>Rollup</h1>
      <p>보드게임 플랫폼</p>
      
      <Button onClick={handleGuestLogin}>
        게스트로 시작하기
      </Button>
      
      <Button onClick={loginWithGoogle}>
        Google로 로그인
      </Button>
    </div>
  );
}
```

**확인사항:**
- [ ] 로그인 버튼 클릭 가능
- [ ] Firebase 인증 성공
- [ ] /community로 리다이렉트

---

## 🔧 개발 팁

### TypeScript 경로 별칭

**tsconfig.json에 이미 설정됨:**
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**사용 예시:**
```typescript
// ✅ 좋음
import { Button } from '@/components/common/Button';

// ❌ 나쁨
import { Button } from '../../../components/common/Button';
```

---

### 컴포넌트 작성 패턴

```typescript
// 1. Import
import { useState } from 'react';
import { Button } from '@/components/common/Button';

// 2. Interface
interface MyComponentProps {
  title: string;
  onSubmit: () => void;
}

// 3. Component
export function MyComponent({ title, onSubmit }: MyComponentProps) {
  const [value, setValue] = useState('');
  
  return (
    <div>
      <h2>{title}</h2>
      <Button onClick={onSubmit}>Submit</Button>
    </div>
  );
}
```

---

### 상태 관리 패턴

**전역 상태 (Zustand):**
- 인증 정보
- 게임 현재 상태
- UI 상태 (모달 등)

**로컬 상태 (useState):**
- 폼 입력
- 토글 상태
- 임시 데이터

**서버 상태 (hooks):**
- useAuth
- useGame
- useLobby

---

### Firestore 실시간 구독 패턴

```typescript
useEffect(() => {
  const unsubscribe = onSnapshot(
    doc(db, 'collection', id),
    (snapshot) => {
      setData(snapshot.data());
    }
  );
  
  return unsubscribe; // ⭐ 정리 필수!
}, [id]);
```

---

## 🐛 일반적인 문제 해결

### 1. Firebase 연결 안 됨
```
❌ Firebase: Error (auth/invalid-api-key)
```
**해결:** `.env` 파일의 `VITE_FIREBASE_API_KEY` 확인

---

### 2. 모듈을 찾을 수 없음
```
❌ Cannot find module '@/components/...'
```
**해결:**
```bash
# tsconfig 재시작
npm run dev (재시작)
```

---

### 3. Babylon.js 에러
```
❌ scene.dispose is not a function
```
**해결:** useEffect cleanup에서 정리
```typescript
useEffect(() => {
  const scene = new Scene(engine);
  
  return () => {
    scene.dispose();
    engine.dispose();
  };
}, []);
```

---

### 4. 무한 리렌더링
```
❌ Too many re-renders
```
**해결:** useEffect 의존성 배열 확인
```typescript
// ❌ 나쁨
useEffect(() => {
  setData(fetchData());
}, [data]); // data 변경 → setData → data 변경 → 무한 루프

// ✅ 좋음
useEffect(() => {
  fetchData().then(setData);
}, []); // 한 번만 실행
```

---

## 📚 각 폴더별 상세 가이드

### 📖 상세 문서 위치

1. **layouts/** → `src/layouts/README.md`
2. **pages/** → `src/pages/README.md`
3. **components/** → `src/components/README.md`
4. **games/** → `src/games/README.md`
5. **core/** → `src/core/README.md`
6. **hooks/** → `src/hooks/README.md`
7. **store/** → `src/store/README.md`

**각 README.md 파일에는 다음 내용이 포함됨:**
- 폴더 구조
- 작업 체크리스트
- 코드 예시
- 사용 방법
- 주의사항

---

## 🎯 마일스톤

### Milestone 1: MVP (7주)
```
✅ 로그인/로그아웃
✅ 게임 1개 완전 동작 (오목)
✅ 로비 시스템
✅ 채팅 (텍스트)
```

### Milestone 2: 확장 (4주)
```
✅ 게임 2개 추가 (야추, 렉시오)
✅ 상점 & 인벤토리
✅ 채팅 (이모티콘/사운드)
✅ 프로필 & 친구
```

### Milestone 3: 고도화 (지속)
```
✅ 랭크 시스템
✅ 관전 모드
✅ 리플레이
✅ 업적
```

---

## 🚀 시작하기

### 1. 설치
```bash
cd rollup-front
npm install
```

### 2. 환경변수 설정
```bash
# .env 파일 생성
VITE_FIREBASE_API_KEY=your_key_here
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. 개발 서버 실행
```bash
npm run dev
```

### 4. 첫 번째 작업 시작
```
Phase 1, Step 2부터 시작하세요!
→ src/core/firebase/config.ts 생성
```

---

## 📞 도움말

- **에러 발생 시:** 콘솔 로그 확인
- **구조 궁금할 때:** 각 폴더 README.md 참고
- **예시 필요할 때:** 코드 스니펫 활용
- **막힐 때:** 단계별로 천천히 진행

---

**화이팅! 🎮✨**
