import validateRequest from '../../middlewares/validateRequest';
import { CoursesController } from './course.controller';
import express from 'express';
import { CourseValidationSchema } from './course.validation';
import { auth } from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.contants';

const router = express.Router();

router
  .route('/create-course')
  .post(
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(CourseValidationSchema.createCourseValidationSchema),
    CoursesController.createCourse,
  );

router
  .route('/')
  .get(
    auth(
      USER_ROLE.superAdmin,
      USER_ROLE.admin,
      USER_ROLE.faculty,
      USER_ROLE.student,
    ),
    CoursesController.getAllCourses,
  );

router
  .route('/:courseId/assign-faculties')
  .put(
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(CourseValidationSchema.CourseFacultiesValidation),
    CoursesController.assignFaculties,
  );

//  ** Get All Faculties From Specific Course:
router
  .route('/:courseId/get-faculties')
  .get(
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    CoursesController.getCourseFaculties,
  );

router
  .route('/:courseId/remove-faculties')
  .put(
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(CourseValidationSchema.CourseFacultiesValidation),
    CoursesController.removeFaculties,
  );

router
  .route('/:id')
  .get(
    auth(
      USER_ROLE.superAdmin,
      USER_ROLE.admin,
      USER_ROLE.faculty,
      USER_ROLE.student,
    ),
    CoursesController.getSingleCourseById,
  )
  .delete(
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    CoursesController.deleteSingleCourseById,
  )
  .patch(
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(CourseValidationSchema.updateCourseValidationSchema),
    CoursesController.updateSingleCourseById,
  );

export const CourseRoutes = router;
