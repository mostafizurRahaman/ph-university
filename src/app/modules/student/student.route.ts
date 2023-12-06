import express from 'express';
import { StudentController } from './student.controller';
import validateRequest from '../../middlewares/validateRequest';
import { UpdateStudentValidationSchema } from './student.zod.validation';

const router = express.Router();

// router.post('/create-student', StudentController.createStudent);

router.get('/', StudentController.getAllStudents);

router.get('/aggregate', StudentController.getStudentsWithAggregation);

router.get('/:id', StudentController.getStudentById);

router.patch(
  '/:id',
  validateRequest(UpdateStudentValidationSchema),
  StudentController.updateStudentById,
);

router.delete('/:id', StudentController.deleteStudentById);

export const StudentRoutes = router;
