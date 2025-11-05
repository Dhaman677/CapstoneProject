// api/src/app.ts
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./auth/auth.routes";
import postRoutes from "./modules/posts/post.routes";
import userAdminRoutes from "./modules/users/user.routes";
import { httpLogger, correlationIdMiddleware } from "./utils/logger";
import rateLimit from "express-rate-limit";

const app = express();

// ---- middleware (order matters) ----
app.use(correlationIdMiddleware);
app.use(httpLogger);
app.use(express.json()); // parse JSON body BEFORE routes
app.use(cookieParser());

const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10, // max 10 requests per IP per window
  message: { error: "Too many requests, please try again later." },
});

const generalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 100, // limit per IP
  message: { error: "Rate limit exceeded." },
});

// ---- health ----
app.get("/health", (_req, res) => res.json({ ok: true }));

// ---- routes (mount ONCE) ----
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/admin/users", userAdminRoutes);

app.use("/auth", authLimiter);// apply stricter limit to auth endpoints
app.use(generalLimiter); // general API limit

export default app;
