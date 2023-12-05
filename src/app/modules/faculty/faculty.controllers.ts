import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { FacultyServices } from './faculty.services';

const getAllFaculties = catchAsync(async (req, res) => {
  const query = { ...req.query };

  const faculties = await FacultyServices.getAllFacultiesFromDB(query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculties are Retrieved Successfully',
    data: faculties,
  });
});

const getSingleFacultyById = catchAsync(async (req, res) => {
  const { facultyId } = req.params;

  const faculty = await FacultyServices.getSingleFacultyFromDB(facultyId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty is Retrieved Successfully!!!',
    data: faculty,
  });
});

const updateFacultyById = catchAsync(async (req, res) => {
  const { facultyId } = req.params;
  const result = await FacultyServices.updateFacultyByIdIntoDB(
    facultyId,
    req.body.faculty,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty Updated Successfully!!!',
    data: result,
  });
});

const deleteFacultyById = catchAsync(async (req, res) => {
  const { facultyId } = req.params;

  const result = await FacultyServices.deleteSingleFacultyByID(facultyId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty Deleted Successfully',
    data: result,
  });
});

export const FacultyControllers = {
  getAllFaculties,
  getSingleFacultyById,
  updateFacultyById,
  deleteFacultyById,
};
