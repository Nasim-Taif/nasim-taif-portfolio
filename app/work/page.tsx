import {publishedContent} from '../store';
import WorkGallery from './work-gallery';
export const dynamic='force-dynamic';
export async function generateMetadata(){const c=await publishedContent();return {title:`Selected work — ${c.profile.shortName}`,description:'UI/UX case studies, interfaces, and the thinking behind them.'}}
export default async function Work(){return <WorkGallery content={await publishedContent()}/>}
