const crypto = require('crypto');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const sendEmail = require('../utils/sendEmail');
const createToken = require('../utils/createToken');

const Teacher = require('../models/teacherModel');

// @desc    Signup
// @route   GET /api/v1/teacherAuth/signup
// @access  Public
exports.signup = asyncHandler(async (req, res, next) => {
  // 1- Create teacher
  const teacher = await Teacher.create({
    fullName: req.body. fullName,
    email: req.body.email,
    password: req.body.password,
    subject:req.body.subject,
    level:req.body.level
  });

  // 2- Generate token
  const token = createToken(teacher._id);

  res.status(201).json({ data: teacher, token });
});

// @desc    Login
// @route   GET /api/v1/teacherAuth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  // 1) check if password and email in the body (validation)
  // 2) check if teacher exist & check if password is correct
  const teacher = await Teacher.findOne({ email: req.body.email });

  if (!teacher || !(await bcrypt.compare(req.body.password, teacher.password))) {
    return next(new ApiError('Incorrect email or password', 401));
  }
  // 3) generate token
  const token = createToken(teacher._id);

  // Delete password from response
  delete teacher._doc.password;
  // 4) send response to client side
  res.status(200).json({ data: teacher, token });
});

// @desc   make sure the teacher is logged in
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


  // 3) Check if teacher exists
  const currentTeacher = await Teacher.findById(decoded.studentId);
  if (!currentTeacher) {
    return next(
      new ApiError(
        'The teacher that belong to this token does no longer exist',
        401
      )
    );
  }






  // 4) Check if Teacher change his password after token created
  if (currentTeacher.passwordChangedAt) {
    const passChangedTimestamp = parseInt(
      currentTeacher.passwordChangedAt.getTime() / 1000,
      10
    );
    // Password changed after token created (Error)
    if (passChangedTimestamp > decoded.iat) {
      return next(
        new ApiError(
          'teacher recently changed his password. please login again..',
          401
        )
      );
    }
  }

  req.teacher = currentTeacher;
  next();
});

// @desc    Authorization (teacher Permissions)
// ["Student","admin", "manager"]
exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    // 1) access roles
    // 2) access registered user (req.student.role)
    if (!roles.includes(req.teacher.role)) {
      return next(
        new ApiError('You are not allowed to access this route', 403)
      );
    }
    next();
  });

// @desc    Forgot password
// @route   POST /api/v1/teacherAuth/forgotPassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // 1) Get Teacher by email
  const teacher = await Teacher.findOne({ email: req.body.email });
  if (!teacher) {
    return next(
      new ApiError(`There is no teacher with that email ${req.body.email}`, 404)
    );
  }
  // 2) If teacher exist, Generate hash reset random 6 digits and save it in db
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash('sha256')
    .update(resetCode)
    .digest('hex');

  // Save hashed password reset code into db
  teacher.passwordResetCode = hashedResetCode;
  // Add expiration time for password reset code (10 min)
  teacher.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  teacher.passwordResetVerified = false;

  await teacher.save();

  // 3) Send the reset code via email
  const message = `Hi ${teacher.name},\n We received a request to reset the password on your TeacherAPP Account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The TeacherAPP Team`;
  try {
    await sendEmail({
      email: teacher.email,
      subject: 'Your password reset code (valid for 10 min)',
      message,
    });teacher
  } catch (err) {
    teacher.passwordResetCode = undefined;
    teacher.passwordResetExpires = undefined;
    teacher.passwordResetVerified = undefined;

    await teacher.save();
    return next(new ApiError('There is an error in sending email', 500));
  }

  res
    .status(200)
    .json({ status: 'Success', message: 'Reset code sent to email' });
});

// @desc    Verify password reset code
// @route   POST /api/v1/teacherAuth/verifyResetCode
// @access  Public
exports.verifyPassResetCode = asyncHandler(async (req, res, next) => {
  // 1) Get teacher based on reset code
  const hashedResetCode = crypto
    .createHash('sha256')
    .update(req.body.resetCode)
    .digest('hex');

  const teacher= await Teacher.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!teacher) {
    return next(new ApiError('Reset code invalid or expired'));
  }

  // 2) Reset code valid
  teacher.passwordResetVerified = true;
  await teacher.save();

  res.status(200).json({
    status: 'Success',
  });
});

// @desc    Reset password
// @route   POST /api/v1/teacherAuth/resetPassword
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // 1) Get teacher based on email
  const teacher = await Teacher.findOne({ email: req.body.email });
  if (!teacher) {
    return next(
      new ApiError(`There is no teacher with email ${req.body.email}`, 404)
    );
  }

  // 2) Check if reset code verified
  if (!teacher.passwordResetVerified) {
    return next(new ApiError('Reset code not verified', 400));
  }

  teacher.password = req.body.newPassword;
  teacher.passwordResetCode = undefined;
 teacher.passwordResetExpires = undefined;
  teacher.passwordResetVerified = undefined;

  await teacher.save();

  // 3) if everything is ok, generate token
  const token = createToken(teacher._id);
  res.status(200).json({ token });
});
