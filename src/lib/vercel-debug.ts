import "server-only";

interface DebugPayload {
  event: string;
  region: string | null;
  deploymentId: string | null;
  environment: string | null;
  data?: Record<string, unknown>;
}

function isVercelCacheDebugEnabled(): boolean {
  return process.env.VERCEL === "1" && process.env.SWAG_DEBUG_CACHE === "1";
}

export function logVercelCacheDebug(
  event: string,
  data?: Record<string, unknown>
): void {
  if (!isVercelCacheDebugEnabled()) return;

  const payload: DebugPayload = {
    event,
    region: process.env.VERCEL_REGION ?? null,
    deploymentId: process.env.VERCEL_DEPLOYMENT_ID ?? null,
    environment: process.env.VERCEL_ENV ?? null,
    data,
  };

  console.log(`[swag-cache-debug] ${JSON.stringify(payload)}`);
}
