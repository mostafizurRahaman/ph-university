import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.services';
import configs from '../../configs';

// login user:
const login = catchAsync(async (req, res) => {
  const result = await AuthServices.loginServices(req.body);
  const { accessToken, refreshToken, needsPasswordChanged } = result;

  // set refresh token to cookie:
  res.cookie('refresh_token', refreshToken, {
    secure: configs.node_env === 'production',
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'LoggedIn Successfully!!!',
    data: {
      accessToken,
      needsPasswordChanged,
    },
  });
});

// change password controller:
const changePassword = catchAsync(async (req, res) => {
  const user = req.user;
  const payload = req.body;

  const result = await AuthServices.changePasswordIntoDB(user, payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password Updated Successfully!!!',
    data: result,
  });
});

// refresh-token controller:
const getRefreshToken = catchAsync(async (req, res) => {
  const { refresh_token } = req.cookies;
  const result = await AuthServices.refreshToken(refresh_token);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access Token is Retrieved Successfully!!!',
    data: result,
  });
});

// forget password controller:
const forgetPassword = catchAsync(async (req, res) => {
  const userId = req.body.id;
  const result = await AuthServices.forgetPassword(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password is reset Successfully!!!',
    data: result,
  });
});

// reset password controller :
const resetPassword = catchAsync(async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  const result = await AuthServices.resetPassword(req.body, token as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: false,
    message: 'Password Reset Successfully!!!',
    data: result,
  });
});
export const AuthControllers = {
  login,
  changePassword,
  getRefreshToken,
  forgetPassword,
  resetPassword,
};
