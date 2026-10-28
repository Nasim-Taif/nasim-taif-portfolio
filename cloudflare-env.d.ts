declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    BUCKET?: R2Bucket;
    PORTFOLIO_OWNER_EMAIL?: string;
  }
}
