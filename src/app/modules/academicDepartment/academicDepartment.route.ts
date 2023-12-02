import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicDepartmentValidations } from './academicDepartment.validation';
import { AcademicDepartmentControllers } from './academicDeparment.controller';

const router = express.Router();

router
  .route('/:academicDepartmentId')
  .get(AcademicDepartmentControllers.getSingleAcademicDepartment)
  .patch(AcademicDepartmentControllers.updateAcademicDepartmentById);

router.post(
  '/create-academic-department',
  validateRequest(
    AcademicDepartmentValidations.createAcademicDepartmentValidationSchema,
  ),
  AcademicDepartmentControllers.createAcademicDepartment,
);

router.get('/', AcademicDepartmentControllers.getAllAcademicDepartments);

export const AcademicDepartmentRoutes = router;
