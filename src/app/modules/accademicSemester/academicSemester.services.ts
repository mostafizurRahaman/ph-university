import { academicSemesterCodeNameMapper } from './academicSemester.constant';
import TAcademicSemester from './academicSemester.interface';
import AcademicSemester from './academicSemester.model';

export const createAcademicSemesterIntoDB = async (
  payload: TAcademicSemester,
) => {
  // validate semester code and name:

  if (academicSemesterCodeNameMapper[payload.name] !== payload.code) {
    throw new Error('Semester Code and Name not matched');
  }

  const result = await AcademicSemester.create(payload);

  return result;
};

export const getAcademicSemesterFromDB = async () => {
  const result = await AcademicSemester.find();
  return result;
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
    throw new Error('Invalid Semester Code!!!');
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
