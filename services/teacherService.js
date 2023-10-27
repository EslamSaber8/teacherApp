const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const bcrypt = require('bcryptjs');

const factory = require('./handlersFactory');
const ApiError = require('../utils/apiError');
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');
const createToken = require('../utils/createToken');
const Teacher= require('../models/teacherModel');

// Upload single image
exports.uploadTeacherImage = uploadSingleImage('profileImg');

// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `teacher-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat('jpeg')
      .jpeg({ quality: 95 })
      .toFile(`uploads/teachers/${filename}`);

    // Save image into our db
    req.body.profileImg = filename;
  }

  next();
});

// @desc    Get list of teachers
// @route   GET /api/v1/teachers
// @access  Private/Admin
exports.getTeachers = factory.getAll(Teacher);

// @desc    Get specific teacher by id
// @route   GET /api/v1/teachers/:id
// @access  Private/Admin
exports.getTeacher = factory.getOne(Teacher);

// @desc    Create teacher
// @route   POST  /api/v1/teachers
// @access  Private/Admin
exports.createTeacher = factory.createOne(Teacher);

// @desc    Update specific teacher
// @route   PUT /api/v1/teachers/:id
// @access  Private/Admin
exports.updateTeacher = asyncHandler(async (req, res, next) => {
  const document = await Teacher.findByIdAndUpdate(
    req.params.id,
    {
      fullName: req.body.fullName,
      classes:req.body. classes,
      email: req.body.email,
      profileImg: req.body.profileImg,
      role: req.body.role,
    },
    {
      new: true,
    }
  );

  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});

exports.changeTeacherPassword = asyncHandler(async (req, res, next) => {
  const document = await Teacher.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});

// @desc    Delete specific teacher
// @route   DELETE /api/v1/teachers/:id
// @access  Private/Admin
exports.deleteTeacher = factory.deleteOne(Teacher);

// @desc    Get Logged teacher data
// @route   GET /api/v1/teachers/getMe
// @access  Private/Protect
exports.getLoggedTeacherData = asyncHandler(async (req, res, next) => {
  req.params.id = req.teacher._id;
  next();
});

// @desc    Update logged teacher password
// @route   PUT /api/v1/teachers/updateMyPassword
// @access  Private/Protect
exports.updateLoggedTeacherPassword = asyncHandler(async (req, res, next) => {
  // 1) Update teacher password based teacher payload (req.teacher._id)
  const teacher = await Teacher.findByIdAndUpdate(
    req.teacher._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  // 2) Generate token
  const token = createToken(teacher._id);

  res.status(200).json({ data: teacher, token });
});

// @desc    Update logged teacher data (without password, role)
// @route   PUT /api/v1/teachers/updateMe
// @access  Private/Protect
exports.updateLoggedTeacherData = asyncHandler(async (req, res, next) => {
  const updatedTeacher = await Teacher.findByIdAndUpdate(
    req.teacher._id,
    {
      fullName: req.body.fullName,
      email: req.body.email,
      profileImg:req.body.profileImg,
      subject:req.body.subject,
      level:req.body. level,
     classes:req.body.classes,
    },
    { new: true }
  );

  res.status(200).json({ data: updatedTeacher });
});

// @desc    Deactivate logged teacher
// @route   DELETE /api/v1/teachers/deleteMe
// @access  Private/Protect
exports.deleteLoggedTeacherData = asyncHandler(async (req, res, next) => {
  await Teacher.findByIdAndUpdate(req.teacher._id, { active: false });

  res.status(204).json({ status: 'Success' });
});
