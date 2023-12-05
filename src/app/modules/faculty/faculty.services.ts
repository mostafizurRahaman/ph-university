import httpStatus from 'http-status';
import QueryBuilder from '../../builders/QueryBuilder';
import AppError from '../../errors/AppError';
import { searchFields } from './facultites.constant';
import Faculty from './faculty.model';
import { TFaculty } from './faculty.interface';
import mongoose from 'mongoose';
import User from '../user/user.model';

const getAllFacultiesFromDB = async (query: Record<string, unknown>) => {
  const facultyQuery = new QueryBuilder(Faculty.find(), query)
    .search(searchFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await facultyQuery.modelQuery;
  return result;
};

const getSingleFacultyFromDB = async (facultyId: string) => {
  if (!(await Faculty.isFacultyExists(facultyId))) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Faculty Doesn't Exist with this Id",
    );
  }

  const faculty = await Faculty.findOne({ id: facultyId });

  return faculty;
};

const updateFacultyByIdIntoDB = async (
  facultyId: string,
  payload: Partial<TFaculty>,
) => {
  if (!(await Faculty.isFacultyExists(facultyId))) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Faculty Doesn't Exist with this Id",
    );
  }

  const { name, ...remainingInfo } = payload;

  const modifiedDocument: Record<string, unknown> = { ...remainingInfo };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedDocument[`name.${key}`] = value;
    }
  }

  const result = await Faculty.findOneAndUpdate(
    { id: facultyId },
    { $set: modifiedDocument },
    {
      runValidators: true,
      new: true,
    },
  );

  return result;
};

const deleteSingleFacultyByID = async (facultyId: string) => {
  if (!(await Faculty.isFacultyExists(facultyId))) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Faculty Doesn't Exist with this Id",
    );
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // transaction-1
    const deleteFaculty = await Faculty.findOneAndUpdate(
      { id: facultyId },
      {
        $set: { isDeleted: true },
      },
      {
        new: true,
        session,
      },
    );

    if (!deleteFaculty) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to Delete Faculty!!!');
    }

    // transaction-2:
    const deleteUser = await User.findOneAndUpdate(
      { id: facultyId },
      {
        $set: { isDeleted: true },
      },
      {
        new: true,
        session,
      },
    );

    if (!deleteUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to Delete User!!!');
    }

    await session.commitTransaction();
    await session.endSession();

    return deleteFaculty;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
  }
};

export const FacultyServices = {
  getAllFacultiesFromDB,
  getSingleFacultyFromDB,
  updateFacultyByIdIntoDB,
  deleteSingleFacultyByID,
};
