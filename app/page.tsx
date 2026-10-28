import Portfolio from "./portfolio";
import {publishedContent} from "./store";
export const dynamic="force-dynamic";
export async function generateMetadata(){const {profile:p}=await publishedContent();return {title:`${p.name} — ${p.title}`,description:p.intro,openGraph:{title:`${p.name} — ${p.title}`,description:p.intro,type:"website"}};}
export default async function Home(){return <Portfolio content={await publishedContent()}/>;}
