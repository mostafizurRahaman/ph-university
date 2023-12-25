import { z } from 'zod';

const loginValidationSchema = z.object({
  body: z.object({
    id: z.string(),
    password: z.string(),
  }),
});

const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string(),
    newPassword: z.string(),
  }),
});

// refresh token  validation schema:
const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refresh_token: z.string(),
  }),
});

// forget password validation schema:
const forgetPasswordValidationSchema = z.object({
  body: z.object({
    id: z.string(),
  }),
});

// reset password validation schema:
const resetPasswordValidationSchema = z.object({
  body: z.object({
    id: z.string(),
    newPassword: z.string(),
  }),
});

export const AuthValidations = {
  loginValidationSchema,
  changePasswordValidationSchema,
  refreshTokenValidationSchema,
  forgetPasswordValidationSchema,
  resetPasswordValidationSchema,
};
