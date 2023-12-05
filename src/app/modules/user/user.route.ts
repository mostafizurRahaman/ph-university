import express, { Router } from 'express';
import { UserControllers } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import StudentValidationSchema from '../student/student.zod.validation';
import facultyValidationSchema from '../faculty/faculty.validation';

const router: Router = express.Router();

router
  .route('/create-student')
  .post(
    validateRequest(StudentValidationSchema),
    UserControllers.createStudent,
  );

router
  .route('/create-faculty')
  .post(
    validateRequest(facultyValidationSchema),
    UserControllers.createFaculty,
  );
export const userRouter = router;
