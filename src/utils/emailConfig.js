const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs').promises;

const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // use SSL
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        },
        tls: {
            rejectUnauthorized: false 
        }
    });
};

const loadTemplate = async (templateName, data) => {
    try {
        const templatePath = path.join(__dirname, '../templates/emails', `${templateName}.html`);
        let template = await fs.readFile(templatePath, 'utf8');
        
        Object.keys(data).forEach(key => {
            template = template.replace(new RegExp(`{{${key}}}`, 'g'), data[key]);
        });
        
        return template;
    } catch (error) {
        console.error('Error loading email template:', error);
        throw new Error('Failed to load email template');
    }
};

const sendVerificationEmail = async (email, otp) => {
    try {
        const transporter = createTransporter();
        
        const templateData = {
            otp,
            expiryTime: '10 minutes',
            supportEmail: process.env.SUPPORT_EMAIL || 'support@example.com'
        };

        const html = await loadTemplate('verification', templateData);

        const mailOptions = {
            from: `"${process.env.EMAIL_FROM_NAME || 'Your App'}" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Email Verification OTP',
            html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Verification email sent:', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw new Error('Failed to send verification email');
    }
};

const sendPasswordResetEmail = async (email, otp) => {
    try {
        const transporter = createTransporter();
        
        const templateData = {
            otp,
            expiryTime: '10 minutes',
            supportEmail: process.env.SUPPORT_EMAIL || 'support@example.com'
        };

        const html = await loadTemplate('password-reset', templateData);

        const mailOptions = {
            from: `"${process.env.EMAIL_FROM_NAME || 'Your App'}" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Password Reset OTP',
            html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Password reset email sent:', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending password reset email:', error);
        throw new Error('Failed to send password reset email');
    }
};

module.exports = {
    sendVerificationEmail,
    sendPasswordResetEmail
}; 