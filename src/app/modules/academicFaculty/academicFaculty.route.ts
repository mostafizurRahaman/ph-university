import express from 'express';
import { AcademicFacultyController } from './academicFaculty.conroller';
import { AcademicFacultyValidations } from './academicFaculty.validation';
import validateRequest from '../../middlewares/validateRequest';

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
  validateRequest(AcademicFacultyValidations.CreateAcademicFacultyValidations),
  AcademicFacultyController.createAcademicFaculty,
);

router.route('/').get(AcademicFacultyController.getAcademicFaculties);

export const AcademicFacultyRoutes = router;
