"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordAuthDenial = recordAuthDenial;
exports.getMetrics = getMetrics;
let authDeniedCount = 0;
function recordAuthDenial(req) {
    authDeniedCount++;
    console.log(`[METRIC] Authorization denied (${authDeniedCount} total) for user=${req.user?.id || "anon"} route=${req.path}`);
}
function getMetrics() {
    return {
        uptime: process.uptime(),
        authDeniedCount,
        memory: process.memoryUsage(),
    };
}
