const express = require('express');
const {
  getCourseValidator,
  createCourseValidator,
  updateCourseValidator,
  deleteCourseValidator,
  
  
} = require('../utils/validators/courseValidator');

const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  getPreCourse ,
  // uploadCourseImages,
  // resizeCourseImages,

} = require('../services/courseService');
const teacherAuthService= require('../services/teacherAuthService');

const router = express.Router();

router.get(
  '/pre/:courseId',
  getPreCourse 
);
router
  .route('/')
  .get(getCourses)
  .post(
  teacherAuthService.protect,
  teacherAuthService.allowedTo('admin', 'teacher'),
    // uploadCourseImages,
    // resizeCourseImages,
    createCourseValidator,
    createCourse
  );
router
  .route('/:id')
  .get(getCourseValidator, getCourse)
  .put(
   teacherAuthService.protect,
   teacherAuthService.allowedTo('admin', 'teacher'),
    // uploadCourseImages,
    // resizeCourseImages,
    updateCourseValidator,
    updateCourse
  )
  .delete(
     teacherAuthService.protect,
    teacherAuthService.allowedTo('admin'),
    deleteCourseValidator,
    deleteCourse
  );

module.exports = router;
