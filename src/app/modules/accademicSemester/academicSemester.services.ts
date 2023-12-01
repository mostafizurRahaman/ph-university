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

export const AcademicSemesterServices = {
  createAcademicSemesterIntoDB,
};
