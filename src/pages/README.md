# Pages 폴더 작업 가이드

## 📋 목적
페이지 단위 컴포넌트 관리 (각 라우트의 실제 콘텐츠)

## 📁 구조
```
pages/
├── auth/                    # 인증 관련
│   ├── LoginPage.tsx        # 로그인 페이지
│   └── SignupModal.tsx      # 회원가입 모달
│
├── community/               # 커뮤니티
│   ├── LandingPage.tsx      # 랜딩 페이지 (실시간 게임 현황)
│   ├── BoardPage.tsx        # 게시판
│   ├── ShopPage.tsx         # 상점
│   └── ProfilePage.tsx      # 내 정보
│
├── game/                    # 게임 관련
│   ├── GameSelectPage.tsx   # 게임 선택
│   ├── GameLoadingPage.tsx  # 플러그인 로딩
│   ├── GameListPage.tsx     # 방 목록
│   ├── LobbyPage.tsx        # 대기실
│   └── GamePlayPage.tsx     # 게임 플레이
│
└── settings/                # 설정
    └── StoragePage.tsx      # 저장 공간 관리
```

## ✅ 작업 체크리스트

---

## 🔐 auth/ - 인증

### LoginPage.tsx
**필수 기능:**
- [ ] 게스트 로그인 (Firebase Anonymous)
- [ ] Google 로그인 (Firebase OAuth)
- [ ] 회원가입 버튼 → SignupModal 열기
- [ ] 로그인 성공 시 → `/community` 리다이렉트

**UI 요소:**
```tsx
- 로고
- 환영 메시지
- [게스트로 시작하기] 버튼
- [Google로 로그인] 버튼
- [회원가입] 링크
```

**코드 스니펫:**
```tsx
const { loginAnonymously, loginWithGoogle } = useAuth();

const handleAnonymousLogin = async () => {
  await loginAnonymously();
  navigate('/community');
};
```

### SignupModal.tsx
**필수 기능:**
- [ ] 이메일/비밀번호 회원가입
- [ ] 닉네임 입력
- [ ] 유효성 검사
- [ ] 닫기 버튼

---

## 🏠 community/ - 커뮤니티

### LandingPage.tsx
**필수 기능:**
- [ ] Hero 섹션 (소개)
- [ ] 실시간 게임 현황 (Firestore onSnapshot)
  - [ ] 진행 중인 게임 목록
  - [ ] 관전 기능 (추후)
- [ ] 게시판 최근 글 목록
- [ ] CTA 버튼 (게임 시작하기)

**Firestore 구독:**
```tsx
useEffect(() => {
  const q = query(
    collection(db, 'active_games'),
    where('status', '==', 'playing'),
    limit(10)
  );
  
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const games = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setActiveGames(games);
  });
  
  return unsubscribe;
}, []);
```

### BoardPage.tsx
**필수 기능:**
- [ ] 게시글 목록 (Supabase)
- [ ] 페이지네이션
- [ ] 검색 기능
- [ ] 글쓰기 버튼
- [ ] 카테고리 필터

### ShopPage.tsx
**필수 기능:**
- [ ] 상점 카테고리 탭
- [ ] 아이템 그리드 (이모티콘/사운드)
- [ ] 추천 상품 섹션
- [ ] 소유 여부 표시
- [ ] 구매 모달
- [ ] 재화 표시 (코인/젬)

**데이터 로드:**
```tsx
const { categories, items, featured } = useShop();
const { inventory, currency } = useInventory();
```

### ProfilePage.tsx
**필수 기능:**
- [ ] 프로필 정보 (아바타, 닉네임, 칭호)
- [ ] 전적 통계
- [ ] 업적 목록
- [ ] 친구 목록
- [ ] 설정 버튼

---

## 🎮 game/ - 게임

### GameSelectPage.tsx
**필수 기능:**
- [ ] 게임 목록 (API: `/api/plugins/available`)
- [ ] 게임 카드 (썸네일, 이름, 인원, 용량)
- [ ] 설치 상태 표시
- [ ] 클릭 시 → `/games/{gameType}` 이동

