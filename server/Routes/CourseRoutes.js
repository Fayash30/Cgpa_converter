const express = require('express');
const router = express.Router();
const Course = require('../Models/CourseModel');

// Create a new course
router.post('/add', async (req, res) => {
    const { title, code, creditScore } = req.body;
    try {
        const newCourse = new Course({ title, code, creditScore });
        await newCourse.save();
        res.status(201).json(newCourse);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add course' });
    }
});

// Get all courses
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch courses' });
    }
});

module.exports = router;