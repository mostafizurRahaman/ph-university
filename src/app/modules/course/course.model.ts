import { Schema, model } from 'mongoose';
import { ICourse, IPreRequisiteCourse } from './course.interface';

const PreRequisiteCoursesSchema = new Schema<IPreRequisiteCourse>({
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const courseSchema = new Schema<ICourse>({
  title: {
    type: String,
    unique: true,
    trim: true,
    required: true,
  },
  prefix: {
    type: String,
    trim: true,
    required: true,
  },
  code: {
    type: Number,
    trim: true,
    required: true,
  },
  credits: {
    type: Number,
    trim: true,
    required: true,
  },
  preRequisiteCourses: [PreRequisiteCoursesSchema],
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

// check the course is Exists or not before Query;

// remove all deleted course from find:
courseSchema.pre('find', async function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// remove all deleted course form findOne():
courseSchema.pre('findOne', async function (next) {
  this.findOne({ isDeleted: { $ne: true } });
  next();
});

// remove all deleted Courses from aggregation:
courseSchema.pre('aggregate', async function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

const Course = model<ICourse>('Course', courseSchema);

export default Course;
