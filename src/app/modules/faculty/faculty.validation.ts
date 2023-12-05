import { bloodGroups } from './../user/user.contants';
import { z } from 'zod';
import { UserNameZodValidationSchema } from '../student/student.zod.validation';
import { genders } from '../user/user.contants';

const facultyValidationSchema = z.object({
  body: z.object({
    password: z.string(),
    faculty: z.object({
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
      academicDepartment: z.string(),
      profileImg: z.string(),
    }),
  }),
});

export const updateFacultyValidationSchema = z.object({
  body: z.object({
    password: z.string().optional(),
    faculty: z
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
        academicDepartment: z.string().optional(),
        profileImg: z.string().optional(),
      })
      .optional(),
  }),
});

export default facultyValidationSchema;
