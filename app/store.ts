import { auth } from "../auth";
import { defaultContent, type Content } from "./content";
import { database } from "../db";
export { database };

function upgradeContent(content: Content): Content {
  if (content.process.map((s) => s.title).join("|") === "Understand|Explore|Design|Refine") {
    return { ...content, process: defaultContent.process };
  }
  return content;
}

export async function loadState() {
  if (!process.env.DATABASE_URL) {
    return {
      published: defaultContent,
      draft: null,
      revision: 0,
      updatedAt: null,
    };
  }
  const sql = database();
  const rows = await sql<{
    published: string;
    draft: string | null;
    revision: number;
    updated_at: string;
  }[]>`SELECT published, draft, revision, updated_at FROM portfolio_content WHERE id = 'main'`;
  const row = rows[0];
  return {
    published: row ? upgradeContent(JSON.parse(row.published) as Content) : defaultContent,
    draft: row?.draft ? upgradeContent(JSON.parse(row.draft) as Content) : null,
    revision: row?.revision ?? 0,
    updatedAt: row?.updated_at ?? null,
  };
}

export async function publishedContent() {
  return (await loadState()).published;
}

export async function ownerIdentity() {
  if (!process.env.DATABASE_URL) return null;
  const session = await auth();
  const email = session?.user?.email?.trim().toLowerCase();
  if (!email) return null;

  const sql = database();
  const owner = await sql<{ user_id: string }[]>`SELECT user_id FROM portfolio_owner WHERE id = 'owner'`;
  if (owner[0]) return owner[0].user_id === email ? { userId: email, email } : null;

  const configuredEmail = process.env.PORTFOLIO_OWNER_EMAIL?.trim().toLowerCase();
  return configuredEmail && configuredEmail === email ? { userId: email, email } : null;
}

export function noStore() {
  return { "Cache-Control": "no-store" };
}
