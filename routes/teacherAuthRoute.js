const express = require('express');
const {
  signupValidator,
  loginValidator,
} = require('../utils/validators/teacherAuthValidator');

const {
  signup,
  login,
  forgotPassword,
  verifyPassResetCode,
  resetPassword,
} = require('../services/teacherAuthService');

const router = express.Router();

router.post('/teacherSignup', signupValidator, signup);
router.post('/teacherLogin', loginValidator, login);
router.post('/teacherForgotPassword', forgotPassword);
router.post('/teacherVerifyResetCode', verifyPassResetCode);
router.put('/teacherResetPassword', resetPassword);

module.exports = router;
