const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    roll_no: {
        type: String,
        required: true,
        unique: true,
    },
    dept: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dept'
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false, // Default is false for regular users
    }
});

const User = mongoose.model("User_Account", UserSchema);

module.exports = User;
