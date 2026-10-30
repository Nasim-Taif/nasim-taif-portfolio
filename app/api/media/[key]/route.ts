import { downloadImage } from "../../../../lib/storage";

export async function GET(_request: Request, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  if (!/^[a-f0-9-]+\.(jpg|png|webp|gif)$/.test(key)) return new Response("Not found", { status: 404 });
  try {
    const object = await downloadImage(key);
    if (!object.Body) return new Response("Not found", { status: 404 });
    const body = Buffer.from(await object.Body.transformToByteArray());
    return new Response(body, {
      headers: {
        "Content-Type": object.ContentType ?? "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    if (error instanceof Error && error.name === "NoSuchKey") return new Response("Not found", { status: 404 });
    throw error;
  }
}
