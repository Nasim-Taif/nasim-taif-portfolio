import { auth } from "../auth";
import { defaultContent, type Content } from "./content";
import { database } from "../db";
export { database };

function upgradeContent(content: Content): Content {
  const profile =
    content.profile.title === "UI/UX Designer"
      ? {
          ...content.profile,
          title: defaultContent.profile.title,
          intro: defaultContent.profile.intro,
          aboutTitle: defaultContent.profile.aboutTitle,
          about: defaultContent.profile.about,
        }
      : content.profile;
  const projects = content.projects.map((project) => {
    if (project.role === "UI/UX Designer") {
      return { ...project, role: defaultContent.projects.find((item) => item.id === project.id)?.role ?? project.role };
    }
    if (project.role === "UI/UX design · Collaborative project") {
      return { ...project, role: "UX Engineer · Product Strategy · Collaborative project" };
    }
    return project;
  });
  if (!projects.some((project) => project.id === "pachok")) {
    const pachok = defaultContent.projects.find((project) => project.id === "pachok");
    const nishchintoIndex = projects.findIndex((project) => project.id === "nishchinto");
    if (pachok) {
      projects.splice(nishchintoIndex < 0 ? 0 : nishchintoIndex + 1, 0, pachok);
    }
  } else {
    const pachok = defaultContent.projects.find((project) => project.id === "pachok");
    const currentPachok = projects.find((project) => project.id === "pachok");
    if (pachok && currentPachok && !currentPachok.cover) {
      Object.assign(currentPachok, { cover: pachok.cover, detailImage: pachok.detailImage, year: pachok.year });
    }
  }
  return {
    ...content,
    profile,
    projects,
    process:
      content.process.map((s) => s.title).join("|") === "Understand|Explore|Design|Refine"
        ? defaultContent.process
        : content.process,
  };
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
  if (!email || email !== process.env.PORTFOLIO_OWNER_EMAIL?.trim().toLowerCase()) return null;

  const sql = database();
  const owner = await sql<{ user_id: string }[]>`SELECT user_id FROM portfolio_owner WHERE id = 'owner'`;
  if (owner[0]) return owner[0].user_id === email ? { userId: email, email } : null;

  const configuredEmail = process.env.PORTFOLIO_OWNER_EMAIL?.trim().toLowerCase();
  return configuredEmail && configuredEmail === email ? { userId: email, email } : null;
}

export function noStore() {
  return { "Cache-Control": "no-store" };
}
