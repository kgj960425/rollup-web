# Rollup Web Phase 2 진행 기록

## 📅 작업 일시
2026-02-04 ~ 2026-02-05

---

## ✅ 완료된 작업

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
- Phase 0: 환경 설정 ✅
- Phase 1: 기본 인프라 ✅
- Phase 2: 로비/채팅 시스템 진행중 (35%)

### 4. useGame.ts 훅 생성 (야추 게임용)
- **파일**: `src/hooks/useGame.ts`
- **기능**: Firestore 실시간 구독, 주사위 굴리기, 점수 계산

---

## 🔄 다음 작업 (미완료)

| 작업 | 설명 |
|------|------|
| GamePage.tsx | 게임 진행 페이지 UI |
| 야추 주사위 컴포넌트 | 3D 스타일 주사위 UI |
| 야추 점수판 컴포넌트 | 점수 선택 및 표시 |
| App.tsx 라우트 연결 | `/game/:roomId` 페이지 연결 |

---

## 📁 변경된 파일

```
src/components/chat/ChatBox.tsx (수정)
src/hooks/useGame.ts (신규)
src/views/pages/room/WaitingRoomPage.css (수정)
TODO.md (수정)
```
