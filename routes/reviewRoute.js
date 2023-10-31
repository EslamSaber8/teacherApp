const express = require('express');

const {
  createReviewValidator,
  updateReviewValidator,
  getReviewValidator,
  deleteReviewValidator,
} = require('../utils/validators/reviewValidator');

const {
  getReview,
  getReviews,
  createReview,
  updateReview,
  deleteReview,
  // createFilterObj,
  setCourseIdAndStudentIdToBody,
} = require('../services/reviewService');

const authService = require('../services/studentAuthService');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(/*createFilterObj,*/ getReviews)
  .post(
    authService.protect,
    authService.allowedTo('student'),
    setCourseIdAndStudentIdToBody,
    createReviewValidator,
    createReview
  );
router
  .route('/:id')
  .get(getReviewValidator, getReview)
  .put(
    authService.protect,
    authService.allowedTo('student'),
    updateReviewValidator,
    updateReview
  )
  .delete(
    authService.protect,
    authService.allowedTo('student', 'admin'),
    deleteReviewValidator,
    deleteReview
  );

module.exports = router;
