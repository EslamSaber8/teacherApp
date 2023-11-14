const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Please tell us your name!']
  },
  age:{
    type:Number ,
  },
  level:{
    type:Number,
    min: [1, 'level must be between 1:12'],
    max: [12, 'level must be between 1:12'],

  },
  teachers:[{
      type: mongoose.Schema.ObjectId,
      ref: 'teacher'
  }],
  parentPhone:String,
  attendant:[{
    type:[String], 
    default:"NewStudent"
  }],
  grades:[{
    type:[String],
    default:"NewStudent"
  }],
  expenses:[{
    type:[Boolean],
    default:false
  }],
  email: {
    type: String,
    required: [true, 'email required'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'password required'],
    minlength: [6, 'Too short password'],
  },
  passwordChangedAt: Date,
  passwordResetCode: String,
  passwordResetExpires: Date,
  passwordResetVerified: Boolean,
  role: {
    type: String,
    default: 'student',
  },
  active:{
    type:Boolean,
    default:true
  },
  courses:[{
    type: mongoose.Schema.ObjectId,
    ref: 'Course',
  }],
});

studentSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  // Hashing student password
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
studentSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'course',
    select: 'titel -_id',
  });
  next();
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;







