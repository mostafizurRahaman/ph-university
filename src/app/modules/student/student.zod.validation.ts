import { z } from 'zod';

export const UserNameZodValidationSchema = z.object({
  firstName: z
    .string()
    .max(20, { message: "First name can't be more than 20 characters" }),
  middleName: z
    .string()
    .max(20, { message: "Middle name can't be more than 20 characters" }),
  lastName: z
    .string()
    .max(20, { message: "Last name can't be more than 20 characters" }),
});

const GuardianZodValidationSchema = z.object({
  fatherName: z.string(),
  fatherOccupation: z.string(),
  fatherContactNo: z.string(),
  motherName: z.string(),
  motherOccupation: z.string(),
  motherContactNo: z.string(),
});

const LocalGuardianZodValidationSchema = z.object({
  name: z.string(),
  occupation: z.string(),
  address: z.string(),
  contactNo: z.string(),
});

const StudentValidationSchema = z.object({
  body: z.object({
    password: z.string().optional(),
    student: z.object({
      name: UserNameZodValidationSchema,
      gender: z.enum(['male', 'female', 'other']),
      email: z
        .string({
          required_error: 'Email is required!',
        })
        .email('This is not a valid email!'),
      bloodGroup: z
        .enum(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'])
        .optional(),
      dateOfBirth: z.string().optional(),
      contactNo: z.string(),
      emergencyContactNo: z.string(),
      permanentAddress: z.string(),
      presentAddress: z.string(),
      guardian: GuardianZodValidationSchema,
      localGuardian: LocalGuardianZodValidationSchema,
      admissionSemester: z.string(),
      academicDepartment: z.string(),
    }),
  }),
});

export const UpdateStudentValidationSchema = z.object({
  body: z.object({
    password: z.string().optional(),
    student: z.object({
      name: UserNameZodValidationSchema.partial().optional(),
      gender: z.enum(['male', 'female', 'other']).optional(),
      email: z.string().email().optional(),
      bloodGroup: z
        .enum(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'])
        .optional(),
      dateOfBirth: z.string().optional(),
      contactNo: z.string().optional(),
      emergencyContactNo: z.string().optional(),
      permanentAddress: z.string().optional(),
      presentAddress: z.string().optional(),
      guardian: GuardianZodValidationSchema.partial().optional(),
      localGuardian: LocalGuardianZodValidationSchema.partial().optional(),
      admissionSemester: z.string().optional(),
      academicDepartment: z.string().optional(),
    }),
  }),
});
export default StudentValidationSchema;
