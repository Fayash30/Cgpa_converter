import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Home.css'; 
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [user, setUser] = useState({});
    const [cgpa, setCgpa] = useState(null);
    const [semesters, setSemesters] = useState([0, 0]); 
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Fetch user data and CGPA records
            const fetchUserData = async () => {
                try {
                    const response = await axios.get('https://cgpa-converter-rust.vercel.app/auth/user', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUser(response.data);
                    
                    
                } catch (err) {
                    console.error(err);
                }
            };
            fetchUserData();
        }
    }, []);

    const handleAddSemester = () => {
        if (semesters.length < 8) {
            setSemesters([...semesters, 0]);
        }
    };

    const calculateCgpa = () => {
        const totalPoints = semesters.reduce((acc, gpa) => acc + gpa, 0);
        const newCgpa = (totalPoints / semesters.length).toFixed(2);
        setCgpa(newCgpa);
    };


    const handleSaveCgpa = async () => {
        const token = localStorage.getItem('token');
        const confirm = window.confirm("Are you sure you want to save your CGPA record?");
        if (confirm) {
            try {
                await axios.post('https://cgpa-converter-rust.vercel.app/cgpa/save', 
                    { semesters: semesters.length, cgpa },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                alert("CGPA data saved successfully!");
            } catch (err) {
                console.error(err);
                alert("Error saving CGPA data");
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token'); 
        localStorage.removeItem('isAdmin'); 
        navigate('/'); 
    };

    const goToDashboard = () => {
        navigate('/admin'); 
    };

    return (
        <div className="home-container">
             <div className="top-right-buttons">
                {user.isAdmin && ( 
                    <button className="dashboard-button" onClick={goToDashboard}>Dashboard</button>
                )}
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>
            <h1>Welcome, {user.name}!</h1>
            <div className="cgpa-display">
                {cgpa !== null ? (
                    <h2>Your Current CGPA: {cgpa}</h2>
                ) : (
                    <h2>No previous record found.</h2>
                )}
            </div>

            <h3>GPA to CGPA Converter</h3>
            <div className="gpa-inputs">
                {semesters.map((gpa, index) => (
                    <input
                        key={index}
                        type="number"
                        value={gpa}
                        onChange={(e) => {
                            const newSemesters = [...semesters];
                            newSemesters[index] = parseFloat(e.target.value);
                            setSemesters(newSemesters);
                        }}
                        placeholder={`Semester ${index + 1} GPA`}
                    />
                ))}
            </div>
            <button onClick={handleAddSemester}>Add Semester</button>
            
            <button onClick={calculateCgpa} style={{ marginLeft: '20px' }}>Calculate CGPA</button>

            {cgpa && (
    <div className="cgpa-circular">
        <svg viewBox="0 0 100 100" className="circle" transform="rotate(45, 50, 50)">
            <g transform="rotate(45, 50, 50)">
                <circle cx="50" cy="50" r="45" strokeWidth="7" fill="none" />
                <circle
                    cx="50"
                    cy="50"
                    r="45"
                    strokeWidth="7"
                    fill="none"
                    strokeDasharray={`${(cgpa / 10) * 283} ${283 - (cgpa / 10) * 283}`}
                    stroke="green" // Change the color as needed
                />
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" transform="rotate(45, 50, 50)" className="cgpa-text">
    {cgpa}
</text>
            </g>
        </svg>
    </div>
)}




            {cgpa && (
                <button onClick={handleSaveCgpa}>Save CGPA Record</button>
            )}
        </div>
    );
};

export default Home;
