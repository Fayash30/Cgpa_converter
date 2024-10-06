const mongoose = require("mongoose");

const CgpaSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User_Account' 
    },
    name: {
        type: String,
        required: true,
    },
    semesters: {
        type: String,
        required: true,
        min: 1
    },
    cgpa: {
        type: Number,
        required: true,
        min: 0,
        max: 10 
    }
});

const Cgpa = mongoose.model("Cgpa_Record", CgpaSchema);

module.exports = Cgpa;
