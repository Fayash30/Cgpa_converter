import React, { useState } from 'react';
import axios from 'axios';
import './AddDept.css';

const AddDept = () => {
    const [dept, setDept] = useState({ name: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDept({ ...dept, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:5000/departments', dept);
            alert('Department added successfully!');
            setDept({ name: '' });
        } catch (error) {
            console.error('Error adding department', error);
            alert('Failed to add department.');
        }
    };

    return (
        <div className="add-dept">
            <h1>Add New Department</h1>
            <form onSubmit={handleSubmit}>
                <label>Department Name:</label>
                <input type="text" name="name" value={dept.name} onChange={handleChange} required />

                <button type="submit">Add Department</button>
            </form>
        </div>
    );
};

export default AddDept;
