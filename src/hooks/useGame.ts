import { useState, useEffect, useCallback } from 'react';
import { doc, onSnapshot, updateDoc, collection, query, orderBy, limit, addDoc, serverTimestamp_as_timestamp, serverTimestamp } from 'firebase/firestore';
import { db } from '../core/firebase/config';

// 야추 게임 점수 카테고리
export type YachtCategory =
    | 'ones' | 'twos' | 'threes' | 'fours' | 'fives' | 'sixes' // 상단
    | 'choice' | 'fourOfAKind' | 'fullHouse' | 'smallStraight' | 'largeStraight' | 'yacht'; // 하단

export interface YachtPlayer {
    id: string;
    nickname: string;
    scores: Partial<Record<YachtCategory, number>>;
    totalScore: number;
    upperBonus: boolean;
}

export interface YachtGameState {
    roomId: string;
    players: YachtPlayer[];
    currentTurnPlayerId: string;
    dice: number[]; // 5개의 주사위
    heldDice: boolean[]; // 주사위 홀드 상태
    rollsLeft: number; // 이번 턴에 남은 굴리기 횟수 (최대 3회)
    round: number; // 현재 라운드 (1~12)
    status: 'waiting' | 'playing' | 'finished';
    winnerId?: string;
}

interface UseGameOptions {
    roomId: string;
    userId: string;
    userNickname: string;
}

