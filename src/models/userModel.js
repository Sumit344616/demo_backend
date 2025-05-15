const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        enum: [0, 1],
        // 0: customer, 1: admin
        default: 0
    },
    isActive: {
        type: Number,
        default: 1 // 1: active, 0: inactive 
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });
const User = mongoose.model('User', userSchema);
module.exports = User;