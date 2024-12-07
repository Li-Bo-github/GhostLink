import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css'; // Import Home styles

const Home: React.FC = () => {
    return (
        <div className="Home">
            <h1>Welcome to GhostLink</h1>
            <p>
                This is the Home page. Navigate to <Link to="/login">Login</Link>.
            </p>
        </div>
    );
};

export default Home;
