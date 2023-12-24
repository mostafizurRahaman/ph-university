import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import User from '../user/user.model';
import { IChangePassword, ILoginUser } from './auth.interface';
import jwt, { JwtPayload } from 'jsonwebtoken';
import configs from '../../configs';

import bcrypt from 'bcrypt';
import { createToken } from './auth.utils';

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

  const accessToken = createToken(
    jwtPayload,
    configs.jwt_access_token as string,
    configs.jwt_access_expiresIn as string,
  );

  // Generate Refresh Token:
  const refreshToken = createToken(
    jwtPayload,
    configs.jwt_refresh_token as string,
    configs.jwt_refresh_expiresIn as string,
  );

  return {
    accessToken,
    refreshToken,
    needsPasswordChanged: user.needsPasswordChanged,
  };
};

// change password services :

const changePasswordIntoDB = async (
  userData: JwtPayload,
  payload: IChangePassword,
) => {
  const { oldPassword, newPassword } = payload;

  const user = await User.isUserExistsByCustomId(userData.userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not Found With This Id!!');
  }
  // isUserDeleted?:

  if (await User.isUserDeleted(user)) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Is Deleted!!!');
  }

  // isUserBlock?:
  if (await User.isUserBlocked(user)) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are Blocked!!!');
  }

  // check is password matched or not? :
  const isPasswordMatched = await User.compareUserPassword(
    oldPassword,
    user.password,
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Password Not Matched!!!');
  }

  // bcrypt password:
  const password = await bcrypt.hash(
    newPassword,
    Number(configs.bcrypt_solt_rounds as string),
  );
  await User.findOneAndUpdate(
    { id: userData.userId, role: userData.role },
    {
      $set: {
        password: password,
        needsPasswordChanged: false,
        passwordChangedAt: new Date(),
      },
    },

    {
      new: true,
      runValidators: true,
    },
  );

  return null;
};

// get access token by refresh token:
const refreshToken = async (token: string) => {
  // verify refresh_token is valid?:
  const decoded = jwt.verify(
    token,
    configs.jwt_refresh_token as string,
  ) as JwtPayload;

  // destructure decoded object :
  const { userId, iat } = decoded;

  // check is user Exits with this Id:
  const user = await User.isUserExistsByCustomId(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'You account is not Exists!!!');
  }

  // check is user Deleted ?:
  if (await User.isUserDeleted(user)) {
    throw new AppError(httpStatus.FORBIDDEN, 'Your Account is deleted!!!');
  }

  // check is user blocked?:
  if (await User.isUserBlocked(user)) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are Blocked!!!');
  }

  // check is Jwt issued before passwordChange?:
  if (
    User.isJWTIssuedBeforePasswordChanged(
      user.passwordChangedAt as Date,
      iat as number,
    )
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are UnAuthorized!!!');
  }

  // generate a new  jwt token:

  const JwtPayload = {
    userId: user.id,
    role: user.role,
  };

  const accessToken = createToken(
    JwtPayload,
    configs.jwt_access_token as string,
    configs.jwt_access_expiresIn as string,
  );

  return {
    accessToken,
  };
};

export const AuthServices = {
  loginServices,
  changePasswordIntoDB,
  refreshToken,
};
