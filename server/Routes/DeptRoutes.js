const express = require('express');
const router = express.Router();
const Dept = require("../Models/DeptModel")
// Route to create a new department
router.post('/', async (req, res) => {
    try {
        const { name } = req.body;
        const newDept = new Dept({ name });
        await newDept.save();
        res.status(201).json({ message: 'Department created successfully', dept: newDept });
    } catch (error) {
        res.status(500).json({ message: 'Error creating department', error: error.message });
    }
})

// Route to get all departments
router.get('/', async (req, res) => {
    try {
        const departments = await Dept.find();
        res.status(200).json(departments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching departments', error: error.message });
    }
})

// Route to update a department by ID
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const updatedDept = await Dept.findByIdAndUpdate(id, { name }, { new: true });
        if (!updatedDept) {
            return res.status(404).json({ message: 'Department not found' });
        }
        res.status(200).json({ message: 'Department updated successfully', dept: updatedDept });
    } catch (error) {
        res.status(500).json({ message: 'Error updating department', error: error.message });
    }
})
// Route to delete a department by ID
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedDept = await Dept.findByIdAndDelete(id);
        if (!deletedDept) {
            return res.status(404).json({ message: 'Department not found' });
        }
        res.status(200).json({ message: 'Department deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting department', error: error.message });
    }
})
module.exports = router;
