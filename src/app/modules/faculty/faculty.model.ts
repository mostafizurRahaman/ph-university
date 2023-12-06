import { bloodGroups, genders } from './../user/user.contants';
import { Schema, model } from 'mongoose';
import { TFaculty, IFacultyModel } from './faculty.interface';

const facultySchema = new Schema<TFaculty, IFacultyModel>(
  {
    id: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      firstName: {
        type: String,
        lowercase: true,
        required: true,
      },
      middleName: {
        type: String,
        lowercase: true,
      },
      lastName: {
        type: String,
        lowercase: true,
        required: true,
      },
    },
    user: {
      type: Schema.Types.ObjectId,
      unique: true,
      required: true,
    },
    designation: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: {
        values: [...genders],
        message: "{VALUE} can't be  gender",
      },
      required: true,
    },
    dateOfBirth: {
      type: String,
    },
    bloodGroup: {
      type: String,
      enum: {
        values: bloodGroups,
        message: "{VALUE} can't be bloodGroup",
      },
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    contactNo: {
      type: String,
      required: true,
    },
    emergencyContactNo: {
      type: String,
      required: true,
    },
    presentAddress: {
      type: String,
      required: true,
    },
    permanentAddress: {
      type: String,
      required: true,
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    profileImg: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// write a pre middleware which hide deleted faculties and user:
facultySchema.pre('find', async function (next) {
  this.find({ isDeleted: false });
  next();
});
// remove all deletedItem:
facultySchema.pre('findOne', async function (next) {
  this.find({ isDeleted: false });
  next();
});

// remove all deleted Item on aggregation :
facultySchema.pre('aggregate', async function (next) {
  this.pipeline().unshift({ $match: { isDeleted: false } });
  next();
});

facultySchema.statics.isFacultyExists = async (id: string) => {
  const isExists = await Faculty.findById(id);

  return isExists;
};

const Faculty = model<TFaculty, IFacultyModel>('Faculty', facultySchema);

export default Faculty;
