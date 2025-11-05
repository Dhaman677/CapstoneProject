import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
import { RoleValue } from "../config/roles";

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  role: RoleValue;
  comparePassword: (plain: string) => Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["Admin", "Editor", "Viewer"], required: true },
  },
  { timestamps: true }
);

UserSchema.methods.comparePassword = async function (plain: string) {
  return bcrypt.compare(plain, this.passwordHash);
};

export const UserModel = mongoose.model<IUser>("User", UserSchema);
