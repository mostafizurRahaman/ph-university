import { z } from 'zod';
import { days } from './offeredCourse.constant';

const createOfferedCourseValidationSchema = z.object({
  body: z
    .object({
      semesterRegistration: z.string(),
      academicSemester: z.string(),
      academicFaculty: z.string(),
      academicDepartment: z.string(),
      faculty: z.string(),
      course: z.string(),
      maxCapacity: z.number().min(1),
      section: z.number().min(1),
      days: z.array(z.enum([...days] as [string, ...string[]])),
      startTime: z.string().refine(
        (time) => {
          const regex = /^([01]\d|2[0-3]):[0-5]\d$/;

          return regex.test(time);
        },
        { message: "startTime must be followed 'HH:MM' and 24 hour format!!!" },
      ),
      endTime: z.string().refine(
        (time) => {
          const regex = /^([01]\d|2[0-3]):[0-5]\d$/;

          return regex.test(time);
        },
        { message: "endTime must be followed 'HH:MM' and 24 hour format!!!" },
      ),
    })
    .refine(
      (body) => {
        const start = new Date(`2002-04-07T${body.startTime}:00`);
        const end = new Date(`2002-04-07T${body.endTime}:00`);
        console.log(start, end);

        return end > start;
      },
      { message: 'endTime should be greater Then startTime!!!' },
    ),
});

const updateOfferedCourseValidationSchema = z.object({
  body: z.object({
    faculty: z.string().optional(),
    maxCapacity: z.number().min(1).optional(),
    days: z.array(z.enum([...days] as [string, ...string[]])).optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
  }),
});

export const offeredCourseValidationSchema = {
  createOfferedCourseValidationSchema,
  updateOfferedCourseValidationSchema,
};
