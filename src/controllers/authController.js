const User = require('../models/userModel');
const OTP = require('../models/otpModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendVerificationEmail } = require('../utils/emailConfig');
const asyncHandler = require('../middlewares/asyncHandler');
const ApiError = require('../utils/ApiError');

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const createAndSaveOTP = asyncHandler(async (email, type = 'VERIFICATION') => {

        await OTP.deleteMany({ email, type });
        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); 

        const otpDoc = new OTP({
            email,
            otp,
            type,
            expiresAt
        });

        await otpDoc.save();
        return otp;
   
})

exports.registerCustomer = asyncHandler(async (req, res,next) => {
        const { firstName, lastName, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(new ApiError(400, 'User already exists'));
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role: 0 
        });

        await user.save();

        const otp = await createAndSaveOTP(email);
        //await sendVerificationEmail(email, otp);

        res.status(201).json({ message: 'Registration successful. Please check your email for OTP verification.' });
   
});

exports.registerAdmin = asyncHandler(async (req, res,next) => {
        const { firstName, lastName, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(new ApiError(400, 'User already exists'));
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role: 1 
        });

        await user.save();

        const otp = await createAndSaveOTP(email);
        await sendVerificationEmail(email, otp);

        res.status(201).json({ message: 'Admin registration successful. Please check your email for OTP verification.' });
    
});

exports.verifyEmail = asyncHandler(async (req, res,next) => {
        const { email, otp } = req.body;

        const otpDoc = await OTP.findOne({
            email,
            otp,
            type: 'VERIFICATION',
            isUsed: false,
            expiresAt: { $gt: new Date() }
        });

        if (!otpDoc) {
            return next(new ApiError(400, 'Invalid or expired OTP'));
        }

        const user = await User.findOne({ email });
        if (!user) {
            return next(new ApiError(404, 'User not found'));
        }

        otpDoc.isUsed = true;
        await otpDoc.save();

        user.isEmailVerified = true;
        await user.save();

        res.status(200).json({ message: 'Email verified successfully' });
   
});

exports.resendOTP = asyncHandler(async (req, res,next) => {
    const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return next(new ApiError(404, 'User not found'));
        }

        if (user.isEmailVerified) {
            return next(new ApiError(400, 'Email is already verified'));
        }

        const otp = await createAndSaveOTP(email);
        await sendVerificationEmail(email, otp);

        res.status(200).json({ message: 'New OTP sent successfully' });
});

exports.adminLogin = asyncHandler(async (req, res,next) => {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return next(new ApiError(401, 'Invalid credentials'));
        }

        if (user.role !== 1) {
            return next(new ApiError(403, 'You are not allowed to login from here'));
        }

        if (!user.isEmailVerified) {
            return next(new ApiError(401, 'Please verify your email first'));
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return next(new ApiError(401, 'Invalid credentials'));
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            }
        });
});

exports.userLogin = asyncHandler(async (req, res,next) => {
        const { email, password } = req.body;
        const user = await User.findOne({ email });     
        if (!user) {
            return next(new ApiError(401, 'Invalid credentials'));
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return next(new ApiError(401, 'Invalid credentials'));
        }
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            }
        });
});
