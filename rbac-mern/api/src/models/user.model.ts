import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  email: string;
  passwordHash: string;            // <-- use passwordHash
  role: "Admin" | "Editor" | "Viewer";
  comparePassword: (plain: string) => Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },  // <-- schema matches
    role: { type: String, enum: ["Admin", "Editor", "Viewer"], required: true },
  },
  { timestamps: true }
);

UserSchema.methods.comparePassword = async function (plain: string) {
  return bcrypt.compare(plain, this.passwordHash);   // <-- compare with passwordHash
};

export const UserModel = mongoose.model<IUser>("User", UserSchema);
