import TAcademicSemester from '../accademicSemester/academicSemester.interface';

import User from './user.model';

export const findLastStudentId = async () => {
  const lastStudent = await User.findOne({ role: 'student' }, { id: 1, _id: 0 })
    .sort({ createdAt: -1 })
    .lean();

  return lastStudent?.id ? lastStudent?.id : undefined;
};

export const generateStudentId = async (payload: TAcademicSemester) => {
  let currentId = (0).toString();

  const lastStudent = await findLastStudentId();

  const lastSemesterYear = lastStudent?.substring(0, 4);
  const lastSemesterCode = lastStudent?.substring(4, 6);

  if (lastStudent) {
    if (
      lastSemesterYear === payload.year &&
      lastSemesterCode === payload.code
    ) {
      currentId = lastStudent.substring(6);
    }
  }

  const incrementId = (Number(currentId) + 1).toString().padStart(4, '0');
  return `${payload.year}${payload.code}${incrementId}`;
};

const loadLastFacultyId = async () => {
  const lastId = await User.findOne({ role: 'faculty' }, { id: 1, _id: 1 })
    .sort({ createdAt: -1 })
    .lean();

  return lastId?.id.substring(2);
};

export const generateFacultyId = async () => {
  let currentId = (0).toString();
  const lastFacultyId = await loadLastFacultyId();
  if (lastFacultyId) {
    currentId = lastFacultyId;
  }
  const incrementId = Number(currentId) + 1;
  const facultyId = 'F-' + incrementId.toString().padStart(4, '0');
  return facultyId;
};

const findLastAdminId = async () => {
  const lastAdmin = await User.findOne({ role: 'admin' }, { id: 1 }).sort({
    createdAt: -1,
  });

  return lastAdmin?.id.substring(2);
};

export const generateAdminId = async () => {
  const adminId = await findLastAdminId();
  let currentId = (0).toString();
  if (adminId) {
    currentId = adminId;
  }

  const newId = 'A-' + (Number(currentId) + 1).toString().padStart(4, '0');
  return newId;
};
