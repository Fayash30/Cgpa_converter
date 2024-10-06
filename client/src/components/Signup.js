import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Auth.css'; 
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [name, setName] = useState('');
    const [roll_no, setRollNumber] = useState('');
    const [password, setPassword] = useState('');
    const [dept, setDept] = useState('');  // Add state for department
    const [departments, setDepartments] = useState([]);  // Add state for department list
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Fetch departments from the API when component mounts
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get('https://cgpa-converter-rust.vercel.app/departments');  // Update URL accordingly
                setDepartments(response?.data);
                console.log(response)
            } catch (err) {
                console.error('Failed to fetch departments:', err);
                setError('Failed to load departments');
            }
        };
        fetchDepartments();
    }, []);  // Empty dependency array means this runs once when component mounts

    const handleSignup = async () => {
        try {
            const response = await axios.post('https://cgpa-converter-rust.vercel.app/auth/register', {
                name,
                roll_no,
                password,
                dept,  // Send department along with other data
            });
            console.log('Signup successful');
            console.log(response?.data);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Error during signup');
        }
    };

    return (
        <div className="auth-container">
            <h1>Signup</h1>
            {error && <p className="error">{error}</p>}
            <label htmlFor="name">Name:</label>
            <input 
                id="name"
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Name" 
                required 
            />
            <label htmlFor="roll_no">Roll Number:</label>
            <input 
                id="roll_no"
                type="text" 
                value={roll_no} 
                onChange={(e) => setRollNumber(e.target.value)} 
                placeholder="Roll Number" 
                required 
            />

            <label htmlFor="dept">Department:</label>
            <select id="dept" value={dept} onChange={(e) => setDept(e.target.value)} required>
                <option value="" disabled>Select Department</option>
                {departments.map(dept => (
                    <option key={dept._id} value={dept._id}>{dept.name}</option>
                ))}
            </select>

            <label htmlFor="password">Password:</label>
            <input 
                id="password"
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
