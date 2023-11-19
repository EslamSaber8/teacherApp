const express = require('express');
const upload = require("../utils/multer")
const {
getLessonsValidator,
createLessonsValidator,
updateLessonsValidator,
deleteLessonsValidator,
  
  
} = require('../utils/validators/lessonsValidator');

const {
getLessons,
getLesson,
createLesson,
deleteLesson,
updateLesson
} = require('../services/lessonsService');
const teacherAuthService= require('../services/teacherAuthService');
const { uploadVideo } = require('../utils/cloudinaryUpload');

const router = express.Router();

router
  .route('/')
  .get(getLessons)
  .post(
  teacherAuthService.protect,
 teacherAuthService.allowedTo('admin', 'teacher'),
  upload.single("video"),
  createLessonsValidator,
 
  uploadVideo,
  createLesson
  );
router
  .route('/:id')
  .get( getLessonsValidator,getLesson)
  .put(
  teacherAuthService.protect,
   teacherAuthService.allowedTo('admin', 'teacher'),
   teacherAuthService.allowLesson,
   updateLessonsValidator,
   upload.single("video"),
   uploadVideo,
   updateLesson
  )
  .delete(
    teacherAuthService.protect,
    teacherAuthService.allowedTo('admin',"teacher"),
    teacherAuthService.allowLesson,
    deleteLessonsValidator,
    deleteLesson
  );
module.exports = router;
