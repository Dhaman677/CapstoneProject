"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appLogger = exports.httpLogger = void 0;
exports.correlationIdMiddleware = correlationIdMiddleware;
exports.logInfo = logInfo;
exports.logError = logError;
const express_winston_1 = __importDefault(require("express-winston"));
const winston_1 = __importDefault(require("winston"));
const crypto_1 = require("crypto");
function correlationIdMiddleware(req, res, next) {
    const id = req.headers["x-correlation-id"] || (0, crypto_1.randomUUID)();
    res.setHeader("x-correlation-id", id);
    req.correlationId = id;
    next();
}
exports.httpLogger = express_winston_1.default.logger({
    transports: [new winston_1.default.transports.Console()],
    format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.timestamp(), winston_1.default.format.printf(({ timestamp, level, message, meta }) => {
        const id = meta?.req?.headers?.["x-correlation-id"];
        return `[${timestamp}] ${level} (${id ?? "-"}) ${message}`;
    })),
    meta: true,
    msg: "{{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms",
});
// --- Additional helpers for structured app logging ---
exports.appLogger = winston_1.default.createLogger({
    level: "info",
    transports: [new winston_1.default.transports.Console()],
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
});
// Use this in services or controllers instead of console.log()
function logInfo(message, meta = {}) {
    exports.appLogger.info(message, { meta });
}
function logError(message, meta = {}) {
    exports.appLogger.error(message, { meta });
}
