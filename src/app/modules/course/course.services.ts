import QueryBuilder from '../../builders/QueryBuilder';
import { courseSearchableFields } from './course.constant';
import { ICourse } from './course.interface';
import Course from './course.model';

// create courses:
const createCourseIntoDB = async (payload: ICourse) => {
  const course = await Course.create(payload);
  return course;
};

// get all course:
const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder(
    Course.find().populate('preRequisiteCourses.course'),
    query,
  )
    .search(courseSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await courseQuery.modelQuery;
  return result;
};

// get single course:

const getSingleCourseFromDB = async (id: string) => {
  const course = await Course.findById(id).populate({
    path: 'preRequisiteCourses.course',
  });

  return course;
};

// delete course:
const deleteSingleCourseFromDB = async (id: string) => {
  const course = await Course.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );

  return course;
};

export const CourseServices = {
  createCourseIntoDB,
  getAllCoursesFromDB,
  getSingleCourseFromDB,
  deleteSingleCourseFromDB,
};
