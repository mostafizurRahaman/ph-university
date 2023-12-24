import httpStatus from 'http-status';
import AppError from '../errors/AppError';
import catchAsync from '../utils/catchAsync';
import configs from '../configs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { TUserRole } from '../modules/user/user.interface';
import User from '../modules/user/user.model';

// export const auth = (...requiredRoles: TUserRole[]) => {
//   return catchAsync(async (req, res, next) => {
//     // get the token from request:
//     const token = req?.headers?.authorization?.split(' ')[1];

//     // check the token is sent?:
//     if (!token) {
//       throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!!!');
//     }

//     // verify the jwt token :

//     const decoded = jwt.verify(
//       token,
//       configs.jwt_access_token as string,
//     ) as JwtPayload;

//     const { userId, role, iat } = decoded;

//     //   check is user authorized for this route by using role:
//     if (requiredRoles && !requiredRoles.includes(role)) {
//       throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
//     }

//     // set decoded user  to req:
//     req.user = decoded; // define a type index.d.ts in interface folder to assign this req.user type globally.

//     next();
//   });
// };

export const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!!!');
    }

    //   verify jwt token :
    const decoded = jwt.verify(
      token,
      configs.jwt_access_token as string,
    ) as JwtPayload;

    // destructure decoded object:
    const { userId, role, iat } = decoded;

    // check isUserExists:
    const user = await User.isUserExistsByCustomId(userId);

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'Your Account Is Not Exists!!!');
    }

    // check is user deleted:

    if (await User.isUserDeleted(user)) {
      throw new AppError(httpStatus.NOT_FOUND, 'You are Deleted!!!');
    }

    // check is user blocked:
    if (await User.isUserBlocked(user)) {
      throw new AppError(httpStatus.BAD_REQUEST, 'You are Blocked!!!');
    }

    // is JWT issued before password changed?:
    if (
      user.passwordChangedAt &&
      User.isJWTIssuedBeforePasswordChanged(
        user.passwordChangedAt,
        iat as number,
      )
    ) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not Authorized!!!');
    }
    if (requiredRoles && !requiredRoles.includes(role)) {
      // check user is authorized for this  route by role?:

      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not Authorized!!!');
    }

    // set the decoded  object as user in request object:
    req.user = decoded; // define a type index.d.ts in interface folder to assign this req.user type globally.

    next();
  });
};
