import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AdminServices } from './admin.services';

const getAllAdmins = catchAsync(async (req, res) => {
  // get queries:
  const query = req.query;

  const admins = await AdminServices.getAllAdminFromDB(query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admins are Retrieved Successfully!!!',
    meta: admins.meta, 
    data: admins.result,
  });
});

const getSingleAdminById = catchAsync(async (req, res) => {
  // get admin Id from params:
  const { id } = req.params;

  const admin = await AdminServices.getSingleAdminFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin Retrieved Successfully!!!',
    data: admin,
  });
});

const updateAdminById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { admin: adminData } = req.body;

  const admin = await AdminServices.updateSingleAdminIntoDB(id, adminData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin Updated Successfully!!!',
    data: admin,
  });
});

const deleteAdminById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await AdminServices.deleteSingleAdminFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin Updated Successfully!!!',
    data: result,
  });
});

export const AdminControllers = {
  getAllAdmins,
  getSingleAdminById,
  updateAdminById,
  deleteAdminById,
};
