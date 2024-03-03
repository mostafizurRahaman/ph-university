/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import OfferedCourse from '../offeredCourses/offeredCourse.model';
import { IEnrolledCourse } from './enrolledCourse.interface';
import EnrolledCourse from './enrolledCourse.model';
import Student from '../student/student.model';
import SemesterRegistration from '../semesterRegistration/semesterRegistration.model';
import Course from '../course/course.model';
import mongoose from 'mongoose';
import Faculty from '../faculty/faculty.model';
import calculateGradePoints from './enrolledCourse.utils';
import QueryBuilder from '../../builders/QueryBuilder';

// ** Create Enrolled Course Services :
const createEnrolledCourseIntoDB = async (
  userId: string,
  payload: IEnrolledCourse,
) => {
  // ** Step 1: Check Is Offered Course Exists?:
  const offeredCourse = await OfferedCourse.findById(payload?.offeredCourse);
  console.log(payload.offeredCourse, offeredCourse);

  if (!offeredCourse) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Offered Course Doesn't Exists!!!",
    );
  }

  // ** Get the Semester Registration Id From Semester Registration:
  const semesterRegistration = offeredCourse.semesterRegistration;

  // ** Check  Capacity of offeredCourse :
  if (offeredCourse.maxCapacity <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Capacity Failed!!!');
  }

  // ** Find Student :
  const student = await Student.findOne({ id: userId }, { _id: 1 });

  // ** User MongoDB ID:
  const studentID = student?._id;

  //  ** Semester Registration Max Credit :
  const semesterRegistrationMaxCredit =
    await SemesterRegistration.findById(semesterRegistration).select(
      'maxCredit',
    );

  // **  Max  Credit for Semester :
  const maxCreditForSemester = semesterRegistrationMaxCredit?.maxCredit;

  // **get the course credits:
  const course = await Course.findById(offeredCourse.course);
  // ** Check  Max Credit Exceed the limit for a student:
  const isMaxLimitExceed = await EnrolledCourse.aggregate([
    {
      $match: {
        semesterRegistration: semesterRegistration,
        student: studentID,
      },
    },
    {
      $lookup: {
        from: 'courses',
        localField: 'course',
        foreignField: '_id',
        as: 'enrolledCourseData',
      },
    },
    {
      $unwind: '$enrolledCourseData',
    },
    {
      $group: {
        _id: null,
        totalEnrolledCredits: { $sum: '$enrolledCourseData.credits' },
      },
    },
    {
      $project: {
        totalEnrolledCredits: 1,
      },
    },
  ]);

  // ** new totalCredits :
  const totalCredits =
    isMaxLimitExceed.length > 0 ? isMaxLimitExceed[0].totalEnrolledCredits : 0;

  if (
    maxCreditForSemester &&
    maxCreditForSemester < totalCredits + course?.credits
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Max Credits Limit Exceed For Semester!!!. Try Different Course!!!',
    );
  }
  // ** Check Is Student Already Enrolled This Same Course:

  const isStudentAlreadyEnrolled = await EnrolledCourse.findOne({
    offeredCourse: offeredCourse._id,
    student: studentID,
    semesterRegistration,
  });

  if (isStudentAlreadyEnrolled) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You Already Enrolled This Course!!!',
    );
  }

  const session = await mongoose.startSession();

  try {
    // ** Start Transaction:
    session.startTransaction();

    // ** Step 3: Create An Enrollment :
    const result = await EnrolledCourse.create(
      [
        {
          semesterRegistration: offeredCourse.semesterRegistration,
          offeredCourse: offeredCourse._id,
          academicSemester: offeredCourse.academicSemester,
          academicFaculty: offeredCourse.academicFaculty,
          academicDepartment: offeredCourse.academicDepartment,
          course: offeredCourse.course,
          student: studentID,
          faculty: offeredCourse.faculty,
          isEnrolled: true,
        },
      ],
      { session },
    );

    // ** If Enrollment is not successful then throw new app error :
    if (!result) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Enrollment Failed!!!');
    }

    const updateOfferedCourse = await OfferedCourse.findByIdAndUpdate(
      offeredCourse._id,
      {
        $inc: {
          maxCapacity: -1,
        },
      },
      {
        new: true,
        runValidators: true,
        session,
      },
    );

    if (!updateOfferedCourse) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        'Failed to  Update Offered Course!!',
      );
    }

    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

