const mongoose = require('mongoose');

// Define the GPA schema
const gpaSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User_Account',  // Use the actual name of the User model here
        required: true
    },
    semester: {
        type: Number,
        required: true,
        min: 1 
    },
    gpa: {
        type: Number,
        required: true,
        min: 0,
        max: 10 
    }
}, { timestamps: true });

// Create the model
const GpaModel = mongoose.model('Gpa_Records', gpaSchema);

module.exports = GpaModel;
