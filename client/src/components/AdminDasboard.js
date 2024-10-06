import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [cgpaRecords, setCgpaRecords] = useState([]);
    const [gpaRecords, setGpaRecords] = useState([]);
    const [filteredCgpaRecords, setFilteredCgpaRecords] = useState([]);
    const [filteredGpaRecords, setFilteredGpaRecords] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [selectedDept, setSelectedDept] = useState('');
    const [error, setError] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
    const [isCgpaView, setIsCgpaView] = useState(true);
    const [user, setUser] = useState([])
    const navigate = useNavigate();

    
    // Fetch CGPA records and departments on component mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const fetchUserData = async () => {
                try {
                    const response = await axios.get('http://127.0.0.1:5000/auth/user', {
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

    useEffect(() => {
        const fetchCgpaRecords = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/cgpa/allCgpas');
                setCgpaRecords(response.data || []);
                setFilteredCgpaRecords(response.data || []); // Initialize filtered CGPA records
            } catch (err) {
                console.error('Error fetching CGPA records', err);
                setError('Failed to fetch CGPA records');
            }
        };

        const fetchDepartments = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/departments');
                setDepartments(response.data || []);
            } catch (err) {
                console.error('Error fetching departments', err);
                setError('Failed to fetch departments');
            }
        };

        const fetchGpaRecords = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/gpa/all');
                const gpaData = response.data.data || []; // Ensure it defaults to an empty array
                setGpaRecords(gpaData);
                setFilteredGpaRecords(gpaData); // Set filtered records
                console.log("Gpa:",gpaData)
            } catch (err) {
                console.error('Error fetching GPA records', err);
                setError('Failed to fetch GPA records');
            }
        };
        fetchCgpaRecords();
        fetchDepartments();
        fetchGpaRecords();
    }, []);

 
    if (!user.isAdmin) {
        return (
            <div className="unauthorized">
                <h1>Unauthorized!</h1>
                <p>Your current role does not allow you to view this page.</p>
                <button onClick={() => navigate('/home')}>Go to Home</button>
            </div>
        );
    }
    // Handle filtering based on selected department
    const handleDeptFilter = (dept) => {
        setSelectedDept(dept);
        if (dept === '') {
            setFilteredCgpaRecords(cgpaRecords);
            setFilteredGpaRecords(gpaRecords);
        } else {
            const filteredCgpas = cgpaRecords.filter((record) => record?.userId?.dept?.name === dept);
            const filteredGpas = gpaRecords.filter((record) => record?.userId?.dept?.name === dept);
            setFilteredCgpaRecords(filteredCgpas.length > 0 ? filteredCgpas : []);
            setFilteredGpaRecords(filteredGpas.length > 0 ? filteredGpas : []);
        }
    };

    // Sorting logic
    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }

        const recordsToSort = isCgpaView ? [...filteredCgpaRecords] : [...filteredGpaRecords];

        recordsToSort.sort((a, b) => {
            if (key === 'gpa') {
                return direction === 'ascending' ? a.gpa - b.gpa : b.gpa - a.gpa;
            } else if (key === 'cgpa') {
                return direction === 'ascending' ? a.cgpa - b.cgpa : b.cgpa - a.cgpa;
            }

            let aValue = a?.userId?.[key] || 'N/A';
            let bValue = b?.userId?.[key] || 'N/A';

            if (key === 'dept') {
                aValue = a?.userId?.dept?.name ?? 'N/A';
                bValue = b?.userId?.dept?.name ?? 'N/A';
            }

            return direction === 'ascending'
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        });

        setSortConfig({ key, direction });
        if (isCgpaView) {
            setFilteredCgpaRecords(recordsToSort);
        } else {
            setFilteredGpaRecords(recordsToSort);
        }
    };

    // Toggle view to CGPA
    const showCgpaRecords = () => {
        setIsCgpaView(true);
        setFilteredCgpaRecords(cgpaRecords);
        setSelectedDept(''); // Reset selected department
    };

    // Toggle view to GPA
    const showGpaRecords = async () => {
        setIsCgpaView(false);
        setFilteredGpaRecords(gpaRecords)
        setSelectedDept(''); // Reset selected department
    };
    
    const goToAddCoursePage = () => {
        navigate('/add-course');
    };

    const goToAddDeptPage = () => {
        navigate('/add-dept');
    };

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>

            {/* Add Courses and Departments buttons */}
            <div className="admin-actions">
                <button className="add-btn" onClick={goToAddCoursePage}>Add Course</button>
                <button className="add-btn" onClick={goToAddDeptPage}>Add Department</button>
            </div>

            {/* Toggle buttons for CGPA and GPA */}
            <div className="toggle-buttons">
                <button className={`toggle-btn ${isCgpaView ? 'active' : ''}`} onClick={showCgpaRecords}>CGPA Records</button>
                <button className={`toggle-btn ${!isCgpaView ? 'active' : ''}`} onClick={showGpaRecords}>GPA Records</button>
            </div>

            {/* Department filter */}
            <div className="dept-filter">
                <label htmlFor="dept-select">Filter by Department: </label>
                <select id="dept-select" value={selectedDept} onChange={(e) => handleDeptFilter(e.target.value)}>
                    <option value="">All Departments</option>
                    {departments.map((dept, index) => (
                        <option key={index} value={dept.name}>
                            {dept.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Table to display records */}
            <table>
                <thead>
                    <tr>
                        <th onClick={() => handleSort('name')}>Name</th>
                        <th onClick={() => handleSort('roll_no')}>Roll No</th>
                        <th onClick={() => handleSort('dept')}>Department</th>
                        <th onClick={() => handleSort(isCgpaView ? 'semesters' : 'semester')}>{isCgpaView ? 'Semesters' : 'Semester'}</th>
                        <th onClick={() => handleSort(isCgpaView ? 'cgpa' : 'gpa')}>{isCgpaView ? 'CGPA' : 'GPA'}</th>
                    </tr>
                </thead>

                <tbody>
                    {isCgpaView ? (
                        Array.isArray(filteredCgpaRecords) && filteredCgpaRecords.length > 0 ? (
                            filteredCgpaRecords.map((record, index) => (
                                <tr key={index}>
                                    <td>{record?.userId?.name || 'N/A'}</td>
                                    <td>{record?.userId?.roll_no || 'N/A'}</td>
                                    <td>{record?.userId?.dept?.name || 'N/A'}</td>
                                    <td>{`Upto ${record.semesters} Sem`}</td>
                                    <td>{record.cgpa}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">No CGPA records found.</td>
                            </tr>
                        )
                    ) : (
                        console.log('Filtered GPA Records:', filteredGpaRecords), // Log to see the filtered records
                        Array.isArray(filteredGpaRecords) && filteredGpaRecords.length > 0 ? (
                            filteredGpaRecords.map((record, index) => (
                                <tr key={index}>
                                    <td>{record?.userId?.name || 'N/A'}</td>
                                    <td>{record?.userId?.roll_no || 'N/A'}</td>
                                    <td>{record.userId.dept ? record.userId.dept.name : 'N/A'}</td>
                                    <td>{record.semester || 'N/A'}</td>
                                    <td>{record.gpa || 'N/A'}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">No GPA records found.</td>
                            </tr>
                        )
                    )}
                    
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;
