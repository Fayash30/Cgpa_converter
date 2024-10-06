const verifyToken = require("../Middlewares/Auth");
const express = require('express');
const router = express.Router();
const Cgpa = require('../Models/CgpaModel'); 
const User = require('../Models/UserModel'); 

router.post('/save/', verifyToken, async (req, res) => {
    const { semesters, cgpa } = req.body;  

    try {
        // Fetch the logged-in user's details using the token
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        
        const newCgpaRecord = new Cgpa({
            userId: user._id,
            name: user.name,   
            semesters,          
            cgpa                
        });

        // Save the record in the database
        await newCgpaRecord.save();
        res.status(200).json({ message: 'CGPA data saved successfully' });
    } catch (err) {
        res.status(400).json({ error: 'Error saving CGPA data' });
    }
});

router.get('/allCgpas', async (req, res) => {
    try {
        // Fetch all CGPA records along with the user's roll_no and department
        const cgpaRecords = await Cgpa.find()
            .populate({
                path: 'userId',
                select: 'roll_no dept name', // Selecting the fields you need
                populate: { path: 'dept', select: 'name' } // Fetch the department name
            });

        res.status(200).json(cgpaRecords);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching CGPA records' });
    }
});

module.exports = router;
