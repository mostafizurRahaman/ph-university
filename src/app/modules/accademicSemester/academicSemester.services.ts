import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import {
  academicSemesterCodeNameMapper,
  academicSemesterSearchTerm,
} from './academicSemester.constant';
import TAcademicSemester from './academicSemester.interface';
import AcademicSemester from './academicSemester.model';
import QueryBuilder from '../../builders/QueryBuilder';

export const createAcademicSemesterIntoDB = async (
  payload: TAcademicSemester,
) => {
  // validate semester code and name:

  if (academicSemesterCodeNameMapper[payload.name] !== payload.code) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Semester Code and Name not matched',
    );
  }

  const result = await AcademicSemester.create(payload);

  return result;
};

export const getAcademicSemesterFromDB = async (query: Record<string, unknown>) => {
  const academicSemesterQuery = new QueryBuilder(AcademicSemester.find(), query)
    .search(academicSemesterSearchTerm)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await academicSemesterQuery.modelQuery;
  const meta = await academicSemesterQuery.countTotal();
  return {
    result,
    meta,
  };
};

export const getAcademicSemesterByIdFromDB = async (semesterId: string) => {
  const semester = await AcademicSemester.findOne({ _id: semesterId });
  return semester;
};

export const updateAcademicSemesterByIdIntoDB = async (
  semesterId: string,
  payload: Partial<TAcademicSemester>,
) => {
  if (
    payload.name &&
    payload.code &&
    academicSemesterCodeNameMapper[payload.name] !== payload.code
  ) {
    throw new AppError(httpStatus.NOT_FOUND, 'Invalid Semester Code!!!');
  }
  const result = await AcademicSemester.updateOne(
    { _id: semesterId },
    { $set: payload },
    {
      runValidators: true,
      new: true,
    },
  );

  return result;
};

export const AcademicSemesterServices = {
  createAcademicSemesterIntoDB,
  getAcademicSemesterFromDB,
  getAcademicSemesterByIdFromDB,
  updateAcademicSemesterByIdIntoDB,
};
