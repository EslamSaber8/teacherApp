const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const Teacher = require('../../models/teacherModel');

exports.signupValidator = [
  check('fullName')
    .notEmpty()
    .withMessage('Teacher required')
    .isLength({ min: 3 })
    .withMessage('Too short teacher name'),
    

  check('email')
    .notEmpty()
    .withMessage('Email required')
    .isEmail()
    .withMessage('Invalid email address')
    .custom((val) =>
      Teacher.findOne({ email: val }).then((teacher) => {
        if (teacher) {
          return Promise.reject(new Error('E-mail already in student'));
        }
      })
    ),
   
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

    check('subject') 
    .notEmpty().withMessage('subject required'),

  
    check('level')
   .notEmpty().withMessage('teacher level required').isNumeric().withMessage("level must be a number between 1 and 12")
    .custom((value) => {
    if (value < 1 || value > 12) {
       throw new Error('level must be between 1 and 12');
    }
  return true;
  }),

  check('passwordConfirm')
    .notEmpty()
    .withMessage('Password confirmation required'),

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
