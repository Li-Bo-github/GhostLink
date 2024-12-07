import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/RoomList.css";

const RoomList: React.FC = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState<string | null>(null); // State to store the username
    const [error, setError] = useState<string | null>(null); // State for error messages

    // Fetch session data when the component loads
    useEffect(() => {
        const fetchSession = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/session`, {
                    withCredentials: true,
                });
                setUsername(response.data.user.user_name); // Assuming the backend sends the username
            } catch (err) {
                console.error("Error fetching session:", err);
                setError("Session expired. Redirecting to login...");
                setTimeout(() => navigate("/login"), 2000); // Redirect after showing the error
            }
        };

        fetchSession();
    }, [navigate]);

    const handleJoinRoom = () => {
        navigate("/join-room"); // Navigate to the Join Room page
    };

    const handleCreateRoom = () => {
        navigate("/create-room"); // Navigate to the Create Room page
    };

    if (error) {
        return <div className="room-list-container">{error}</div>;
    }

    return (
        <div className="room-list-container">
            <div className="room-header">
                <h1>Welcome, {username || "Loading..."}</h1>
            </div>
            <div className="room-button-group">
                <button className="room-action-btn" onClick={handleJoinRoom}>
                    Join Room
                </button>
                <button className="create-room-btn" onClick={handleCreateRoom}>
                    Create Room
                </button>
            </div>
        </div>
    );
};

export default RoomList;
