import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AcademicDepartmentServices } from './academicDepartment.services';

export const createAcademicDepartment = catchAsync(async (req, res) => {
  const academicDepartment =
    await AcademicDepartmentServices.createAcademicDepartmentIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Department Is Created Successfully',
    data: academicDepartment,
  });
});

export const getAllAcademicDepartments = catchAsync(async (req, res) => {
  const result =
    await AcademicDepartmentServices.getAllAcademicDepartmentsFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Department Found Successfully!!!',
    data: result,
  });
});

export const getSingleAcademicDepartment = catchAsync(async (req, res) => {
  const { academicDepartmentId } = req.params;
  if (!academicDepartmentId) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'academicDepartmentId is required',
      data: null,
    });
  }

  const academicDepartment =
    await AcademicDepartmentServices.getSingleAcademicDepartmentFromDB(
      academicDepartmentId,
    );

  if (!academicDepartment) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Academic Department Not Found with this' + academicDepartmentId,
      data: academicDepartment,
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Department Found Successfully',
    data: academicDepartment,
  });
});

export const updateAcademicDepartmentById = catchAsync(async (req, res) => {
  const { academicDepartmentId } = req.params;
  if (!academicDepartmentId) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'academicDepartmentId is required',
      data: null,
    });
  }

  const result =
    await AcademicDepartmentServices.updateAcademicDepartmentIntoDB(
      academicDepartmentId,
      req.body,
    );

  if (!result.modifiedCount) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Academic Department Not Updated',
      data: result,
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Department Updated Successfully',
    data: result,
  });
});
