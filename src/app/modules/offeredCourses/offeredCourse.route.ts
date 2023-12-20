import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { offeredCourseValidationSchema } from './offeredCourse.validation';
import { OfferedCourseControllers } from './offeredCourse.controller';

const router = express.Router();

router
  .route('/create-offered-course')
  .post(
    validateRequest(
      offeredCourseValidationSchema.createOfferedCourseValidationSchema,
    ),
    OfferedCourseControllers.createOfferedCourse,
  );

export const offeredCourseRoutes = router;
