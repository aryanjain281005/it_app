import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { Send, X, Image as ImageIcon, Paperclip, Smile } from 'lucide-react';
import Button from './ui/Button';
import Card from './ui/Card';
import toast from 'react-hot-toast';

const ChatWindow = ({ booking, onClose }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [typing, setTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const chatChannel = useRef(null);

    // Determine the other user in the conversation
    const otherUser = user.id === booking.user_id 
        ? (booking.service?.provider || booking.provider)
        : booking.user;

    console.log('Chat Debug:', { booking, otherUser, currentUserId: user.id });

    useEffect(() => {
        fetchMessages();
        subscribeToMessages();
        
        return () => {
            if (chatChannel.current) {
                supabase.removeChannel(chatChannel.current);
            }
        };
    }, [booking.id]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchMessages = async () => {
        try {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .eq('booking_id', booking.id)
                .order('created_at', { ascending: true });

            if (error) throw error;
            setMessages(data || []);
        } catch (error) {
            console.error('Error fetching messages:', error);
            toast.error('Failed to load messages');
        }
    };

    const subscribeToMessages = () => {
        chatChannel.current = supabase
            .channel(`booking-${booking.id}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `booking_id=eq.${booking.id}`,
                },
                (payload) => {
                    setMessages((prev) => [...prev, payload.new]);
                    if (payload.new.sender_id !== user.id) {
                        // Play notification sound or vibrate
                        if (navigator.vibrate) navigator.vibrate(200);
                    }
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'messages',
                },
                (payload) => {
                    setMessages((prev) =>
                        prev.map((msg) => (msg.id === payload.new.id ? payload.new : msg))
                    );
                }
            )
            .subscribe();
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        setLoading(true);
        try {
            // Determine receiver_id based on current user role
            const receiverId = user.id === booking.user_id 
                ? booking.provider_id 
                : booking.user_id;

            const { error } = await supabase.from('messages').insert([
                {
                    booking_id: booking.id,
                    sender_id: user.id,
                    receiver_id: receiverId,
                    message: newMessage.trim(),
                    message_type: 'text',
                },
            ]);

            if (error) {
                console.error('Insert error:', error);
                throw error;
            }
            setNewMessage('');
            scrollToBottom();
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Failed to send message: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleTyping = () => {
        setTyping(true);
        setTimeout(() => setTyping(false), 1000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{
                position: 'fixed',
                bottom: 20,
                right: 20,
                width: '380px',
                maxWidth: 'calc(100vw - 40px)',
                height: '500px',
                maxHeight: 'calc(100vh - 100px)',
                zIndex: 1000,
                boxShadow: 'var(--shadow-xl)',
            }}
        >
            <Card style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 0 }}>
                {/* Header */}
                <div
                    style={{
                        background: 'linear-gradient(135deg, #D63864 0%, #F97316 100%)',
                        padding: '1rem',
                        borderTopLeftRadius: 'var(--radius-lg)',
                        borderTopRightRadius: 'var(--radius-lg)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                background: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.2rem',
                                fontWeight: 700,
                                color: '#D63864',
                            }}
                        >
                            {otherUser?.full_name?.charAt(0) || 'U'}
                        </div>
                        <div>
                            <div style={{ color: 'white', fontWeight: 600 }}>
                                {otherUser?.full_name || 'User'}
                            </div>
                            {typing && (
                                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem' }}>
                                    typing...
                                </div>
                            )}
                        </div>
                    </div>
                    <Button
                        variant="text"
                        size="sm"
                        onClick={onClose}
                        style={{ color: 'white', minWidth: 'auto', padding: '0.5rem' }}
                    >
                        <X size={20} />
                    </Button>
                </div>

                {/* Messages */}
                <div
                    style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem',
                        background: '#FFF5E6',
                    }}
                >
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                alignSelf: msg.sender_id === user.id ? 'flex-end' : 'flex-start',
                                maxWidth: '70%',
                            }}
                        >
                            <div
                                style={{
                                    padding: '0.75rem 1rem',
                                    borderRadius: 'var(--radius-md)',
                                    background:
                                        msg.sender_id === user.id
                                            ? 'linear-gradient(135deg, #D63864 0%, #F97316 100%)'
                                            : 'white',
                                    color: msg.sender_id === user.id ? 'white' : '#333',
                                    boxShadow: 'var(--shadow-sm)',
                                }}
                            >
                                <div>{msg.message}</div>
                                <div
                                    style={{
                                        fontSize: '0.7rem',
                                        marginTop: '0.25rem',
                                        opacity: 0.8,
                                    }}
                                >
                                    {new Date(msg.created_at).toLocaleTimeString('en-IN', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form
                    onSubmit={sendMessage}
                    style={{
                        padding: '1rem',
                        borderTop: '1px solid var(--md-sys-color-outline-variant)',
                        display: 'flex',
                        gap: '0.5rem',
                    }}
                >
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => {
                            setNewMessage(e.target.value);
                            handleTyping();
                        }}
                        placeholder="Type a message..."
                        style={{
                            flex: 1,
                            padding: '0.75rem 1rem',
                            borderRadius: 'var(--radius-full)',
                            border: '1px solid var(--md-sys-color-outline)',
                            outline: 'none',
                            fontSize: '0.875rem',
                        }}
                        disabled={loading}
                    />
                    <Button
                        type="submit"
                        variant="filled"
                        size="sm"
                        disabled={loading || !newMessage.trim()}
                        style={{
                            borderRadius: '50%',
                            minWidth: 'auto',
                            width: 40,
                            height: 40,
                            padding: 0,
                        }}
                    >
                        <Send size={18} />
                    </Button>
                </form>
            </Card>
        </motion.div>
    );
};

export default ChatWindow;
