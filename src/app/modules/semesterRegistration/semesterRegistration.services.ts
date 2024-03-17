import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import AcademicSemester from '../accademicSemester/academicSemester.model';
import { ISemesterRegistration } from './semesterRegistration.interface';
import SemesterRegistration from './semesterRegistration.model';
import QueryBuilder from '../../builders/QueryBuilder';
import { RegistrationStatus } from './semesterRegistration.constant';
import mongoose from 'mongoose';
import OfferedCourse from '../offeredCourses/offeredCourse.model';

const createSemesterRegistrationIntoDB = async (
  payload: ISemesterRegistration,
) => {
  const academicSemester = payload.academicSemester;

  // check if there any registered semester that already "UPCOMING" and "ONGOING"

  const isThereAnyUpcomingOrOngoingSemester =
    await SemesterRegistration.findOne({
      $or: [
        { status: RegistrationStatus.UPCOMING },
        {
          status: RegistrationStatus.ONGOING,
        },
      ],
    });

  if (isThereAnyUpcomingOrOngoingSemester) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `There is already an ${isThereAnyUpcomingOrOngoingSemester.status}  Semester!!!`,
    );
  }

  //  is Academic Semester Already Registered:
  const isSemesterIsAlreadyRegistered = await SemesterRegistration.findOne({
    academicSemester,
  });

  if (isSemesterIsAlreadyRegistered) {
    throw new AppError(
      httpStatus.CONFLICT,
      'This Semester Already Registered!!!',
    );
  }

  // check academic is Exists:
  const isAcademicSemesterExists =
    await AcademicSemester.findById(academicSemester);

  if (!isAcademicSemesterExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Academic Semester Is not Exists!!!',
    );
  }

  const registeredSemester = await SemesterRegistration.create(payload);

  return registeredSemester;
};

// get all Semester Registration from db:
const getAllSemesterRegistrationFromDB = async (
  query: Record<string, unknown>,
) => {
  const semesterRegistrationQuery = new QueryBuilder(
    SemesterRegistration.find().populate('academicSemester'),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await semesterRegistrationQuery.modelQuery;
  const meta = await semesterRegistrationQuery.countTotal();

  return { result, meta };
};

// get single Semester Registration from db:
const getSingleSemesterRegistrationFromDB = async (id: string) => {
  const result =
    await SemesterRegistration.findById(id);

  return result;
};

// update single Semester Registration from db:

const updateSingleSemesterRegisterIntoDB = async (
  id: string,
  payload: Partial<ISemesterRegistration>,
) => {
  // check requested semester is exists :
  const currentSemester = await SemesterRegistration.findById(id);
  const requestedSemester = payload?.status;

  if (!currentSemester) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Semester Not Exits with This Id!!',
    );
  }

  // check status of requested semester :
  const currentSemesterStatus = currentSemester.status;

  if (currentSemesterStatus === RegistrationStatus.ENDED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `This semester is already ${currentSemesterStatus}`,
    );
  }

  if (
    currentSemesterStatus === RegistrationStatus.UPCOMING &&
    requestedSemester !== RegistrationStatus.ONGOING
  ) {
    throw new AppError(
      httpStatus.CONFLICT,
      `You can't directly update status "${currentSemesterStatus}" to "${requestedSemester}" `,
    );
  }

  if (
    currentSemesterStatus === RegistrationStatus.ONGOING &&
    requestedSemester !== RegistrationStatus.ENDED
  ) {
    throw new AppError(
      httpStatus.CONFLICT,
      `You can't directly update status "${currentSemesterStatus}" to "${requestedSemester}"`,
    );
  }

  // update semester registration:

  const updatedSemester = await SemesterRegistration.findByIdAndUpdate(
    id,
    {
      $set: payload,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  return updatedSemester;
};

// delete semester registration when status upcoming by id:
const deleteSemesterRegistrationFromDB = async (id: string) => {
  const isSemesterRegistrationExists = await SemesterRegistration.findById(id);
  // check semester is exists or not ? :

  if (!isSemesterRegistrationExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'This semester Not Exists with this ' + id,
    );
  }
  // check semester status is "UPCOMING" ? :
  if (isSemesterRegistrationExists.status !== RegistrationStatus.UPCOMING) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can't delete This Semester, Because This Semester Status is ${isSemesterRegistrationExists.status}`,
    );
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // delete all OfferedCourse of This semesterRegistration:
    const deleteOfferedCourse = await OfferedCourse.updateMany(
      {
        semesterRegistration: id,
      },
      {
        $set: {
          isDeleted: true,
        },
      },
      {
        new: true,
        runValidators: true,
        session,
      },
    );
    console.log(deleteOfferedCourse);

    if (!deleteOfferedCourse.acknowledged) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to delete Offered Course!!!',
      );
    }

    const deleteSemesterRegistration =
      await SemesterRegistration.findByIdAndUpdate(
        id,
        {
          $set: { isDeleted: true },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      );

    if (!deleteSemesterRegistration) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to delete SemesterRegistration!!!',
      );
    }

    await session.commitTransaction();
    await session.endSession();
    return deleteSemesterRegistration;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // throw new Error(err as any);
    throw err;
  }
};

export const SemesterRegistrationServices = {
  createSemesterRegistrationIntoDB,
  getAllSemesterRegistrationFromDB,
  getSingleSemesterRegistrationFromDB,
  updateSingleSemesterRegisterIntoDB,
  deleteSemesterRegistrationFromDB,
};
