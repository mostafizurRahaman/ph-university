import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CourseServices } from './course.services';

// create course:
const createCourse = catchAsync(async (req, res) => {
  const { course } = req.body;

  const result = await CourseServices.createCourseIntoDB(course);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course Created Successfully!!!',
    data: result,
  });
});

// get all course:
const getAllCourses = catchAsync(async (req, res) => {
  const query: Record<string, unknown> = req.query;

  const courses = await CourseServices.getAllCoursesFromDB(query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Courses are Retrieved Successfully!!!',
    data: courses,
  });
});

// get single courses:
const getSingleCourseById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseServices.getSingleCourseFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course is Retrieved Successfully!!!',
    data: result,
  });
});

// update  single courses:
const updateSingleCourseById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { course } = req.body;
  const result = await CourseServices.updateSingleCourseIntoDB(id, course);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course updated successfully!!!',
    data: result,
  });
});

// delete single courses :
const deleteSingleCourseById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await CourseServices.deleteSingleCourseFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course Deleted Successfully!!!',
    data: result,
  });
});

export const CoursesController = {
  createCourse,
  getAllCourses,
  getSingleCourseById,
  deleteSingleCourseById,
  updateSingleCourseById,
};
