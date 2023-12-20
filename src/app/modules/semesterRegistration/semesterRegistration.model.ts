import { Schema, model } from 'mongoose';
import { ISemesterRegistration } from './semesterRegistration.interface';
import { semesterRegistrationStatus } from './semesterRegistration.constant';

const semesterRegistrationSchema = new Schema<ISemesterRegistration>(
  {
    academicSemester: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicSemester',
      unique: true,
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: semesterRegistrationStatus,
        message: "{VALUE} can't be a status",
      },
      default: 'UPCOMING',
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    minCredit: {
      type: Number,
      default: 3,
      required: true,
    },
    maxCredit: {
      type: Number,
      default: 15,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const SemesterRegistration = model<ISemesterRegistration>(
  'SemesterRegistration',
  semesterRegistrationSchema,
);

export default SemesterRegistration;
