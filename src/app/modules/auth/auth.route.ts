import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthValidations } from './auth.validation';
import { AuthControllers } from './auth.controller';

const router = express.Router();

router
  .route('/login')
  .post(
    validateRequest(AuthValidations.loginValidationSchema),
    AuthControllers.login,
  );

export const AuthRoutes = router;
