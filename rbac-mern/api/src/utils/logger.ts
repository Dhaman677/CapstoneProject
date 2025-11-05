import expressWinston from "express-winston";
import winston from "winston";
import { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";

export function correlationIdMiddleware(req: Request, res: Response, next: NextFunction) {
  const id = req.headers["x-correlation-id"] || randomUUID();
  res.setHeader("x-correlation-id", id);
  (req as any).correlationId = id;
  next();
}

export const httpLogger = expressWinston.logger({
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message, meta }) => {
      const id = (meta as any)?.req?.headers?.["x-correlation-id"];
      return `[${timestamp}] ${level} (${id ?? "-"}) ${message}`;
    })
  ),
  meta: true,
  msg: "{{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms",
});

// --- Additional helpers for structured app logging ---

export const appLogger = winston.createLogger({
  level: "info",
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
});

// Use this in services or controllers instead of console.log()
export function logInfo(message: string, meta: any = {}) {
  appLogger.info(message, { meta });
}

export function logError(message: string, meta: any = {}) {
  appLogger.error(message, { meta });
}
