const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    "username": {
        type: String,
        required: true,
        default: 'John Doe'
    },
    "height": {
        type: Number,
        default: 0
    },

    "email": {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model('Users', userSchema);