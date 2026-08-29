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
        console.log(e)
    }
})

module.exports = router