import mongoose from 'mongoose';
import QueryBuilder from '../../builders/QueryBuilder';
import { courseSearchableFields } from './course.constant';
import { ICourse } from './course.interface';
import Course from './course.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

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
  const course = await Course.findById(id);
  if (!course) {
    throw new Error('Course Not Exits with this ID!!!');
  }

  return course;
};

// update single courses:
const updateSingleCourseIntoDB = async (
  id: string,
  payload: Partial<ICourse>,
) => {
  const { preRequisiteCourses, ...remainingCourseInfo } = payload;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const updateBasicCourseInfo = await Course.findByIdAndUpdate(
      id,
      {
        $set: remainingCourseInfo,
      },
      {
        new: true,
        runValidators: true,
        session,
      },
    );

    if (!updateBasicCourseInfo) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to update basic course info!!!',
      );
    }

    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      // remove deleted PreRequisite Course :
      const deletedPreRequisiteCourse = preRequisiteCourses
        .filter((el) => el.course && el.isDeleted)
        .map((el) => el.course);

      const updateDeletedPreRequisiteCourse = await Course.findByIdAndUpdate(
        id,
        {
          $pull: {
            preRequisiteCourses: { course: { $in: deletedPreRequisiteCourse } },
          },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      );

      if (!updateDeletedPreRequisiteCourse) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Failed to update deleted PreRequisiteCourse!!!',
        );
      }

      // filter new PreRequisite Course which need to add:
      const newPreRequisiteCourse = preRequisiteCourses.filter(
        (el) => el.course && !el.isDeleted,
      );

      // update new PreRequisite Course :
      const updateNewPreRequisiteCourse = await Course.findByIdAndUpdate(
        id,
        {
          $addToSet: {
            preRequisiteCourses: { $each: newPreRequisiteCourse },
          },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      );

      if (!updateNewPreRequisiteCourse) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Failed to update new PreRequisite Course!!!',
        );
      }
    }

    await session.commitTransaction();
    await session.endSession();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }

  const updatedCourse = await Course.findById(id);
  return updatedCourse;
};

// delete course:
const deleteSingleCourseFromDB = async (id: string) => {
  const course = await Course.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );

  if (!course) {
    throw new Error('Course Not Exits with this ID!!!');
  }

  return course;
};

export const CourseServices = {
  createCourseIntoDB,
  getAllCoursesFromDB,
  getSingleCourseFromDB,
  deleteSingleCourseFromDB,
  updateSingleCourseIntoDB,
};
