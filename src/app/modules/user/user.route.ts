import express, { NextFunction, Request, Response, Router } from 'express';
import { UserControllers } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import StudentValidationSchema from '../student/student.zod.validation';
import facultyValidationSchema from '../faculty/faculty.validation';
import { AdminValidations } from '../admin/admin.validation';
import { auth } from '../../middlewares/auth';
import { USER_ROLE } from './user.contants';
import { userStatusValidationSchema } from './user.zodValidation';
import { upload } from '../../utils/sendImageToCloudinary';

const router: Router = express.Router();

router.route('/create-student').post(
  auth(USER_ROLE.superAdmin,USER_ROLE.admin),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(StudentValidationSchema),
  UserControllers.createStudent,
);

router.route('/create-faculty').post(
  auth(USER_ROLE.superAdmin,USER_ROLE.admin),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(facultyValidationSchema),
  UserControllers.createFaculty,
);

router.route('/create-admin').post(
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(AdminValidations.createAdminValidationSchema),
  UserControllers.createAdmin,
);

router
  .route('/me')
  .get(auth('admin', 'faculty', 'student', 'superAdmin'), UserControllers.getMe);

// change user status route:
router
  .route('/change-status/:id')
  .patch(
    auth(USER_ROLE.superAdmin,USER_ROLE.admin),
    validateRequest(userStatusValidationSchema),
    UserControllers.changeUserStatus,
  );
export const userRouter = router;
