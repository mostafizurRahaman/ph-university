import express, { Router } from 'express';
import { StudentRoutes } from '../modules/student/student.route';
import { userRouter } from '../modules/user/user.route';
import { AcademicSemesterRoutes } from '../modules/accademicSemester/academicSemester.route';
import { AcademicFacultyRoutes } from '../modules/academicFaculty/academicFaculty.route';
import { AcademicDepartmentRoutes } from '../modules/academicDepartment/academicDepartment.route';
import { facultiesRoutes } from '../modules/faculty/faculty.route';
import { AdminRoutes } from '../modules/admin/admin.route';
import { CourseRoutes } from '../modules/course/course.route';
import { SemesterRegistrationRoutes } from '../modules/semesterRegistration/semesterRegistration.Route';
import { offeredCourseRoutes } from '../modules/offeredCourses/offeredCourse.route';
import { AuthRoutes } from '../modules/auth/auth.route';

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
  {
    path: '/academic-departments',
    route: AcademicDepartmentRoutes,
  },
  {
    path: '/faculties',
    route: facultiesRoutes,
  },
  {
    path: '/admins',
    route: AdminRoutes,
  },
  {
    path: '/courses',
    route: CourseRoutes,
  },
  {
    path: '/semester-registration',
    route: SemesterRegistrationRoutes,
  },
  {
    path: '/offered-courses',
    route: offeredCourseRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
];

modulesRoute.forEach((route) => router.use(route.path, route.route));

export default router;
