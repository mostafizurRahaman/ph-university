import { Schema, model } from 'mongoose';
import { UserSchema } from '../student/student.model';
import { bloodGroups, genders } from '../user/user.contants';
import { IAdminModel, TAdmin } from './admin.interface';

const adminSchema = new Schema<TAdmin, IAdminModel>(
  {
    id: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: UserSchema,
      required: true,
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
        message: "{VALUE} can't be gender ",
      },
      required: true,
    },
    dateOfBirth: {
      type: String,
    },
    bloodGroup: {
      type: String,
      enum: {
        values: [...bloodGroups],
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
    profileImg: {
      type: String,
      required: true,
    },
    managementDepartment: {
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

// check is admin exists:
adminSchema.statics.isAdminExists = async (id: string) => {
  const isExists = await Admin.findById(id);
  return isExists;
};

// remove delete item from find query:
adminSchema.pre('find', async function (next) {
  this.find({ isDeleted: false });
  next();
});

// remove delete item from findOne query:
adminSchema.pre('findOne', async function (next) {
  this.findOne({ isDeleted: false });
  next();
});

// remove delete item from aggregation pipeline:
adminSchema.pre('aggregate', async function (next) {
  this.pipeline().unshift({ $match: { isDeleted: false } });
  next();
});

const Admin = model<TAdmin, IAdminModel>('Admin', adminSchema);

export default Admin;
