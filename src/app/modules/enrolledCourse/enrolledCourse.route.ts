import express from 'express';
import { EnrolledCourseValidationSchema } from './enrolledCourse.validation';
import { EnrolledCourseController } from './enrolledCourse.controller';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../user/user.contants';
import { auth } from '../../middlewares/auth';

// ** Create Route:
const router = express.Router();

// ** Create Enrolled Course:
router
  .route('/create-enrolled-course')
  .post(
    auth(USER_ROLE.student),
    validateRequest(
      EnrolledCourseValidationSchema.createEnrolledCourseValidationSchema,
    ),
    EnrolledCourseController.createEnrolledCourse,
  );

//  ** Update Enrolled Course Marks Routes :
router
  .route('/update-enrolled-course-marks')
  .put(
    auth(USER_ROLE.faculty),
    validateRequest(
      EnrolledCourseValidationSchema.updateEnrolledCourseMarksValidationSchema,
    ),
    EnrolledCourseController.updateEnrolledCourseMarks,
  );
export const EnrolledCourseRouter = router;
