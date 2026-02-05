import { useState, useEffect, useRef } from 'react';
import { collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebase';

export interface ChatMessage {
    id: string;
    userId: string;
    nickname: string;
    text: string;
    timestamp: Date;
}

interface UseChatOptions {
    roomId: string;
    userId: string;
    userNickname: string;
    messageLimit?: number;
}

export const useChat = ({ roomId, userId, userNickname, messageLimit = 100 }: UseChatOptions) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    // 메시지 실시간 구독
    useEffect(() => {
        if (!roomId) return;

        const chatRef = collection(db, 'rooms', roomId, 'chat');
        const q = query(chatRef, orderBy('timestamp', 'asc'), limit(messageLimit));

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const messageList: ChatMessage[] = snapshot.docs.map((doc) => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        userId: data.userId,
                        nickname: data.nickname,
                        text: data.text,
                        timestamp: data.timestamp?.toDate() || new Date(),
                    };
                });

                setMessages(messageList);
                setLoading(false);
            },
            (err) => {
                console.error('Error fetching chat messages:', err);
                setError('채팅을 불러오는데 실패했습니다.');
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [roomId, messageLimit]);

    // 메시지 전송
    const sendMessage = async (text: string) => {
        if (!roomId || !userId || !text.trim()) return;

        try {
            const chatRef = collection(db, 'rooms', roomId, 'chat');
            await addDoc(chatRef, {
                userId,
                nickname: userNickname,
                text: text.trim(),
                timestamp: serverTimestamp(),
            });
        } catch (err) {
            console.error('Failed to send message:', err);
            throw err;
        }
    };

    // 시스템 메시지 전송 (입장/퇴장 등)
    const sendSystemMessage = async (text: string) => {
        if (!roomId) return;

        try {
            const chatRef = collection(db, 'rooms', roomId, 'chat');
            await addDoc(chatRef, {
                userId: 'system',
                nickname: '시스템',
                text,
                timestamp: serverTimestamp(),
            });
        } catch (err) {
            console.error('Failed to send system message:', err);
        }
    };

    return {
        messages,
        loading,
        error,
        sendMessage,
        sendSystemMessage,
        messagesEndRef,
    };
};
