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
  .route('/:courseId/assign-faculties')
  .put(
    validateRequest(CourseValidationSchema.CourseFacultiesValidation),
    CoursesController.assignFaculties,
  );

router
  .route('/:courseId/remove-faculties')
  .put(
    validateRequest(CourseValidationSchema.CourseFacultiesValidation),
    CoursesController.removeFaculties,
  );

router
  .route('/:id')
  .get(CoursesController.getSingleCourseById)
  .delete(CoursesController.deleteSingleCourseById)
  .patch(
    validateRequest(CourseValidationSchema.updateCourseValidationSchema),
    CoursesController.updateSingleCourseById,
  );

export const CourseRoutes = router;
