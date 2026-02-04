# Games 폴더 작업 가이드 (게임 플러그인)

## 📋 목적
동적으로 로드되는 게임 플러그인 관리

## 📁 구조
```
games/
├── base.ts                  # 게임 인터페이스 (IGamePlugin)
├── DynamicGameRegistry.ts   # 동적 게임 레지스트리
│
├── lexio/                   # 렉시오 게임
│   ├── index.ts             # 진입점 (default export)
│   ├── manifest.json        # 플러그인 메타데이터
│   ├── LexioGame.ts         # 게임 로직
│   ├── LexioRules.ts        # 게임 규칙
│   ├── LexioBoard.ts        # 3D 보드
│   ├── LexioTile.ts         # 타일 오브젝트
│   └── assets/              # 게임 에셋
│       ├── models/
│       ├── textures/
│       └── sounds/
│
└── yacht/                   # 야추 게임
    ├── index.ts
    ├── manifest.json
    ├── YachtGame.ts
    ├── YachtRules.ts
    └── assets/
```

---

## 🎮 base.ts - 게임 인터페이스

### IGamePlugin 인터페이스
```typescript
export interface IGamePlugin {
  // 메타데이터
  id: string;
  name: string;
  version: string;
  
  // 게임 설정
  config: GameConfig;
  
  // 초기화
  initialize(scene: Scene, gameState: any): void;
  
  // 게임 상태 업데이트
  updateState(newState: any): void;
  
  // 액션 처리
  handleAction(action: any): void;
  
  // UI 렌더링
  getGameUI(): React.ComponentType<any>;
  
  // 정리
  dispose(): void;
}

export interface GameConfig {
  minPlayers: number;
  maxPlayers: number;
  turnTimeLimit: number;
  hasPhysics: boolean;
  has3DBoard: boolean;
  assetList: string[];  // 필요한 에셋 경로
}
```

---

## 🔄 DynamicGameRegistry.ts

### 기능
- 게임 동적 로드
- IndexedDB 캐싱 확인
- 다운로드 & 설치
- 플러그인 등록

### 주요 메서드
```typescript
class DynamicGameRegistry {
  private plugins: Map<string, IGamePlugin> = new Map();
  private pluginManager: PluginManager;
  
  // 게임 준비 (다운로드 + 로드)
  async ensure(
    gameType: string,
    onProgress?: (progress: number, stage: string) => void
  ): Promise<void>
  
  // 게임 가져오기 (동기)
  get(gameType: string): IGamePlugin
  
  // 사용 가능한 게임 목록
  async getAvailable(): Promise<GameMetadata[]>
}
```

### 사용 예시
```typescript
// 게임 로딩 페이지에서
await gameRegistry.ensure('lexio', (progress, stage) => {
  setProgress(progress);
  setStageMessage(stage);
});

// 게임 플레이 페이지에서
const game = gameRegistry.get('lexio');
game.initialize(scene, initialState);
```

---

## 🎲 게임 플러그인 개발 가이드

### 1. 폴더 생성
```bash
games/
└── [game_name]/
    ├── index.ts
    ├── manifest.json
    └── [GameName]Game.ts
```

### 2. manifest.json 작성
```json
{
  "id": "lexio",
  "name": "렉시오",
  "version": "1.0.0",
  "description": "3D 타일 발사 게임",
  "author": "Rollup Team",
  
  "config": {
    "minPlayers": 2,
    "maxPlayers": 4,
    "turnTimeLimit": 30,
    "hasPhysics": true,
    "has3DBoard": true
  },
  
  "assets": {
    "models": [
      "assets/models/tile.glb",
      "assets/models/board.glb"
    ],
    "textures": [
      "assets/textures/tile_diffuse.png",
      "assets/textures/board_normal.png"
    ],
    "sounds": [
      "assets/sounds/tile_slide.mp3",
      "assets/sounds/tile_hit.mp3"
    ]
  },
  
  "thumbnail": "assets/thumbnail.png"
}
```

### 3. index.ts (진입점)
```typescript
import { IGamePlugin } from '../base';
import { LexioGame } from './LexioGame';

// Default export (필수)
const plugin: IGamePlugin = new LexioGame();
export default plugin;
```

