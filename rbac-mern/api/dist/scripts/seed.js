"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = require("../models/user.model");
const post_model_1 = require("../models/post.model");
async function main() {
    await mongoose_1.default.connect(process.env.MONGO_URI);
    await user_model_1.UserModel.deleteMany({});
    await post_model_1.PostModel.deleteMany({});
    const pwd = "Passw0rd!";
    const [admin, editor, viewer] = await Promise.all([
        user_model_1.UserModel.create({ email: "admin@demo.com", passwordHash: await bcryptjs_1.default.hash(pwd, 10), role: "Admin" }),
        user_model_1.UserModel.create({ email: "editor@demo.com", passwordHash: await bcryptjs_1.default.hash(pwd, 10), role: "Editor" }),
        user_model_1.UserModel.create({ email: "viewer@demo.com", passwordHash: await bcryptjs_1.default.hash(pwd, 10), role: "Viewer" }),
    ]);
    await post_model_1.PostModel.insertMany([
        { title: "Admin Post", body: "By Admin", authorId: admin._id },
        { title: "Editor Post", body: "By Editor", authorId: editor._id },
    ]);
    console.log("✅ Seed complete!");
    await mongoose_1.default.disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
