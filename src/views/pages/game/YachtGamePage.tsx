import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useGame, getScorePreview } from '../../../hooks/useGame';
import type { YachtCategory } from '../../../hooks/useGame';
import './YachtGamePage.css';

// 주사위 dot 배치 매핑 (3x3 grid 기반)
const DICE_DOT_POSITIONS: Record<number, string[]> = {
    1: ['dot-pos-mm'],
    2: ['dot-pos-tr', 'dot-pos-bl'],
    3: ['dot-pos-tr', 'dot-pos-mm', 'dot-pos-bl'],
    4: ['dot-pos-tl', 'dot-pos-tr', 'dot-pos-bl', 'dot-pos-br'],
    5: ['dot-pos-tl', 'dot-pos-tr', 'dot-pos-mm', 'dot-pos-bl', 'dot-pos-br'],
    6: ['dot-pos-tl', 'dot-pos-tr', 'dot-pos-ml', 'dot-pos-mr', 'dot-pos-bl', 'dot-pos-br'],
};

// 점수 카테고리 표시 정보
const UPPER_CATEGORIES: { key: YachtCategory; label: string; emoji: string }[] = [
    { key: 'ones', label: 'Ones', emoji: '⚀' },
    { key: 'twos', label: 'Twos', emoji: '⚁' },
    { key: 'threes', label: 'Threes', emoji: '⚂' },
    { key: 'fours', label: 'Fours', emoji: '⚃' },
    { key: 'fives', label: 'Fives', emoji: '⚄' },
    { key: 'sixes', label: 'Sixes', emoji: '⚅' },
];

const LOWER_CATEGORIES: { key: YachtCategory; label: string; emoji: string }[] = [
    { key: 'choice', label: 'Choice', emoji: '🎯' },
    { key: 'fourOfAKind', label: '4 of a Kind', emoji: '🃏' },
    { key: 'fullHouse', label: 'Full House', emoji: '🏠' },
    { key: 'smallStraight', label: 'S. Straight', emoji: '📏' },
    { key: 'largeStraight', label: 'L. Straight', emoji: '📐' },
    { key: 'yacht', label: 'Yacht!', emoji: '🚢' },
];

// 주사위 한 개 컴포넌트
function Die({
    value,
    held,
    rolling,
    disabled,
    onClick,
}: {
    value: number;
    held: boolean;
    rolling: boolean;
    disabled: boolean;
    onClick: () => void;
}) {
    const dots = DICE_DOT_POSITIONS[value] || [];

    return (
        <div
            className={`yacht-die ${held ? 'held' : ''} ${rolling ? 'rolling' : ''} ${disabled ? 'disabled' : ''} ${value === 0 ? 'empty' : ''}`}
            onClick={disabled ? undefined : onClick}
            title={held ? '클릭해서 홀드 해제' : '클릭해서 홀드'}
        >
            {dots.map((pos, i) => (
                <div key={i} className={`die-dot ${pos}`} />
            ))}
        </div>
    );
}

