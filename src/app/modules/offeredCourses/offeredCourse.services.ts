import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { RegistrationStatus } from '../semesterRegistration/semesterRegistration.constant';
import SemesterRegistration from '../semesterRegistration/semesterRegistration.model';
import OfferedCourse from './offeredCourse.model';
import { IOfferedCourse } from './offeredCourses.interface';
import AcademicFaculty from '../academicFaculty/academicFaculty.model';
import AcademicDepartment from '../academicDepartment/academicDepartment.model';
import Course from '../course/course.model';
import Faculty from '../faculty/faculty.model';

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
  const isSemesterRegistrationExits =
    await SemesterRegistration.findById(semesterRegistration);

  if (!isSemesterRegistrationExits) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'SemesterRegistration not found!!!',
    );
  }

  // check semester Ended ?:
  if (isSemesterRegistrationExits.status === RegistrationStatus.ENDED) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `This Semester is ${isSemesterRegistrationExits.status}`,
    );
  }

  // is academicFaculty Exists:
  const isAcademicFacultyExists =
    await AcademicFaculty.findById(academicFaculty);

  if (!isAcademicFacultyExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Academic Faculty is not exists!!!',
    );
  }

  // is academicDepartment exists:
  const isAcademicDepartmentExits =
    await AcademicDepartment.findById(academicDepartment);

  if (!isAcademicDepartmentExits) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Academic Department not Exits!!!',
    );
  }

  // check is academic Department get matched with academic faculty?
  if (academicFaculty !== isAcademicDepartmentExits.academicFaculty) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Academic Department not exits on Provided faculty!!!',
    );
  }

  // check is courseExits Or not ?:
  const isCourseExists = await Course.findById(course);
  if (!isCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course  is not Exists!!!');
  }

  // check is Faculty is exists or not ?:
  const isFacultyExists = await Faculty.findById(faculty);

  if (!isFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty is not Exists!!!');
  }

  const academicSemester = isSemesterRegistrationExits.academicSemester;

  const offeredCourse = await OfferedCourse.create({
    ...payload,
    academicSemester,
  });

  return offeredCourse;
};

export const offeredCourseServices = {
  createOfferedCourseIntoDB,
};
