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
    auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
    validateRequest(AuthValidations.changePasswordValidationSchema),
    AuthControllers.changePassword,
  );

router
  .route('/refresh-token')
  .post(
    validateRequest(AuthValidations.refreshTokenValidationSchema),
    AuthControllers.getRefreshToken,
  );

export const AuthRoutes = router;
