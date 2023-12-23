import { days } from './offeredCourse.constant';
import { Schema, model } from 'mongoose';

import { IOfferedCourse } from './offeredCourses.interface';

const offeredCourseSchema = new Schema<IOfferedCourse>(
  {
    semesterRegistration: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'SemesterRegistration',
    },
    academicSemester: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'AcademicSemester',
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'AcademicFaculty',
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'AcademicDepartment',
    },
    faculty: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Faculty',
    },
    course: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Course',
    },
    maxCapacity: {
      type: Number,
      required: true,
      min: 1,
    },
    section: {
      type: Number,
      required: true,
      min: 1,
    },
    days: [
      {
        type: String,
        enum: {
          values: days,
        },
      },
    ],
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const OfferedCourse = model<IOfferedCourse>(
  'OfferedCourse',
  offeredCourseSchema,
);

export default OfferedCourse;
