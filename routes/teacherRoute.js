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
const { uploadIMG } = require('../utils/cloudinaryUpload');
const upload=require("../utils/multer")

const router = express.Router();

router.use(teacherAuthService.protect);

router.get('/getMe', getLoggedTeacherData, getTeacher);
router.put('/changeMyPassword', updateLoggedTeacherPassword);
router.put('/updateMe',upload.single("profileImg"), uploadIMG, updateLoggedTeacherValidator, updateLoggedTeacherData);
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
  .post(upload.single("profileImg"), uploadIMG, createTeacherValidator, createTeacher);
router
  .route('/:id')
  .get(getTeacherValidator, getTeacher)
  .put(upload.single("profileImg"), uploadIMG, updateTeacherValidator, updateTeacher)
  .delete(deleteTeacherValidator, deleteTeacher);

module.exports = router;
