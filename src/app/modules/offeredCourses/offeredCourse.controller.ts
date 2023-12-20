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

export const OfferedCourseControllers = {
  createOfferedCourse,
};
