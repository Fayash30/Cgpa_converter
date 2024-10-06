import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css'; 
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const [roll_no, setRollNumber] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // Error state
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post('https://cgpa-converter-rust.vercel.app/auth/login', {
                roll_no,
                password
            });
            
            // Check if the status is ok
            if (response.data.status === 'ok') {
                // Save token and user details
                localStorage.setItem('token', response?.data?.token);
                localStorage.setItem('isAdmin', response?.data?.isAdmin);
                
                setError(''); // Clear any previous errors on success
                navigate('/home');  
            } else {
                // If the response is not ok, set the error message
                setError(response.data.message || 'Login failed');
            }
        } catch (err) {
            // Check if server responded with an error message
            if (err.response && err.response.data) {
                setError(err.response.data.message || 'Login failed'); // Use the error message from the server
            } else {
                setError('Check the RollNumber or password');
            }
        }
    };

    return (
        <div className="auth-container">
            <h1>Login</h1>
            {error && <p className="error">{error}</p>}
            <label htmlFor="roll_no">Roll Number:</label>
            <input 
                id="roll_no"
                type="text" 
                value={roll_no} 
                onChange={(e) => setRollNumber(e.target.value)} 
                placeholder="Roll Number" 
                required 
            />
            <label htmlFor="password">Password:</label>
            <input 
                id="password"
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
