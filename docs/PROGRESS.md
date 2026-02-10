# Rollup Web 진행 기록

---

## 📅 2026-02-10 작업 내용

### 1. Firebase 연결 상태 점검
- **Firebase 프로젝트 (`rollup-e11ce`)**: 정상 동작 확인
- **Firestore**: 보안 규칙 정상 적용 (인증 없이 접근 시 403 반환)
- **Firebase Auth**: OAuth 핸들러 정상 응답
- **프론트엔드 `.env`**: 모든 Firebase 키 정상 입력 확인
- **TypeScript 빌드**: 통과 / **Vite 빌드**: 성공 / **Dev 서버**: 정상 (200)

### 2. useGame.ts import 오류 수정
- **파일**: `src/hooks/useGame.ts`
- **변경사항**:
  - 잘못된 import 경로 수정: `../core/firebase/config` → `../firebase/firebase`
  - 존재하지 않는 `serverTimestamp_as_timestamp` export 제거
  - 미사용 import (`collection`, `query`, `orderBy`, `limit`, `addDoc`, `serverTimestamp`) 제거

### 3. rollup-core 백엔드 분석 완료
- **기술 스택**: Python FastAPI (Spring Boot 아님)
- **현재 상태**:
  - 로비 API (`routes/lobby.py`) 구현 완료
  - Firebase Admin SDK 설정 있음 (mock 모드 fallback)
  - Supabase 클라이언트 설정 있음 (mock 모드 fallback)
  - 게임 플러그인 아키텍처 (`games/base.py`, `games/__init__.py`) 구현 완료
- **미구현 사항**:
  - JWT 토큰 검증 미들웨어 (`core/middleware/auth.py`) 없음
  - 인증 API 엔드포인트 (`routes/auth.py`) 없음
  - 유저 관리 서비스 (`core/services/user_service.py`) 없음
  - 로비 라우트에 하드코딩된 테스트 유저 사용 중

### 4. 백엔드 서버 상태 확인
- **Cloudtype 서버** (`port-0-rollup-api-...cloudtype.app`): 404 응답 → 서버 꺼져있거나 엔드포인트 변경됨

---

## 📅 2026-02-04 ~ 2026-02-05 작업 내용

### 1. ChatBox.tsx lint 에러 수정
- **파일**: `src/components/chat/ChatBox.tsx`
- **내용**: 사용되지 않는 `formatTime` 함수 제거

### 2. 대기실 CSS 레이아웃 개선
- **파일**: `src/views/pages/room/WaitingRoomPage.css`
- **변경사항**:
  - `max-width: 900px` → `1200px` 확장
  - 2열 그리드 → 3열 그리드 (플레이어/설정/채팅)
  - 태블릿(1024px) 및 모바일(768px) 반응형 미디어 쿼리 추가

### 3. TODO.md 진행상황 업데이트
- Phase 0: 환경 설정 완료
- Phase 1: 기본 인프라 완료
- Phase 2: 로비/채팅 시스템 진행중 (35%)

### 4. useGame.ts 훅 생성 (야추 게임용)
- **파일**: `src/hooks/useGame.ts`
- **기능**: Firestore 실시간 구독, 주사위 굴리기, 점수 계산

---

## 🔴 다음 작업 (우선순위순)

### P0: 백엔드 인증 연계 (rollup-core)

| 작업 | 파일 (rollup-core) | 설명 |
|------|---------------------|------|
| JWT 미들웨어 생성 | `core/middleware/auth.py` | Firebase ID Token 검증 |
| Auth API 엔드포인트 | `routes/auth.py` | `/api/auth/verify`, `/api/auth/register` 등 |
| 유저 서비스 | `core/services/user_service.py` | Supabase 유저 CRUD |
| 로비 라우트 인증 적용 | `routes/lobby.py` | 하드코딩 테스트 유저 제거 → 실제 JWT 인증 |
| 프론트 API 조정 | `src/backend/api.tsx` (rollup-web) | 백엔드 엔드포인트 매칭 확인 |

### P1: 야추 게임 플레이 UI (rollup-web)

| 작업 | 설명 |
|------|------|
| `GamePage.tsx` 생성 | 게임 진행 메인 페이지 UI |
| 야추 주사위 컴포넌트 | 주사위 5개 표시, 홀드/굴리기 |
| 야추 점수판 컴포넌트 | 카테고리별 점수 선택/표시 |
| `App.tsx` 라우트 연결 | `/game/:roomId` 페이지 연결 |

---

## 📊 전체 현황 요약

| 영역 | 상태 | 진행률 |
|------|------|--------|
| 프론트 - Phase 0 (초기 설정) | Supabase 연동 제외 완료 | 90% |
| 프론트 - Phase 1 (기본 인프라) | 완료 | 100% |
| 프론트 - Phase 2 (게임 코어) | 로비/채팅 완료, 게임 UI 미구현 | 40% |
| 백엔드 - 인증 (JWT/Firebase) | 미구현 | 0% |
| 백엔드 - 로비 API | 완료 (테스트 유저 하드코딩) | 80% |
| 백엔드 - 게임 API | 미구현 | 0% |
| 프론트-백엔드 연계 | Firebase Auth 토큰 전송 코드 있음, 백엔드 검증 없음 | 20% |

---

## 📁 변경된 파일 (전체)

```
src/components/chat/ChatBox.tsx (수정)
src/hooks/useGame.ts (신규 → import 오류 수정)
src/views/pages/room/WaitingRoomPage.css (수정)
TODO.md (수정)
docs/PROGRESS.md (수정)
```
