import { z } from 'zod';

const CreateAcademicFacultyValidations = z.object({
  body: z.object({
    name: z.string(),
  }),
});

export const AcademicFacultyValidations = {
  CreateAcademicFacultyValidations,
};
