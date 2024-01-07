import { RequestHandler } from 'express';
import { UserServices } from './user.services';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';

const createStudent: RequestHandler = catchAsync(async (req, res) => {
  const { password, student: studentData } = req.body;

  const student = await UserServices.createStudentIntoDB(
    req.file, // pass the file
    password,
    studentData,
  );

  // send response :
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student Created successfully',
    data: student,
  });
});

// create faculty :
const createFaculty: RequestHandler = catchAsync(async (req, res) => {
  const { faculty: facultyData, password } = req.body;

  const faculty = await UserServices.createFacultyIntoDB(
    req.file,
    password,
    facultyData,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty Created Successfully',
    data: faculty,
  });
});

// create admin:
const createAdmin: RequestHandler = catchAsync(async (req, res) => {
  const { password, admin: adminData } = req.body;

  const admin = await UserServices.createAdminIntoDB(
    req.file,
    password,
    adminData,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin Created Successfully',
    data: admin,
  });
});

// create a  getMe router:

const getMe = catchAsync(async (req, res) => {
  const { userId, role } = req.user;
  const result = await UserServices.getMe(userId, role);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User Retrieved Successfully!!!',
    data: result,
  });
});

// change user status :
const changeUserStatus = catchAsync(async (req, res) => {
  const id = req.params.id;
  const status = req.body.status;

  const result = await UserServices.changeUserStatusIntoDB(id, status);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User Status Updated Successfully!!!',
    data: result,
  });
});
export const UserControllers = {
  createStudent,
  createFaculty,
  createAdmin,
  getMe,
  changeUserStatus,
};
