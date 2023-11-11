const express = require('express');

const {
  addCourseToCart,
  getLoggedStudentCart,
  removeSpecificCartItem,
  clearCart,
  checkoutSession
} = require('../services/cartService');
const studentAuthService = require('../services/studentAuthService');

const router = express.Router();

router.use(studentAuthService.protect, studentAuthService.allowedTo('student'));
router.get(
  '/checkout-session/:cartId',
  checkoutSession
);
router
  .route('/')
  .post(addCourseToCart)
  .get(getLoggedStudentCart)
  .delete(clearCart);


router
  .route('/:itemId')
  .delete(removeSpecificCartItem);

module.exports = router;
