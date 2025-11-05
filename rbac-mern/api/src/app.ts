import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./auth/auth.routes";
import postRoutes from "./modules/posts/post.routes";
import { httpLogger, correlationIdMiddleware } from "./utils/logger";

const app = express();

app.use(correlationIdMiddleware);
app.use(httpLogger);
app.use(express.json());
app.use(cookieParser());

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
