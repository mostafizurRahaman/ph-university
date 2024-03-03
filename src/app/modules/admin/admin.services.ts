import httpStatus from 'http-status';
import QueryBuilder from '../../builders/QueryBuilder';
import AppError from '../../errors/AppError';
import { adminSearchFields } from './admin.constant';
import Admin from './admin.model';
import { TAdmin } from './admin.interface';
import mongoose from 'mongoose';
import User from '../user/user.model';

const getAllAdminFromDB = async (query: Record<string, unknown>) => {
  const adminQuery = new QueryBuilder(Admin.find(), query)
    .search(adminSearchFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await adminQuery.modelQuery;
  const meta = await adminQuery.countTotal();

  return { result, meta };
};

const getSingleAdminFromDB = async (id: string) => {
  const admin = await Admin.isAdminExists(id);
  if (!admin) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Admin Not Exists with This Id!!!',
    );
  }

  return admin;
};

const updateSingleAdminIntoDB = async (
  id: string,
  payload: Partial<TAdmin>,
) => {
  if (!(await Admin.isAdminExists(id))) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Admin Not Exists with This Id!!!',
    );
  }

  const { name, ...remainingInfo } = payload;

  const modifiedDocument: Record<string, unknown> = { ...remainingInfo };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedDocument[`name.${key}`] = value;
    }
  }

  // transaction -1:
  const result = await Admin.findByIdAndUpdate(
    id,
    { $set: modifiedDocument },
    { new: true, runValidators: true },
  );

  return result;
};

const deleteSingleAdminFromDB = async (id: string) => {
  if (!(await Admin.isAdminExists(id))) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Admin Not Exists with This Id!!!',
    );
  }

  // create a session :
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const deleteAdmin = await Admin.findByIdAndUpdate(
      id,
      { $set: { isDeleted: true } },
      { new: true, session },
    );
    if (!deleteAdmin) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete Admin!!!');
    }

    const userId = deleteAdmin.user;
    const deleteUser = await User.findByIdAndUpdate(
      userId,
      { $set: { isDeleted: true } },
      { new: true, session },
    );
    if (!deleteUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete Admin!!!');
    }
    // commit transaction:
    await session.commitTransaction();
    await session.endSession();
    return deleteAdmin;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};
export const AdminServices = {
  getAllAdminFromDB,
  getSingleAdminFromDB,
  updateSingleAdminIntoDB,
  deleteSingleAdminFromDB,
};
