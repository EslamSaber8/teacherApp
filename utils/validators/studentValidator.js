const { check,body} = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const Student = require('../../models/studentModel');

exports.createStudentValidator = [
  check('fullName')
    .notEmpty()
    .withMessage('student fullName required')
    .isLength({ min: 6 })
    .withMessage('Too short fullName')
    .isLength({ max: 32 })
    .withMessage('Too long fullName'),

   check("age")
   .notEmpty() .withMessage('student age required').isNumeric().withMessage("age must be a number between 6 and 25") 
   .custom((value) => {
    // Custom validation to check the minimum and maximum values
    if (value < 6 || value > 25) {
      throw new Error('age must be between 6 and 25');
    }
    return true;}),



    check('email')
    .notEmpty()
    .withMessage('Email required')
    .isEmail()
    .withMessage('Invalid email address')
    .custom((val) =>
      Student.findOne({ email: val }).then((student) => {
        if (student) {
          return Promise.reject(new Error('E-mail already in student'));
        }
      })
    ),

  check('password')
    .notEmpty()
    .withMessage('Password required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error('Password Confirmation incorrect');
      }
      return true;
    }),

  check('passwordConfirm')
    .notEmpty()
    .withMessage('Password confirmation required'),


   check('level')
   .notEmpty().withMessage('student level required').isNumeric().withMessage("level must be a number between 1 and 12")
    .custom((value) => {
    if (value < 1 || value > 12) {
       throw new Error('level must be between 1 and 12');
    }
  return true;
}),

  
   check('teachers').optional()
   .isMongoId()
   .withMessage('Invalid teacher id format'),
   check('parentPhone')
    .notEmpty()
    .withMessage('parentPhone required')
    .isMobilePhone(['ar-EG', 'ar-SA'])
    .withMessage('Invalid phone number only accepted Egypt and SaudiArabia Phone numbers'),

    check('attendant').optional(),
    check('grades').optional(),
    check('expenses').optional(),

  validatorMiddleware,
];

exports.getStudentValidator = [
  check('id').isMongoId().withMessage('Invalid Student id format'),
  validatorMiddleware,
];

exports.updateStudentValidator = [
  check('id').isMongoId().withMessage('Invalid Student id format'),
  check('fullName').optional()
  .isLength({ min: 6 })
  .withMessage('Too short fullName')
  .isLength({ max: 32 })
  .withMessage('Too long fullName'),

check("age").optional().isNumeric()
.custom((value) => {
  // Custom validation to check the minimum and maximum values
  if (value < 6 || value > 25) {
    throw new Error('age must be between 6 and 25');
  }
  return true;}),

check('level').optional()
.isNumeric().withMessage("level must be a number between 6 and 25")
    .custom((value) => {
    if (value < 1 || value > 12) {
       throw new Error('level must be between 1 and 12');
    }
  return true;
}),
check('teachers').optional()
 .isMongoId()
 .withMessage('Invalid teacher id format'),
 check('parentPhone').optional()
  .isMobilePhone(['ar-EG', 'ar-SA'])
  .withMessage('Invalid phone number only accepted Egypt and SaudiArabia Phone numbers'),
  check('email').optional().isEmail()
  .withMessage('Invalid email address')
  .custom((val) =>
    Student.findOne({ email: val }).then((student) => {
      if (student) {
        return Promise.reject(new Error('E-mail already in student'));
      }
    })
  ),

    check('attendant').optional(),
    check('grades').optional(),
    check('expenses').optional(),
  validatorMiddleware,
];

exports.deleteStudentValidator = [
  check('id').isMongoId().withMessage('Invalid Student id format'),
  validatorMiddleware,
];
exports.changeStudentPasswordValidator = [
  check('id').isMongoId().withMessage('Invalid Student id format'),
  body('currentPassword')
    .notEmpty()
    .withMessage('You must enter your current password'),
  body('passwordConfirm')
    .notEmpty()
    .withMessage('You must enter the password confirm'),
  body('password')
    .notEmpty()
    .withMessage('You must enter new password')
    .custom(async (val, { req }) => {
      // 1) Verify current password
      const student = await Student.findById(req.params.id);
      if (!student) {
        throw new Error('There is no student for this id');
      }
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        student.password
      );
      if (!isCorrectPassword) {
        throw new Error('Incorrect current password');
      }

      // 2) Verify password confirm
      if (val !== req.body.passwordConfirm) {
        throw new Error('Password Confirmation incorrect');
      }
      return true;
    }),
  validatorMiddleware,
];

exports.updateLoggedStudentValidator = [
  body('fullName') .optional()
  .isLength({ min: 6 })
  .withMessage('Too short fullName')
  .isLength({ max: 32 })
  .withMessage('Too long fullName'),

check("age").optional().isNumeric()
.custom((value) => {
  // Custom validation to check the minimum and maximum values
  if (value < 6 || value > 25) {
    throw new Error('age must be between 6 and 25');
  }
  return true;}),

check('level').optional()
.isNumeric().withMessage("level must be a number between 6 and 25")
    .custom((value) => {
    if (value < 1 || value > 12) {
       throw new Error('level must be between 1 and 12');
    }
  return true;
}),
 check('parentPhone').optional()
  .isMobilePhone(['ar-EG', 'ar-SA'])
  .withMessage('Invalid phone number only accepted Egypt and SaudiArabia Phone numbers'),
  check('email').optional().isEmail()
  .withMessage('Invalid email address')
  .custom((val) =>
    Student.findOne({ email: val }).then((student) => {
      if (student) {
        return Promise.reject(new Error('E-mail already in student'));
      }
    })
  ),
  validatorMiddleware,
];
