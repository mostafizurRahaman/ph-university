import { Types } from 'mongoose';

export type TSemesterStatus = 'ONGOING' | 'UPCOMING' | 'ENDED';

export interface ISemesterRegistration {
  academicSemester: Types.ObjectId;
  status: TSemesterStatus;
  startDate: Date;
  endDate: Date;
  minCredit: number;
  maxCredit: number;
  isDeleted?: boolean;
}
