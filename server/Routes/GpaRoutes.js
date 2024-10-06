const express = require('express');
const GpaModel = require('../Models/GpaModel'); // Adjust the path based on your folder structure
const verifyToken = require("../Middlewares/Auth"); // Ensure user is authenticated (only needed for POST route)

const router = express.Router();

// POST route to add a GPA record (still requires authentication)
router.post('/save', verifyToken, async (req, res) => {
    try {
        const { semester, gpa } = req.body;

        // Ensure the user ID is available
        const userId = req.userId; // Extract userId from token

        // Create a new GPA record
        const newGpaRecord = new GpaModel({
            userId,
            semester,
            gpa
        });

        await newGpaRecord.save();
        res.status(201).json({ status: 'ok', message: 'GPA record added successfully', data: newGpaRecord });
    } catch (err) {
        res.status(400).json({ status: 'error', error: err.message });
    }
});
// GET route to fetch all GPA records with populated user and department details
router.get('/all', async (req, res) => {
    try {
        // Fetch all GPA records and populate user and department details
        const allGpaRecords = await GpaModel.find()
            .populate({
                path: 'userId',
                populate: {
                    path: 'dept', // Populate the department within the user
                    model: 'Dept' // Ensure you're referencing the correct model
                }
            });

        if (allGpaRecords.length === 0) {
            return res.status(404).json({ status: 'error', message: 'No GPA records found.' });
        }
        res.json({ status: 'ok', data: allGpaRecords });
    } catch (err) {
        res.status(400).json({ status: 'error', error: err.message });
    }
});


module.exports = router;
