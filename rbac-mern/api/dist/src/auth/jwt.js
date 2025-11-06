"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.REFRESH_COOKIE_NAME = void 0;
exports.signAccessToken = signAccessToken;
exports.verifyAccessToken = verifyAccessToken;
exports.signRefreshToken = signRefreshToken;
exports.verifyRefreshToken = verifyRefreshToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const roles_1 = require("../config/roles");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const ACCESS_TTL_MIN = parseInt(process.env.ACCESS_TTL_MIN || "15", 10);
const REFRESH_TTL_DAYS = parseInt(process.env.REFRESH_TTL_DAYS || "7", 10);
const JWT_SECRET = process.env.JWT_SECRET;
exports.REFRESH_COOKIE_NAME = process.env.REFRESH_COOKIE_NAME || "refresh_token";
function signAccessToken(userId, role) {
    const perms = (0, roles_1.permissionsForRole)(role);
    const payload = { sub: userId, role, perms };
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: `${ACCESS_TTL_MIN}m` });
}
function verifyAccessToken(token) {
    return jsonwebtoken_1.default.verify(token, JWT_SECRET);
}
function signRefreshToken(userId, role) {
    const payload = { sub: userId, role, typ: "refresh" };
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: `${REFRESH_TTL_DAYS}d` });
}
function verifyRefreshToken(token) {
    const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
    if (decoded.typ !== "refresh")
        throw new Error("Invalid token type");
    return decoded;
}
