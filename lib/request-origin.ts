/** Reject cross-site cookie-authenticated writes. Use AUTH_URL behind Render's proxy. */
export function isSameOrigin(request: Request, appUrl = process.env.AUTH_URL): boolean {
  const origin = request.headers.get("origin");
  if (!origin || request.headers.get("sec-fetch-site") === "cross-site") return false;
  try {
    return new URL(origin).origin === new URL(appUrl || request.url).origin;
  } catch { return false; }
}
