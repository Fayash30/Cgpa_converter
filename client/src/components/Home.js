import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Home.css'; 
import { useNavigate } from 'react-router-dom';
import Select from 'react-select'; // For searchable dropdown
import Modal from 'react-modal';

const gradeValues = {
    'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6, 'C': 5,
    'RA': 0, 'SA': 0, 'W': 0
};

const Home = () => {
    const [user, setUser] = useState({});
    const [cgpa, setCgpa] = useState(null);
    const [gpa, setGpa] = useState(null);
    const [semesters, setSemesters] = useState([0, 0]); 
    const [activeTab, setActiveTab] = useState(''); 
    const [errorMessage, setErrorMessage] = useState(''); 
    const [saveStatus, setSaveStatus] = useState(''); 
    const [courses, setCourses] = useState([]); // For GPA calculation
    const [semesterInput, setSemesterInput] = useState(''); // Store semester for saving GPA
    const [modalIsOpen, setModalIsOpen] = useState(false); // Modal state for saving GPA
    const navigate = useNavigate();
    const [selectedCourses, setSelectedCourses] = useState([{ course: '', grade: '' }]);
    


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const fetchUserData = async () => {
                try {
                    const response = await axios.get('https://cgpa-converter-rust.vercel.app/auth/user', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUser(response.data);
                } catch (err) {
                    console.error(err);
                    setErrorMessage("Error fetching user data");
                }
            };
            fetchUserData();
        }
    }, []);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get('https://cgpa-converter-rust.vercel.app/courses');
                setCourses(response.data); // Assuming response.data returns the list of courses
            } catch (err) {
                console.error(err);
            }
        };
        fetchCourses();
    }, []);

    const handleAddSemester = () => {
        if (semesters.length < 8) {
            setSemesters([...semesters, 0]);
        }
    };

    const handleRemoveSemester = () => {
        if (semesters.length > 2) {
            setSemesters(semesters.slice(0, -1));
        }
    };

    const calculateCgpa = () => {
        const validGpas = semesters.every(gpa => gpa >= 0 && gpa <= 10);
        if (!validGpas) {
            setErrorMessage("GPA must be between 0 and 10.");
            return;
        }

        setErrorMessage(''); 
        const totalPoints = semesters.reduce((acc, gpa) => acc + gpa, 0);
        const newCgpa = (totalPoints / semesters.length).toFixed(2);
        setCgpa(newCgpa);
    };

    const calculateGpa = () => {
        console.log("Selected Courses:", selectedCourses); // Debugging line
        let totalCredits = 0;
        let totalPoints = 0;
    
        selectedCourses.forEach(({ course, grade }) => {
            const selectedCourse = courses.find(c => c._id === course._id); // Compare _id
            console.log("Selected Course:", selectedCourse); // Debugging line
    
            if (selectedCourse && gradeValues.hasOwnProperty(grade)) {
                const gradePoint = gradeValues[grade] || 0; // Ensure "W", "RA", "SA" are treated as 0
                const credit = selectedCourse.creditScore || 0; // Ensure no credits give 0
    
                // Only add to totalPoints if grade point and credit are non-zero
                totalPoints += credit * gradePoint;
                totalCredits += credit; // Always add the credit, even if grade point is 0
            }
        });
    
        console.log("Total Credits:", totalCredits, "Total Points:", totalPoints); // Debugging line
    
        if (totalCredits === 0) {
            setErrorMessage("Please select valid courses and grades.");
            return;
        }
    
        const newGpa = (totalPoints / totalCredits).toFixed(2);
        setGpa(newGpa);
        setErrorMessage('');
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
                setSaveStatus("CGPA data saved successfully!");
            } catch (err) {
                console.error(err);
                setSaveStatus("Error saving CGPA data.");
            }
        }
    };
    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };
    const handleSaveGpa = async () => {
        try {
            await axios.post('https://cgpa-converter-rust.vercel.app/gpa/save', {
                semester: semesterInput,
                gpa
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setSaveStatus('GPA saved successfully!');
            setModalIsOpen(false);
        } catch (error) {
            setSaveStatus(`Error saving GPA: ${error.message}`);
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

    const handleAddCourse = () => {
        setSelectedCourses([...selectedCourses, { course: '', grade: '' }]); // Add a new empty course and grade
    };
    
    const handleRemoveCourse = (index) => {
        const newCourses = [...selectedCourses];
        newCourses.splice(index, 1); // Remove the course at the given index
        setSelectedCourses(newCourses);
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

            <div className="toggle-buttons">
                <button 
                    className={`toggle-btn ${activeTab === 'gpa' ? 'active' : ''}`}
                    onClick={() => setActiveTab('gpa')}
                >
                    Calculate GPA
                </button>
                <button 
                    className={`toggle-btn ${activeTab === 'cgpa' ? 'active' : ''}`}
                    onClick={() => setActiveTab('cgpa')}
                >
                    Calculate CGPA
                </button>
            </div>

            {activeTab === 'cgpa' && (
                <div>
                    <div className="cgpa-display">
                        {cgpa !== null ? (
                            <h2>Your Current CGPA: {cgpa}</h2>
                        ) : (
                            <h2>No previous record found.</h2>
                        )}
                    </div>
                    <h3>CGPA Converter</h3>
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                    <div className="gpa-inputs">
                        {semesters.map((gpa, index) => (
                            <div key={index} className="gpa-input-wrapper">
                                <label>Enter semester {index + 1} GPA : </label>
                                <input
                                    type="number"
                                    value={gpa}
                                    onChange={(e) => {
                                        const newSemesters = [...semesters];
                                        newSemesters[index] = parseFloat(e.target.value);
                                        setSemesters(newSemesters);
                                    }}
                                    placeholder={`Semester ${index + 1} GPA`}
                                    min="0"
                                    max="10"
                                />
                                {index === semesters.length - 1 && semesters.length > 2 && (
                                    <button className="remove-semester" onClick={handleRemoveSemester}>x</button>
                                )}
                            </div>
                        ))}
                    </div>
                    <button onClick={handleAddSemester}>Add Semester</button>
                    <button onClick={calculateCgpa}>Calculate CGPA</button>

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
                                        stroke="green"
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
                    {saveStatus && <div className="save-status">{saveStatus}</div>}
                </div>
            )}

{activeTab === 'gpa' && (
    <div>
        <h3>GPA Converter</h3>
        {errorMessage && <div className="error-message">{errorMessage}</div>}

        {selectedCourses.map((courseData, index) => (
    <div key={index} className="course-row">
        <div className="input-select-wrapper">
            <label className="course-label">Course:</label>
            <Select
                className="course-select"
                options={courses.map(course => ({ value: course._id, label: `${course.code} - ${course.title}`, course }))}
                placeholder="Select Course"
                onChange={(option) => {
                    const newCourses = [...selectedCourses];
                    newCourses[index].course = option.course; // Store course object
                    setSelectedCourses(newCourses);
                }}
            />
            <label className="grade-label">Grade:</label>
            <Select
                className="grade-select"
                options={Object.keys(gradeValues).map(grade => ({ value: grade, label: grade }))}
                placeholder="Select Grade"
                onChange={(option) => {
                    const newCourses = [...selectedCourses];
                    newCourses[index].grade = option.value; // Store the selected grade
                    setSelectedCourses(newCourses);
                }}
            />
            {/* Show "X" button only if there is more than one course */}
            {index === selectedCourses.length - 1 && selectedCourses.length > 1 && (
                <button
                    className="remove-semester"
                    onClick={() => handleRemoveCourse(index)}
                >
                    &times;
                </button>
            )}
        </div>
    </div>
))}

{/* Button to add new course */}
<button onClick={handleAddCourse}>
    Add New Course
</button>


        <button onClick={calculateGpa}>Calculate GPA</button>

        {gpa && (
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
                            strokeDasharray={`${(gpa / 10) * 283} ${283 - (gpa / 10) * 283}`}
                            stroke="green"
                        />
                        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" transform="rotate(45, 50, 50)" className="cgpa-text">
                            {gpa}
                        </text>
                    </g>
                </svg>
            </div>
        )}

        {gpa && (
            <button className="save-gpa" onClick={openModal}>Save GPA</button>
        )}

        {/* Modal for entering semester and saving GPA */}
        <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            contentLabel="Save GPA"
        >
            <h2>Enter Semester to Save GPA</h2>
            <label>Enter the semester for this GPA ({gpa}):</label>
            <input
                type="text"
                value={semesterInput}
                onChange={(e) => setSemesterInput(e.target.value)}
            />
            <button onClick={handleSaveGpa}>Save GPA</button>
            <button onClick={closeModal}>Close</button>
        </Modal>

        {saveStatus && <div className="save-status">{saveStatus}</div>}
    </div>
)}



        </div>
    );
};

export default Home;