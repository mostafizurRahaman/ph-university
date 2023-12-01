import express, { Router } from 'express';
import { StudentRoutes } from '../modules/student/student.route';
import { userRouter } from '../modules/user/user.route';
import { AcademicSemesterRoutes } from '../modules/accademicSemester/academicSemester.route';
import { AcademicFacultyRoutes } from '../modules/academicFaculty/academicFaculty.route';

const router = express.Router();

// router.use('/students', StudentRoutes);
// router.use('/users', userRouter);

interface TModuleRoutes {
  path: string;
  route: Router;
}

const modulesRoute: TModuleRoutes[] = [
  {
    path: '/students',
    route: StudentRoutes,
  },
  {
    path: '/users',
    route: userRouter,
  },
  {
    path: '/academic-semester',
    route: AcademicSemesterRoutes,
  },
  {
    path: '/academic-faculties',
    route: AcademicFacultyRoutes,
  },
];

modulesRoute.forEach((route) => router.use(route.path, route.route));

export default router;
