/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export type TUser = {
  id: string;
  password: string;
  needsPasswordChanged?: boolean;
  role: 'admin' | 'student' | 'faculty';
  status: 'in-progress' | 'blocked';
  isDeleted?: boolean;
};

// export type NewUser = {
//   id: string;
//   role: string;
//   password?: string;
// };

export type TGender = 'male' | 'female' | 'others';
export type TBloodGroup =
  | 'A+'
  | 'A-'
  | 'B+'
  | 'B-'
  | 'AB+'
  | 'AB-'
  | 'O+'
  | 'O-';

export interface IUserModel extends Model<TUser> {
  isUserExistsByCustomId(id: string): Promise<TUser | null>;
  isUserDeleted(id: TUser): Promise<boolean>;
  isUserBlocked(user: TUser): Promise<boolean>;
  compareUserPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}
