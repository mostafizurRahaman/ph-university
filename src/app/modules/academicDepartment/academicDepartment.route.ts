import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicDepartmentValidations } from './academicDepartment.validation';
import { AcademicDepartmentControllers } from './academicDeparment.controller';
import { USER_ROLE } from '../user/user.contants';
import { auth } from '../../middlewares/auth';

const router = express.Router();

router
  .route('/:academicDepartmentId')
  .get(AcademicDepartmentControllers.getSingleAcademicDepartment)
  .patch(AcademicDepartmentControllers.updateAcademicDepartmentById);

router.post(
  '/create-academic-department',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(
    AcademicDepartmentValidations.createAcademicDepartmentValidationSchema,
  ),
  AcademicDepartmentControllers.createAcademicDepartment,
);

router.get('/', AcademicDepartmentControllers.getAllAcademicDepartments);

export const AcademicDepartmentRoutes = router;
