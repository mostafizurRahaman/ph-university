import { Schema, model } from 'mongoose';
import TAcademicSemester from './academicSemester.interface';
import {
  academicSemesterCode,
  academicSemesterName,
  months,
} from './academicSemester.constant';
import AppError from '../../errors/AppError';

const academicSemesterSchema = new Schema<TAcademicSemester>(
  {
    name: {
      type: String,
      enum: {
        values: academicSemesterName,
        message: "{VALUE} can't be Name",
      },
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      enum: {
        values: academicSemesterCode,
        message: "{VALUE} can't be code",
      },
      required: true,
    },
    startMonth: {
      type: String,
      enum: {
        values: months,
        message: "{VALUE} can't be startMonth",
      },
      required: true,
    },
    endMonth: {
      type: String,
      enum: {
        values: months,
        message: "{VALUE} can't be startMonth",
      },
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

academicSemesterSchema.pre('save', async function (next) {
  const isSemesterExists = await AcademicSemester.findOne({
    year: this.year,
    name: this.name,
  });

  if (isSemesterExists) {
    throw new AppError(
      404,
      `Academic Semester  ${this.name} for ${this.year} already exists`,
    );
  }

  next();
});

const AcademicSemester = model<TAcademicSemester>(
  'AcademicSemester',
  academicSemesterSchema,
);

export default AcademicSemester;
