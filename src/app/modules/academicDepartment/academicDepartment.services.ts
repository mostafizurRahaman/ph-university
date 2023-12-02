import { TAcademicDepartment } from './academicDepartment.interface';
import AcademicDepartment from './academicDepartment.model';

const createAcademicDepartmentIntoDB = async (payload: TAcademicDepartment) => {
  const academicDepartment = new AcademicDepartment(payload);

  const result = await academicDepartment.save();
  return result;
};

const getAllAcademicDepartmentsFromDB = async () => {
  const academicDepartments = await AcademicDepartment.find({});
  return academicDepartments;
};

const getSingleAcademicDepartmentFromDB = async (
  academicDepartmentId: string,
) => {
  const academicDepartment = await AcademicDepartment.findOne({
    _id: academicDepartmentId,
  });

  return academicDepartment;
};

const updateAcademicDepartmentIntoDB = async (
  academicDepartmentId: string,
  payload: Partial<TAcademicDepartment>,
) => {
  const result = await AcademicDepartment.updateOne(
    { _id: academicDepartmentId },
    { $set: payload },
    {
      runValidators: true,
      new: true,
    },
  );
  console.log(result);
  return result;
};

export const AcademicDepartmentServices = {
  createAcademicDepartmentIntoDB,
  getAllAcademicDepartmentsFromDB,
  getSingleAcademicDepartmentFromDB,
  updateAcademicDepartmentIntoDB,
};
