const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');


exports.createLesson = asyncHandler(async (req, res, next) => {
    const courseId = req.body.courseId; // Assuming courseId is passed in the request body
    const lessonData = {
      video: req.body.video,
      description: req.body.description,
      assignments: req.body.assignments,
      notes: req.body.notes,
    };
  
    const newLesson = new Lesson({
      courseId,
      lessons: [lessonData],
    });
  
    const savedLesson = await newLesson.save();
  
    res.status(201).json({ data: savedLesson });
  });
  
  // READ
  exports.getLessonById = asyncHandler(async (req, res, next) => {
    const lessonId = req.params.id;
  
    const lesson = await Lesson.findById(lessonId);
  
    if (!lesson) {
      return next(new ApiError(`No lesson found for this id ${lessonId}`, 404));
    }
  
    res.status(200).json({ data: lesson });
  });
  
  exports.getAllLessonsByCourse = asyncHandler(async (req, res, next) => {
    const courseId = req.params.courseId;
  
    const lessons = await Lesson.find({ courseId });
  
    res.status(200).json({ data: lessons });
  });
  
  // UPDATE
  exports.updateLesson = asyncHandler(async (req, res, next) => {
    const lessonId = req.params.id;
  
    const updatedData = {
      $push: {
        lessons: {
          video: req.body.video,
          description: req.body.description,
          assignments: req.body.assignments,
          notes: req.body.notes,
        },
      },
    };
  
    const updatedLesson = await Lesson.findByIdAndUpdate(
      lessonId,
      updatedData,
      { new: true }
    );
  
    if (!updatedLesson) {
      return next(new ApiError(`No lesson found for this id ${lessonId}`, 404));
    }
  
    res.status(200).json({ data: updatedLesson });
  });
  
  // DELETE
  exports.deleteLesson = asyncHandler(async (req, res, next) => {
    const lessonId = req.params.id;
  
    const deletedLesson = await Lesson.findByIdAndRemove(lessonId);
  
    if (!deletedLesson) {
      return next(new ApiError(`No lesson found for this id ${lessonId}`, 404));
    }
  
    res.status(200).json({ data: deletedLesson });
  });