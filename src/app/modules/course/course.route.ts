import validateRequest from '../../middlewares/validateRequest';
import { CoursesController } from './course.controller';
import express from 'express';
import { CourseValidationSchema } from './course.validation';
import { auth } from '../../middlewares/auth';

const router = express.Router();

router
  .route('/create-course')
  .post(
    auth('admin'),
    validateRequest(CourseValidationSchema.createCourseValidationSchema),
    CoursesController.createCourse,
  );

router
  .route('/')
  .get(auth('student', 'faculty', 'admin'), CoursesController.getAllCourses);

router
  .route('/:courseId/assign-faculties')
  .put(
    auth('admin'),
    validateRequest(CourseValidationSchema.CourseFacultiesValidation),
    CoursesController.assignFaculties,
  );

router
  .route('/:courseId/remove-faculties')
  .put(
    auth('admin'),
    validateRequest(CourseValidationSchema.CourseFacultiesValidation),
    CoursesController.removeFaculties,
  );

router
  .route('/:id')
  .get(CoursesController.getSingleCourseById)
  .delete(auth('admin'), CoursesController.deleteSingleCourseById)
  .patch(
    auth('admin'),
    validateRequest(CourseValidationSchema.updateCourseValidationSchema),
    CoursesController.updateSingleCourseById,
  );

export const CourseRoutes = router;