**게임 카드 정보:**
```tsx
interface GameCard {
  id: string;
  name: string;
  thumbnail: string;
  minPlayers: number;
  maxPlayers: number;
  size: { total: number };
  isInstalled: boolean;
}
```

### GameLoadingPage.tsx
**필수 기능:**
- [ ] 플러그인 다운로드 (PluginManager)
- [ ] 프로그레스 바 (0-100%)
- [ ] 단계 메시지 표시
- [ ] 로딩 팁/힌트
- [ ] 완료 시 → `/games/{gameType}/list` 리다이렉트

**프로그레스 예시:**
```tsx
await gameRegistry.ensure(
  gameType,
  (progress, stage) => {
    setProgress(progress);
    setStage(stage);
  }
);
```

### GameListPage.tsx
**필수 기능:**
- [ ] 방 목록 (Firestore onSnapshot)
- [ ] 방 생성 버튼
- [ ] 방 입장 버튼
- [ ] 필터 (대기 중만)
- [ ] 방 정보 (호스트, 인원, 상태)

**Firestore 구독:**
```tsx
const lobbiesQuery = query(
  collection(db, 'game_lobbies'),
  where('gameType', '==', selectedGameType),
  where('status', '==', 'waiting')
);
```

### LobbyPage.tsx
**필수 기능:**
- [ ] 플레이어 목록 (useLobby)
- [ ] 준비 버튼 (일반 플레이어)
- [ ] 시작 버튼 (호스트만)
- [ ] 게임 설정 (호스트만)
- [ ] 채팅 (ChatBox)
- [ ] 실시간 동기화

**조건 체크:**
```tsx
const canStart = 
  isHost && 
  players.length >= lobby.minPlayers &&
  players.every(p => p.isReady);
```

### GamePlayPage.tsx
**필수 기능:**
- [ ] 3D 캔버스 (Babylon.js)
- [ ] 게임 상태 동기화 (useGame)
- [ ] 턴 표시기
- [ ] 점수판
- [ ] 게임별 UI (GamePlugin.getGameUI())
- [ ] 액션 버튼
- [ ] 게임 종료 처리

**게임 초기화:**
```tsx
const gamePlugin = gameRegistry.get(gameType);
gamePlugin.initialize(canvasRef.current);
```

---

## ⚙️ settings/ - 설정

### StoragePage.tsx
**필수 기능:**
- [ ] 캐시 사용량 표시
- [ ] 설치된 플러그인 목록
- [ ] 플러그인 삭제 버튼
- [ ] 플러그인 정보 (버전, 크기, 설치일)

---

## 🎨 공통 패턴

### 로딩 상태
```tsx
if (loading) {
  return <Loading message="로딩 중..." />;
}
```

### 에러 처리
```tsx
if (error) {
  return (
    <div className="error">
      <h2>오류 발생</h2>
      <p>{error}</p>
      <button onClick={() => navigate(-1)}>돌아가기</button>
    </div>
  );
}
```

### 빈 상태
```tsx
{items.length === 0 && (
  <div className="empty-state">
    <p>아이템이 없습니다</p>
  </div>
)}
```

## 🔗 의존성

### 필요한 훅
- `useAuth` - 인증
- `useGame` - 게임 상태
- `useLobby` - 로비 상태
- `useChat` - 채팅
- `useShop` - 상점
- `useInventory` - 인벤토리

### 필요한 컴포넌트
- `Loading` - 로딩 스피너
- `Modal` - 모달
- `Button` - 버튼
- `GameCard` - 게임 카드
- `ChatBox` - 채팅창

## 📝 참고사항

- 모든 페이지는 React Router 사용
- 인증이 필요한 페이지는 `ProtectedRoute` 래퍼 사용
- Firestore onSnapshot은 언마운트 시 정리 필수
- 에러 바운더리 권장
- SEO 메타 태그 추가 (react-helmet)
