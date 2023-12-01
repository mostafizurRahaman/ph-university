import { TAcademicFaculty } from './academicFaculty.interface';
import AcademicFaculty from './academicFaculty.model';

export const createAcademicFacultyIntoDB = async (
  payload: TAcademicFaculty,
) => {
  const result = await AcademicFaculty.create(payload);

  return result;
};

export const getAcademicFacultiesFromDB = async () => {
  const academicFaculties = await AcademicFaculty.find({});

  return academicFaculties;
};

export const getAcademicFacultyByIdFromDB = async (
  academicFacultyId: string,
) => {
  const academicFaculty = await AcademicFaculty.findById(academicFacultyId);

  return academicFaculty;
};

export const updateAcademicFaculty = async (
  academicFacultyId: string,
  payload: Partial<TAcademicFaculty>,
) => {
  const result = await AcademicFaculty.updateOne(
    { _id: academicFacultyId },
    { $set: payload },
    { new: true, runValidators: true },
  );

  return result;
};

export const AcademicFacultyServices = {
  createAcademicFacultyIntoDB,
  getAcademicFacultiesFromDB,
  getAcademicFacultyByIdFromDB,
  updateAcademicFaculty,
};
