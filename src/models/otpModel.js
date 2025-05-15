const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['VERIFICATION', 'RESET_PASSWORD'],
        default: 'VERIFICATION'
    },
    isUsed: {
        type: Boolean,
        default: false
    },
    expiresAt: {
        type: Date,
        required: true
    }
}, { timestamps: true });


const OTP = mongoose.model('OTP', otpSchema);
module.exports = OTP; 