import QueryBuilder from '../../builders/QueryBuilder';
import { TAcademicDepartment } from './academicDepartment.interface';
import AcademicDepartment from './academicDepartment.model';

const createAcademicDepartmentIntoDB = async (payload: TAcademicDepartment) => {
  const academicDepartment = new AcademicDepartment(payload);

  const result = await academicDepartment.save();
  return result;
};

const getAllAcademicDepartmentsFromDB = async (
  query: Record<string, unknown>,
) => {
  console.log(query);
  const academicDepartmentQuery = new QueryBuilder(
    AcademicDepartment.find({}).populate('academicFaculty'),
    query,
  )
    .search(['name'])
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await academicDepartmentQuery.modelQuery;
  const meta = await academicDepartmentQuery.countTotal();
  return {
    meta,
    result,
  };
};

const getSingleAcademicDepartmentFromDB = async (
  academicDepartmentId: string,
) => {
  const academicDepartment = await AcademicDepartment.findOne({
    _id: academicDepartmentId,
  }).populate('academicFaculty');

  return academicDepartment;
};

const updateAcademicDepartmentIntoDB = async (
  academicDepartmentId: string,
  payload: Partial<TAcademicDepartment>,
) => {
  const result = await AcademicDepartment.findOneAndUpdate(
    { _id: academicDepartmentId },
    { $set: payload },
    {
      runValidators: true,
      new: true,
    },
  );
  return result;
};

export const AcademicDepartmentServices = {
  createAcademicDepartmentIntoDB,
  getAllAcademicDepartmentsFromDB,
  getSingleAcademicDepartmentFromDB,
  updateAcademicDepartmentIntoDB,
};
