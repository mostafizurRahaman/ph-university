import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import User from '../user/user.model';
import { ILoginUser } from './auth.interface';
import jwt from 'jsonwebtoken';
import configs from '../../configs';

// login :
const loginServices = async (payload: ILoginUser) => {
  const { id, password } = payload;
  // check if the user with id is Exists:
  const user = await User.isUserExistsByCustomId(id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User  Exists With Credential!!!');
  }

  // if is user deleted :

  if (await User.isUserDeleted(user)) {
    throw new AppError(httpStatus.FORBIDDEN, 'User is Deleted!!!');
  }

  // check is user status is user block ? :

  if (await User.isUserBlocked(user)) {
    throw new AppError(httpStatus.FORBIDDEN, 'User Is Blocked!!!');
  }

  // check provided password is matched or not with hash:
  if (!(await User.compareUserPassword(password, user?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, 'Credential Not Matched!!!');
  }

  // generate a jwt payload :
  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };

  // Access Token and Refresh Token generate from here:

  const accessToken = await jwt.sign(
    jwtPayload,
    configs.jwt_access_token as string,
    {
      expiresIn: '10d',
    },
  );

  return {
    accessToken,
    needsPasswordChanged: user.needsPasswordChanged,
  };
};

export const AuthServices = {
  loginServices,
};
