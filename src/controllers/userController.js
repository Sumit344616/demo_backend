const asyncHandler = require('../middlewares/asyncHandler');
const User = require('../models/userModel');
const ApiError = require('../utils/ApiError');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser =asyncHandler( async (req, res,next) => {
    const { email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(new ApiError(400, 'User already exists'));
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully', user: newUser });
   
})
const loginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return next(new ApiError(400, 'User not found'));
    }
    if (user.isActive === 0) {
        return next(new ApiError(403, 'User is inactive'));
    }
    const isMatch = await bcrypt.compare(password, user.password);
   
    if (!isMatch) {
        return next(new ApiError(400, 'Invalid credentials'));
    }
    const token=jwt.sign({ id: user._id,email:user.email,role:user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.status(200).json({ message: 'Login successful', user: user, token });
});
const adminLogin = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return next(new ApiError(400, 'User not found'));
    }
    if (user.isActive === 0) {
        return next(new ApiError(403, 'User is inactive'));
    }
    if (user.role !== 'admin') {
        return next(new ApiError(403, 'User is not an admin'));
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return next(new ApiError(400, 'Invalid credentials'));
    }
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.status(200).json({ message: 'Login successful', user: user, token });
}
);  



module.exports = {
    registerUser,
    loginUser,
    adminLogin
}