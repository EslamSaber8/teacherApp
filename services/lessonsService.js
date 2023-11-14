const asyncHandler = require('express-async-handler');
const factory = require('./handlersFactory');
const ApiError = require('../utils/apiError');
const Lessons = require('../models/lessonsModel');
// @desc    Get list of course
// @route   GET /api/v1/courses
// @access  Private/Admin
exports.getLessons = factory.getAll(Lessons);

// @desc    Get specific course by id
// @route   GET /api/v1/courses/:id
// @access  Private/Admin
exports.getLesson = factory.getOne(Lessons);

// @desc    Create course
// @route   POST  /api/v1/courses
// @access  Private/Admin
exports.createLesson= factory.createOne(Lessons);

// @desc    Update specific course
// @route   PUT /api/v1/courses/:id
// @access  Private/Admin
 
exports.updateLesson = asyncHandler(async (req, res, next) => {
  const lessonId = req.params.id;

  const updatedData = {
    $push: {
      lessons: { $each: req.body.lessons },
    },
  };

  const updatedLesson = await Lessons.findByIdAndUpdate(
    lessonId,
    updatedData,
    { new: true }
  );

  if (!updatedLesson) {
    return next(new ApiError(`No lesson found for this id ${lessonId}`, 404));
  }

  res.status(200).json({ data: updatedLesson });
});


// @desc    Delete specific course
// @route   DELETE /api/v1/courses/:id
// @access  Private/Admin
exports.deleteLesson= factory.deleteOne(Lessons);






exports.updateLessonInArray = asyncHandler(async (req, res, next) => {
  const lessonId = req.params.lessonId; // ID of the lesson to be updated
  const lessonToUpdateId = req.body.lessonId; // ID of the specific lesson inside the array to be updated

  const updatedData = {
    $set: {
      'lessons.$[elem].video': req.body.video,
      'lessons.$[elem].description': req.body.description,
      'lessons.$[elem].assignments': req.body.assignments,
      'lessons.$[elem].notes': req.body.notes,
    },
  };

  const options = {
    arrayFilters: [{ 'elem._id': lessonToUpdateId }],
    new: true,
  };

  const updatedLesson = await Lessons.findByIdAndUpdate(
    lessonId,
    updatedData,
    options
  );

  if (!updatedLesson) {
    return next(new ApiError(`No lesson found for this id ${lessonId}`, 404));
  }

  res.status(200).json({ data: updatedLesson });
});

