import { z } from 'zod';

// ** Create Enrolled Course Validation Schema:
const createEnrolledCourseValidationSchema = z.object({
  body: z.object({
    offeredCourse: z.string({
      required_error: 'OfferedCourse Id is Required!!!',
    }),
  }),
});

// ** Enrolled Course Update Validation Schema :
const updateEnrolledCourseMarksValidationSchema = z.object({
  body: z.object({
    semesterRegistration: z.string({
      required_error: 'Semester Registration Id Is Required!!!',
    }),
    offeredCourse: z.string({
      required_error: 'Offered Course Id Is Required !!!',
    }),
    student: z.string({
      required_error: 'Student Id Is Required !!',
    }),
    courseMarks: z.object({
      classTest1: z.number().optional(),
      midTerm: z.number().optional(),
      classTest2: z.number().optional(),
      finalTerm: z.number().optional(),
    }),
  }),
});

export const EnrolledCourseValidationSchema = {
  createEnrolledCourseValidationSchema,
  updateEnrolledCourseMarksValidationSchema,
};
