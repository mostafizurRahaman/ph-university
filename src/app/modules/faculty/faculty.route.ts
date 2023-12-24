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
    auth(USER_ROLE.admin, USER_ROLE.faculty),
    FacultyControllers.getAllFaculties,
  );

router
  .route('/:id')
  .get(FacultyControllers.getSingleFacultyById)
  .patch(
    validateRequest(updateFacultyValidationSchema),
    FacultyControllers.updateFacultyById,
  )
  .delete(FacultyControllers.deleteFacultyById);

export const facultiesRoutes = router;
