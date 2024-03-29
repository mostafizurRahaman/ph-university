import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthValidations } from './auth.validation';
import { AuthControllers } from './auth.controller';
import { USER_ROLE } from '../user/user.contants';
import { auth } from '../../middlewares/auth';

const router = express.Router();

router
  .route('/login')
  .post(
    validateRequest(AuthValidations.loginValidationSchema),
    AuthControllers.login,
  );

router
  .route('/change-password')
  .post(
    auth( USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
    validateRequest(AuthValidations.changePasswordValidationSchema),
    AuthControllers.changePassword,
  );

router
  .route('/refresh-token')
  .post(
    validateRequest(AuthValidations.refreshTokenValidationSchema),
    AuthControllers.getRefreshToken,
  );

router
  .route('/forget-password')
  .post(
    validateRequest(AuthValidations.forgetPasswordValidationSchema),
    AuthControllers.forgetPassword,
  );

router
  .route('/reset-password')
  .post(
    validateRequest(AuthValidations.resetPasswordValidationSchema),
    AuthControllers.resetPassword,
  );



export const AuthRoutes = router;
