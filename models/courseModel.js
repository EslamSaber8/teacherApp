const mongoose = require('mongoose');

/*


const setImageURL = (doc) => {
  if (doc.imageCover) {
    const imageUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`;
    doc.imageCover = imageUrl;
  }
  if (doc.images) {
    const imagesList = [];
    doc.images.forEach((image) => {
      const imageUrl = `${process.env.BASE_URL}/products/${image}`;
      imagesList.push(imageUrl);
    });
    doc.images = imagesList;
  }
};
// findOne, findAll and update
productSchema.post('init', (doc) => {
  setImageURL(doc);
});

// create
productSchema.post('save', (doc) => {
  setImageURL(doc);
});
*/
const courseSchema = new mongoose.Schema({
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
    video:String,
    description:String,
    assignments:String,
    notes:String
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
courseSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'student',
    select: 'fullName -_id',
  });
  next();
});
const Course = mongoose.model('Course', courseSchema);

module.exports = Course;







