import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { EnrolledCourseServices } from './enrolledCourse.services';

// ** Create Enrolled Course Controller :
const createEnrolledCourse = catchAsync(async (req, res) => {
  // ** get User From Request Which is included by auth :
  const userId = req.user.userId;

  const result = await EnrolledCourseServices.createEnrolledCourseIntoDB(
    userId,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Enrolled Course Created Successfully!!!',
    data: result,
  });
});

//  ** Update Course Marks :
const updateEnrolledCourseMarks = catchAsync(async (req, res) => {
  const facultyId = req.user.userId;

  const result = await EnrolledCourseServices.updateEnrolledCourseMarksIntoDB(
    facultyId,
    req.body,
  );

  // ** Send Response **
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Update Enrolled Course Marks!!!',
    data: result,
  });
});


//  ** My Enrolled Course : 
const getMyEnrolledCourse = catchAsync(async (req, res) => { 
  const studentId = req.user.userId; 
  const result = await EnrolledCourseServices.myEnrolledCourseFromDB(studentId, req.query)

  // ** Send Response : 
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "My Enrolled Courses Retrieved Successfully!!", 
    meta: result.meta,
    data: result.result,     
  })
})



// ** Export Enrolled Course Controller:
export const EnrolledCourseController = {
  createEnrolledCourse,
  updateEnrolledCourseMarks,
  getMyEnrolledCourse,
};
