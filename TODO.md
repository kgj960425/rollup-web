# Rollup 프론트엔드 TODO 체크리스트

## 📋 전체 진행률 추적

**현재 Phase:** Phase 0 (설정)  
**진행률:** 0% (0/100)

---

## Phase 0: 초기 설정 (완료 필수)

### 환경 설정
- [ ] `npm install` 실행
- [ ] `.env` 파일 생성 및 Firebase 키 입력
- [ ] `npm run dev` 실행 확인
- [ ] Firebase 프로젝트 생성
- [ ] Firebase Authentication 활성화
- [ ] Firestore Database 생성
- [ ] Supabase 프로젝트 생성 (백엔드 연동용)

---

## Phase 1: 기본 인프라 (1-2주)

### 🔥 Firebase 설정
- [ ] `src/core/firebase/config.ts` 생성
- [ ] `src/core/firebase/auth.ts` 생성
- [ ] `src/core/firebase/firestore.ts` 생성
- [ ] Firebase 연결 테스트

### 🌐 API 클라이언트
- [ ] `src/core/api/client.ts` 생성
- [ ] Axios 인터셉터 설정 (JWT 자동 추가)

### 📦 상태 관리 (Zustand)
- [ ] `src/store/authStore.ts` 생성
- [ ] `src/store/uiStore.ts` 생성
- [ ] `src/store/gameStore.ts` 생성
- [ ] `src/store/notificationStore.ts` 생성

### 🎣 커스텀 훅
- [ ] `src/hooks/useAuth.ts` 생성
- [ ] onAuthStateChanged 연동

### 🎨 공통 컴포넌트
- [ ] `src/components/common/Button.tsx` 생성
- [ ] `src/components/common/Loading.tsx` 생성
- [ ] `src/components/common/Modal.tsx` 생성
- [ ] `src/components/common/Navbar.tsx` 생성
- [ ] `src/components/common/ErrorBoundary.tsx` 생성

### 📐 레이아웃
- [ ] `src/layouts/LoginLayout.tsx` 생성
- [ ] `src/layouts/CommunityLayout.tsx` 생성

### 📄 페이지
- [ ] `src/pages/auth/LoginPage.tsx` 생성
- [ ] `src/pages/community/LandingPage.tsx` 생성

### 🛣️ 라우팅
- [ ] `src/router/index.tsx` 전체 라우트 설정
- [ ] 로그인 → 커뮤니티 플로우 테스트

### ✅ Phase 1 완료 확인
- [ ] 게스트 로그인 가능
- [ ] Google 로그인 가능
- [ ] 커뮤니티 랜딩 페이지 표시
- [ ] 네비게이션 바 동작

---

## Phase 2: 게임 코어 (2-3주)

### 🏠 로비 시스템
- [ ] `src/layouts/LobbyLayout.tsx` 생성
- [ ] `src/pages/game/GameSelectPage.tsx` 생성
- [ ] `src/pages/game/GameListPage.tsx` 생성
- [ ] `src/pages/game/LobbyPage.tsx` 생성
- [ ] `src/hooks/useLobby.ts` 생성
- [ ] `src/components/lobby/PlayerList.tsx` 생성
- [ ] `src/components/lobby/PlayerCard.tsx` 생성
- [ ] `src/components/lobby/GameSettings.tsx` 생성
- [ ] `src/components/lobby/ReadyButton.tsx` 생성

### 💬 채팅 시스템
- [ ] `src/hooks/useChat.ts` 생성
- [ ] `src/components/chat/ChatBox.tsx` 생성
- [ ] `src/components/chat/ChatMessage.tsx` 생성
- [ ] `src/components/chat/ChatInput.tsx` 생성
- [ ] Firestore 실시간 구독 연동

### 🎮 게임 플레이 (오목 우선)
- [ ] `src/layouts/GameLayout.tsx` 생성
- [ ] `src/pages/game/GamePlayPage.tsx` 생성
- [ ] `src/hooks/useGame.ts` 생성
- [ ] `src/games/base.ts` (게임 인터페이스) 생성
- [ ] `src/games/gomoku/GomokuGame.ts` 생성
- [ ] `src/games/gomoku/GomokuBoard.ts` 생성
- [ ] `src/games/gomoku/GomokuUI.tsx` 생성
- [ ] `src/components/game/GameCanvas.tsx` 생성
- [ ] `src/components/game/TurnIndicator.tsx` 생성
- [ ] `src/components/game/Scoreboard.tsx` 생성

### ✅ Phase 2 완료 확인
- [ ] 로비 생성 가능
- [ ] 로비 입장 가능
- [ ] 채팅 전송/수신 가능
- [ ] 게임 시작 가능
- [ ] 오목 한 판 완전히 플레이 가능
- [ ] 승리 조건 동작

---

## Phase 3: 플러그인 시스템 (1-2주)

### 🔌 플러그인 매니저
- [ ] `src/core/plugins/PluginManager.ts` 생성
- [ ] `src/core/plugins/CacheManager.ts` 생성
- [ ] `src/core/plugins/AssetLoader.ts` 생성
- [ ] `src/games/DynamicGameRegistry.ts` 생성
- [ ] IndexedDB 캐싱 구현

### 📥 플러그인 로딩
- [ ] `src/pages/game/GameLoadingPage.tsx` 생성
- [ ] 프로그레스 바 구현
- [ ] 에러 처리

### 🎲 게임 추가
- [ ] `src/games/yacht/YachtGame.ts` 생성
- [ ] `src/games/yacht/YachtRules.ts` 생성
- [ ] `src/games/yacht/YachtUI.tsx` 생성

