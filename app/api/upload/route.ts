import { isSameOrigin } from "../../../lib/request-origin";
import { ownerIdentity } from "../../store";
import { uploadImage } from "../../../lib/storage";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return Response.json({ error: "Same-origin request required." }, { status: 403 });
  if (!(await ownerIdentity())) return Response.json({ error: "Owner sign-in required." }, { status: 403 });
  if (Number(request.headers.get("content-length") ?? 0) > 9 * 1024 * 1024) return Response.json({ error: "Images must be smaller than 8 MB." }, { status: 413 });
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File) || file.size > 8 * 1024 * 1024 || !file.size) return Response.json({ error: "Choose an image smaller than 8 MB." }, { status: 400 });
  const bytes = new Uint8Array(await file.arrayBuffer());
  const head = String.fromCharCode(...bytes.slice(0, 12));
  const format = bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255 ? { ext: "jpg", type: "image/jpeg" }
    : bytes[0] === 137 && head.slice(1, 4) === "PNG" ? { ext: "png", type: "image/png" }
    : head.startsWith("RIFF") && head.slice(8, 12) === "WEBP" ? { ext: "webp", type: "image/webp" }
    : head.startsWith("GIF8") ? { ext: "gif", type: "image/gif" } : null;
  if (!format) return Response.json({ error: "Use a JPG, PNG, WebP, or GIF image." }, { status: 400 });
  const key = `${crypto.randomUUID()}.${format.ext}`;
  await uploadImage(key, bytes, format.type);
  return Response.json({ url: `/api/media/${key}` }, { headers: { "Cache-Control": "no-store" } });
}
