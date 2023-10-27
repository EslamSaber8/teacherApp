const crypto = require('crypto');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const sendEmail = require('../utils/sendEmail');
const createToken = require('../utils/createToken');

const Student = require('../models/studentModel');

// @desc    Signup
// @route   GET /api/v1/studentAuth/signup
// @access  Public
exports.signup = asyncHandler(async (req, res, next) => {
  // 1- Create student
  const student = await Student.create({
    fullName: req.body. fullName,
    email: req.body.email,
    password: req.body.password,
    age:req.body.age,
    level:req.body.level,
    parentPhone:req.body.parentPhone
  });

  // 2- Generate token
  const token = createToken(student._id);

  res.status(201).json({ data: student, token });
});

// @desc    Login
// @route   GET /api/v1/studentAuth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  // 1) check if password and email in the body (validation)
  // 2) check if student exist & check if password is correct
  const student = await Student.findOne({ email: req.body.email });

  if (!student || !(await bcrypt.compare(req.body.password, student.password))) {
    return next(new ApiError('Incorrect email or password', 401));
  }
  // 3) generate token
  const token = createToken(student._id);

  // Delete password from response
  delete student._doc.password;
  // 4) send response to client side
  res.status(200).json({ data: student, token });
});

// @desc   make sure the student is logged in
exports.protect = asyncHandler(async (req, res, next) => {
  // 1) Check if token exist, if exist get
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new ApiError(
        'You are not login, Please login to get access this route',
        401
      )
    );
  }

  // 2) Verify token (no change happens, expired token)
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // 3) Check if student exists
  const currentStudent = await Student.findById(decoded.studentId);
  if (!currentStudent) {
    return next(
      new ApiError(
        'The student that belong to this token does no longer exist',
        401
      )
    );
  }

  // 4) Check if Student change his password after token created
  if (currentStudent.passwordChangedAt) {
    const passChangedTimestamp = parseInt(
      currentStudent.passwordChangedAt.getTime() / 1000,
      10
    );
    // Password changed after token created (Error)
    if (passChangedTimestamp > decoded.iat) {
      return next(
        new ApiError(
          'Student recently changed his password. please login again..',
          401
        )
      );
    }
  }

  req.student = currentStudent;
  next();
});

// @desc    Authorization (Student Permissions)
// ["Student","admin", "teacher"]
exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    // 1) access roles
    // 2) access registered user (req.student.role)
    if (!roles.includes(req.student.role)) {
      return next(
        new ApiError('You are not allowed to access this route', 403)
      );
    }
    next();
  });

// @desc    Forgot password
// @route   POST /api/v1/studentAuth/forgotPassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // 1) Get Student by email
  const student = await Student.findOne({ email: req.body.email });
  if (!student) {
    return next(
      new ApiError(`There is no student with that email ${req.body.email}`, 404)
    );
  }
  // 2) If student exist, Generate hash reset random 6 digits and save it in db
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash('sha256')
    .update(resetCode)
    .digest('hex');

  // Save hashed password reset code into db
  student.passwordResetCode = hashedResetCode;
  // Add expiration time for password reset code (10 min)
  student.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  student.passwordResetVerified = false;

  await student.save();

  // 3) Send the reset code via email
  const message = `Hi ${student.name},\n We received a request to reset the password on your TeacherAPP Account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The TeacherAPP Team`;
  try {
    await sendEmail({
      email: student.email,
      subject: 'Your password reset code (valid for 10 min)',
      message,
    });
  } catch (err) {
    student.passwordResetCode = undefined;
    student.passwordResetExpires = undefined;
    student.passwordResetVerified = undefined;

    await student.save();
    return next(new ApiError('There is an error in sending email', 500));
  }

  res
    .status(200)
    .json({ status: 'Success', message: 'Reset code sent to email' });
});

// @desc    Verify password reset code
// @route   POST /api/v1/studentAuth/verifyResetCode
// @access  Public
exports.verifyPassResetCode = asyncHandler(async (req, res, next) => {
  // 1) Get student based on reset code
  const hashedResetCode = crypto
    .createHash('sha256')
    .update(req.body.resetCode)
    .digest('hex');

  const student= await Student.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!student) {
    return next(new ApiError('Reset code invalid or expired'));
  }

  // 2) Reset code valid
  student.passwordResetVerified = true;
  await student.save();

  res.status(200).json({
    status: 'Success',
  });
});

// @desc    Reset password
// @route   POST /api/v1/studentAuth/resetPassword
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // 1) Get student based on email
  const student = await Student.findOne({ email: req.body.email });
  if (!student) {
    return next(
      new ApiError(`There is no student with email ${req.body.email}`, 404)
    );
  }

  // 2) Check if reset code verified
  if (!student.passwordResetVerified) {
    return next(new ApiError('Reset code not verified', 400));
  }

  student.password = req.body.newPassword;
  student.passwordResetCode = undefined;
 student.passwordResetExpires = undefined;
  student.passwordResetVerified = undefined;

  await student.save();

  // 3) if everything is ok, generate token
  const token = createToken(student._id);
  res.status(200).json({ token });
});
