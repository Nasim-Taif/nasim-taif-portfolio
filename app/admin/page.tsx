import {getChatGPTUser,chatGPTSignInPath,chatGPTSignOutPath} from "../chatgpt-auth";
import {ownerIdentity,loadState} from "../store";
import Editor from "./editor";
export const dynamic="force-dynamic";
export const metadata={title:"Portfolio editor — Nasim Taif",robots:{index:false,follow:false}};
export default async function Admin(){
 const user=await getChatGPTUser();
 if(!user)return <main className="admin-gate"><a className="text-link" href="/">← Back to portfolio</a><span className="eyebrow">YOUR CONTENT, YOUR WAY</span><h1>A little space<br/>for your next chapter.</h1><p>Sign in with the ChatGPT account that owns this portfolio to edit your projects, words, and images.</p><a className="button dark" href={chatGPTSignInPath("/admin")} target="_top">Sign in to your editor ↗</a></main>;
 if(!await ownerIdentity())return <main className="admin-gate"><h1>This is the owner’s workspace.</h1><p>You’re signed in as {user.email}. Use the ChatGPT account that created this portfolio to edit it.</p><a className="button dark" href={chatGPTSignOutPath("/admin")} target="_top">Switch account</a><a className="text-link" href="/">Back to portfolio</a></main>;
 return <Editor initial={await loadState()} email={user.email}/>;
}
