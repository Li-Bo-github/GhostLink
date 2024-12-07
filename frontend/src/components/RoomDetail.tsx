import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../styles/RoomDetail.css';

const RoomDetail: React.FC = () => {
    const { roomName } = useParams<{ roomName: string }>();
    const [roomDetails, setRoomDetails] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const [error, setError] = useState<string>('');

    // Fetch room details
    useEffect(() => {
        const fetchRoomDetails = async () => {
            if (!roomName) {
                setError('Room name is missing');
                return;
            }
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/room/search/${roomName}`, { withCredentials: true });
                if (response.data.length > 0) {
                    setRoomDetails(response.data[0]);
                } else {
                    setError('Room not found');
                }
            } catch (err) {
                setError('Failed to fetch room details');
            }
        };

        fetchRoomDetails();
    }, [roomName]);

    // Fetch messages
    useEffect(() => {
        const fetchMessages = async () => {
            if (!roomName) {
                setError('Room name is missing');
                return;
            }
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/room/${roomName}/message`, { withCredentials: true });
                setMessages(response.data);
            } catch (err) {
                setError('Failed to fetch messages');
            }
        };

        fetchMessages();
        const intervalId = setInterval(fetchMessages, 10000);
        return () => clearInterval(intervalId);
    }, [roomName]);

    // Send a new message
    const handleSendMessage = async () => {
        if (!newMessage.trim() || !roomName) return;

        try {
            await axios.put(
                `${process.env.REACT_APP_BACKEND_URL}/room/${roomName}/message`,
                { message: { content: newMessage, time_stamp: new Date() } },
                { withCredentials: true }
            );
            setMessages([...messages, { content: newMessage, user_name: 'You', time_stamp: new Date() }]); // Optimistic update
            setNewMessage('');
        } catch (err) {
            setError('Failed to send message');
        }
    };

    return (
        <div className="room-detail-container">
            {error && <p className="error-message">{error}</p>}
            {roomDetails ? (
                <>
                    <div className="room-header">
                        <h2>{roomDetails.room_name}</h2>
                        <p>{roomDetails.description}</p>
                    </div>
                    <div className="chat-window">
                        {messages.length > 0 ? (
                            messages.map((msg, index) => (
                                <div className="message-item" key={index}>
                                    <p>
                                        <strong>{msg.user_name}</strong>: {msg.content}
                                    </p>
                                    <p className="timestamp">{new Date(msg.time_stamp).toLocaleString()}</p>
                                </div>
                            ))
                        ) : (
                            <p>No messages yet. Start the conversation!</p>
                        )}
                    </div>
                    <div className="input-container">
                        <input
                            type="text"
                            placeholder="Type a message"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <button onClick={handleSendMessage}>Send</button>
                    </div>
                </>
            ) : (
                <p>Loading room details...</p>
            )}
        </div>
    );
};

export default RoomDetail;
