import express from 'express'
import User from '../models/user.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import multer from 'multer'
import cloudinary from '../config/cloudinary.js'

const router = express.Router()

const upload = multer({
    storage: multer.memoryStorage()
})

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
        res.status(200).json({
            name: user.name,
            companyName: user.Company_name,
            email: user.email,
            phone: user.phone,
            about: user.about,
            profileImage: user.profileImage
        })
    } catch (e) {
        console.error(e)
        return res.status(500).json({
            message: 'Server error'
        });
    }
})

const getCloudinaryPublicId = (url) => {

    if (!url) {
        return null
    }

    const parts = url.split('/')

    const uploadIndex = parts.indexOf('upload')

    if (uploadIndex === -1) {
        return null
    }

    let publicId = parts
        .slice(uploadIndex + 1)
        .join('/')

    publicId = publicId.replace(/^v\d+\//, '')

    publicId = publicId.replace(/\.[^/.]+$/, '')

    return publicId
}

router.patch('/updateProfileInfo', upload.single('image'), async (req, res) => {

    const {
        name,
        companyName,
        email,
        phone,
        about
    } = req.body

    try {

        const token = req.cookies.av_token

        if (!token) {
            return res.status(401).json({
                message: 'No user Logedin'
            })
        }


        const decode = jwt.verify(
            token,
            process.env.JWT_KEY
        )


        const user = await User.findOne({
            _id: decode.userId
        })


        if (!user) {
            return res.status(401).json({
                message: 'No user Logedin'
            })
        }


        if (user.email != email) {

            const user2 = await User.findOne({
                email
            })

            if (user2) {
                return res.status(400).json({
                    message: `user ${email} already exist`
                })
            }
        }

        const updateData = {

            name,

            Company_name:
                companyName,

            email,

            phone,

            about
        }

        if (req.file) {

            const oldImage =
                user.profileImage

            const result = await new Promise(
                (resolve, reject) => {

                    const stream =
                        cloudinary.uploader.upload_stream(
                            {
                                folder:
                                    'agrivision/profile_images',

                                resource_type:
                                    'image'
                            },

                            (error, result) => {

                                if (error) {
                                    reject(error)
                                } else {
                                    resolve(result)
                                }

                            }
                        )


                    stream.end(
                        req.file.buffer
                    )

                }
            )

            updateData.profileImage =
                result.secure_url

            if (oldImage) {

                const oldPublicId =
                    getCloudinaryPublicId(
                        oldImage
                    )


                if (oldPublicId) {

                    await cloudinary.uploader.destroy(
                        oldPublicId,
                        {
                            resource_type:
                                'image'
                        }
                    )

                }

            }

        }

        const updatedUser =
            await User.findOneAndUpdate(

                {
                    _id: decode.userId
                },

                updateData,

                {
                    returnDocument: 'after'
                }
            )


        if (!updatedUser) {

            return res.status(404).json({
                message: 'User not found'
            })

        }


        return res.status(200).json({

            message:
                'profile updated successfully',

            profileImage:
                updatedUser.profileImage || ''

        })


    } catch (e) {

        console.error(e)

        return res.status(500).json({
            message: 'Server error'
        })

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