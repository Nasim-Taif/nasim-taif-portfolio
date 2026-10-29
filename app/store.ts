import { env } from "cloudflare:workers";
import { defaultContent, type Content } from "./content";
import { getChatGPTUser } from "./chatgpt-auth";
export function database(){if(!env.DB)throw new Error("Content storage is unavailable.");return env.DB;}
function upgradeContent(content:Content):Content {
 if(content.process.map(s=>s.title).join("|")==="Understand|Explore|Design|Refine") return {...content,process:defaultContent.process};
 return content;
}
export async function loadState(){
  const row=await database().prepare("SELECT * FROM portfolio_content WHERE id = ?").bind("main").first<{published:string;draft:string|null;revision:number;updated_at:string}>();
  return {published:row?upgradeContent(JSON.parse(row.published) as Content):defaultContent,draft:row?.draft?upgradeContent(JSON.parse(row.draft) as Content):null,revision:row?.revision??0,updatedAt:row?.updated_at??null};
}
export async function publishedContent(){return (await loadState()).published;}
export async function ownerIdentity(){
  const user=await getChatGPTUser();if(!user)return null;
  const owner=await database().prepare("SELECT user_id FROM portfolio_owner WHERE id = ?").bind("owner").first<{user_id:string}>();
  if(owner)return owner.user_id===user.userId?user:null;
  const email=env.PORTFOLIO_OWNER_EMAIL?.trim().toLowerCase();
  return email && user.email.toLowerCase()===email?user:null;
}
export function sameOrigin(request:Request){
  const origin=request.headers.get("origin");
  return !!origin && origin===new URL(request.url).origin && request.headers.get("sec-fetch-site")!=="cross-site";
}
export const noStore={"Cache-Control":"no-store"};
