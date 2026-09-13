import express from 'express'
import bcrypt from 'bcryptjs'
import User from '../models/user.js'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'

const router = express.Router();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

router.post("/register", async (req, res) => {
    const { name, Company_name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }


        const hashedPassword = await bcrypt.hash(password, 10);


        const user = await User.create({
            name: name,
            Company_name: Company_name,
            email: email,
            phone: '',
            password: hashedPassword,
        });

        res.status(201).json({ message: `${name} Registration successful` });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: `${email} no user found`
            });
        }


        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        )

        if (!passwordMatch) {
            return res.status(400).json({
                message: "Invalid password"
            });
        }


        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_KEY,
            { expiresIn: "7d" }
        );

        res.cookie('av_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        }).status(200).json({
            message: `${user.name} Login successful`,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});

router.get('/check-login', async (req, res) => {
    try {
        const token = req.cookies.av_token

        if (!token) {
            return res.status(401).json({
                message: 'No user Logedin'
            });
        }
        const dec = jwt.verify(token, process.env.JWT_KEY)
        const user = await User.findOne({ _id: dec.userId })
        if (!user) {
            return res.status(401).json({
                message: 'No user Logedin'
            })
        }

        res.status(200).json({
            message: `${user.name} Login successful`
        })
    } catch (e) {
        res.status(401).json({
            message: 'No user Logedin'
        })
    }
})

router.post('/logout', (req, res) => {
    res.clearCookie('av_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    });

    return res.status(200).json({
        message: 'Logout successful'
    });
});

router.post('/send-otp', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: "Email is required." });
    }

    try {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ success: false, message: "No account found with this email." });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetOTP = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000;
        await user.save();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'AgriVision - Password Reset OTP',
            text: `Hello ${user.name},\n\nYour password reset verification code is: ${otp}\n\nThis code is valid for 10 minutes. If you did not request this, please ignore this email.`
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: "OTP sent to your email successfully." });

    } catch (error) {
        console.error("Error sending OTP:", error);
        res.status(500).json({ success: false, message: "Failed to send OTP due to server error." });
    }
});

router.post('/reset-password', async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.status(400).json({ success: false, message: "All fields are required." });
    }

    try {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        if (user.resetOTP !== otp) {
            return res.status(400).json({ success: false, message: "Invalid OTP code." });
        }

        if (user.otpExpires < Date.now()) {
            return res.status(400).json({ success: false, message: "OTP has expired. Please request a new code." });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOTP = null;
        user.otpExpires = null;
        await user.save();

        res.status(200).json({ success: true, message: "Password reset successfully!" });

    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ success: false, message: "Server error while resetting password." });
    }
});

export default router