//  ** Update Enrolled Course Marks :
const updateEnrolledCourseMarksIntoDB = async (
  facultyId: string,
  payload: Partial<IEnrolledCourse>,
) => {
  // ** IS Faculty Exists with the requested Id ?:
  const faculty = await Faculty.findOne({ id: facultyId }, { _id: 1 });
  if (!faculty) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Faculty Doesn't Exists With This ID!!!",
    );
  }
  //  ** Destructure the payload :
  const { semesterRegistration, offeredCourse, student, courseMarks } = payload;

  //** Check is Offered Course Exists ?? : */
  const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse);
  // console.log(semesterRegistration);

  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered Course Not Exists!!!');
  }

  // ** Check Semester Registration Exists ? :
  const isSemesterRegistrationExists =
    await SemesterRegistration.findById(semesterRegistration);

  if (!isSemesterRegistrationExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'SemesterRegistration Not Exists!!!',
    );
  }

  // ** Check is Student Exists ? :
  const isStudentExists = Student.findById(student);

  if (!isStudentExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Student Not Found With This ID!!!',
    );
  }

  //  **  Check Course Belongs to Faculty ? :
  const isCourseBelongsToFaculty = await EnrolledCourse.findOne({
    offeredCourse,
    semesterRegistration,
    student,
    faculty: faculty._id,
  });

  if (!isCourseBelongsToFaculty) {
    throw new AppError(httpStatus.FORBIDDEN, 'You Are Forbidden!!!');
  }

  // **  Update Course Marks Dynamically:
  const modifiedData: Record<string, unknown> = {
    ...courseMarks,
  };

  // ** Final marks Have In Course Marks :

  if (courseMarks?.finalTerm) {
    const { classTest1, midTerm, classTest2 } =
      isCourseBelongsToFaculty.courseMarks;

    // const totalMarks =
    //   Math.ceil(classTest1 * 0.1) +
    //   Math.ceil(midTerm * 0.3) +
    //   Math.ceil(classTest2 * 0.1) +
    //   Math.ceil(finalTerm * 0.5);

    const totalMarks =
      classTest1 + midTerm + classTest2 + courseMarks.finalTerm;
    // console.log(totalMarks);
    const result = calculateGradePoints(totalMarks);

    modifiedData['grade'] = result.grade;
    modifiedData['gradePoints'] = result.gradePoints;
    modifiedData['isCompleted'] = true;
  }

  // ** If Modified Data ** :

  if (courseMarks && Object.keys(courseMarks).length > 0) {
    for (const [key, value] of Object.entries(courseMarks)) {
      modifiedData[`courseMarks.${key}`] = value;
    }
  }

  const updateMarks = await EnrolledCourse.findByIdAndUpdate(
    isCourseBelongsToFaculty._id,
    {
      $set: modifiedData,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  return updateMarks;
};

//  ** My Enrolled Course :

const myEnrolledCourseFromDB = async (
  studentId: string,
  query: Record<string, unknown>,
) => {
  const student = await Student.findOne({ id: studentId });

  console.log(student);

  //  ** Check Is Student Exists?
  if (!student) {
    throw new AppError(httpStatus.OK, 'Student Not Exists With This ID!!!');
  }

  //  ** Get Enrolled Courses For This Student :
  const myEnrolledCourseQuery = new QueryBuilder(
    EnrolledCourse.find({ student: student._id }).populate(
      'semesterRegistration offeredCourse academicSemester academicFaculty academicDepartment  course faculty student',
    ),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();
  
  
  const result = await myEnrolledCourseQuery.modelQuery
  const meta = await myEnrolledCourseQuery.countTotal(); 


  return {
    meta, 
    result, 
  }; 
};

export const EnrolledCourseServices = {
  createEnrolledCourseIntoDB,
  updateEnrolledCourseMarksIntoDB,
  myEnrolledCourseFromDB,
};
