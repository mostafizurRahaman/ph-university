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

const getSingleFacultyFromDB = async (id: string) => {
  if (!(await Faculty.isFacultyExists(id))) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Faculty Doesn't Exist with this Id",
    );
  }

  const faculty = await Faculty.findById(id);

  return faculty;
};

const updateFacultyByIdIntoDB = async (
  id: string,
  payload: Partial<TFaculty>,
) => {
  if (!(await Faculty.isFacultyExists(id))) {
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

  const result = await Faculty.findByIdAndUpdate(
    id,
    { $set: modifiedDocument },
    {
      runValidators: true,
      new: true,
    },
  );

  return result;
};

const deleteSingleFacultyByID = async (id: string) => {
  if (!(await Faculty.isFacultyExists(id))) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Faculty Doesn't Exist with this Id",
    );
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // transaction-1
    const deleteFaculty = await Faculty.findByIdAndUpdate(
      id,
      {
        $set: { isDeleted: true },
      },
      {
        new: true,
        session,
      },
    );

    const userId = deleteFaculty?.user;
    if (!deleteFaculty) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to Delete Faculty!!!');
    }

    // transaction-2:
    const deleteUser = await User.findByIdAndUpdate(
      userId,
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