export const useGame = ({ roomId, userId }: UseGameOptions) => {
    const [gameState, setGameState] = useState<YachtGameState | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 게임 상태 실시간 구독
    useEffect(() => {
        if (!roomId) return;

        const gameRef = doc(db, 'games', roomId);
        const unsubscribe = onSnapshot(
            gameRef,
            (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.data() as YachtGameState;
                    setGameState(data);
                } else {
                    setError('게임을 찾을 수 없습니다.');
                }
                setLoading(false);
            },
            (err) => {
                console.error('Game subscription error:', err);
                setError('게임 상태를 불러오는데 실패했습니다.');
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [roomId]);

    // 주사위 굴리기
    const rollDice = useCallback(async () => {
        if (!gameState || gameState.rollsLeft <= 0) return;
        if (gameState.currentTurnPlayerId !== userId) {
            throw new Error('본인의 턴이 아닙니다.');
        }

        const gameRef = doc(db, 'games', roomId);
        const newDice = gameState.dice.map((die, idx) =>
            gameState.heldDice[idx] ? die : Math.floor(Math.random() * 6) + 1
        );

        await updateDoc(gameRef, {
            dice: newDice,
            rollsLeft: gameState.rollsLeft - 1,
        });
    }, [gameState, roomId, userId]);

    // 주사위 홀드/언홀드 토글
    const toggleHoldDice = useCallback(async (index: number) => {
        if (!gameState) return;
        if (gameState.currentTurnPlayerId !== userId) return;
        if (gameState.rollsLeft === 3) return; // 첫 굴리기 전에는 홀드 불가

        const gameRef = doc(db, 'games', roomId);
        const newHeldDice = [...gameState.heldDice];
        newHeldDice[index] = !newHeldDice[index];

        await updateDoc(gameRef, {
            heldDice: newHeldDice,
        });
    }, [gameState, roomId, userId]);

    // 점수 선택 (턴 종료)
    const selectScore = useCallback(async (category: YachtCategory) => {
        if (!gameState) return;
        if (gameState.currentTurnPlayerId !== userId) {
            throw new Error('본인의 턴이 아닙니다.');
        }

        const currentPlayer = gameState.players.find(p => p.id === userId);
        if (!currentPlayer) return;

        // 이미 선택한 카테고리는 불가
        if (currentPlayer.scores[category] !== undefined) {
            throw new Error('이미 선택한 카테고리입니다.');
        }

        const score = calculateScore(gameState.dice, category);
        const gameRef = doc(db, 'games', roomId);

        // 플레이어 점수 업데이트
        const updatedPlayers = gameState.players.map(player => {
            if (player.id === userId) {
                const newScores = { ...player.scores, [category]: score };
                const upperSum = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes']
                    .reduce((sum, cat) => sum + (newScores[cat as YachtCategory] || 0), 0);
                const upperBonus = upperSum >= 63;
                const totalScore = Object.values(newScores).reduce((sum, s) => sum + (s || 0), 0)
                    + (upperBonus && !player.upperBonus ? 35 : 0);

                return {
                    ...player,
                    scores: newScores,
                    totalScore,
                    upperBonus: upperBonus || player.upperBonus,
                };
            }
            return player;
        });

        // 다음 턴 계산
        const currentPlayerIndex = gameState.players.findIndex(p => p.id === userId);
        const nextPlayerIndex = (currentPlayerIndex + 1) % gameState.players.length;
        const isRoundComplete = nextPlayerIndex === 0;
        const newRound = isRoundComplete ? gameState.round + 1 : gameState.round;

        // 게임 종료 체크 (12라운드 완료)
        const isGameFinished = newRound > 12;

        let winnerId: string | undefined;
        if (isGameFinished) {
            const winner = updatedPlayers.reduce((prev, current) =>
                prev.totalScore > current.totalScore ? prev : current
            );
            winnerId = winner.id;
        }

        await updateDoc(gameRef, {
            players: updatedPlayers,
            currentTurnPlayerId: gameState.players[nextPlayerIndex].id,
            dice: [0, 0, 0, 0, 0],
            heldDice: [false, false, false, false, false],
            rollsLeft: 3,
            round: newRound,
            status: isGameFinished ? 'finished' : 'playing',
            ...(winnerId && { winnerId }),
        });
    }, [gameState, roomId, userId]);

    // 내 턴인지 확인
    const isMyTurn = gameState?.currentTurnPlayerId === userId;

    // 현재 플레이어 정보
    const currentPlayer = gameState?.players.find(p => p.id === userId);

    return {
        gameState,
        loading,
        error,
        rollDice,
        toggleHoldDice,
        selectScore,
        isMyTurn,
        currentPlayer,
    };
};

// 점수 계산 함수
export function calculateScore(dice: number[], category: YachtCategory): number {
    const counts = new Array(7).fill(0);
    dice.forEach(d => counts[d]++);
    const sum = dice.reduce((a, b) => a + b, 0);

    switch (category) {
        case 'ones': return counts[1] * 1;
        case 'twos': return counts[2] * 2;
        case 'threes': return counts[3] * 3;
        case 'fours': return counts[4] * 4;
        case 'fives': return counts[5] * 5;
        case 'sixes': return counts[6] * 6;
        case 'choice': return sum;
        case 'fourOfAKind':
            return counts.some(c => c >= 4) ? sum : 0;
        case 'fullHouse':
            return counts.includes(3) && counts.includes(2) ? sum : 0;
        case 'smallStraight': {
            const sorted = [...new Set(dice)].sort();
            const str = sorted.join('');
            return str.includes('1234') || str.includes('2345') || str.includes('3456') ? 15 : 0;
        }
        case 'largeStraight': {
            const sorted = [...new Set(dice)].sort();
            const str = sorted.join('');
            return str === '12345' || str === '23456' ? 30 : 0;
        }
        case 'yacht':
            return counts.includes(5) ? 50 : 0;
        default:
            return 0;
    }
}

// 가능한 점수 미리보기
export function getScorePreview(dice: number[]): Record<YachtCategory, number> {
    const categories: YachtCategory[] = [
        'ones', 'twos', 'threes', 'fours', 'fives', 'sixes',
        'choice', 'fourOfAKind', 'fullHouse', 'smallStraight', 'largeStraight', 'yacht'
    ];

    return categories.reduce((acc, cat) => {
        acc[cat] = calculateScore(dice, cat);
        return acc;
    }, {} as Record<YachtCategory, number>);
}
