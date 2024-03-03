import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { offeredCourseValidationSchema } from './offeredCourse.validation';
import { OfferedCourseControllers } from './offeredCourse.controller';
import { USER_ROLE } from '../user/user.contants';
import { auth } from '../../middlewares/auth';

const router = express.Router();


router
  .route('/my-offered-courses')
  .get(
    auth(USER_ROLE.student),
    OfferedCourseControllers.getMyOfferedCourses,
  );

router
  .route('/create-offered-course')
  .post(
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(
      offeredCourseValidationSchema.createOfferedCourseValidationSchema,
    ),
    OfferedCourseControllers.createOfferedCourse,
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
    OfferedCourseControllers.getSingleOfferedCourse,
  )
  .patch(
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(
      offeredCourseValidationSchema.updateOfferedCourseValidationSchema,
    ),
    OfferedCourseControllers.updateOfferedCourse,
  )
  .delete(
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    OfferedCourseControllers.deleteOfferedCourse,
  );


router
  .route('/')
  .get(
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty),
    OfferedCourseControllers.getAllOfferedCourse,
);
  

export const offeredCourseRoutes = router;
