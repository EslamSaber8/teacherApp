const express = require('express');
const {
  signupValidator,
  loginValidator,
} = require('../utils/validators/studentAuthValidator');

const {
  signup,
  login,
  forgotPassword,
  verifyPassResetCode,
  resetPassword,
} = require('../services/studentAuthService');

const router = express.Router();

router.post('/studentSignup', signupValidator, signup);
router.post('/studentLogin', loginValidator, login);
router.post('/studentForgotPassword', forgotPassword);
router.post('/studentVerifyResetCode', verifyPassResetCode);
router.put('/studentResetPassword', resetPassword);

module.exports = router;
