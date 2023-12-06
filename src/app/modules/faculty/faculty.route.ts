import express from 'express';
import { FacultyControllers } from './faculty.controllers';
import validateRequest from '../../middlewares/validateRequest';
import { updateFacultyValidationSchema } from './faculty.validation';

const router = express.Router();

router.route('/').get(FacultyControllers.getAllFaculties);

router
  .route('/:id')
  .get(FacultyControllers.getSingleFacultyById)
  .patch(
    validateRequest(updateFacultyValidationSchema),
    FacultyControllers.updateFacultyById,
  )
  .delete(FacultyControllers.deleteFacultyById);

export const facultiesRoutes = router;