### ✅ Phase 3 완료 확인
- [ ] 게임 선택 화면에서 목록 표시
- [ ] 게임 다운로드 & 설치 가능
- [ ] 캐시된 게임 빠르게 로드
- [ ] 야추 플레이 가능

---

## Phase 4: 상점 & 소셜 (2주)

### 🛒 상점 시스템
- [ ] `src/pages/community/ShopPage.tsx` 생성
- [ ] `src/hooks/useShop.ts` 생성
- [ ] `src/hooks/useInventory.ts` 생성
- [ ] `src/core/api/shop.ts` (API 클라이언트) 생성
- [ ] `src/components/shop/ShopCategory.tsx` 생성
- [ ] `src/components/shop/ShopItem.tsx` 생성
- [ ] `src/components/shop/ItemPreview.tsx` 생성
- [ ] `src/components/shop/PurchaseModal.tsx` 생성
- [ ] `src/components/shop/InventoryPanel.tsx` 생성

### 💬 채팅 확장
- [ ] `src/components/chat/EmoticonPicker.tsx` 생성
- [ ] `src/components/chat/SoundPicker.tsx` 생성
- [ ] `src/components/chat/ChatSoundPlayer.tsx` 생성
- [ ] 이모티콘 전송 구현
- [ ] 사운드 전송 구현
- [ ] 자동 재생 구현

### 👤 프로필 & 친구
- [ ] `src/pages/community/ProfilePage.tsx` 생성
- [ ] `src/components/profile/ProfileCard.tsx` 생성
- [ ] `src/components/profile/FriendsList.tsx` 생성
- [ ] `src/components/profile/StatsCard.tsx` 생성

### ✅ Phase 4 완료 확인
- [ ] 상점에서 아이템 구매 가능
- [ ] 채팅에서 이모티콘 전송 가능
- [ ] 채팅에서 사운드 전송 가능
- [ ] 프로필 페이지 표시
- [ ] 전적 확인 가능

---

## Phase 5: 추가 게임 (지속적)

### 🎲 렉시오 (3D 타일 게임)
- [ ] `src/games/lexio/LexioGame.ts` 생성
- [ ] `src/games/lexio/LexioBoard.ts` (3D) 생성
- [ ] `src/games/lexio/LexioTile.ts` 생성
- [ ] `src/games/lexio/LexioPhysics.ts` 생성
- [ ] `src/games/lexio/LexioUI.tsx` 생성
- [ ] Babylon.js 물리 엔진 연동

### 🎴 루미큐브
- [ ] `src/games/rummikub/RummikubGame.ts` 생성
- [ ] `src/games/rummikub/RummikubBoard.ts` 생성
- [ ] `src/games/rummikub/RummikubUI.tsx` 생성
- [ ] 타일 조합 검증 로직

### ✅ Phase 5 완료 확인
- [ ] 렉시오 플레이 가능
- [ ] 루미큐브 플레이 가능
- [ ] 총 4개 게임 동작

---

## Phase 6: 고급 기능 (선택)

### 📊 랭크 시스템
- [ ] `src/pages/community/LeaderboardPage.tsx` 생성
- [ ] `src/components/rank/RankBadge.tsx` 생성
- [ ] `src/components/rank/RankProgressBar.tsx` 생성
- [ ] 매치메이킹 큐 구현

### 👀 관전 모드
- [ ] `src/pages/game/SpectatorMode.tsx` 생성
- [ ] `src/components/game/SpectatorList.tsx` 생성
- [ ] 관전자 채팅 구현

### 🎬 리플레이
- [ ] `src/pages/game/ReplayPage.tsx` 생성
- [ ] 액션 로그 재생 구현
- [ ] 배속 조절 구현

### 🏆 업적
- [ ] `src/pages/community/AchievementsPage.tsx` 생성
- [ ] `src/components/achievements/AchievementCard.tsx` 생성
- [ ] 데일리 미션 구현

---

## 🐛 버그 수정 & 개선

### 성능 최적화
- [ ] React.memo 적용
- [ ] useMemo/useCallback 최적화
- [ ] 이미지 레이지 로딩
- [ ] 코드 스플리팅

### 접근성
- [ ] ARIA 속성 추가
- [ ] 키보드 네비게이션
- [ ] 스크린 리더 지원

### 반응형
- [ ] 모바일 레이아웃
- [ ] 태블릿 레이아웃
- [ ] 터치 이벤트

### 테스트
- [ ] 단위 테스트 (Jest)
- [ ] E2E 테스트 (Playwright)
- [ ] 통합 테스트

---

## 📦 배포 준비

- [ ] 프로덕션 빌드 테스트
- [ ] Firebase Hosting 설정
- [ ] 환경변수 프로덕션 설정
- [ ] 에러 로깅 (Sentry)
- [ ] 애널리틱스 (GA4)
- [ ] SEO 최적화

---

## 📝 문서화

- [ ] 컴포넌트 Storybook
- [ ] API 문서
- [ ] 사용자 가이드
- [ ] 개발자 가이드

---

## 🎯 현재 해야 할 작업

**다음 작업:**
1. [ ] Phase 0 완료 → 환경 설정
2. [ ] Phase 1 시작 → Firebase 설정부터

**우선순위:**
```
🔴 Phase 0, 1 (필수)
🟠 Phase 2, 3 (핵심)
🟡 Phase 4 (중요)
🟢 Phase 5, 6 (선택)
```

---

## 💡 작업 팁

- 한 번에 하나의 Phase씩 진행
- 각 Phase 완료 후 테스트
- 막히면 해당 폴더 README.md 참고
- 커밋은 자주, 의미 있는 단위로

---

**진행하면서 체크하세요! ✅**
