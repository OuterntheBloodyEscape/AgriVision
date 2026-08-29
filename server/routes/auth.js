const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require('jsonwebtoken')
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
        );

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

        res.status(200).json({
            message: `${user.name} Login successful`,
            token
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});

module.exports = router;