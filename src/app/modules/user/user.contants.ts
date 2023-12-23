import { TBloodGroup, TGender } from './user.interface';

export const genders: TGender[] = ['male', 'female', 'others'];
export const bloodGroups: TBloodGroup[] = [
  'A+',
  'A-',
  'AB+',
  'AB-',
  'B+',
  'B-',
  'O+',
  'O-',
];

export const USER_ROLE = {
  admin: 'admin',
  student: 'student',
  faculty: 'faculty',
} as const;



