const express = require('express')
const router = express.Router()
const ApiKey = require('../models/ApiKey')

router.post('/getAiKey', async (req, res) => {
    const { name } = req.body
    try {
        const Key = await ApiKey.findOne({ name })
        if (!Key) {
            return res.status(400).json({
                message: `No ${name} key found`
            })
        }

        res.json({
            key: Key.key
        })

    } catch (e) {
        console.error(e)
    }
})

module.exports = router