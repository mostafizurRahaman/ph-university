import express, { Router } from 'express';
import { UserControllers } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import StudentValidationSchema from '../student/student.zod.validation';
import facultyValidationSchema from '../faculty/faculty.validation';
import { AdminValidations } from '../admin/admin.validation';
import { auth } from '../../middlewares/auth';
import { USER_ROLE } from './user.contants';

const router: Router = express.Router();

router
  .route('/create-student')
  .post(
    auth(USER_ROLE.admin),
    validateRequest(StudentValidationSchema),
    UserControllers.createStudent,
  );

router
  .route('/create-faculty')
  .post(
    auth(USER_ROLE.admin),
    validateRequest(facultyValidationSchema),
    UserControllers.createFaculty,
  );

router
  .route('/create-admin')
  .post(
    validateRequest(AdminValidations.createAdminValidationSchema),
    UserControllers.createAdmin,
  );

router
  .route('/me')
  .get(auth('admin', 'faculty', 'student'), UserControllers.getMe);
export const userRouter = router;
