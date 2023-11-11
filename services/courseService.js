const asyncHandler = require('express-async-handler');
const factory = require('./handlersFactory');
const ApiError = require('../utils/apiError');
const Course = require('../models/courseModel');
const Student=require("../models/studentModel")
const stripe=require('stripe')(process.env.STRIPE_SECRET);

// @desc    Get list of course
// @route   GET /api/v1/courses
// @access  Private/Admin
exports.getCourses = factory.getAll(Course);

// @desc    Get specific course by id
// @route   GET /api/v1/courses/:id
// @access  Private/Admin
exports.getCourse = factory.getOne(Course,'reviews');

// @desc    Create course
// @route   POST  /api/v1/courses
// @access  Private/Admin
exports.createCourse= factory.createOne(Course);

// @desc    Update specific course
// @route   PUT /api/v1/courses/:id
// @access  Private/Admin
exports.updateCourse = asyncHandler(async (req, res, next) => {
  const document = await Course.findByIdAndUpdate(
    req.params.id,
    {
     teacher:req.body.teacher,
     student:req.body.student,
     subject:req.body.student,
     level: req.body.level,
     lessons:req.body.student,
     price:req.body.price
      
    },
    {
      new: true,
    }
  );

  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});



// @desc    Delete specific course
// @route   DELETE /api/v1/courses/:id
// @access  Private/Admin
exports.deleteCourse= factory.deleteOne(Course);
// @desc    Get specific pre course by id
// @route   GET /api/v1/courses/pre/:id
// @access  Private/user
exports.getPreCourse = asyncHandler(async (req, res, next) => {
  const id=req.params
  const course = await Course.findOne({ id }).select('-lessons');

 
  if (!course) {
    return next(new AppError('No course found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      course
    }
  });
});











