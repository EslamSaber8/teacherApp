const express = require('express');
const {
getLessonsValidator,
createLessonsValidator,
updateLessonsValidator,
deleteLessonsValidator,
  
  
} = require('../utils/validators/lessonsValidator');

const {
  getAllLessonsByCourse,
  getLessonById ,
  createLesson,
  updateLesson,
  deleteLesson ,
 
} = require('../services/lessonsService');
const studentAuthService= require('../services/studentAuthService');

const router = express.Router();

router
  .route('/')
  .get(getAllLessonsByCourse)
  .post(
  studentAuthService.protect,
  studentAuthService.allowedTo('admin', 'teacher'),
  createLessonsValidator,
  createLesson
  );
router
  .route('/:id')
  .get( getLessonsValidator,getLessonById)
  .put(
   studentAuthService.protect,
   studentAuthService.allowedTo('admin', 'teacher'),
   updateLessonsValidator,
   updateLesson
  )
  .delete(
    studentAuthService.protect,
    studentAuthService.allowedTo('admin',"teacher"),
    deleteLessonsValidator,
    deleteLesson
  );

module.exports = router;
