const express = require('express');
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
updateLesson,
deleteLesson,
updateLessonInArray
 
} = require('../services/lessonsService');
const teacherAuthService= require('../services/teacherAuthService');

const router = express.Router();

router
  .route('/')
  .get(getLessons)
  .post(
  teacherAuthService.protect,
 teacherAuthService.allowedTo('admin', 'teacher'),
  createLessonsValidator,
  createLesson
  );
router
  .route('/:id')
  .get( getLessonsValidator,getLesson)
  .put(
  teacherAuthService.protect,
   teacherAuthService.allowedTo('admin', 'teacher'),
   updateLessonsValidator,
   updateLesson
  )
  .delete(
    teacherAuthService.protect,
    teacherAuthService.allowedTo('admin',"teacher"),
    deleteLessonsValidator,
    deleteLesson
  );
  router.put(
    '/updateLesson/:lessonId',
    updateLessonInArray 
  );
module.exports = router;
