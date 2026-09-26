import mongoose from 'mongoose'

const applicationSchema = new mongoose.Schema({
    applicantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    applicantName: {
        type: String,
        required: true
    },
    proposedPrice: {
        type: Number,
        required: true,
        min: 0
    },
    message: {
        type: String,
        default: '',
        maxlength: 500
    },
    status: {
        type: String,
        enum: ['pending', 'owner_countered', 'farmer_accepted', 'accepted', 'rejected'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { _id: true })

const ratingSchema = new mongoose.Schema({
    raterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    raterName: {
        type: String,
        required: true
    },
    stars: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        default: '',
        maxlength: 500
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { _id: true })

const contractSchema = new mongoose.Schema({

    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    ownerName: {
        type: String,
        required: true
    },

    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 80
    },

    need: {
        type: Number,
        required: true,
        min: 0
    },

    unit: {
        type: String,
        required: true,
        enum: ['kg', 'ton', 'L', 'kl']
    },

    price: {
        type: Number,
        required: true,
        min: 0
    },

    delivery: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },


    moreInfo: {
        type: String,
        required: true,
        maxlength: 500
    },

    status: {
        type: String,
        enum: ['open', 'closed', 'completed'],
        default: 'open'
    },

    applications: {
        type: [applicationSchema],
        default: []
    },

    ratings: {
        type: [ratingSchema],
        default: []
    }

}, { timestamps: true })

export default mongoose.model('Contract', contractSchema)
