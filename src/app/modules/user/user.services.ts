/* eslint-disable @typescript-eslint/no-explicit-any */
import { TUser } from './user.interface';
import configs from '../../configs';
import User from './user.model';
import { TStudent } from '../student/student.interface';
import Student from '../student/student.model';

import AcademicSemester from '../accademicSemester/academicSemester.model';
import { generateFacultyId, generateStudentId } from './user.utils';
import TAcademicSemester from '../accademicSemester/academicSemester.interface';
import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { TFaculty } from '../faculty/faculty.interface';
import Faculty from '../faculty/faculty.model';

const createStudentIntoDB = async (password: string, payload: TStudent) => {
  const userData: Partial<TUser> = {};

  // if password not given use default password:
  userData.password = password || (configs.default_password as string);

  // set  role student:
  userData.role = 'student';

  /**
   *  Generate Student Id With a utils function
   *  load student semester info with
   * to load data use @admissionSemester property from @studentData
   *  then call the generated function pass the semester info
   */
  const academicSemester = await AcademicSemester.findOne({
    _id: payload.admissionSemester,
  });

  // create a session:
  const session = await mongoose.startSession();

  try {
    // start transaction:
    session.startTransaction();

    // call the generate id func:
    userData.id = await generateStudentId(
      academicSemester as TAcademicSemester,
    );

    // transaction : 1
    const newUser = await User.create([userData], { session: session });

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'User Not Created');
    }

    payload.id = newUser[0].id;
    payload.user = newUser[0]._id;

    // create new student: // transaction : 2
    const newStudent = await Student.create([payload], { session: session });

    if (!newStudent.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Student Not Created');
    }

    await session.commitTransaction();
    await session.endSession();
    return newStudent;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const createFacultyIntoDB = async (password: string, payload: TFaculty) => {
  // create new user:
  const userData: Partial<TUser> = {};

  // set faculty role:
  userData.role = 'faculty';

  // if password not given set default password:
  userData.password = password || configs.default_password;

  // generate a new faculty:
  userData.id = await generateFacultyId();

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // transaction-1
    const newUser = await User.create([userData], { session });

    if (!newUser.length) {
      throw new Error('Failed  to Create User!!!');
    }

    payload.id = newUser[0].id;
    payload.user = newUser[0]._id;

    const newFaculty = await Faculty.create([payload], { session });

    if (!newFaculty.length) {
      throw new Error('Failed to Create  Faculty');
    }

    await session.commitTransaction();
    await session.endSession();

    return newFaculty[0];
  } catch (err : any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

export const UserServices = {
  createStudentIntoDB,
  createFacultyIntoDB,
};
