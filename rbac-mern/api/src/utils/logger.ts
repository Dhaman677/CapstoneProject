import morgan from "morgan";
import { Request, Response } from "express";
import { randomUUID } from "crypto";

export function correlationIdMiddleware(req: Request, _res: Response, next: any) {
  req.correlationId = (req.headers["x-correlation-id"] as string) || randomUUID();
  next();
}

export const httpLogger = morgan(":method :url :status :res[content-length] - :response-time ms");
