const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    user_name: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true
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
