import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/LoginPage.css';

const LoginPage: React.FC = () => {
    const [userName, setUserName] = useState(''); // Changed to username
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/login`, // Use environment variable for backend URL
                { user_name: userName, password },
                { withCredentials: true } // Ensure cookies are sent
            );

            if (response.status === 200) {
                console.log("[FRONTEND]: Login successful");
                navigate('/rooms'); // Redirect to dashboard or protected page
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    setError('Incorrect password.');
                } else if (err.response?.status === 404) {
                    setError('User not found.');
                } else {
                    setError('An error occurred. Please try again.');
                }
            } else {
                setError('An unexpected error occurred.');
            }
        }
    };

    return (
        <div className="Login-container">
            <div className="Login-left">
                <div className="Login-logo">
                    <h1>GhostLink</h1>
                </div>
            </div>
            <div className="Login-right">
                <div className="Login-form">
                    <h2>Welcome Back</h2>
                    {error && <p className="error-message">{error}</p>}
                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label>Username</label>
                            <input
                                type="text"
                                placeholder="Enter your username"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="submit-button">
                            Log In
                        </button>
                    </form>
                    <p>
                        Don’t have an account? <Link to="/register">Sign Up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