### 4. [GameName]Game.ts 구현
```typescript
import { Scene, Mesh, Vector3 } from '@babylonjs/core';
import { IGamePlugin, GameConfig } from '../base';
import { LexioRules } from './LexioRules';
import { LexioBoard } from './LexioBoard';

export class LexioGame implements IGamePlugin {
  id = 'lexio';
  name = '렉시오';
  version = '1.0.0';
  
  config: GameConfig = {
    minPlayers: 2,
    maxPlayers: 4,
    turnTimeLimit: 30,
    hasPhysics: true,
    has3DBoard: true,
    assetList: [
      'models/tile.glb',
      'models/board.glb',
      'textures/tile.png',
      'sounds/slide.mp3'
    ]
  };
  
  private scene: Scene | null = null;
  private board: LexioBoard | null = null;
  private rules: LexioRules = new LexioRules();
  private gameState: any = null;
  
  initialize(scene: Scene, gameState: any): void {
    this.scene = scene;
    this.gameState = gameState;
    
    // 보드 생성
    this.board = new LexioBoard(scene);
    this.board.create();
    
    // 초기 타일 배치
    this.setupInitialTiles(gameState.tiles);
    
    // 카메라 설정
    this.setupCamera();
    
    // 조명 설정
    this.setupLights();
    
    // 입력 핸들러
    this.setupInputHandlers();
  }
  
  updateState(newState: any): void {
    this.gameState = newState;
    
    // 보드 업데이트
    if (this.board) {
      this.board.updateTiles(newState.tiles);
    }
  }
  
  handleAction(action: any): void {
    // 액션 검증
    const valid = this.rules.validateAction(
      this.gameState,
      action
    );
    
    if (!valid) {
      console.error('Invalid action:', action);
      return;
    }
    
    // 서버로 액션 전송
    this.sendActionToServer(action);
  }
  
  getGameUI(): React.ComponentType<any> {
    // 게임별 UI 컴포넌트 반환
    return LexioUI;
  }
  
  dispose(): void {
    // 정리
    if (this.board) {
      this.board.dispose();
    }
    this.scene = null;
  }
  
  private setupCamera(): void {
    // 카메라 로직
  }
  
  private setupLights(): void {
    // 조명 로직
  }
  
  private setupInputHandlers(): void {
    // 입력 핸들러
  }
  
  private setupInitialTiles(tiles: any[]): void {
    // 타일 초기화
  }
  
  private sendActionToServer(action: any): void {
    // API 호출
  }
}
```

### 5. [GameName]Rules.ts (게임 규칙)
```typescript
export class LexioRules {
  validateAction(state: any, action: any): boolean {
    // 턴 확인
    if (action.playerId !== state.currentTurn) {
      return false;
    }
    
    // 타일 선택 유효성
    if (!this.isValidTileSelection(state, action.tileId)) {
      return false;
    }
    
    // 방향 유효성
    if (!this.isValidDirection(state, action.direction)) {
      return false;
    }
    
    return true;
  }
  
  calculateScore(state: any, playerId: string): number {
    // 점수 계산
    const player = state.players.find(p => p.id === playerId);
    return player?.score || 0;
  }
  
  checkWinCondition(state: any): string | null {
    // 승리 조건 체크
    for (const player of state.players) {
      if (player.score >= state.targetScore) {
        return player.id;
      }
    }
    return null;
  }
  
  private isValidTileSelection(state: any, tileId: string): boolean {
    // 로직
    return true;
  }
  
  private isValidDirection(state: any, direction: Vector3): boolean {
    // 로직
    return true;
  }
}
```

### 6. [GameName]Board.ts (3D 보드)
```typescript
import { Scene, Mesh, MeshBuilder, StandardMaterial } from '@babylonjs/core';

export class LexioBoard {
  private scene: Scene;
  private boardMesh: Mesh | null = null;
  private tiles: Map<string, Mesh> = new Map();
  
  constructor(scene: Scene) {
    this.scene = scene;
  }
  
  create(): void {
    // 보드 메쉬 생성
    this.boardMesh = MeshBuilder.CreateBox(
      'board',
      { width: 10, height: 0.5, depth: 10 },
      this.scene
    );
    
    // 재질 설정
    const material = new StandardMaterial('boardMat', this.scene);
    material.diffuseColor = new Color3(0.2, 0.2, 0.3);
    this.boardMesh.material = material;
    
    // 위치 설정
    this.boardMesh.position.y = -0.25;
  }
  
  createTile(id: string, position: Vector3): Mesh {
    const tile = MeshBuilder.CreateBox(
      `tile_${id}`,
      { size: 1 },
      this.scene
    );
    
    tile.position = position;
    this.tiles.set(id, tile);
    
    return tile;
  }
  
  updateTiles(tilesData: any[]): void {
    tilesData.forEach(data => {
      const tile = this.tiles.get(data.id);
      if (tile) {
        tile.position = new Vector3(
          data.position.x,
          data.position.y,
          data.position.z
        );
      }
    });
  }
  
  dispose(): void {
    // 모든 메쉬 제거
    if (this.boardMesh) {
      this.boardMesh.dispose();
    }
    
    this.tiles.forEach(tile => tile.dispose());
    this.tiles.clear();
  }
}
```

