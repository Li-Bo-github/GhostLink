import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/JoinRoom.css';

type Room = {
    _id: string;
    room_name: string;
    description: string;
};

const JoinRoom: React.FC = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const [error, setError] = useState<string>(''); // Keep error state to display it if needed
    const navigate = useNavigate();

    const handleSearch = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/room/search/${searchKeyword}`, { withCredentials: true });
            setRooms(response.data);
            setError(''); // Clear error if the request succeeds
        } catch (err) {
            setError('Failed to fetch rooms');
        }
    };

    const handleJoin = async () => {
        if (selectedRoom) {
            try {
                await axios.post(`${process.env.REACT_APP_BACKEND_URL}/room/${selectedRoom.room_name}/join`, {}, { withCredentials: true });
                navigate(`/room/${selectedRoom.room_name}`);
            } catch (err) {
                setError('Failed to join room');
            }
        }
    };

    return (
        <div className="join-room-container">
            <div className="room-list">
                <input
                    type="text"
                    placeholder="Search for rooms"
                    className="room-search"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>
                {error && <p className="error-message">{error}</p>} {/* Display error if present */}
                <div>
                    {rooms.map((room) => (
                        <button
                            key={room._id}
                            onClick={() => setSelectedRoom(room)}
                            className={`room-button ${selectedRoom?._id === room._id ? 'selected' : ''}`}
                        >
                            {room.room_name}
                        </button>
                    ))}
                </div>
            </div>
            <div className="room-details">
                {selectedRoom ? (
                    <>
                        <h1>{selectedRoom.room_name}</h1>
                        <p>{selectedRoom.description}</p>
                        <button className="join-room-button" onClick={handleJoin}>
                            Join
                        </button>
                    </>
                ) : (
                    <p>Please select a room to see the details</p>
                )}
            </div>
        </div>
    );
};

export default JoinRoom;
