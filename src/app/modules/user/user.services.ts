import { TUser } from './user.interface';
import configs from '../../configs';
import User from './user.model';
import { TStudent } from '../student/student.interface';
import Student from '../student/student.model';

import AcademicSemester from '../accademicSemester/academicSemester.model';
import { generateStudentId } from './user.utils';
import TAcademicSemester from '../accademicSemester/academicSemester.interface';

const createStudentIntoDB = async (password: string, studentData: TStudent) => {
  const userData: Partial<TUser> = {};

  // if password not given use default password:
  userData.password = password || (configs.default_password as string);

  // set  role student:
  userData.role = 'student';

  /**
   *  Generate Student Id With a utils function
   *  load student semester info with
   * to load data use @admissionSemester property from @studentData
   *  then call the generated function pass the semester info
   */
  const academicSemester = await AcademicSemester.findOne({
    _id: studentData.admissionSemester,
  });

  // call the generate id func:
  userData.id = await generateStudentId(academicSemester as TAcademicSemester);

  const newUser = await User.create(userData);

  if (Object.keys(newUser).length) {
    studentData.id = newUser.id;
    studentData.user = newUser._id;

    // create new student:

    const newStudent = await Student.create(studentData);

    return newStudent;
  }
};

export const UserServices = {
  createStudentIntoDB,
};
