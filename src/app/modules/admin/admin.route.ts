import express from 'express';
import { AdminControllers } from './admin.controller';
import validateRequest from '../../middlewares/validateRequest';
import { AdminValidations } from './admin.validation';

const router = express.Router();

router.route('/').get(AdminControllers.getAllAdmins);

router
  .route('/:adminId')
  .get(AdminControllers.getSingleAdminById)
  .patch(
    validateRequest(AdminValidations.updateAdminValidationSchema),
    AdminControllers.updateAdminById,
  )
  .delete(AdminControllers.deleteAdminById);

export const AdminRoutes = router;
