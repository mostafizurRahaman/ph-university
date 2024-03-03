import express from 'express';
import { FacultyControllers } from './faculty.controllers';
import validateRequest from '../../middlewares/validateRequest';
import { updateFacultyValidationSchema } from './faculty.validation';
import { auth } from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.contants';

const router = express.Router();

router
  .route('/')
  .get(
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty),
    FacultyControllers.getAllFaculties,
  );

router
  .route('/:id')
  .get(
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.superAdmin),
    FacultyControllers.getSingleFacultyById,
  )
  .patch(
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    validateRequest(updateFacultyValidationSchema),
    FacultyControllers.updateFacultyById,
  )
  .delete(
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    FacultyControllers.deleteFacultyById,
  );

export const facultiesRoutes = router;
