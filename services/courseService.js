const asyncHandler = require('express-async-handler');
const factory = require('./handlersFactory');
const ApiError = require('../utils/apiError');
const Course = require('../models/courseModel');

// @desc    Get list of course
// @route   GET /api/v1/courses
// @access  Private/Admin
exports.getCourses = factory.getAll(Course);

// @desc    Get specific course by id
// @route   GET /api/v1/courses/:id
// @access  Private/Admin
exports.getCourse = factory.getOne(Course);

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
