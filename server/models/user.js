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
        }
    }
)

export default mongoose.model('User', userSchema)