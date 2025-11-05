let authDeniedCount = 0;

export function recordAuthDenial(req: any) {
  authDeniedCount++;
  console.log(`[METRIC] Authorization denied (${authDeniedCount} total) for user=${req.user?.id || "anon"} route=${req.path}`);
}

export function getMetrics() {
  return {
    uptime: process.uptime(),
    authDeniedCount,
    memory: process.memoryUsage(),
  };
}
