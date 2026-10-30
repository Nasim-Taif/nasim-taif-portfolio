import {ownerIdentity,loadState} from "../store";
import Editor from "./editor";
import { auth } from "../../auth";
import { signIn, signOut } from "../../auth";
export const dynamic="force-dynamic";
export const metadata={title:"Portfolio editor — Nasim Taif",robots:{index:false,follow:false}};
export default async function Admin(){
 const user=await auth();
 if(!user)return <main className="admin-gate"><a className="text-link" href="/">← Back to portfolio</a><span className="eyebrow">YOUR CONTENT, YOUR WAY</span><h1>A little space<br/>for your next chapter.</h1><p>Sign in with the Google account that owns this portfolio to edit your projects, words, and images.</p><form action={async()=>{"use server";await signIn("google",{redirectTo:"/admin"})}}><button className="button dark" type="submit">Sign in to your editor ↗</button></form></main>;
 if(!await ownerIdentity())return <main className="admin-gate"><h1>This is the owner’s workspace.</h1><p>You’re signed in as {user.user?.email}. Use the Google account configured for this portfolio to edit it.</p><form action={async()=>{"use server";await signOut({redirectTo:"/admin"})}}><button className="button dark" type="submit">Switch account</button></form><a className="text-link" href="/">Back to portfolio</a></main>;
 return <Editor initial={await loadState()} email={user.user?.email ?? ""}/>;
}
