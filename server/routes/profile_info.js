import express from 'express'
import User from '../models/user.js'
import jwt from 'jsonwebtoken'

const router = express.Router()

router.get('/getProfileInfo', async (req, res) => {
    const authorization = req.headers.authorization
    if (!authorization) {
        res.status(120).json(
            {
                message: 'No user Login',
            }
        )
    }
    const token = authorization.split(' ')[1]
    try {
        const decode = jwt.verify(token, process.env.JWT_KEY)
        const user = await User.findById(decode.userId)
        res.json({
            name: user.name,
            companyName: user.Company_name,
            email: user.email,
            phone: user.phone,
            about: user.about
        })
    } catch (e) {
        console.error(e)
    }
})

router.patch('/updateProfileInfo', async (req, res) => {
    const { name, companyName, email, phone, about } = req.body
    const authorization = req.headers.authorization
    if (!authorization) {
        res.status(120).json(
            {
                message: 'No user Login',
            }
        )
    }
    const token = authorization.split(' ')[1]
    const decode = jwt.verify(token, process.env.JWT_KEY)
    try {
        const user = await User.findOneAndUpdate(
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
            }
        )

        if (user) {
            res.status(200).json({
                message: 'Change success fully'
            })
        }

    } catch (e) {
        console.error(e)
    }
})

export default router