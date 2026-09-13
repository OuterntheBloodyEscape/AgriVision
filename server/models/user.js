import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        Company_name: {
            type: String,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        phone: {
            type: String
        },
        password: {
            type: String,
            required: true,
        },
        about: {
            type: String
        },
        profileImage: {
            type: String,
            default: ""
        },
        resetOTP: {
            type: String,
            default: null
        },
        otpExpires: {
            type: Date,
            default: null
        }
    }
)

export default mongoose.model('User', userSchema)