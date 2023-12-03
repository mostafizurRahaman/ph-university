import express, { Router } from 'express';
import { UserControllers } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import StudentValidationSchema from '../student/student.zod.validation';

const router: Router = express.Router();

router.route('/create-student').post(UserControllers.createStudent);
export const userRouter = router;
