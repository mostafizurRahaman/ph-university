import validateRequest from '../../middlewares/validateRequest';
import { CoursesController } from './course.controller';
import express from 'express';
import { CourseValidationSchema } from './course.validation';

const router = express.Router();

router
  .route('/create-course')
  .post(
    validateRequest(CourseValidationSchema.createCourseValidationSchema),
    CoursesController.createCourse,
  );

router.route('/').get(CoursesController.getAllCourses);

router
  .route('/:id')
  .get(CoursesController.getSingleCourseById)
  .delete(CoursesController.deleteSingleCourseById);

export const CourseRoutes = router;
