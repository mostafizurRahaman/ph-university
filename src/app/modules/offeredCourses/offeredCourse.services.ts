import OfferedCourse from './offeredCourse.model';
import { IOfferedCourse } from './offeredCourses.interface';

// create offeredCourse Services :
const createOfferedCourseIntoDB = async (payload: IOfferedCourse) => {
  const {
    semesterRegistration,
    academicFaculty,
    academicDepartment,
    course,
    faculty,
  } = payload;


  // check if semester registration exists: 
  const isSemesterRegistrationExits = await 
  const offeredCourse = await OfferedCourse.create(payload);

  return offeredCourse;
};

export const offeredCourseServices = {
  createOfferedCourseIntoDB,
};
