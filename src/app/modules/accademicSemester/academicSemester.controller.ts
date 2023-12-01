import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AcademicSemesterServices } from './academicSemester.services';

export const createAcademicSemester = catchAsync(async (req, res) => {
  const result = await AcademicSemesterServices.createAcademicSemesterIntoDB(
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Semester Created Successfully',
    data: result,
  });
});

export const getAllAcademicSemester = catchAsync(async (req, res) => {
  // call the services to get all academic semester:
  const semesters = await AcademicSemesterServices.getAcademicSemesterFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Semester Found successfully',
    data: semesters,
  });
});

export const getAcademicSemesterById = catchAsync(async (req, res) => {
  const { semesterId } = req.params;

  // check semester Id not found:
  if (!semesterId) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'SemesterId is required',
      data: null,
    });
  }

  const result =
    await AcademicSemesterServices.getAcademicSemesterByIdFromDB(semesterId);

  if (!result) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Academic Semester Not found with this id',
      data: result,
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Semester Found Successfully',
    data: result,
  });
});

export const updateAcademicSemesterById = catchAsync(async (req, res) => {
  const { semesterId } = req.params;

  if (!semesterId) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'SemesterId is required',
      data: null,
    });
  }

  const isExists =
    await AcademicSemesterServices.getAcademicSemesterByIdFromDB(semesterId);

  if (!isExists) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Academic Semester Not found with this id',
      data: isExists,
    });
  }

  const result =
    await AcademicSemesterServices.updateAcademicSemesterByIdIntoDB(
      semesterId,
      req.body,
    );

  if (!result.modifiedCount) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Academic Semester Not Found!!!',
      data: result,
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Semester Found successfully',
    data: result,
  });
});

export const AcademicSemesterControllers = {
  createAcademicSemester,
  getAllAcademicSemester,
  getAcademicSemesterById,
  updateAcademicSemesterById,
};
