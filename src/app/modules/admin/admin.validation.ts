import { z } from 'zod';
import { UserNameZodValidationSchema } from '../student/student.zod.validation';
import { bloodGroups, genders } from '../user/user.contants';

const createAdminValidationSchema = z.object({
  body: z.object({
    password: z.string(),
    admin: z.object({
      name: UserNameZodValidationSchema,
      designation: z.string(),
      gender: z.enum([...(genders as [string, ...string[]])]),
      dateOfBirth: z.string().optional(),
      bloodGroup: z.enum([...(bloodGroups as [string, ...string[]])]),
      email: z
        .string({
          required_error: 'Email is required',
        })
        .email('Invalid Email'),
      contactNo: z.string(),
      emergencyContactNo: z.string(),
      presentAddress: z.string(),
      permanentAddress: z.string(),
      managementDepartment: z.string(),
      profileImg: z.string(),
    }),
  }),
});

export const updateAdminValidationSchema = z.object({
  body: z.object({
    password: z.string().optional(),
    admin: z
      .object({
        name: UserNameZodValidationSchema.partial().optional(),
        designation: z.string().optional(),
        gender: z.enum([...(genders as [string, ...string[]])]).optional(),
        dateOfBirth: z.string().optional(),
        bloodGroup: z
          .enum([...(bloodGroups as [string, ...string[]])])
          .optional(),
        email: z
          .string({
            required_error: 'Email is required',
          })
          .email('Invalid Email')
          .optional(),
        contactNo: z.string().optional(),
        emergencyContactNo: z.string().optional(),
        presentAddress: z.string().optional(),
        permanentAddress: z.string().optional(),
        managementDepartment: z.string().optional(),
        profileImg: z.string().optional(),
      })
      .optional(),
  }),
});

export const AdminValidations = {
  createAdminValidationSchema,
  updateAdminValidationSchema,
};
