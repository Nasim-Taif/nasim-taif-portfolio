import { contentSchema, defaultContent } from "../../content";
import { database, loadState, ownerIdentity, noStore } from "../../store";

export async function GET() {
  if (!(await ownerIdentity())) return Response.json({ error: "Owner sign-in required." }, { status: 403, headers: noStore() });
  return Response.json(await loadState(), { headers: noStore() });
}

async function save(request: Request, publish: boolean) {
  const owner = await ownerIdentity();
  if (!owner) return Response.json({ error: "Owner sign-in required." }, { status: 403 });
  const raw = await request.text();
  if (raw.length > 250000) return Response.json({ error: "Content is too large." }, { status: 413 });
  let body: { content?: unknown; revision?: unknown };
  try { body = JSON.parse(raw) as typeof body; } catch { return Response.json({ error: "Invalid JSON." }, { status: 400 }); }
  const parsed = contentSchema.safeParse(body.content);
  if (!parsed.success) return Response.json({ error: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("\n") }, { status: 400 });
  if (!Number.isInteger(body.revision) || (body.revision as number) < 0) return Response.json({ error: "Invalid revision." }, { status: 400 });

  const sql = database();
  const now = new Date().toISOString();
  await sql`INSERT INTO portfolio_owner (id, user_id) VALUES ('owner', ${owner.userId}) ON CONFLICT (id) DO NOTHING`;
  await sql`INSERT INTO portfolio_content (id, published, draft, revision, updated_at) VALUES ('main', ${JSON.stringify(defaultContent)}, NULL, 0, ${now}) ON CONFLICT (id) DO NOTHING`;
  const json = JSON.stringify(parsed.data);
  const result = publish
    ? await sql`UPDATE portfolio_content SET published = ${json}, draft = NULL, revision = revision + 1, updated_at = ${now} WHERE id = 'main' AND revision = ${body.revision as number}`
    : await sql`UPDATE portfolio_content SET draft = ${json}, revision = revision + 1, updated_at = ${now} WHERE id = 'main' AND revision = ${body.revision as number}`;
  if (result.count !== 1) return Response.json({ error: "This content changed in another session. Export your work, then reload the editor to see the latest version." }, { status: 409 });
  return Response.json({ revision: (body.revision as number) + 1, updatedAt: now, published: publish }, { headers: noStore() });
}

export const PUT = (request: Request) => save(request, false);
export const POST = (request: Request) => save(request, true);
