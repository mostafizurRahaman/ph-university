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

router
  .route('/:id')
  .get(OfferedCourseControllers.getSingleOfferedCourse)
  .patch(
    validateRequest(
      offeredCourseValidationSchema.updateOfferedCourseValidationSchema,
    ),
    OfferedCourseControllers.updateOfferedCourse,
  )
  .delete(OfferedCourseControllers.deleteOfferedCourse);

router.route('/').get(OfferedCourseControllers.getAllOfferedCourse);

export const offeredCourseRoutes = router;
