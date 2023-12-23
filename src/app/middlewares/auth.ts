
import httpStatus from 'http-status';
import AppError from '../errors/AppError';
import catchAsync from '../utils/catchAsync';
import configs from '../configs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { TUserRole } from '../modules/user/user.interface';

export const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req, res, next) => {
    // get the token from request:
    const token = req?.headers?.authorization?.split(' ')[1];

    // check the token is sent?:
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!!!');
    }

    // verify the jwt token :
    jwt.verify(token, configs.jwt_access_token as string, (err, decoded) => {
      // if have error  throw new Error:
      if (err) {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          'You are not Authorized!!!',
        );
      }

      const role = (decoded as JwtPayload)?.role;

      // check is user role exists in required roles?:
      if (requiredRoles && !requiredRoles.includes(role)) {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          'You are not Authorized!!!',
        );
      }

      // set decoded data to req.user
      req.user = decoded as JwtPayload; // define a type index.d.ts in interface folder to assign this req.user type globally.

      next();
    });
  });
};
