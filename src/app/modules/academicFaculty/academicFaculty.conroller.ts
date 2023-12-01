import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import { AcademicFacultyServices } from './academicFaculty.services';
import catchAsync from '../../utils/catchAsync';

export const createAcademicFaculty = catchAsync(async (req, res) => {
  const academicFaculty =
    await AcademicFacultyServices.createAcademicFacultyIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Faculty Is Created Successfully!!!',
    data: academicFaculty,
  });
});

export const getAcademicFaculties = catchAsync(async (req, res) => {
  const academicFaculties =
    await AcademicFacultyServices.getAcademicFacultiesFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Faculty Found Successfully!!!',
    data: academicFaculties,
  });
});

export const getAcademicFacultyById = catchAsync(async (req, res) => {
  const { academicFacultyId } = req.params;

  if (!academicFacultyId) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'academicFacultyId Is Required',
      data: null,
    });
  }

  const academicFaculty =
    await AcademicFacultyServices.getAcademicFacultyByIdFromDB(
      academicFacultyId,
    );

  if (!academicFaculty) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Academic Faculty Not Found',
      data: null,
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Faculty is Found successfully',
    data: academicFaculty,
  });
});

export const updateAcademicFacultyById = catchAsync(async (req, res) => {
  const { academicFacultyId } = req.params;

  if (!academicFacultyId) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'academicFacultyId Is Required',
      data: null,
    });
  }

  const result = await AcademicFacultyServices.updateAcademicFaculty(
    academicFacultyId,
    req.body,
  );

  if (!result.modifiedCount) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Academic Faculty Not Updated Successfully',
      data: result,
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Faculty Updated Successfully',
    data: result,
  });
});

export const AcademicFacultyController = {
  createAcademicFaculty,
  getAcademicFaculties,
  getAcademicFacultyById,
  updateAcademicFacultyById,
};
