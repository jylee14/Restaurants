const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    terminationDate: {
        type: Date,
        required: false
    },
    fulltime: {
        type: Boolean,
        required: true
    },
    department: {
        type: String,
        required: false
    },
    level: {
        type: Number,
        required: false
    },
    city: {
        type: String,
        required: false
    },
    country: {
        type: String,
        required: false
    }, 
    gender: {
        type: Boolean,
        required: true,
    },
    salary: {
        type: Number,
        required: true
    },
    bonus: {
        type: Number,
        required: false
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant'
    }
})

schema.set('toJSON', {
    transform: (doc, ret) => {
        ret.gender = ret.gender ? "Female" : "Male", 
        delete ret._id,
        delete ret.__v
    }
})

module.exports = new mongoose.model('Employee', schema)