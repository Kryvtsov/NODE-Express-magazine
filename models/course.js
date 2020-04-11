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
    img: String,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

course.method('toClient', function () {
    const course = this.toObject();
    course.id = course._id;
    delete course._id;
    return course
})

module.exports = mongoose.model('Course', course);