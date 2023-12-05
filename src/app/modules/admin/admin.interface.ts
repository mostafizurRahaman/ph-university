import { Model } from 'mongoose';
import { TFaculty } from '../faculty/faculty.interface';

export type TAdmin = Omit<TFaculty, 'academicDepartment'> & {
  managementDepartment: string;
};

export interface IAdminModel extends Model<TAdmin> {
  // eslint-disable-next-line no-unused-vars
  isAdminExists(id: string): Promise<TAdmin | null>;
}
