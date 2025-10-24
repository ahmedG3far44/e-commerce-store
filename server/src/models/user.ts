import mongoose, { Schema, Document } from "mongoose";

enum UserStatus {
  ACTIVE = "active",
  BLOCKED = "blocked",
}

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isAdmin: boolean;
  status: UserStatus;
  addresses: string[];
}

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: Object.values(UserStatus), // ✅ Fix enum usage
      required: true,
      default: UserStatus.ACTIVE,
    },
    addresses: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model<IUser>("User", userSchema);

export default userModel;
