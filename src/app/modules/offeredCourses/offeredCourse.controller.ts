import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { offeredCourseServices } from './offeredCourse.services';

// create offered course :
const createOfferedCourse = catchAsync(async (req, res) => {
  const result = await offeredCourseServices.createOfferedCourseIntoDB(
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Offered Course Created Successfully!!!',
    data: result,
  });
});

// get all offered courses:
const getAllOfferedCourse = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await offeredCourseServices.getAllOfferedCourseFromDB(query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered Courses Retrieved Successfully!!!',
    data: result,
  });
});

// get single offered Course:
const getSingleOfferedCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await offeredCourseServices.getSingleOfferedCourseFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered Course Found Successfully!!!',
    data: result,
  });
});

// update offeredCourse :
const updateOfferedCourse = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await offeredCourseServices.updateOfferedCourseIntoDB(
    id,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered Course Updated Successfully!!!',
    data: result,
  });
});

// delete offered course by ID:
const deleteOfferedCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await offeredCourseServices.deleteOfferedCourseFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered Courses is Deleted Successfully!!!',
    data: result,
  });
});

export const OfferedCourseControllers = {
  createOfferedCourse,
  getAllOfferedCourse,
  getSingleOfferedCourse,
  updateOfferedCourse,
  deleteOfferedCourse,
};
