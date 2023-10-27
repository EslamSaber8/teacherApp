const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');

const factory = require('./handlersFactory');
const ApiError = require('../utils/apiError');
const createToken = require('../utils/createToken');
const Student = require('../models/studentModel');

// @desc    Get list of student
// @route   GET /api/v1/students
// @access  Private/Admin
exports.getStudents = factory.getAll(Student);

// @desc    Get specific student by id
// @route   GET /api/v1/students/:id
// @access  Private/Admin
exports.getStudent = factory.getOne(Student);

// @desc    Create student
// @route   POST  /api/v1/students
// @access  Private/Admin
exports.createStudent= factory.createOne(Student);

// @desc    Update specific student
// @route   PUT /api/v1/students/:id
// @access  Private/Admin
exports.updateStudent = asyncHandler(async (req, res, next) => {
  const document = await Student.findByIdAndUpdate(
    req.params.id,
    {
      fullName:req.body.fullName,
      email:req.body.email,
      age:req.body.age,
      level: req.body.level,
      teachers:req.body.teachers,
      parentPhone:req.body.parentPhone,
      attendant:req.body.attendant,
      grades: req.body. grades,
      expenses:req.body. expenses,
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

exports.changeStudentPassword = asyncHandler(async (req, res, next) => {
  const document = await Student.findByIdAndUpdate(
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

// @desc    Delete specific student
// @route   DELETE /api/v1/students/:id
// @access  Private/Admin
exports.deleteStudent= factory.deleteOne(Student);

// // @desc    Get Logged student data
// // @route   GET /api/v1/students/getMe
// // @access  Private/Protect
exports.getLoggedStudentData = asyncHandler(async (req, res, next) => {
  req.params.id = req.Student._id;
  next();
});

 // @desc    Update logged student password
 // @route   PUT /api/v1/students/updateMyPassword
 // @access  Private/Protect
exports.updateLoggedStudentPassword = asyncHandler(async (req, res, next) => {
  // 1) Update student password based user payload (req.student._id)
  const student = await Student.findByIdAndUpdate(
    req.student._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
   },
    {
       new: true,
     }
   );

  // 2) Generate token
  const token = createToken(student._id);

   res.status(200).json({ data: student, token });
 });

// @desc    Update logged student data (without password, role)
// @route   PUT /api/v1/students/updateMe
// @access  Private/Protect
exports.updateLoggedStudentData = asyncHandler(async (req, res, next) => {
  const updatedStudent = await Student.findByIdAndUpdate(
    req.student._id,
    {
      fullName: req.body.fullName,
      age:req.body.age,
      level:req.body.level,
      email: req.body.email,
      parentPhone: req.body.parentPhone,
    },
    { new: true }
  );

  res.status(200).json({ data: updatedStudent });
});

// @desc    Deactivate logged student
// @route   DELETE /api/v1/students/deleteMe
// @access  Private/Protect
exports.deleteLoggedStudentData = asyncHandler(async (req, res, next) => {
  await Student.findByIdAndUpdate(req.student._id, { active: false });

  res.status(204).json({ status: 'Success' });
});
