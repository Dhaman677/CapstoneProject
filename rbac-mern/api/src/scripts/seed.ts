import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcryptjs"; // use bcryptjs
import { UserModel } from "../models/user.model";
import { PostModel } from "../models/post.model";


async function main() {
  await mongoose.connect(process.env.MONGO_URI!);

  await UserModel.deleteMany({});
  await PostModel.deleteMany({});

  const pwd = "Passw0rd!";
  const [admin, editor, viewer] = await Promise.all([
    UserModel.create({
      email: "admin@demo.com",
      passwordHash: await bcrypt.hash(pwd, 10),
      role: "Admin",
    }),
    UserModel.create({
      email: "editor@demo.com",
      passwordHash: await bcrypt.hash(pwd, 10),
      role: "Editor",
    }),
    UserModel.create({
      email: "viewer@demo.com",
      passwordHash: await bcrypt.hash(pwd, 10),
      role: "Viewer",
    }),
  ]);

  await PostModel.insertMany([
    { title: "Admin Post", body: "By Admin", authorId: admin._id },
    { title: "Editor Post", body: "By Editor", authorId: editor._id },
  ]);

  console.log("✅ Seed complete!");
  console.log("Admin:", admin.email);
  console.log("Editor:", editor.email);
  console.log("Viewer:", viewer.email);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