---

## 🎨 게임 UI 컴포넌트

### LexioUI.tsx (예시)
```tsx
interface LexioUIProps {
  gameState: any;
  onAction: (action: any) => void;
  isMyTurn: boolean;
}

export function LexioUI({ gameState, onAction, isMyTurn }: LexioUIProps) {
  const [selectedTile, setSelectedTile] = useState<string | null>(null);
  
  const handleShoot = (direction: Vector3) => {
    if (!selectedTile || !isMyTurn) return;
    
    onAction({
      type: 'shoot',
      tileId: selectedTile,
      direction
    });
  };
  
  return (
    <div className="lexio-ui">
      <div className="controls">
        {isMyTurn ? (
          <>
            <p>타일을 선택하고 방향을 정하세요</p>
            <div className="direction-pad">
              <button onClick={() => handleShoot(new Vector3(0, 0, 1))}>↑</button>
              <button onClick={() => handleShoot(new Vector3(-1, 0, 0))}>←</button>
              <button onClick={() => handleShoot(new Vector3(1, 0, 0))}>→</button>
              <button onClick={() => handleShoot(new Vector3(0, 0, -1))}>↓</button>
            </div>
          </>
        ) : (
          <p>상대방의 차례를 기다리는 중...</p>
        )}
      </div>
      
      <div className="score">
        점수: {gameState.players.find(p => p.isMe)?.score || 0}
      </div>
    </div>
  );
}
```

---

## 📦 에셋 관리

### 에셋 폴더 구조
```
games/lexio/assets/
├── models/
│   ├── tile.glb
│   └── board.glb
├── textures/
│   ├── tile_diffuse.png
│   └── tile_normal.png
└── sounds/
    ├── tile_slide.mp3
    └── tile_hit.mp3
```

### 에셋 로딩
```typescript
// PluginManager가 자동 처리
await pluginManager.loadAsset(gameType, 'models/tile.glb');
```

---

## 🔄 게임 라이프사이클

```
1. 사용자가 게임 선택
   ↓
2. GameLoadingPage
   → PluginManager.install() (필요 시)
   → DynamicGameRegistry.ensure()
   ↓
3. 게임 로드 완료
   → /games/{gameType}/list 이동
   ↓
4. 방 생성/입장
   → /lobby/{lobbyId}
   ↓
5. 게임 시작
   → GamePlayPage
   → game.initialize(scene, initialState)
   ↓
6. 게임 진행
   → Firestore onSnapshot (상태 업데이트)
   → game.updateState(newState)
   ↓
7. 액션 발생
   → game.handleAction(action)
   → POST /api/game/{gameType}/action
   ↓
8. 게임 종료
   → game.dispose()
   → 결과 화면
```

---

## ✅ 체크리스트

### 새 게임 추가 시
- [ ] 폴더 생성 (`games/[game_name]/`)
- [ ] `manifest.json` 작성
- [ ] `index.ts` 진입점 생성
- [ ] `[GameName]Game.ts` 구현 (`IGamePlugin`)
- [ ] `[GameName]Rules.ts` 게임 규칙
- [ ] 3D 보드 (필요 시)
- [ ] 게임 UI 컴포넌트
- [ ] 에셋 준비
- [ ] 백엔드 게임 규칙 구현
- [ ] 테스트

---

## 🚀 배포

### 빌드 스크립트
```bash
# 프론트엔드 빌드
npm run build

# 플러그인 번들 추출
node scripts/extract-game-plugins.js

# Firebase Storage 업로드
node scripts/upload-to-firebase.js lexio 1.0.0
```

---

## 📝 참고사항

- 게임은 완전히 독립적으로 동작해야 함
- 공통 유틸은 `games/utils/` 사용
- 모든 에셋은 상대 경로 사용
- 상태는 서버가 권위 (클라이언트는 시각만)
- 물리 엔진 사용 시 Cannon.js or Havok
- 성능 최적화 (LOD, 인스턴싱)
