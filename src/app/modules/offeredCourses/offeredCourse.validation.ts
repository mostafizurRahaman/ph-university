import { z } from 'zod';
import { days } from './offeredCourse.constant';

const timeValidationSchema = z.string().refine(
  (time) => {
    const regex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

    return regex.test(time);
  },
  { message: "startTime must be followed 'HH:MM' and 24 hour format!!!" },
);

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
      startTime: timeValidationSchema,
      endTime: timeValidationSchema,
    })
    .refine(
      (body) => {
        const start = new Date(`2002-04-07T${body.startTime}:00`);
        const end = new Date(`2002-04-07T${body.endTime}:00`);

        return end > start;
      },
      { message: 'endTime should be greater Then startTime!!!' },
    ),
});

const updateOfferedCourseValidationSchema = z.object({
  body: z
    .object({
      faculty: z.string(),
      maxCapacity: z.number().min(1),
      days: z.array(z.enum([...days] as [string, ...string[]])),
      startTime: timeValidationSchema,
      endTime: timeValidationSchema,
    })
    .refine(
      (body) => {
        const startTime = new Date(`1970-01-01T${body.startTime}`);
        const endTime = new Date(`1970-01-01T${body.endTime}`);

        return endTime > startTime;
      },
      {
        message: 'startTime should be less then endTime',
      },
    ),
});

export const offeredCourseValidationSchema = {
  createOfferedCourseValidationSchema,
  updateOfferedCourseValidationSchema,
};
