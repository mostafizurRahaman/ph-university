import express from 'express';
import { AcademicFacultyController } from './academicFaculty.conroller';
import { AcademicFacultyValidations } from './academicFaculty.validation';
import validateRequest from '../../middlewares/validateRequest';
import { auth } from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.contants';

const router = express.Router();

router
  .route('/:academicFacultyId')
  .get(AcademicFacultyController.getAcademicFacultyById)
  .patch(
    validateRequest(
      AcademicFacultyValidations.CreateAcademicFacultyValidations.partial(),
    ),
    AcademicFacultyController.updateAcademicFacultyById,
  );

router.post(
  '/create-academic-faculty',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(AcademicFacultyValidations.CreateAcademicFacultyValidations),
  AcademicFacultyController.createAcademicFaculty,
);

router.route('/').get(AcademicFacultyController.getAcademicFaculties);

export const AcademicFacultyRoutes = router;
