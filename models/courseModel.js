const mongoose = require('mongoose');
const { string } = require('sharp/lib/is');
const courseSchema = new mongoose.Schema({
  titel:String,
   teacher:{
        type: mongoose.Schema.ObjectId,
        ref: 'Teacher'
    },
    
  subject :String, 
  level:{
    type:Number,
    min: [1, 'level must be between 1:12'],
    max: [12, 'level must be between 1:12'],
},
  
  lessons:[{
    type: mongoose.Schema.ObjectId,
        ref: 'Lessons'
  }],
  price:Number,
  ratingsAverage: {
    type: Number,
    min: [1, 'Rating must be above or equal 1.0'],
    max: [5, 'Rating must be below or equal 5.0'],
    // set: (val) => Math.round(val * 10) / 10, // 3.3333 * 10 => 33.333 => 33 => 3.3
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
},
{
  timestamps: true,
  // to enable virtual populate
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});
courseSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'course',
  localField: '_id',
});
// Mongoose query middleware
courseSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'teacher',
    select: 'fullName -_id',
  });
  next();
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;







