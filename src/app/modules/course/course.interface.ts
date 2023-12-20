/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';

export interface IPreRequisiteCourse {
  course: Types.ObjectId;
  isDeleted: boolean;
}

export interface ICourse {
  title: string;
  prefix: string;
  code: number;
  credits: number;
  preRequisiteCourses: IPreRequisiteCourse[];
  isDeleted: boolean;
}

// create a model type :
export interface ICourseModel extends Model<ICourse> {
  isCourseExists(code: number): Promise<ICourse | null>;
}

export type TCourseFaculty = {
  course: Types.ObjectId;
  faculties: Types.ObjectId[];
};
