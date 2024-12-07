import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import LoginPage from './components/LoginPage'; // Login page for existing users
import RegisterPage from './components/RegisterPage'; // Registration page
import RoomList from './components/RoomList'; // Room list page
import RoomDetail from './components/RoomDetail'; // Room detail page
import CreateRoom from './components/CreateRoom'; // Create room page
import JoinRoom from './components/JoinRoom';

function App() {
    return (
        <Router basename="/ghostlink">
            <div className="App">
                <Routes>
                    {/* Login&Register Pages */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} /> {/* Register page */}

                    {/* Room Pages */}
                    <Route path="/rooms" element={<RoomList />} /> {/* Room list */}
                    <Route path="/join-room" element={<JoinRoom />} />
                    <Route path="/room/:roomName" element={<RoomDetail />} /> {/* Room detail */}
                    <Route path="/create-room" element={<CreateRoom />} /> {/* Create room */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
