// api/src/app.ts
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./auth/auth.routes";
import postRoutes from "./modules/posts/post.routes";
import userAdminRoutes from "./modules/users/user.routes";
import { httpLogger, correlationIdMiddleware } from "./utils/logger";

const app = express();

// ---- middleware (order matters) ----
app.use(correlationIdMiddleware);
app.use(httpLogger);
app.use(express.json()); // parse JSON body BEFORE routes
app.use(cookieParser());

const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));

// ---- health ----
app.get("/health", (_req, res) => res.json({ ok: true }));

// ---- routes (mount ONCE) ----
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/admin/users", userAdminRoutes);

export default app;
