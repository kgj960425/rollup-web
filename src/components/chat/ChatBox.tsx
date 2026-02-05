import { useState, useEffect, useRef } from 'react';
import { useChat, type ChatMessage } from '../../hooks/useChat';
import './ChatBox.css';

interface ChatBoxProps {
    roomId: string;
    userId: string;
    userNickname: string;
}

const ChatBox = ({ roomId, userId, userNickname }: ChatBoxProps) => {
    const [inputText, setInputText] = useState('');
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    const { messages, loading, sendMessage } = useChat({
        roomId,
        userId,
        userNickname,
    });

    // 새 메시지가 오면 스크롤
    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        try {
            await sendMessage(inputText);
            setInputText('');
        } catch (err) {
            console.error('Failed to send message:', err);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <div className="chat-box">
            <div className="chat-header">
                <h4>💬 채팅</h4>
            </div>

            <div className="chat-messages" ref={messagesContainerRef}>
                {loading ? (
                    <div className="chat-loading">채팅을 불러오는 중...</div>
                ) : messages.length === 0 ? (
                    <div className="chat-empty">아직 메시지가 없습니다.</div>
                ) : (
                    messages.map((message) => (
                        <ChatMessageItem
                            key={message.id}
                            message={message}
                            isOwn={message.userId === userId}
                            isSystem={message.userId === 'system'}
                        />
                    ))
                )}
            </div>

            <form className="chat-input-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="메시지를 입력하세요..."
                    maxLength={200}
                />
                <button type="submit" disabled={!inputText.trim()}>
                    전송
                </button>
            </form>
        </div>
    );
};

interface ChatMessageItemProps {
    message: ChatMessage;
    isOwn: boolean;
    isSystem: boolean;
}

const ChatMessageItem = ({ message, isOwn, isSystem }: ChatMessageItemProps) => {
    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (isSystem) {
        return (
            <div className="chat-message system">
                <span className="message-text">{message.text}</span>
            </div>
        );
    }

    return (
        <div className={`chat-message ${isOwn ? 'own' : ''}`}>
            {!isOwn && <span className="message-nickname">{message.nickname}</span>}
            <div className="message-content">
                <span className="message-text">{message.text}</span>
                <span className="message-time">{formatTime(message.timestamp)}</span>
            </div>
        </div>
    );
};

export default ChatBox;
