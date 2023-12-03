import { Schema, model } from 'mongoose';
import { TAcademicDepartment } from './academicDepartment.interface';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const academicDepartmentSchema = new Schema<TAcademicDepartment>({
  name: {
    type: String,
    unique: true,
    required: [true, 'name is required'],
  },

  academicFaculty: {
    type: Schema.Types.ObjectId,
    ref: 'AcademicFaculty',
    required: true,
  },
});

// documents middleware for before saving academicDepartment:
// academicDepartmentSchema.pre('save', async function (next) {
//   const isDepartmentExists = await AcademicDepartment.findOne({
//     name: this.name,
//   });

//   if (isDepartmentExists) {
//     throw new AppError(httpStatus.NOT_FOUND, `This Department Already Exists`);
//   }

//   next();
// });

// query middleware for findOneAndUpdate():

academicDepartmentSchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery();

  const isDepartmentExists = await AcademicDepartment.findOne(query);
  if (!isDepartmentExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'This Academic Department Is No Exists!!!',
    );
  }

  next();
});

const AcademicDepartment = model<TAcademicDepartment>(
  'AcademicDepartment',
  academicDepartmentSchema,
);

export default AcademicDepartment;
