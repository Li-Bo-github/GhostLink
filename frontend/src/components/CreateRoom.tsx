import React, { useState } from 'react';
import '../styles/CreateRoom.css';

const CreateRoom: React.FC = () => {
    const [roomName, setRoomName] = useState('');
    const [password, setPassword] = useState('');

    const handleCreateRoom = () => {
        console.log('Creating room:', { roomName, password });
        // Add API call here
    };

    return (
        <div className="create-room-container">
            <h2>Room Creation</h2>
            <div className="form-group">
                <label>Room Name</label>
                <input
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label>Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <button className="create-btn" onClick={handleCreateRoom}>
                Create
            </button>
        </div>
    );
};

export default CreateRoom;
