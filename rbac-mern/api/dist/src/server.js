"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const PORT = parseInt(process.env.PORT || "4000", 10);
const MONGO_URI = process.env.MONGO_URI;
async function start() {
    await mongoose_1.default.connect(MONGO_URI);
    console.log("Mongo connected");
    app_1.default.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
}
start().catch((e) => {
    console.error("Startup failed", e);
    process.exit(1);
});
