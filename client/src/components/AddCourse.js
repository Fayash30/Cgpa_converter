import React, { useState } from 'react';
import axios from 'axios';
import './AddCourse.css';

const AddCourse = () => {
    const [course, setCourse] = useState({
        title: '',
        code: '',
        creditScore: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCourse({ ...course, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://cgpa-converter-rust.vercel.app/courses/add', course);
            alert('Course added successfully!');
            setCourse({ title: '', code: '', creditScore: '' });
        } catch (error) {
            console.error('Error adding course', error);
            alert('Failed to add course.');
        }
    };

    return (
        <div className="add-course">
            <h1>Add New Course</h1>
            <form onSubmit={handleSubmit}>
                <label>Course Title:</label>
                <input type="text" name="title" value={course.title} onChange={handleChange} required />

                <label>Course Code:</label>
                <input type="text" name="code" value={course.code} onChange={handleChange} required />

                <label>Credit Score:</label>
                <input type="number" name="creditScore" value={course.creditScore} onChange={handleChange} required />

                <button type="submit">Add Course</button>
            </form>
        </div>
    );
};

export default AddCourse;
