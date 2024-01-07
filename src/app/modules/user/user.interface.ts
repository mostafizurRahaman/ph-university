/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';
import { USER_ROLE } from './user.contants';

export type TUser = {
  id: string;
  password: string;
  needsPasswordChanged?: boolean;
  passwordChangedAt?: Date;
  email: string;
  role: 'admin' | 'student' | 'faculty';
  status: 'in-progress' | 'blocked';
  isDeleted?: boolean;
};

export type TUserStatus = 'in-progress' | 'blocked';
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
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimeStamps: Date,
    jwtIssuedTimeStamps: number,
  ): boolean;
}

// define a type for USER_ROLE:

export type TUserRole = keyof typeof USER_ROLE;
