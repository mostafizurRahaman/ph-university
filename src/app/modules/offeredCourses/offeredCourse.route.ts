import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { offeredCourseValidationSchema } from './offeredCourse.validation';

const router = express.Router();

router
  .route('/create-offered-course')
  .post(
    validateRequest(
      offeredCourseValidationSchema.createOfferedCourseValidationSchema,
    ),
  );

export const offeredCourseRoutes = router;