export default function YachtGamePage() {
    const { roomId } = useParams<{ roomId: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [rollingDice, setRollingDice] = useState<boolean[]>([false, false, false, false, false]);

    const {
        gameState,
        loading,
        error,
        rollDice,
        toggleHoldDice,
        selectScore,
        isMyTurn,
        currentPlayer,
    } = useGame({
        roomId: roomId || '',
        userId: user?.uid || '',
        userNickname: user?.displayName || '익명',
    });

    // 주사위 미리보기 점수 계산
    const scorePreview = useMemo(() => {
        if (!gameState || gameState.rollsLeft === 3) return null;
        return getScorePreview(gameState.dice);
    }, [gameState?.dice, gameState?.rollsLeft]);

    // 주사위 굴리기 핸들러 (애니메이션 포함)
    const handleRoll = async () => {
        if (!gameState) return;

        // 홀드 안 한 주사위만 흔들기 애니메이션
        const animating = gameState.heldDice.map((held) => !held);
        setRollingDice(animating);

        try {
            await rollDice();
        } catch (err) {
            if (err instanceof Error) alert(err.message);
        }

        setTimeout(() => {
            setRollingDice([false, false, false, false, false]);
        }, 500);
    };

    // 점수 선택 핸들러
    const handleSelectScore = async (category: YachtCategory) => {
        try {
            await selectScore(category);
        } catch (err) {
            if (err instanceof Error) alert(err.message);
        }
    };

    // 주사위 rolling 애니메이션 cleanup
    useEffect(() => {
        return () => setRollingDice([false, false, false, false, false]);
    }, []);

    // --- 렌더링 ---

    if (loading) {
        return (
            <div className="yacht-loading">
                <div className="loading-spinner" />
                <span>게임을 불러오는 중...</span>
            </div>
        );
    }

    if (error || !gameState) {
        return (
            <div className="yacht-error">
                <span>{error || '게임을 찾을 수 없습니다.'}</span>
                <button className="btn btn-primary" onClick={() => navigate('/')}>
                    로비로 돌아가기
                </button>
            </div>
        );
    }

    const turnPlayer = gameState.players.find(
        (p) => p.id === gameState.currentTurnPlayerId
    );

    const canRoll = isMyTurn && gameState.rollsLeft > 0 && gameState.status === 'playing';
    const canHold = isMyTurn && gameState.rollsLeft < 3 && gameState.status === 'playing';
    const canSelectScore = isMyTurn && gameState.rollsLeft < 3 && gameState.status === 'playing';

    // 상단 섹션 합계 계산 (보너스용)
    const upperSum = currentPlayer
        ? ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'].reduce(
            (sum, cat) => sum + (currentPlayer.scores[cat as YachtCategory] ?? 0),
            0
        )
        : 0;

    return (
        <div className="yacht-game">
            {/* 상단 바 */}
            <div className="yacht-top-bar">
                <div className="yacht-round-info">
                    <span className="yacht-round-badge">
                        라운드 {Math.min(gameState.round, 12)} / 12
                    </span>
                    <div className="yacht-rolls-left">
                        <span>남은 굴리기</span>
                        <div className="yacht-rolls-dots">
                            {[0, 1, 2].map((i) => (
                                <div
                                    key={i}
                                    className={`yacht-roll-dot ${i < gameState.rollsLeft ? 'active' : ''}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="yacht-turn-indicator">
                    {turnPlayer && (
                        <>
                            <span
                                className={`turn-name ${turnPlayer.id === user?.uid ? 'my-turn' : ''}`}
                            >
                                {turnPlayer.id === user?.uid ? '내' : turnPlayer.nickname}
                            </span>
                            {' 차례'}
                        </>
                    )}
                </div>

                <button className="yacht-leave-btn" onClick={() => navigate('/')}>
                    나가기
                </button>
            </div>

            {/* 메인 영역 */}
            <div className="yacht-main">
                {/* 주사위 영역 */}
                <div className="yacht-dice-area">
                    <div className="yacht-dice-row">
                        {gameState.dice.map((value, idx) => (
                            <Die
                                key={idx}
                                value={value}
                                held={gameState.heldDice[idx]}
                                rolling={rollingDice[idx]}
                                disabled={!canHold}
                                onClick={() => toggleHoldDice(idx)}
                            />
                        ))}
                    </div>

                    <button
                        className={`yacht-roll-btn ${gameState.rollsLeft === 3 && isMyTurn ? 'first-roll' : ''}`}
                        disabled={!canRoll}
                        onClick={handleRoll}
                    >
                        {gameState.rollsLeft === 3
                            ? '🎲 주사위 굴리기'
                            : `🎲 다시 굴리기 (${gameState.rollsLeft}회 남음)`}
                    </button>

                    {canHold && (
                        <span className="yacht-dice-hint">주사위를 클릭하면 홀드/해제할 수 있습니다</span>
                    )}
                </div>

                {/* 점수판 */}
                <div className="yacht-scoreboard">
                    {/* 상단 섹션 */}
                    <div className="scoreboard-section-title">상단 섹션</div>
                    {UPPER_CATEGORIES.map((cat) => {
                        const confirmed = currentPlayer?.scores[cat.key];
                        const isConfirmed = confirmed !== undefined;
                        const preview = scorePreview?.[cat.key];

                        return (
                            <div
                                key={cat.key}
                                className={`score-row ${!isConfirmed && canSelectScore ? 'selectable' : ''} ${isConfirmed ? 'selected' : ''} ${!isConfirmed && !canSelectScore ? 'disabled' : ''}`}
                                onClick={
                                    !isConfirmed && canSelectScore
                                        ? () => handleSelectScore(cat.key)
                                        : undefined
                                }
                            >
                                <span className="score-label">
                                    <span className="score-emoji">{cat.emoji}</span>
                                    {cat.label}
                                </span>
                                <span
                                    className={`score-value ${isConfirmed ? 'confirmed' : preview !== undefined ? (preview === 0 ? 'zero-preview' : 'preview') : ''}`}
                                >
                                    {isConfirmed ? confirmed : preview !== undefined ? preview : '-'}
                                </span>
                            </div>
                        );
                    })}

                    {/* 보너스 행 */}
                    <div className="score-row bonus-row">
                        <span className="score-label">
                            ✨ 상단 보너스 ({upperSum}/63)
                        </span>
                        <span className="score-value">
                            {currentPlayer?.upperBonus ? '+35' : upperSum >= 63 ? '+35' : '-'}
                        </span>
                    </div>

                    {/* 하단 섹션 */}
                    <div className="scoreboard-section-title lower">하단 섹션</div>
                    {LOWER_CATEGORIES.map((cat) => {
                        const confirmed = currentPlayer?.scores[cat.key];
                        const isConfirmed = confirmed !== undefined;
                        const preview = scorePreview?.[cat.key];

                        return (
                            <div
                                key={cat.key}
                                className={`score-row ${!isConfirmed && canSelectScore ? 'selectable' : ''} ${isConfirmed ? 'selected' : ''} ${!isConfirmed && !canSelectScore ? 'disabled' : ''}`}
                                onClick={
                                    !isConfirmed && canSelectScore
                                        ? () => handleSelectScore(cat.key)
                                        : undefined
                                }
                            >
                                <span className="score-label">
                                    <span className="score-emoji">{cat.emoji}</span>
                                    {cat.label}
                                </span>
                                <span
                                    className={`score-value ${isConfirmed ? 'confirmed' : preview !== undefined ? (preview === 0 ? 'zero-preview' : 'preview') : ''}`}
                                >
                                    {isConfirmed ? confirmed : preview !== undefined ? preview : '-'}
                                </span>
                            </div>
                        );
                    })}

                    {/* 합계 행 */}
                    <div className="score-row total-row">
                        <span className="score-label">총 점수</span>
                        <span className="score-value">{currentPlayer?.totalScore ?? 0}</span>
                    </div>
                </div>
            </div>

            {/* 사이드바 - 플레이어 목록 */}
            <div className="yacht-sidebar">
                <div className="yacht-players-card">
                    <h3>플레이어</h3>
                    {gameState.players.map((player) => (
                        <div
                            key={player.id}
                            className={`yacht-player-item ${player.id === gameState.currentTurnPlayerId ? 'current-turn' : ''} ${player.id === user?.uid ? 'is-me' : ''}`}
                        >
                            <div className="yacht-player-avatar">
                                {player.nickname.charAt(0).toUpperCase()}
                            </div>
                            <div className="yacht-player-info">
                                <div className="yacht-player-name">
                                    {player.nickname}
                                    {player.id === user?.uid && ' (나)'}
                                </div>
                            </div>
                            <div className="yacht-player-score">{player.totalScore}</div>
                            {player.id === gameState.currentTurnPlayerId && (
                                <span className="yacht-player-turn-badge">턴</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* 게임 종료 모달 */}
            {gameState.status === 'finished' && (
                <div className="yacht-game-over-overlay">
                    <div className="yacht-game-over-modal">
                        <div className="game-over-trophy">🏆</div>
                        <h2 className="game-over-title">게임 종료!</h2>
                        <p className="game-over-winner">
                            {gameState.players.find((p) => p.id === gameState.winnerId)?.nickname ||
                                '알 수 없음'}{' '}
                            님이 승리했습니다!
                        </p>

                        <div className="game-over-scores">
                            {[...gameState.players]
                                .sort((a, b) => b.totalScore - a.totalScore)
                                .map((player, idx) => (
                                    <div
                                        key={player.id}
                                        className={`game-over-score-item ${player.id === gameState.winnerId ? 'winner' : ''}`}
                                    >
                                        <span className="player-name">
                                            {idx + 1}. {player.nickname}
                                        </span>
                                        <span className="player-score">{player.totalScore}점</span>
                                    </div>
                                ))}
                        </div>

                        <button className="game-over-btn" onClick={() => navigate('/')}>
                            로비로 돌아가기
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
