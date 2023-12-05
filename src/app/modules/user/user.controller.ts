import { RequestHandler } from 'express';
import { UserServices } from './user.services';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';

const createStudent: RequestHandler = catchAsync(async (req, res) => {
  const { password, student: studentData } = req.body;

  const student = await UserServices.createStudentIntoDB(password, studentData);

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

  const faculty = await UserServices.createFacultyIntoDB(password, facultyData);

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

  const admin = await UserServices.createAdminIntoDB(password, adminData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin Created Successfully',
    data: admin,
  });
});

export const UserControllers = {
  createStudent,
  createFaculty,
  createAdmin,
};
