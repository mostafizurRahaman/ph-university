import { Model } from 'mongoose';
import { TStudent } from '../student/student.interface';

export type TFaculty = Omit<
  TStudent,
  'admissionSemester' | 'guardian' | 'localGuardian'
> & {
  designation: string;
};

export interface IFacultyModel extends Model<TFaculty> {
  // eslint-disable-next-line no-unused-vars
  isFacultyExists(id: string): Promise<TFaculty | null>;
}
