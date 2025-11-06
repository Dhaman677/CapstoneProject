"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validate_1 = require("../middleware/validate");
const auth_validation_1 = require("../validation/auth.validation");
const user_model_1 = require("../models/user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("./jwt"); // if using refresh
const router = (0, express_1.Router)();
router.post("/register", (0, validate_1.validate)(auth_validation_1.registerSchema), async (req, res) => {
    const { email, password, role } = req.body;
    const exists = await user_model_1.UserModel.findOne({ email });
    if (exists)
        return res.status(400).json({ error: "User already exists" });
    const passwordHash = await bcryptjs_1.default.hash(password, 10); // <-- hash to passwordHash
    const user = await user_model_1.UserModel.create({ email, passwordHash, role: role || "Viewer" });
    return res.status(201).json({ id: user._id, email: user.email, role: user.role });
});
router.post("/login", (0, validate_1.validate)(auth_validation_1.loginSchema), async (req, res) => {
    const { email, password } = req.body;
    const user = await user_model_1.UserModel.findOne({ email });
    if (!user)
        return res.status(401).json({ error: "Invalid email or password" });
    const ok = await user.comparePassword(password); // <-- use method
    if (!ok)
        return res.status(401).json({ error: "Invalid email or password" });
    const accessToken = (0, jwt_1.signAccessToken)(user.id, user.role);
    // (optional) also set refresh cookie if you implemented refresh:
    // const refreshToken = signRefreshToken(user.id, user.role);
    // res.cookie(REFRESH_COOKIE_NAME, refreshToken, { httpOnly: true, sameSite: "lax", secure: false, path: "/auth" });
    return res.json({ accessToken });
});
exports.default = router;
