import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.services';

// login user:
const login = catchAsync(async (req, res) => {
  const result = await AuthServices.loginServices(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'LoggedIn Successfully!!!',
    data: result,
  });
});

export const AuthControllers = {
  login,
};
