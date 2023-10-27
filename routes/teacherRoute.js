const express = require('express');
const {
  getTeacherValidator,
  createTeacherValidator,
  updateTeacherValidator,
  deleteTeacherValidator,
  changeTeacherPasswordValidator,
  updateLoggedTeacherValidator,
} = require('../utils/validators/teacherValidator');

const {
  getTeachers,
  getTeacher,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  uploadTeacherImage,
  resizeImage,
  changeTeacherPassword,
   getLoggedTeacherData,
  updateLoggedTeacherPassword,
  updateLoggedTeacherData,
  deleteLoggedTeacherData,
} = require('../services/teacherService');

const teacherAuthService = require('../services/teacherAuthService');

const router = express.Router();

router.use(teacherAuthService.protect);

router.get('/getMe', getLoggedTeacherData, getTeacher);
router.put('/changeMyPassword', updateLoggedTeacherPassword);
router.put('/updateMe',uploadTeacherImage,resizeImage, updateLoggedTeacherValidator, updateLoggedTeacherData);
router.delete('/deleteMe', deleteLoggedTeacherData);

// Admin
router.use(teacherAuthService.allowedTo('admin'));
router.put(
  '/changePassword/:id',
  changeTeacherPasswordValidator,
  changeTeacherPassword
);
router
  .route('/')
  .get(getTeachers)
  .post(uploadTeacherImage, resizeImage, createTeacherValidator, createTeacher);
router
  .route('/:id')
  .get(getTeacherValidator, getTeacher)
  .put(uploadTeacherImage, resizeImage, updateTeacherValidator, updateTeacher)
  .delete(deleteTeacherValidator, deleteTeacher);

module.exports = router;
