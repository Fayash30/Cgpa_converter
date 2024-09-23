import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css'; 
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [user_name, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // Error state
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post('https://cgpa-converter-rust.vercel.app/auth/login', {
                user_name,
                password
            });
            
            // Save token and user details
            localStorage.setItem('token', response?.data?.token);
            localStorage.setItem('isAdmin', response?.data?.isAdmin);
            
            setError(''); // Clear any previous errors on success
            navigate('/home');  
        } catch (err) {
            // Check if server responded with an error message
            if (err.response && err.response.data) {
                setError(err.response.data.message || 'Login failed'); // Use the error message from the server
            } else {
                setError('Check the username or password');
            }
        }
    };

    return (
        <div className="auth-container">
            <h1>Login</h1>
            {error && <p className="error">{error}</p>} {/* Display error message */}
            <input 
                type="text" 
                value={user_name} 
                onChange={(e) => setUserName(e.target.value)} 
                placeholder="Username" 
                required 
            />
            <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Password" 
                required 
            />
            <button onClick={handleLogin}>Login</button>
            <p>New user? <Link to="/signup">Register here</Link></p>
        </div>
    );
};

export default Login;
