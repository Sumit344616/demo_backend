const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    email: String,
    password:String,
    role: {
        type: Number,
        enum: [0, 1],
        // 0: user, 1: admin'],
        default: 0
    },
    isActive: {
        type: Number,
        default: 1 // 1: active, 0: inactive 
    },
}, { timestamps: true });
const User = mongoose.model('User', userSchema);
module.exports = User;