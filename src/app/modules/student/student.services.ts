import Student from './student.model';

// get students:
const getAllStudentFromDB = async () => {
  const students = await Student.find({})
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });

  return students;
};

// get data from db with aggregation:
const getAllStudentFromDBWithAggregation = async () => {
  const students = await Student.aggregate([
    // stage 1:
    { $match: {} },
  ]);

  return students;
};

// get single student with student id:
const getStudentByIdFromDB = async (id: string) => {
  const student = await Student.findOne({ id });
  return student;
};

// delete single documents:
const deleteStudentByIdFromDB = async (id: string) => {
  const result = await Student.updateOne(
    { id },
    {
      $set: {
        isDeleted: true,
      },
    },
  );

  return result;
};

export const StudentServices = {
  getAllStudentFromDB,
  getStudentByIdFromDB,
  deleteStudentByIdFromDB,
  getAllStudentFromDBWithAggregation,
};
