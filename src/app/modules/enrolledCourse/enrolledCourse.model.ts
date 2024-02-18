import { Schema, model } from 'mongoose';
import {
  IEnrolledCourse,
  TEnrolledCourseMarks,
} from './enrolledCourse.interface';
import { grades } from './enrolledCourse.contstant';

// ** Create  a model for course marks :
const courseMarkSchema = new Schema<TEnrolledCourseMarks>({
  classTest1: {
    type: Number,
    min: 0,
    max: 10,
    default: 0,
  },
  midTerm: {
    type: Number,
    min: 0,
    max: 30,
    default: 0,
  },
  classTest2: {
    type: Number,
    min: 0,
    max: 10,
    default: 0,
  },
  finalTerm: {
    type: Number,
    min: 0,
    max: 50,
    default: 0,
  },
});

// ** Create an Schema for  Creating an Schema for Enrolled course:

export const enrolledCourseSchema = new Schema<IEnrolledCourse>(
  {
    semesterRegistration: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'SemesterRegistration',
    },
    offeredCourse: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'OfferedCourse',
    },
    academicSemester: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicSemester',
      required: true,
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicFaculty',
      required: true,
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicDepartment',
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    faculty: {
      type: Schema.Types.ObjectId,
      ref: 'Faculty',
      required: true,
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    isEnrolled: {
      type: Boolean,
      default: false,
    },
    courseMarks: {
      type: courseMarkSchema,
      default: {},
    },
    grade: {
      type: String,
      enum: grades,
      default: 'N/A',
    },
    gradePoints: {
      type: Number,
      min: 0,
      max: 4,
      default: 0,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// ** Create EnRolled Course Model :
const EnrolledCourse = model<IEnrolledCourse>(
  'EnrolledCourse',
  enrolledCourseSchema,
);

export default EnrolledCourse;
