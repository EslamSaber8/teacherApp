const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const Student = require('../../models/studentModel');

exports.signupValidator = [
  check('fullName')
    .notEmpty()
    .withMessage('Student required')
    .isLength({ min: 3 })
    .withMessage('Too short student name'),
    

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
    check('parentPhone')
    .notEmpty()
    .withMessage('parentPhone required')
    .isMobilePhone(['ar-EG', 'ar-SA'])
    .withMessage('Invalid phone number only accepted Egypt and SaudiArabia Phone numbers'),

    check('password')
    .notEmpty()
    .withMessage('Password required')
    .isLength({ min: 6})
    .withMessage('Password must be at least 6 characters')
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error('Password Confirmation incorrect');
      }
      return true;
    }),

  
    check('level')
   .notEmpty().withMessage('student level required').isNumeric().withMessage("level must be a number between 1 and 12")
    .custom((value) => {
    if (value < 1 || value > 12) {
       throw new Error('level must be between 1 and 12');
    }
  return true;
  }),

  check('passwordConfirm')
    .notEmpty()
    .withMessage('Password confirmation required'),

    check("age")
    .notEmpty() .withMessage('student age required').isNumeric().withMessage("age must be a number between 6 and 25") 
    .custom((value) => {
     // Custom validation to check the minimum and maximum values
     if (value < 6 || value > 25) {
       throw new Error('age must be between 6 and 25');
     }
     return true;}),
 

  validatorMiddleware,
];

exports.loginValidator = [
  check('email')
    .notEmpty()
    .withMessage('Email required')
    .isEmail()
    .withMessage('Invalid email address'),

  check('password')
    .notEmpty()
    .withMessage('Password required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),

  validatorMiddleware,
];
