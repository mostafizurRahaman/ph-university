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
import { hasTimeConflicts } from './offeredCourse.utils';
import QueryBuilder from '../../builders/QueryBuilder';
import { offeredCourseSearchableFields } from './offeredCourse.constant';

// create offeredCourse Services :
const createOfferedCourseIntoDB = async (payload: IOfferedCourse) => {
  const {
    semesterRegistration,
    academicFaculty,
    academicDepartment,
    course,
    faculty,
    days,
    startTime,
    endTime,
    section,
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

  // check  is academicDepartment belongs to academicFaculty?:
  const isDepartmentBelogToAcademicFaculty = await AcademicDepartment.findOne({
    _id: academicDepartment,
    academicFaculty,
  });

  if (!isDepartmentBelogToAcademicFaculty) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `${isAcademicDepartmentExits.name} is not belog to ${isAcademicFacultyExists.name}`,
    );
  }

  const isSameRegistrationSemesterationAndSameCourseAndSameSectionExists =
    await OfferedCourse.findOne({
      semesterRegistration,
      course,
      section,
    });

  if (isSameRegistrationSemesterationAndSameCourseAndSameSectionExists) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Same Registration Semester Already Exists for  Same Course and Section!!!',
    );
  }

  // filter schedule of a day  for a faculty:

  const existingScheduleForAFaculty = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select('startTime endTime days');

  const newSchedule = {
    days,
    startTime,
    endTime,
  };

  // check time conflicts by call utils function :
  if (hasTimeConflicts(existingScheduleForAFaculty, newSchedule)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `This Time is Already assigned ${isFacultyExists?.name?.firstName}  ${isFacultyExists?.name?.lastName}!! Try Different Time or Day`,
    );
  }

  const academicSemester = isSemesterRegistrationExits.academicSemester;

  const offeredCourse = await OfferedCourse.create({
    ...payload,
    academicSemester,
  });

  return offeredCourse;
};

// get all offeredCourse :
const getAllOfferedCourseFromDB = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder(OfferedCourse.find(), query)
    .search(offeredCourseSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await courseQuery.modelQuery;

  return result;
};

// get single offered course :
const getSingleOfferedCourseFromDB = async (id: string) => {
  const result = await OfferedCourse.findById(id);
  if (!result) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Offered Course Not Exists With This Id!!!',
    );
  }
  return result;
};

// update offered course:
const updateOfferedCourseIntoDB = async (
  id: string,
  payload: Pick<
    IOfferedCourse,
    'faculty' | 'days' | 'startTime' | 'endTime' | 'maxCapacity'
  >,
) => {
  const { faculty, days, startTime, endTime } = payload;
  // check offered course exists of not?:
  const isOfferedCourseExists = await OfferedCourse.findById(id);

  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Offered doesn't exists!!!");
  }

  // check faculty is Exists with provided Id? :
  const isFacultyExists = await Faculty.findById(faculty);
  if (!isFacultyExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `Faculty Doesn't Exists with this Id`,
    );
  }

  // get the semester ID :
  const semesterRegistrationId = isOfferedCourseExists.semesterRegistration;

  // Check semester Registration Status:
  const semesterRegistration = await SemesterRegistration.findById(
    semesterRegistrationId,
  );

  if (semesterRegistration?.status !== RegistrationStatus.UPCOMING) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You Can't Update, Because Semester Status is ${semesterRegistration?.status}`,
    );
  }
  // get all time slots in a day for a specific faculty:
  const existingSchedules = await OfferedCourse.find({
    semesterRegistration: semesterRegistrationId,
    faculty,
    days: { $in: days },
  });

  // define a new Schedules:
  const newSchedule = {
    days,
    startTime,
    endTime,
  };

  // check hasTimeConflicts :
  if (hasTimeConflicts(existingSchedules, newSchedule)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `This Time is Already assigned ${isFacultyExists?.name?.firstName}  ${isFacultyExists?.name?.lastName}!! Try Different Time or Day`,
    );
  }

  //  update the offered Course:
  const updatedOfferedCourse = await OfferedCourse.findByIdAndUpdate(
    id,
    payload,
    {
      new: true,
      runValidators: true,
    },
  );

  return updatedOfferedCourse;
};

// delete offered course :
const deleteOfferedCourseFromDB = async (id: string) => {
  const isExistsOfferedCourse = await OfferedCourse.findById(id);
  if (!isExistsOfferedCourse) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Offered Course Not Found with This Id!!!',
    );
  }

  const semesterRegistration = isExistsOfferedCourse?.semesterRegistration;

  //  check semesterRegistrationStatus is "UPCOMING" ? :
  const semesterRegistrationStatus =
    await SemesterRegistration.findById(semesterRegistration);

  if (semesterRegistrationStatus?.status !== RegistrationStatus.UPCOMING) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `You can't delete, Because This semesterRegistration status is  ${semesterRegistrationStatus?.status}`,
    );
  }
  const result = await OfferedCourse.findByIdAndUpdate(
    id,
    {
      $set: {
        isDeleted: true,
      },
    },
    {
      new: true,
      runValidators: true,
    },
  );

  return result;
};

export const offeredCourseServices = {
  createOfferedCourseIntoDB,
  getAllOfferedCourseFromDB,
  updateOfferedCourseIntoDB,
  getSingleOfferedCourseFromDB,
  deleteOfferedCourseFromDB,
};
