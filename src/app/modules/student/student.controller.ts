import { StudentServices } from './student.services';
import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';

const getAllStudents = catchAsync(async (req, res) => {
  const students = await StudentServices.getAllStudentFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student retrieved successfully',
    data: students,
  });
});

const getStudentById = catchAsync(async (req, res) => {
  // get  id:
  const { id } = req.params;

  const student = await StudentServices.getStudentByIdFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student retrieved successfully',
    data: student,
  });
});

const deleteStudentById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await StudentServices.deleteStudentByIdFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student deleted successfully',
    data: result,
  });
});

// get student with Aggregation :
const getStudentsWithAggregation = catchAsync(async (req, res) => {
  const result = await StudentServices.getAllStudentFromDBWithAggregation();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student Retrieved successfully with aggregation',
    data: result,
  });
});

// student update route :

const updateStudentById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { student } = req.body;

  const result = await StudentServices.updateStudentIntoDB(id, student);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student Updated Successfully',
    data: result,
  });
});
export const StudentController = {
  getAllStudents,
  getStudentById,
  deleteStudentById,
  getStudentsWithAggregation,
  updateStudentById,
};
