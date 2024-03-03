import express from 'express';
import { StudentController } from './student.controller';
import validateRequest from '../../middlewares/validateRequest';
import { UpdateStudentValidationSchema } from './student.zod.validation';
import { auth } from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.contants';

const router = express.Router();

// router.post('/create-student', StudentController.createStudent);

router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  StudentController.getAllStudents,
);

router.get(
  '/aggregate',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  StudentController.getStudentsWithAggregation,
);

router.get(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.superAdmin),
  StudentController.getStudentById,
);

router.patch(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(UpdateStudentValidationSchema),
  StudentController.updateStudentById,
);

router.delete(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  StudentController.deleteStudentById,
);

export const StudentRoutes = router;
