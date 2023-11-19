
const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');


exports.createCourseValidator = [
  check("titel").notEmpty().withMessage('titel require'),
  check('teacher').notEmpty().withMessage('teacher require')
   .isMongoId()
   .withMessage('Invalid teacher id format'),

  //  check("lessons").notEmpty().withMessage("should include lesson "),
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
  check('titel').optional(),
  check('teachers').optional()
  .isMongoId()
  .withMessage('Invalid teacher id format'),
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

