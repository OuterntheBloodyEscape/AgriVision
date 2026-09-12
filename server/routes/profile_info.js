import express from 'express'
import User from '../models/user.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const router = express.Router()

router.get('/getProfileInfo', async (req, res) => {
    try {
        const token = req.cookies.av_token
        if (!token) {
            return res.status(401).json({
                message: 'No user Logedin'
            });
        }
        const decode = jwt.verify(token, process.env.JWT_KEY)
        const user = await User.findById(decode.userId)
        if (!user) {
            return res.status(401).json({
                message: 'No user Logedin'
            })
        }
        res.status(201).json({
            name: user.name,
            companyName: user.Company_name,
            email: user.email,
            phone: user.phone,
            about: user.about
        })
    } catch (e) {
        console.error(e)
        return res.status(500).json({
            message: 'Server error'
        });
    }
})

router.patch('/updateProfileInfo', async (req, res) => {
    const { name, companyName, email, phone, about } = req.body
    try {
        const token = req.cookies.av_token
        if (!token) {
            return res.status(401).json({
                message: 'No user Logedin'
            });
        }
        const decode = jwt.verify(token, process.env.JWT_KEY)
        const user = await User.findOne({ _id: decode.userId })

        if (!user) {
            return res.status(401).json({
                message: 'No user Logedin'
            })
        }

        if (user.email == email) {
            if (await User.findOneAndUpdate(
                { _id: decode.userId },
                {
                    name,
                    Company_name: companyName,
                    phone,
                    about
                },
                {
                    returnDocument: "after"
                })) {
                res.status(200).json({
                    message: 'profile updated successfully'
                })
            }
        } else {
            const user2 = await User.findOne({ email })
            if (user2) {
                return res.status(400).json({
                    message: `user ${email} already exist`
                });
            }

            if (await User.findOneAndUpdate(
                { _id: decode.userId },
                {
                    name,
                    Company_name: companyName,
                    email,
                    phone,
                    about
                },
                {
                    returnDocument: "after"
                })) {
                res.status(200).json({
                    message: 'profile updated successfully'
                })
            }
        }

    } catch (e) {
        console.error(e)
        return res.status(500).json({
            message: 'Server error'
        });
    }
})

router.patch('/updatePass', async (req, res) => {
    const { oldPass, newPass } = req.body
    try {
        const token = req.cookies.av_token
        if (!token) {
            return res.status(401).json({
                message: 'No user Logedin'
            });
        }
        const decode = jwt.verify(token, process.env.JWT_KEY)
        const user = await User.findOne({ _id: decode.userId })
        if (!user) {
            return res.status(401).json({
                message: 'No user Logedin'
            })
        }
        const passwordMatch = await bcrypt.compare(
            oldPass,
            user.password
        )

        if (!passwordMatch) {
            return res.status(400).json({
                message: "Invalid old password"
            });
        }

        const hashedPassword = await bcrypt.hash(newPass, 10);

        if (await User.findOneAndUpdate({ _id: decode.userId }, { password: hashedPassword }, { returnDocument: "after" })) {
            res.status(200).json({
                message: 'password updated successfully'
            })
        }

    } catch (e) {
        console.error(e)
        return res.status(500).json({
            message: 'Server error'
        });
    }
})

export default router