import { Schema, model } from 'mongoose';
import { IUserModel, TUser } from './user.interface';
import bcrypt from 'bcrypt';
import configs from '../../configs';
const UserSchema = new Schema<TUser, IUserModel>(
  {
    id: {
      type: String,
      trim: true,
      required: [true, 'Id is required'],
      unique: true,
    },

    password: {
      type: String,
      trim: true,
      required: [true, 'Password is required'],
    },
    needsPasswordChanged: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: {
        values: ['admin', 'student', 'faculty'],
        message: `{VALUE} can't be role`,
      },
      required: [true, 'Role is required'],
    },
    status: {
      type: String,
      enum: {
        values: ['in-progress', 'blocked'],
        message: `{VALUE}  can't be status`,
      },
      default: 'in-progress',
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

// user static methods created:

// check is user exist ?:
UserSchema.statics.isUserExistsByCustomId = async function (id: string) {
  return await User.findOne({ id });
};

// check is user deleted?:
UserSchema.statics.isUserDeleted = async function (user: TUser) {
  return user?.isDeleted;
};

// check is user Null:
UserSchema.statics.isUserBlocked = async function (user: TUser) {
  return user.status === 'blocked';
};

// compare password :
UserSchema.statics.compareUserPassword = async function (
  plainTextPassword: string,
  hashedPassword: string,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

UserSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(configs.bcrypt_solt_rounds),
  );
  next();
});

UserSchema.post('save', async function (doc, next) {
  doc.password = '';
  next();
});
const User = model<TUser, IUserModel>('User', UserSchema);

export default User;
