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
  // uploadCourseImages,
  // resizeCourseImages,
} = require('../services/courseService');
const studentAuthService= require('../services/studentAuthService');

const router = express.Router();

router
  .route('/')
  .get(getCourses)
  .post(
   studentAuthService.protect,
    studentAuthService.allowedTo('admin', 'manager'),
    // uploadCourseImages,
    // resizeCourseImages,
    createCourseValidator,
    createCourse
  );
router
  .route('/:id')
  .get(getCourseValidator, getCourse)
  .put(
   studentAuthService.protect,
    studentAuthService.allowedTo('admin', 'manager'),
    // uploadCourseImages,
    // resizeCourseImages,
    updateCourseValidator,
    updateCourse
  )
  .delete(
    studentAuthService.protect,
    studentAuthService.allowedTo('admin'),
    deleteCourseValidator,
    deleteCourse
  );

module.exports = router;
