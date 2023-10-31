const mongoose = require('mongoose');
const Course = require('./courseModel');

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    ratings: {
      type: Number,
      min: [1, 'Min ratings value is 1.0'],
      max: [5, 'Max ratings value is 5.0'],
      required: [true, 'review ratings required'],
    },
    student: {
      type: mongoose.Schema.ObjectId,
      ref: 'Student',
      required: [true, 'Review must belong to Student'],
    },
    // parent reference (one to many)
    course: {
      type: mongoose.Schema.ObjectId,
      ref: 'Course',
      required: [true, 'Review must belong to Course'],
    },
  },
  { timestamps: true }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: 'student', select: 'fullName' });
  next();
});

reviewSchema.statics.calcAverageRatingsAndQuantity = async function (
  courseId
) {
  const result = await this.aggregate([
    // Stage 1 : get all reviews in specific  course
    {
      $match: { course:  courseId },
    },
    // Stage 2: Grouping reviews based on  courseID and calc avgRatings, ratingsQuantity
    {
      $group: {
        _id: 'course',
        avgRatings: { $avg: '$ratings' },
        ratingsQuantity: { $sum: 1 },
      },
    },
  ]);

  // console.log(result);
  if (result.length > 0) {
    await Course.findByIdAndUpdate(courseId, {
      ratingsAverage: result[0].avgRatings,
      ratingsQuantity: result[0].ratingsQuantity,
    });
  } else {
    await Course.findByIdAndUpdate(courseId, {
      ratingsAverage: 0,
      ratingsQuantity: 0,
    });
  }
};

reviewSchema.post('save', async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.course);
});

reviewSchema.post('remove', async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.course);
});

module.exports = mongoose.model('Review', reviewSchema);

