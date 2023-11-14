
const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');

exports.createLessonsValidator = [
  check('courseId').notEmpty().withMessage(' courseId require')
   .isMongoId()
   .withMessage('Invalid  courseId format'),
   check('lesson').notEmpty().withMessage("should have Lessons "),


  validatorMiddleware,
];

exports.getLessonsValidator = [
  check('id').isMongoId().withMessage('Invalid Lesson id format'),
  validatorMiddleware,
];

exports.updateLessonsValidator = [
    check('courseId').optional()
    .isMongoId()
    .withMessage('Invalid courseId format'),
    check('lesson').optional(),
  
  validatorMiddleware,
];



exports.deleteLessonsValidator = [
  check('id').isMongoId().withMessage('Invalid lesson id format'),
  validatorMiddleware,
];

