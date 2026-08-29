const express = require('express')
const User = require('../models/user')
const router = express.Router()
const jwt = require('jsonwebtoken')

router.post('/getProfileInfo', async (req, res) => {
    const { token } = req.body
    const decode = jwt.verify(token, process.env.JWT_KEY)
    try {
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

router.post('/updateProfileInfo', async (req, res) => {
    const { token, name, companyName, email, phone, about } = req.body
    const decode = jwt.verify(token, process.env.JWT_KEY)
    try {
        const user = await User.findByIdAndUpdate(
            decode.userId,
            {
                name,
                Company_name: companyName,
                email,
                phone,
                about
            },
            { new: true }
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

module.exports = router