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
  console.log(lastStudent, lastSemesterCode, lastSemesterYear);

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
