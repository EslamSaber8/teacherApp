const express = require('express');
const {
  getStudentValidator,
  createStudentValidator,
  updateStudentValidator,
  deleteStudentValidator,
  changeStudentPasswordValidator,
  updateLoggedStudentValidator,
} = require('../utils/validators/studentValidator');

const {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  // uploadStudentImage,
  // resizeImage,
  changeStudentPassword,
   getLoggedStudentData,
  updateLoggedStudentPassword,
  updateLoggedStudentData,
  deleteLoggedStudentData,
} = require('../services/studentService');

const studentAuthService = require('../services/studentAuthService');

const router = express.Router();

router.use(studentAuthService.protect);

router.get('/getMe', getLoggedStudentData, getStudent);
router.put('/changeMyPassword', updateLoggedStudentPassword);
router.put('/updateMe', updateLoggedStudentValidator, updateLoggedStudentData);
router.delete('/deleteMe', deleteLoggedStudentData);

// Admin
router.use(studentAuthService.allowedTo('admin'));
router.put(
  '/changePassword/:id',
  changeStudentPasswordValidator,
  changeStudentPassword
);
router
  .route('/')
  .get(getStudents)
  .post(/*uploadUserImage, resizeImage,*/ createStudentValidator, createStudent);
router
  .route('/:id')
  .get(getStudentValidator, getStudent)
  .put(/*uploadStudentImage, resizeImage,*/ updateStudentValidator, updateStudent)
  .delete(deleteStudentValidator, deleteStudent);

module.exports = router;
