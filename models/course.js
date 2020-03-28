const mongoose = require('mongoose');
const course = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    img: String
});

module.exports = mongoose.model('Course', course);