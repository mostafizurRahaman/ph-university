import express from 'express';
import { semesterRegistrationValidation } from './semesterRegistration.validation';
import validateRequest from '../../middlewares/validateRequest';
import { SemesterRegistrationControllers } from './semesterRegistration.controller';
import { auth } from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.contants';

const router = express.Router();

router
  .route('/create-semester-registration')
  .post(
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(
      semesterRegistrationValidation.createSemesterRegistrationValidationSchema,
    ),
    SemesterRegistrationControllers.createSemesterRegistration,
  );

// get single academic Semester By Id :
router
  .route('/:id')
  .get(
    auth(
      USER_ROLE.superAdmin,
      USER_ROLE.admin,
      USER_ROLE.faculty,
      USER_ROLE.student,
    ),
    SemesterRegistrationControllers.getSingleAcademicRegisteredSemester,
  )
  .patch(
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(
      semesterRegistrationValidation.updateSemesterRegistrationValidationSchema,
    ),
    SemesterRegistrationControllers.updateAcademicRegisteredSemester,
  )
  .delete(
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    SemesterRegistrationControllers.deleteSemesterRegistration,
  );

// get all semester registration:

router
  .route('/')
  .get(
    auth(
      USER_ROLE.superAdmin,
      USER_ROLE.admin,
      USER_ROLE.faculty,
      USER_ROLE.student,
    ),
    SemesterRegistrationControllers.getAllRegisteredAcademicSemester,
  );

export const SemesterRegistrationRoutes = router;
