import express from 'express'
import bcrypt from 'bcryptjs'
import User from '../models/user.js'
import jwt from 'jsonwebtoken'

const router = express.Router();

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

export default router