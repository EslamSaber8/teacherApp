const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.ObjectId,
        ref: "Course",
    },
    lessons: [{
        _id: {
            type: mongoose.Schema.ObjectId,
            auto: true,
        },
        video: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        assignments: [{
            type: String,
        }],
        notes: [{
            type: String,
        }],
    }],
});

const Lesson = mongoose.model('Lesson', lessonSchema);

module.exports = Lesson;