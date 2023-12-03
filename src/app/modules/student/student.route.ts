import express from 'express';
import { StudentController } from './student.controller';
import validateRequest from '../../middlewares/validateRequest';
import { UpdateStudentValidationSchema } from './student.zod.validation';

const router = express.Router();

// router.post('/create-student', StudentController.createStudent);

router.get('/', StudentController.getAllStudents);

router.get('/aggregate', StudentController.getStudentsWithAggregation);

router.get('/:studentId', StudentController.getStudentById);

router.patch(
  '/:studentId',
  validateRequest(UpdateStudentValidationSchema),
  StudentController.updateStudentById,
);

router.delete('/:studentId', StudentController.deleteStudentById);

export const StudentRoutes = router;
