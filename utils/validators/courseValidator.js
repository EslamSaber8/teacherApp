
const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const Course = require('../../models/courseModel');

exports.createCourseValidator = [
  check('teacher').notEmpty().withMessage('teacher require')
   .isMongoId()
   .withMessage('Invalid teacher id format'),
   check('student').notEmpty().withMessage('student require')
   .isMongoId()
   .withMessage('Invalid student id format'),

   check("lessons").notEmpty().withMessage("should include lesson "),
    check('subject') 
    .notEmpty()
    .withMessage('subject required'),

  check('level')
   .notEmpty().withMessage('teacher level required').isNumeric().withMessage("level must be a number between 1 and 12")
    .custom((value) => {
    if (value < 1 || value > 12) {
       throw new Error('level must be between 1 and 12');
    }
  return true;
}),

  validatorMiddleware,
];

exports.getCourseValidator = [
  check('id').isMongoId().withMessage('Invalid course id format'),
  validatorMiddleware,
];

exports.updateCourseValidator = [
  check('id').isMongoId().withMessage('Invalid course  id format'),

  check('teachers').optional()
  .isMongoId()
  .withMessage('Invalid teacher id format'),
  check('student').optional()
  .isMongoId()
  .withMessage('Invalid student id format'),
  check("lessons").optional(),
  check('subject') .optional(),
  check('level').optional().isNumeric().withMessage("level must be a number between 1 and 12")
    .custom((value) => {
    if (value < 1 || value > 12) {
       throw new Error('level must be between 1 and 12');
    }
  return true;
}),
  
  validatorMiddleware,
];



exports.deleteCourseValidator = [
  check('id').isMongoId().withMessage('Invalid courses id format'),
  validatorMiddleware,
];

