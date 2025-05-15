const express = require('express');
const validate = require('../middlewares/validate');
const userValidate = require('../validations/userValidation');
const router = express.Router();
const { registerCustomer, registerAdmin, verifyEmail, resendOTP, adminLogin, userLogin } = require('../controllers/authController');

// user routes
router.post('/register', validate(userValidate), registerCustomer);
router.post('/register/admin', validate(userValidate), registerAdmin);
router.post('/verify-email', verifyEmail);
router.post('/resend-otp', resendOTP);
router.post('/login', validate(userValidate), userLogin);
router.post('/admin/login', validate(userValidate), adminLogin);

module.exports = router;    

