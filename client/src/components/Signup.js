import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css'; 
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [name, setName] = useState('');
    const [user_name, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate()

    const handleSignup = async () => {
        
        try {
            const response = await axios.post('https://cgpa-converter-rust.vercel.app/auth/register', {
                name,
                user_name,
                password
            });
            console.log('Signup successful');
            console.log(response?.data);
            navigate('/')
        } catch (err) {
            setError(err.response?.data?.error || 'Error during signup');
        }
    };

    return (
        <div className="auth-container">
            <h1>Signup</h1>
            {error && <p className="error">{error}</p>}
            <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Name" 
                required 
            />
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
            <button onClick={handleSignup}>Signup</button>
            <p>Already have an account? <Link to="/">Login here</Link></p>
        </div>
    );
};
 
export default Signup;
