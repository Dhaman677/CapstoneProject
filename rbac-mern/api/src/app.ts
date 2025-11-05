import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./auth/auth.routes";
import postRoutes from "./modules/posts/post.routes";
import { httpLogger, correlationIdMiddleware } from "./utils/logger";
import userAdminRoutes from "./modules/users/user.routes";

const app = express();

app.use("/admin/users", userAdminRoutes);
app.use(correlationIdMiddleware);
app.use(httpLogger);
app.use(express.json());
app.use(cookieParser());
app.use("/admin/users", userAdminRoutes);

const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/auth", authRoutes);
app.use("/posts", postRoutes);

app.use((err: any, _req: express.Request, res: express.Response, _next: any) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

export default app;
