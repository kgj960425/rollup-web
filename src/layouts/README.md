# Layouts 폴더 작업 가이드

## 📋 목적
페이지 전체 레이아웃 컴포넌트 관리

## 📁 구조
```
layouts/
├── LoginLayout.tsx          # 로그인/회원가입 레이아웃
├── CommunityLayout.tsx      # 커뮤니티 레이아웃 (네비게이션 바 포함)
├── LobbyLayout.tsx          # 게임 대기실 레이아웃
└── GameLayout.tsx           # 게임 플레이 레이아웃
```

## ✅ 작업 체크리스트

### LoginLayout.tsx
- [ ] 중앙 정렬 레이아웃
- [ ] 로고 영역
- [ ] 콘텐츠 영역 (Outlet)
- [ ] 푸터
- [ ] 배경 애니메이션 (선택)

**예시 구조:**
```tsx
export function LoginLayout() {
  return (
    <div className="login-layout">
      <div className="login-container">
        <div className="logo">
          <img src="/logo.png" alt="Rollup" />
        </div>
        <Outlet />
        <footer>© 2026 Rollup</footer>
      </div>
    </div>
  );
}
```

### CommunityLayout.tsx
- [ ] 네비게이션 바 (상단 고정)
  - [ ] 로고
  - [ ] 메뉴: 게임, 게시판, 상점, 내 정보
  - [ ] 사용자 정보 (아바타, 이름)
  - [ ] 로그아웃 버튼
- [ ] 메인 콘텐츠 영역 (Outlet)
- [ ] 푸터
- [ ] 반응형 디자인

**메뉴 구조:**
```tsx
const menuItems = [
  { path: '/games', label: '게임', icon: '🎮' },
  { path: '/community/board', label: '게시판', icon: '📋' },
  { path: '/community/shop', label: '상점', icon: '🛒' },
  { path: '/community/profile', label: '내 정보', icon: '👤' }
];
```

### LobbyLayout.tsx
- [ ] 3단 레이아웃
  - [ ] 왼쪽: 플레이어 목록 (aside)
  - [ ] 중앙: 게임 설정 (main)
  - [ ] 오른쪽: 실시간 채팅 (aside)
- [ ] 헤더 (방 제목, 방 코드)
- [ ] Firestore onSnapshot 연동
- [ ] 반응형 (모바일: 탭 전환)

**레이아웃 비율:**
```css
.lobby-layout {
  display: grid;
  grid-template-columns: 250px 1fr 300px;
  gap: 16px;
}

@media (max-width: 768px) {
  grid-template-columns: 1fr;
}
```

### GameLayout.tsx
- [ ] 전체 화면 (fullscreen)
- [ ] 게임 에셋 로딩
  - [ ] 프로그레스 바
  - [ ] 로딩 팁 표시
- [ ] 에셋 로드 완료 후 게임 시작
- [ ] ESC 키로 나가기 확인 모달

**에셋 로딩 로직:**
```tsx
useEffect(() => {
  const loadGame = async () => {
    const game = GameRegistry.get(gameType);
    await loadAssets(gameType, game.config.assetList);
    setAssetsLoaded(true);
  };
  loadGame();
}, [gameType]);
```

## 🎨 스타일 가이드

### 공통 CSS 변수
```css
:root {
  --navbar-height: 64px;
  --sidebar-width: 250px;
  --chat-width: 300px;
  --max-content-width: 1440px;
}
```

### 반응형 브레이크포인트
```css
/* Mobile */
@media (max-width: 768px) { }

/* Tablet */
@media (min-width: 769px) and (max-width: 1024px) { }

/* Desktop */
@media (min-width: 1025px) { }
```

## 🔗 의존성

### 필요한 컴포넌트
- `Navbar` (components/common/)
- `PlayerList` (components/lobby/)
- `ChatBox` (components/chat/)
- `Loading` (components/common/)

### 필요한 훅
- `useAuth` - 사용자 인증 정보
- `useLobby` - 로비 상태
- `useGame` - 게임 상태

## 📝 참고사항

- 모든 레이아웃은 `<Outlet />` 사용 (React Router)
- 로딩 상태 처리 필수
- 에러 바운더리 추가 권장
- 접근성 (a11y) 고려
