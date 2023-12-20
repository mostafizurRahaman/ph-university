import { TSemesterStatus } from './semesterRegistration.interface';

export const semesterRegistrationStatus: TSemesterStatus[] = [
  'UPCOMING',
  'ONGOING',
  'ENDED',
];

export const RegistrationStatus = {
  UPCOMING: 'UPCOMING',
  ONGOING: 'ONGOING',
  ENDED: 'ENDED',
} as const;

