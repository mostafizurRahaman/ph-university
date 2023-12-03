/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import { IErrorSources, ISendErrorResponse } from '../interfaces/errors';

const handleDuplicateError = (err: any): ISendErrorResponse => {
  const key = Object.keys(err.keyPattern)[0];
  const errorSources: IErrorSources[] = [
    {
      path: key,
      message: ` "The ${err.keyValue[key]}"  is already Exists`,
    },
  ];
  const statusCode: number = httpStatus.BAD_REQUEST;

  return {
    statusCode,
    message: `Path "${key}" is already Exists`,
    errorSources,
  };
};

export default handleDuplicateError;
