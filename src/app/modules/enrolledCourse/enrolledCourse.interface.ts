import { Types } from 'mongoose';

// ** Type for Grades :
export type IGrades = 'A' | 'B' | 'C' | 'D' | 'E' | 'N/A';

// ** Type for CourseMarks :
export type TEnrolledCourseMarks = {
  classTest1: number;
  midTerm: number;
  classTest2: number;
  finalTerm: number;
};

export interface IEnrolledCourse {
  semesterRegistration: Types.ObjectId;
  offeredCourse: Types.ObjectId;
  academicSemester: Types.ObjectId;
  academicFaculty: Types.ObjectId;
  academicDepartment: Types.ObjectId;
  course: Types.ObjectId;
  student: Types.ObjectId;
  faculty: Types.ObjectId;
  isEnrolled: boolean;
  courseMarks: TEnrolledCourseMarks;
  grade: IGrades;
  gradePoints: number;
  isCompleted: boolean;
}
