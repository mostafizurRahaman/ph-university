import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import {
  RegistrationStatus,
} from '../semesterRegistration/semesterRegistration.constant';
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
import Student from '../student/student.model';


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
  const meta = await courseQuery.countTotal();

  return {
    meta,
    result,
  };
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

//  ** My Offered Course Services :
// const getMyOfferedCourseFromDB = async (userId: string) => {
//   //  ** Get User By User Id:
//   const student = await Student.findOne({ id: userId });

//   if (!student) {
//     throw new AppError(httpStatus.NOT_FOUND, "Student Doesn't Exists!!!");
//   }

//   //  ** Get Offered Course For Ongoing Semester:
//   const currentSemesterRegistration = await SemesterRegistration.findOne({
//     status: RegistrationStatus.ONGOING,
//   });

//   if (!currentSemesterRegistration) {
//     throw new AppError(httpStatus.NOT_FOUND, 'There is no ongoing Semester!!!');
//   }

//   console.log({
//     semesterRegistration: currentSemesterRegistration._id,
//     academicFaculty: student.academicFaculty,
//     academicDepartment: student.academicDepartment,
//   });

//   const result = await OfferedCourse.aggregate([
//     {
//       $match: {
//         semesterRegistration: currentSemesterRegistration._id,
//         academicFaculty: student.academicFaculty,
//         academicDepartment: student.academicDepartment,
//       },
//     },
//     {
//       $lookup: {
//         from: 'courses',
//         localField: 'course',
//         foreignField: '_id',
//         as: 'course',
//       },
//     },
//     {
//       $unwind: '$course',
//     },
//     {
//       $lookup: {
//         from: 'enrolledcourses',
//         let: {
//           currentSemester: currentSemesterRegistration._id,
//           currentStudent: student._id,
//         },
//         pipeline: [
//           {
//             $match: {
//               $expr: {
//                 $and: [
//                   {
//                     $eq: ['$semesterRegistration', '$$currentSemester'],
//                   },
//                   {
//                     $eq: ['$student', '$$currentStudent'],
//                   },
//                   {
//                     $eq: ['$isEnrolled', true],
//                   },
//                 ],
//               },
//             },
//           },
//         ],
//         as: 'enrolledCourses',
//       },
//     },
//     {
//       $lookup: {
//         from: 'enrolledcourses',
//         let: {
//           currentStudent: student._id,
//         },
//         pipeline: [
//           {
//             $match: {
//               $expr: {
//                 $and: [
//                   {
//                     $eq: ['$student', '$$currentStudent'],
//                   },
//                   {
//                     $eq: ['$isCompleted', true],
//                   },
//                 ],
//               },
//             },
//           },
//         ],
//         as: 'completedCourses',
//       },
//     },
//     {
//       $addFields: {
//         completedCoursesIds: {
//           $map: {
//             input: '$completedCourses',
//             as: 'completed',
//             in: '$$completed.course',
//           },
//         },
//       },
//     },
//     {
//       $addFields: {
//         isPreRequisiteFulfilled: {
//           $or: [
//             {
//               $eq: ['$course.preRequisiteCourses', []],
//             },
//             {
//               $setIsSubset: [
//                 '$course.preRequisiteCourses.course',
//                 '$completedCoursesIds',
//               ],
//             },
//           ],
//         },
//         isAlreadyEnrolled: {
//           $in: [
//             '$course._id',
//             {
//               $map: {
//                 input: '$enrolledCourses',
//                 as: 'enroll',
//                 in: '$$enroll.course',
//               },
//             },
//           ],
//         },
//       },
//     },
//     {
//       $match: {
//         isAlreadyEnrolled: false,
//         isPreRequisiteFulfilled: true,
//       },
//     },
//   ]);

//   return result;
// };

const getMyOfferedCourseFromDB = async (userId: string, query: Record<string, unknown>) => {
  //  ** filter the Student By Req.user.userId:
  const student = await Student.findOne({ id: userId });
  if (!student) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student Not Found!!');
  }

  // ** Get the Current Ongoing Semester:
  const currentOngoingSemester = await SemesterRegistration.findOne({
    status: RegistrationStatus.ONGOING,
  });
  if (!currentOngoingSemester) {
    throw new AppError(httpStatus.NOT_FOUND, 'There is no ongoing semester!!!');
  }


  //  ** Page calculation For Meta : 
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10; 


  // ** Aggregation Query:
    const aggrigationQuery = [
      // Step 1:   ** Match The Offered for this Student ** Current Department ** Current ongoing Semester
      {
        $match: {
          semesterRegistration: currentOngoingSemester._id,
          academicFaculty: student.academicFaculty,
          academicDepartment: student.academicDepartment,
        },
      },
      {
        $lookup: {
          from: 'courses',
          localField: 'course',
          foreignField: '_id',
          as: 'course',
        },
      },
      {
        $unwind: '$course',
      },
      {
        $lookup: {
          from: 'enrolledcourses',
          let: {
            currentSemester: currentOngoingSemester._id,
            currentStudent: student._id,
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ['$semesterRegistration', '$$currentSemester'],
                    },
                    {
                      $eq: ['$student', '$$currentStudent'],
                    },
                    {
                      $eq: ['$isEnrolled', true],
                    },
                  ],
                },
              },
            },
          ],
          as: 'enrolledCourses',
        },
      },
      {
        $lookup: {
          from: 'enrolledcourses',
          let: {
            currentSemester: currentOngoingSemester._id,
            currentStudent: student._id,
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ['$semesterRegistration', '$$currentSemester'],
                    },
                    {
                      $eq: ['$student', '$$currentStudent'],
                    },
                    {
                      $eq: ['$isCompleted', true],
                    },
                  ],
                },
              },
            },
          ],
          as: 'completedCourse',
        },
      },
      {
        $addFields: {
          completedCourseIds: {
            $map: {
              input: '$completedCourse',
              as: 'completed',
              in: '$$completed.course',
            },
          },
        },
      },
      {
        $addFields: {
          isPreRequisiteFulfilled: {
            $or: [
              {
                $eq: ['$course.preRequisiteCourses', []],
              },
              {
                $setIsSubset: [
                  '$course.preRequisiteCourses.course',
                  '$completedCourseIds',
                ],
              },
            ],
          },
          isAlreadyEnrolled: {
            $in: [
              '$course._id',
              {
                $map: {
                  input: '$enrolledCourses',
                  as: 'enrolled',
                  in: '$$enrolled.course',
                },
              },
            ],
          },
        },
      },

      {
        $match: {
          isAlreadyEnrolled: false,
          isPreRequisiteFulfilled: true,
        },
      },
  ];

  // ** Pagination Query : 
  const paginationQuery = [
    {
      $skip: (page - 1) * limit,
    }, 
    {
      $limit: limit,
    }
  ]

  //  ** Get Offered Courses For Specific Student :
  const result = await OfferedCourse.aggregate([
    ...aggrigationQuery, ...paginationQuery
  ]);



  const total = (await OfferedCourse.aggregate([...aggrigationQuery])).length;
  const totalPages = Math.ceil(total / limit)


  return {
    meta: { 
       page, limit, total, totalPages
     },
    result
  };
};

export const offeredCourseServices = {
  createOfferedCourseIntoDB,
  getAllOfferedCourseFromDB,
  updateOfferedCourseIntoDB,
  getSingleOfferedCourseFromDB,
  deleteOfferedCourseFromDB,
  getMyOfferedCourseFromDB,
};
