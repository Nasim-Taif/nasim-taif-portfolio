import { contentSchema, defaultContent } from "../../content";
import { database, loadState, ownerIdentity, sameOrigin, noStore } from "../../store";
export async function GET(){
  if(!await ownerIdentity())return Response.json({error:"Owner sign-in required."},{status:403,headers:noStore});
  return Response.json(await loadState(),{headers:noStore});
}
async function save(request:Request,publish:boolean){
  if(!sameOrigin(request))return Response.json({error:"Invalid request origin."},{status:403});
  const owner=await ownerIdentity();if(!owner)return Response.json({error:"Owner sign-in required."},{status:403});
  const raw=await request.text();if(raw.length>250000)return Response.json({error:"Content is too large."},{status:413});
  let body;try{body=JSON.parse(raw);}catch{return Response.json({error:"Invalid JSON."},{status:400});}
  const parsed=contentSchema.safeParse(body.content);
  if(!parsed.success)return Response.json({error:parsed.error.issues.map(i=>`${i.path.join(".")}: ${i.message}`).join("\n")},{status:400});
  if(!Number.isInteger(body.revision)||body.revision<0)return Response.json({error:"Invalid revision."},{status:400});
  const db=database();const now=new Date().toISOString();
  await db.batch([
    db.prepare("INSERT OR IGNORE INTO portfolio_owner (id,user_id) VALUES (?,?)").bind("owner",owner.userId),
    db.prepare("INSERT OR IGNORE INTO portfolio_content (id,published,draft,revision,updated_at) VALUES (?,?,NULL,0,?)").bind("main",JSON.stringify(defaultContent),now),
  ]);
  const json=JSON.stringify(parsed.data);
  const query=publish?"UPDATE portfolio_content SET published=?,draft=NULL,revision=revision+1,updated_at=? WHERE id='main' AND revision=?":"UPDATE portfolio_content SET draft=?,revision=revision+1,updated_at=? WHERE id='main' AND revision=?";
  const result=await db.prepare(query).bind(json,now,body.revision).run();
  if(!result.meta.changes)return Response.json({error:"This content changed in another session. Export your work, then reload the editor to see the latest version."},{status:409});
  return Response.json({revision:body.revision+1,updatedAt:now,published:publish},{headers:noStore});
}
export const PUT=(r:Request)=>save(r,false);
export const POST=(r:Request)=>save(r,true);
