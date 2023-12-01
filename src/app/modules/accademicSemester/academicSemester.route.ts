import express from 'express';
import { AcademicSemesterControllers } from './academicSemester.controller';
import validateRequest from '../../middlewares/validateRequest';
import { academicSemesterValidation } from './academicSemester.validation';

const router = express.Router();

router
  .route('/create-academic-semester')
  .post(
    validateRequest(
      academicSemesterValidation.createAcademicSemesterValidationSchema,
    ),
    AcademicSemesterControllers.createAcademicSemester,
  );

router.route('/').get(AcademicSemesterControllers.getAllAcademicSemester);

router
  .route('/:semesterId')
  .get(AcademicSemesterControllers.getAcademicSemesterById)
  .patch(
    validateRequest(academicSemesterValidation.updateAcademicValidationSchema),
    AcademicSemesterControllers.updateAcademicSemesterById,
  );

export const AcademicSemesterRoutes = router;
