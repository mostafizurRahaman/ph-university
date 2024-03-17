/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import Student from './student.model';
import User from '../user/user.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { TStudent } from './student.interface';
import QueryBuilder from '../../builders/QueryBuilder';
import { studentSearchFields } from './student.constants';

const getAllStudentFromDB = async (query: Record<string, unknown>) => {
  // Student paginate Query:
  const StudentQuery = new QueryBuilder(
    Student.find()
      .populate('admissionSemester')
      .populate('academicDepartment')
      .populate('academicFaculty'),
    query,
  )
    .search(studentSearchFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await StudentQuery.modelQuery;

  const meta = await StudentQuery.countTotal();

  return {
    meta,
    result,
  };
};

// get data from db with aggregation:
const getAllStudentFromDBWithAggregation = async () => {
  const students = await Student.aggregate([
    // stage 1:
    { $match: {} },
  ]);

  return students;
};

// get single student with student id:
const getStudentByIdFromDB = async (id: string) => {
  if (!(await Student.isUserExists(id))) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Doesn't Exists!!!");
  }

  const student = await Student.findById(id);

  return student;
};

// delete single documents:
const deleteStudentByIdFromDB = async (id: string) => {
  if (!(await Student.isUserExists(id))) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Doesn't Exists!!!");
  }
  const session = await mongoose.startSession();
  try {
    // start Session()
    session.startTransaction();
    // transaction 1:
    const deletedStudent = await Student.findByIdAndUpdate(
      id,
      {
        $set: {
          isDeleted: true,
        },
      },
      {
        new: true,
        session,
      },
    );

    if (!deletedStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete student!!');
    }

    const userId = deletedStudent.user;
    // transaction 2:
    const deletedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          isDeleted: true,
        },
      },
      {
        new: true,
        session,
      },
    );

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user!!');
    }
    await session.commitTransaction();
    await session.endSession();
    return deletedStudent;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(err?.statusCode, err?.message);
  }
};




// update student services:
const updateStudentIntoDB = async (id: string, payload: Partial<TStudent>) => {
  if (!(await Student.isUserExists(id))) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Doesn't Exists!!!");
  }
  const { name, guardian, localGuardian, ...remainingInfo } = payload;

  const modifiedDocument: Record<string, unknown> = { ...remainingInfo };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedDocument[`name.${key}`] = value;
    }
  }

  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedDocument[`guardian.${key}`] = value;
    }
  }

  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedDocument[`localGuardian.${key}`] = value;
    }
  }

  const result = await Student.findByIdAndUpdate(
    id,
    { $set: modifiedDocument },
    { new: true, runValidators: true },
  );

  return result;
};
export const StudentServices = {
  getAllStudentFromDB,
  getStudentByIdFromDB,
  deleteStudentByIdFromDB,
  getAllStudentFromDBWithAggregation,
  updateStudentIntoDB,
};
