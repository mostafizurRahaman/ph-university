import express from 'express';
import { semesterRegistrationValidation } from './semesterRegistration.validation';
import validateRequest from '../../middlewares/validateRequest';
import { SemesterRegistrationControllers } from './semesterRegistration.controller';

const router = express.Router();

router
  .route('/create-semester-registration')
  .post(
    validateRequest(
      semesterRegistrationValidation.createSemesterRegistrationValidationSchema,
    ),
    SemesterRegistrationControllers.createSemesterRegistration,
  );

// get single academic Semester By Id :
router
  .route('/:id')
  .get(SemesterRegistrationControllers.getSingleAcademicRegisteredSemester)
  .patch(
    validateRequest(
      semesterRegistrationValidation.updateSemesterRegistrationValidationSchema,
    ),
    SemesterRegistrationControllers.updateAcademicRegisteredSemester,
  )
  .delete(SemesterRegistrationControllers.deleteSemesterRegistration);

// get all semester registration:

router
  .route('/')
  .get(SemesterRegistrationControllers.getAllRegisteredAcademicSemester);

export const SemesterRegistrationRoutes = router;
