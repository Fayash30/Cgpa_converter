import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [cgpaRecords, setCgpaRecords] = useState([]);
    const [error, setError] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });

    useEffect(() => {
        const fetchCgpaRecords = async () => {
            try {
                const response = await axios.get('https://cgpa-converter-rust.vercel.app/cgpa/allCgpas');
                setCgpaRecords(response.data);
            } catch (err) {
                console.error('Error fetching CGPA records', err);
                setError('Failed to fetch CGPA records');
            }
        };

        fetchCgpaRecords();
    }, []);

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }

        const sortedRecords = [...cgpaRecords].sort((a, b) => {
            if (key === 'cgpa') {
                return direction === 'ascending' ? a.cgpa - b.cgpa : b.cgpa - a.cgpa;
            }
            return direction === 'ascending'
                ? a[key].localeCompare(b[key])
                : b[key].localeCompare(a[key]);
        });

        setSortConfig({ key, direction });
        setCgpaRecords(sortedRecords);
    };

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            <table>
                <thead>
                    <tr>
                        <th onClick={() => handleSort('name')}>Name</th>
                        <th onClick={() => handleSort('semesters')}>Semesters</th>
                        <th onClick={() => handleSort('cgpa')}>CGPA</th>
                    </tr>
                </thead>
                <tbody>
                    {cgpaRecords.map((record, index) => (
                        <tr key={index}>
                            <td>{record.name}</td>
                            <td>Upto {record.semesters} Sem</td>
                            <td>{record.cgpa}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;
