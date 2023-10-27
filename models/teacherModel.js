const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const teacherSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Please tell us your name!']
  },
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
    default: 'teacher',
  },
  profileImg: {
    type: String,
  },
  subject:{
    type: [String],
  },
  level:{
    type:[Number],
    min: [1, 'level must be between 1:12'],
    max: [12, 'level must be between 1:12'],
},
  classes:[{
    day:String,
    hour:String
  }],
  active:{
    type:Boolean,
    default:true
  }
});

teacherSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  // Hashing student password
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;







