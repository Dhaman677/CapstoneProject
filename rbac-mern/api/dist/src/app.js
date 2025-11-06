"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// api/src/app.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_routes_1 = __importDefault(require("./auth/auth.routes"));
const post_routes_1 = __importDefault(require("./modules/posts/post.routes"));
const user_routes_1 = __importDefault(require("./modules/users/user.routes"));
const logger_1 = require("./utils/logger");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const metrics_1 = require("./middleware/metrics");
const app = (0, express_1.default)();
// ---- middleware (order matters) ----
app.use(logger_1.correlationIdMiddleware);
app.use(logger_1.httpLogger);
app.use(express_1.default.json()); // parse JSON body BEFORE routes
app.use((0, cookie_parser_1.default)());
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";
app.use((0, cors_1.default)({ origin: CORS_ORIGIN, credentials: true }));
const authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 10, // max 10 requests per IP per window
    message: { error: "Too many requests, please try again later." },
});
const generalLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000, // 1 minute
    limit: 100, // limit per IP
    message: { error: "Rate limit exceeded." },
});
// ---- health ----
app.get("/health", (_req, res) => res.json({ ok: true }));
// ---- routes (mount ONCE) ----
app.use("/auth", auth_routes_1.default);
app.use("/posts", post_routes_1.default);
app.use("/admin/users", user_routes_1.default);
app.use("/auth", authLimiter); // apply stricter limit to auth endpoints
app.use(generalLimiter); // general API limit
app.get("/metrics", (_req, res) => {
    res.json((0, metrics_1.getMetrics)());
});
exports.default = app;
