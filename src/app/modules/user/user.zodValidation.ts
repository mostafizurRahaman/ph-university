import z from 'zod';
import { UserStatus } from './user.contants';

export const userValidationSchema = z.object({
  password: z
    .string({
      invalid_type_error: 'Password must be String',
    })
    .max(20, { message: 'Password can not be more than 20 character' })
    .optional(),
});

export const userStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum([...UserStatus] as [string, ...string[]]),
  }),
});
