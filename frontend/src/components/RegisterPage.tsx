import React, { useState } from 'react';
import '../styles/RegisterPage.css'; // Import Register styles
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterPage: React.FC = () => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default form submission behavior
        setError('');
        setSuccess(false);

        try {
            // Send user data to the backend
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user`, {
                user_name: userName,
                password,
            });

            if (response.status === 201) {
                console.log("[FRONTEND]:USER CREATE SUCCESSFULLY")
                setSuccess(true);
                setUserName('');
                setPassword('');
                setTimeout(() => {
                    navigate('/login');
                }, 1000); // Redirect after 1 second
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.data?.message) {
                    setError(err.response.data.message); // Display server error message
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
                    <h2>Create an account</h2>
                    {error && <p className="error-message">{error}</p>}
                    {success && <p className="success-message">Account created successfully!</p>}
                    <form onSubmit={handleRegister}>
                        <div className="form-group">
                            <label>Username</label>
                            <input
                                type="text"
                                placeholder="Enter your user name"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <div className="password-wrapper">
                                <input
                                    type={passwordVisible ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="password-toggle"
                                >
                                    {passwordVisible ? 'Hide' : 'Show'}
                                </button>
                            </div>
                        </div>
                        <button type="submit" className="submit-button">
                            Create an account
                        </button>
                    </form>
                    <p>
                        Already have an account? <Link to="/login">Log In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
