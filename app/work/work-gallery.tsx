'use client';
import {useEffect,useState} from 'react';
import {ArrowUpRight,LayoutGrid,List} from 'lucide-react';
import type {Content} from '../content';
import {Header,Footer} from '../portfolio';
export default function WorkGallery({content}:{content:Content}){
 const [view,setView]=useState<'list'|'grid'>('list');
 const [category,setCategory]=useState('All work');
 const projects=content.projects.filter(p=>p.published);
 const visible=projects.filter(p=>category==='All work'||p.category===category);
 useEffect(()=>{try{const saved=localStorage.getItem('portfolio-work-view');if(saved==='grid'||saved==='list')setView(saved)}catch{}},[]);
 function changeView(value:'list'|'grid'){setView(value);try{localStorage.setItem('portfolio-work-view',value)}catch{}}
 function track(e:React.PointerEvent<HTMLAnchorElement>){if(e.pointerType!=='mouse'||matchMedia('(prefers-reduced-motion: reduce)').matches||document.documentElement.dataset.motionPaused==='true')return;const r=e.currentTarget.getBoundingClientRect();e.currentTarget.style.setProperty('--hover-x',`${Math.max(140,Math.min(r.width-270,e.clientX-r.left-140))}px`);e.currentTarget.style.setProperty('--tilt',`${((e.clientX-r.left)/r.width-.5)*5}deg`)}
 return <div id="top" className="work-index motion-case"><a className="skip-link" href="#work-main">Skip to projects</a><Header content={content}/><main id="work-main" className="archive-shell"><div className="archive-heading"><span className="studio-kicker">THE WORK / {new Date().getFullYear()}</span><h1>Ideas into<br/><span>experiences.</span><sup>({String(projects.length).padStart(2,'0')})</sup></h1><div className="archive-description"><span>SELECTED PROJECTS</span><p>Interfaces with purpose. A collection of digital experiences and the decisions that shaped them.</p></div></div>
 <div className="archive-toolbar"><div className="archive-filters" role="group" aria-label="Filter projects">{['All work',...new Set(projects.map(p=>p.category))].map(c=><button key={c} aria-pressed={category===c} onClick={()=>setCategory(c)}>{c}<sup>{c==='All work'?projects.length:projects.filter(p=>p.category===c).length}</sup></button>)}</div><div className="view-toggle" role="group" aria-label="Project layout"><button onClick={()=>changeView('list')} aria-label="List view" aria-pressed={view==='list'}><List size={20}/></button><button onClick={()=>changeView('grid')} aria-label="Grid view" aria-pressed={view==='grid'}><LayoutGrid size={18}/></button></div></div>
 <p className="archive-count" role="status">{visible.length} {visible.length===1?'project':'projects'} · {view} view</p>
 <div className={`archive-projects archive-${view}`} key={view+category}>{visible.map((p,i)=><a className="archive-project" href={`/work/${p.id}`} key={p.id} onPointerMove={track} onPointerLeave={e=>{e.currentTarget.style.removeProperty('--hover-x');e.currentTarget.style.removeProperty('--tilt')}}><div className="archive-image"><img src={p.cover||'/images/project-placeholder.svg'} alt={`${p.title} interface preview`} loading={i<2?'eager':'lazy'}/><span className="archive-view">View project <ArrowUpRight size={20}/></span></div><div className="archive-title"><span className="archive-number">{String(i+1).padStart(2,'0')}</span><div><h2>{p.title}</h2><p>{p.subtitle}</p></div></div><div className="archive-meta"><span>{p.category}</span><span>{p.year||'UI/UX DESIGN'}</span></div><ArrowUpRight className="archive-arrow" size={32} strokeWidth={1}/></a>)}</div>{!visible.length&&<p className="archive-empty">New work is on the way.</p>}
 <div className="archive-end"><span>HAVE A PROJECT IN MIND?</span><a href="/#contact">Let’s make it happen. <ArrowUpRight/></a></div></main><Footer content={content}/></div>
}
