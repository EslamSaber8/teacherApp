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
        ref: 'teacher'
    },
  student:[{
    type: mongoose.Schema.ObjectId,
    ref:'student',
    default:"NEW COURSE"
  }],
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
  }]
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







