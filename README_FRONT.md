# Rollup - 보드게임 플랫폼 (프론트엔드)

3D 멀티플레이어 턴제 보드게임 플랫폼

## 기술 스택

- **Frontend**: React 18 + TypeScript + Vite
- **3D Engine**: Babylon.js
- **Routing**: React Router v6
- **State**: Zustand
- **Auth**: Firebase Authentication
- **Database**: Firebase Firestore (실시간), Supabase (영구)
- **Storage**: IndexedDB (플러그인 캐싱)

## 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

http://localhost:3000 에서 확인

### 빌드

```bash
npm run build
```

## 프로젝트 구조

```
src/
├── layouts/          # 레이아웃 컴포넌트
├── pages/           # 페이지 컴포넌트
├── components/      # 재사용 컴포넌트
├── games/           # 게임 플러그인 (동적 로딩)
│   ├── lexio/      # 렉시오 게임
│   └── yacht/      # 야추 게임
├── core/           # 핵심 로직
│   ├── plugins/    # 플러그인 매니저
│   ├── firebase/   # Firebase 설정
│   └── api/        # API 클라이언트
├── hooks/          # 커스텀 훅
├── store/          # 상태 관리
└── styles/         # 스타일
```

## 주요 기능

- ✅ 동적 플러그인 시스템 (게임 다운로드 & 캐싱)
- ✅ 실시간 멀티플레이어 (Firestore)
- ✅ 3D 보드게임 (Babylon.js)
- ✅ 채팅 시스템 (텍스트/이모티콘/사운드)
- ✅ 상점 & 인벤토리
- ✅ 랭크 시스템
- ✅ 친구 시스템

## 환경변수

`.env` 파일 생성:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 개발 가이드

### 새 게임 추가하기

1. `src/games/[game_name]/` 폴더 생성
2. `[GameName]Game.ts` 구현 (`IGamePlugin` 인터페이스)
3. `manifest.json` 작성
4. `GameRegistry`에 등록

자세한 내용은 `docs/plugin-guide.md` 참고

## 라이선스

MIT
