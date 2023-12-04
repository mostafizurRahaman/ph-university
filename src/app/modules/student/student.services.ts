/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import Student from './student.model';
import User from '../user/user.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { TStudent } from './student.interface';

/* 
// get students:
const getAllStudentFromDB = async (query: Record<string, unknown>) => {
  // copy base query :
  const queryObj = { ...query };

  // excluding fields array:
  const excludeFields = ['searchTerm', 'sort', 'limit'];

  // remove excluding filed from queryObj:
  excludeFields.forEach((el: string) => delete queryObj[el]);

  // searchTerm :
  let searchTerm: string = '';
  if (query?.searchTerm) {
    searchTerm = query.searchTerm as string;
  }

  // sorting :
  let sort: string = '-createdAt';
  if (query.sort) {
    sort = query.sort as string;
  }

  // limiting :
  let limit: number = 1;
  if (query.limit) {
    limit = Number(query.limit as string);
  }

  // searchQuery :
  const searchQuery = Student.find({
    $or: ['email', 'name.firstName', 'name.middleName'].map((field: string) => {
      return {
        [field]: { $regex: searchTerm, $options: 'i' },
      };
    }),
  });

  console.log(query, queryObj);

  const filterQuery = searchQuery
    .find(queryObj)
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });

  // sortQuery :
  const sortQuery = filterQuery.sort(sort);

  // limiting Query:
  const limitQuery = await sortQuery.limit(limit);

  return limitQuery;
};
 */

const getAllStudentFromDB = async (query: Record<string, unknown>) => {
  console.log(query);
  // copy the query:
  const queryObj = { ...query };

  // excluding fields :
  const excludeFields = ['searchTerm', 'sort', 'limit', 'page'];
  excludeFields.forEach((el: string) => delete queryObj[el]);

  // search Query :
  let searchTerm: string = '';
  if (query.searchTerm) {
    searchTerm = query.searchTerm as string;
  }

  // sort Query:
  const sort: string = (query.sort as string) || '-createdAt';

  // Query Limit :
  const limit: number = query.limit ? Number(query.limit) : 1;

  console.log(queryObj);

  // searchQuery:
  const searchQuery = Student.find({
    $or: ['name.firstName', 'email', 'presentAddress'].map((field: string) => {
      return {
        [field]: { $regex: searchTerm, $options: 'i' },
      };
    }),
  });

  // Filter Query:
  const FilterQuery = searchQuery
    .find(queryObj)
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });

  // Sort Query :

  const sortQuery = FilterQuery.sort(sort);

  // Limit Query:
  const limitQuery = await sortQuery
    .limit(limit)
    .select('name email');

  return limitQuery;

  //
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
  const student = await Student.findOne({ id });
  return student;
};

// delete single documents:
const deleteStudentByIdFromDB = async (id: string) => {
  const session = await mongoose.startSession();

  if (!(await Student.isUserExists(id))) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Doesn't Exists!!!");
  }
  try {
    // start Session()
    session.startTransaction();
    // transaction 1:
    const deletedStudents = await Student.findOneAndUpdate(
      { id },
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

    if (!deletedStudents) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete student!!');
    }

    // transaction 2:
    const deletedUser = await User.findOneAndUpdate(
      { id },
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
    return deletedStudents;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(err?.statusCode, err?.message);
  }
};

// update student services:
const updateStudentIntoDB = async (
  studentId: string,
  payload: Partial<TStudent>,
) => {
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

  const result = await Student.findOneAndUpdate(
    { id: studentId },
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
