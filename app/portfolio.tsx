"use client";
import {useEffect,useState,useRef} from "react";
import {ArrowUpRight,ArrowDown,ArrowRight,Menu,X,Check,Copy,Globe} from "lucide-react";
import DesignProcess from "./design-process";
import type {Content} from "./content";
export function Brand({name="Nasim Taif",title="UI/UX Designer"}:{name?:string;title?:string}){return <a className="brand" href="/" aria-label={`${name} home`}><span className="name-logo"><span className="logo-name">MD. NASIM TAIF<span className="logo-star" aria-hidden="true">✳</span></span><small>UI/UX DESIGNER</small></span></a>;}
export function Header({content}:{content:Content}){const [open,setOpen]=useState(false);return <header className="site-header"><div className="container nav-inner"><Brand name={content.profile.shortName} title={content.profile.title}/><nav aria-label="Main navigation" className={open?"nav-links is-open":"nav-links"}><a href="/work" onClick={()=>setOpen(false)}>Work</a><a href="/about" onClick={()=>setOpen(false)}>About</a><a href="/#process" onClick={()=>setOpen(false)}>Approach</a><a className="nav-contact" href="/contact" onClick={()=>setOpen(false)}>Let’s talk <ArrowUpRight size={16}/></a></nav><button className="menu-toggle icon-btn" onClick={()=>setOpen(!open)} aria-label={open?"Close navigation":"Open navigation"} aria-expanded={open}>{open?<X/>:<Menu/>}</button></div></header>;}
export function Footer({content}:{content:Content}){return <footer className="site-footer container"><div><Brand name={content.profile.shortName} title={content.profile.title}/><p>Thoughtfully designed. Made to connect.</p></div><div className="footer-right"><a href="/admin">Portfolio editor <ArrowUpRight size={13}/></a><span>© {new Date().getFullYear()} {content.profile.name}</span><a href="#top">Back to top ↑</a></div></footer>;}
export default function Portfolio({content,preview=false}:{content:Content;preview?:boolean}){
 const p=content.profile;
 const hero=useRef<HTMLElement>(null);
 const [motionPaused,setMotionPaused]=useState(false);
 useEffect(()=>{setMotionPaused(document.documentElement.dataset.motionPaused==="true")},[]);
 function toggleMotion(){const next=!motionPaused;setMotionPaused(next);document.documentElement.dataset.motionPaused=String(next);try{sessionStorage.setItem("portfolio-motion-paused",String(next))}catch{}resetHero()}
 function moveHero(e:React.PointerEvent<HTMLElement>){
  if(e.pointerType!=="mouse"||motionPaused||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  const r=e.currentTarget.getBoundingClientRect(), x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
  e.currentTarget.style.setProperty("--hero-x",String(x));e.currentTarget.style.setProperty("--hero-y",String(y));
 }
 function resetHero(){hero.current?.style.setProperty("--hero-x","0");hero.current?.style.setProperty("--hero-y","0")}
 function movePreview(e:React.PointerEvent<HTMLAnchorElement>){
  if(e.pointerType!=="mouse"||motionPaused||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  const r=e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--preview-x",Math.min(r.width-310,Math.max(120,e.clientX-r.left-150))+"px");
  e.currentTarget.style.setProperty("--preview-y",((e.clientY-r.top-r.height/2)*.2)+"px");
 }
 const portrait=p.portrait==="/images/nasim.jpg"?"/images/nasim-hero.png":p.portrait;
 const [filter,setFilter]=useState("All work");
 const [open,setOpen]=useState(false);
 const [scrolled,setScrolled]=useState(false);
 useEffect(()=>{const update=()=>setScrolled(window.scrollY>180);update();window.addEventListener("scroll",update,{passive:true});return ()=>window.removeEventListener("scroll",update)},[]);
 const [copied,setCopied]=useState(false);
 const projects=content.projects.filter(x=>x.published);
 useEffect(()=>{
  const media=window.matchMedia("(prefers-reduced-motion: reduce)");
  if(media.matches)return;
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("seen");observer.unobserve(e.target)}}),{threshold:.08});
  document.querySelectorAll(".motion-site .reveal").forEach(el=>observer.observe(el));
  return ()=>observer.disconnect();
 },[filter]);
 useEffect(()=>{if(!open)return;const close=(e:KeyboardEvent)=>{if(e.key==="Escape")setOpen(false)};window.addEventListener("keydown",close);return ()=>window.removeEventListener("keydown",close)},[open]);
 useEffect(()=>{if(!copied)return;const t=setTimeout(()=>setCopied(false),2500);return ()=>clearTimeout(t)},[copied]);
 function magnet(e:React.PointerEvent<HTMLElement>){if(e.pointerType!=="mouse"||motionPaused||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;const r=e.currentTarget.getBoundingClientRect();e.currentTarget.style.translate=`${(e.clientX-r.left-r.width/2)*.18}px ${(e.clientY-r.top-r.height/2)*.18}px`;}
 return <div id="top" className={`motion-site ${preview?"motion-preview":""} ${motionPaused?"motion-paused":""}`}>
 <a className="skip-link" href="#main">Skip to content</a>
 <header className="motion-header"><a href="/" className="motion-brand"><span className="name-logo"><span className="logo-name">MD. NASIM TAIF<span className="logo-star" aria-hidden="true">✳</span></span><small>UI/UX DESIGNER</small></span></a><nav aria-label="Main navigation"><a href="/work">Work</a><a href="/about">About</a><a href="/contact">Contact <ArrowUpRight size={15}/></a></nav><button className="motion-menu" aria-label={open?"Close menu":"Open menu"} aria-expanded={open} aria-controls="motion-navigation" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button></header>
 {open&&!scrolled&&<nav id="motion-navigation" className="motion-drawer" aria-label="Mobile navigation">{["Work","About","Process","Contact"].map(x=><a key={x} href={x==="Process"?"/#process":`/${x.toLowerCase()}`} onClick={()=>setOpen(false)}>{x}<ArrowUpRight/></a>)}</nav>}
 {scrolled&&<div className="scroll-navigation"><button aria-label={open?"Close navigation":"Open navigation"} aria-expanded={open} aria-controls="scroll-nav-links" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button>{open&&<nav id="scroll-nav-links" aria-label="Scroll navigation">{["Home","Work","About","Contact"].map(label=><a key={label} href={label==="Home"?"/":`/${label.toLowerCase()}`} onClick={()=>setOpen(false)}>{label}<ArrowUpRight size={18}/></a>)}</nav>}</div>}
 <main id="main">
 <section ref={hero} className="studio-hero" onPointerMove={moveHero} onPointerLeave={resetHero}>
 <div className="studio-copy"><div className="studio-kicker"><span className="studio-status"/> {p.availability}</div><h1>{p.headline}</h1><p className="studio-subhead">{p.headlineAccent}</p><p className="studio-description">{p.intro}</p><a className="studio-cta" href="/work" onPointerMove={magnet} onPointerLeave={e=>e.currentTarget.style.translate="0 0"}>Explore selected work <ArrowUpRight size={23}/></a><div className="studio-bottom"><span>{p.certification}</span><span>{p.location}</span></div></div>
 <div className="studio-visual"><span className="studio-orbit" aria-hidden="true">✳</span><span className="studio-vertical">INDEPENDENT DESIGNER — OPEN TO COLLABORATE</span><div className="studio-photo"><img src={portrait||"/images/nasim-hero.png"} alt={p.name} fetchPriority="high"/></div><a className="studio-id" href="/about" aria-label="About MD. NASIM TAIF"><span>HELLO, I’M</span><strong>MD. NASIM TAIF</strong><span>{p.title} <ArrowUpRight size={16}/></span></a><button className="studio-motion" aria-pressed={motionPaused} onClick={toggleMotion}>{motionPaused?"Play motion ↗":"Pause motion Ⅱ"}</button></div>
 </section>
 <section className="motion-work motion-container" id="work"><div className="work-heading"><span className="motion-label">02 / SELECTED WORK ({String(projects.length).padStart(2,"0")})</span><span>STRATEGY → EXPERIENCE → INTERFACE</span></div><div className="motion-filters" role="group" aria-label="Filter projects">{["All work",...Array.from(new Set(projects.map(x=>x.category)))].map(f=><button key={f} aria-pressed={filter===f} onClick={()=>setFilter(f)}>{f}</button>)}</div><div aria-live="polite">{projects.filter(x=>filter==="All work"||x.category===filter).map((project,i)=><a href={`/work/${project.id}`} className="work-row reveal" key={project.id} onPointerMove={movePreview} onPointerLeave={e=>{e.currentTarget.style.removeProperty("--preview-x");e.currentTarget.style.removeProperty("--preview-y")}}><div className="work-row-title"><span className="work-number">{String(i+1).padStart(2,"0")}</span><div><h3>{project.title}</h3><p>{project.subtitle}</p></div></div><div className="work-row-preview"><img src={project.cover||"/images/project-placeholder.svg"} alt={`${project.title} interface preview`} loading="lazy"/><span>VIEW CASE <ArrowUpRight size={16}/></span></div><span className="work-category">{project.category}</span><ArrowUpRight className="row-arrow" strokeWidth={1} size={36}/></a>)}</div><a className="outline-pill" href="/work">Explore all projects <ArrowUpRight size={17}/></a></section>
 <section className="project-ribbon" aria-label="Project previews">{projects.map(x=><a key={x.id} href={`/work/${x.id}`}><img src={x.cover||"/images/project-placeholder.svg"} alt={x.title} loading="lazy"/><span>{x.title} <ArrowUpRight size={18}/></span></a>)}</section>
 <section className="motion-story motion-container" id="story"><div className="reveal"><span className="motion-label">03 / THE PERSON BEHIND THE PIXELS</span><h2>{p.aboutTitle}</h2></div><div className="story-copy reveal">{p.about.split(/\n\n/).map((s,i)=><p key={i}>{s}</p>)}<div className="motion-credential"><span>EDUCATION</span><strong>{p.education}</strong><p>{p.institution}</p></div><div className="motion-credential"><span>CERTIFICATION</span><strong>{p.certification}</strong></div><a className="motion-text-link" href={content.socials.find(x=>x.label==="LinkedIn")?.url} target="_blank" rel="noopener noreferrer">My journey on LinkedIn <ArrowUpRight size={18}/></a></div></section>
 <section className="motion-services motion-container"><span className="motion-label">HOW I CAN HELP</span><div>{content.services.map((s,i)=><article className="reveal" key={i}><span>0{i+1}</span><h3>{s.title}</h3><p>{s.description}</p></article>)}</div></section>
 <DesignProcess steps={content.process}/>
 <section className="motion-contact" id="contact"><div className="motion-container"><span className="motion-label">{p.contactTitle}</span><div className="contact-display reveal"><h2>Let’s work<br/><span>together.</span></h2><ArrowUpRight size={70} strokeWidth={1}/></div><div className="contact-rule"><a className="round-button blue" href={`mailto:${p.email}`} onPointerMove={magnet} onPointerLeave={e=>e.currentTarget.style.translate="0 0"}>Get in touch <ArrowUpRight size={19}/></a></div><p className="motion-contact-copy">{p.contactDescription}</p><div className="motion-contact-links"><a className="outline-pill" href={`mailto:${p.email}`}>{p.email}</a><a className="outline-pill" href={`tel:${p.phone.replace(/[^+\d]/g,"")}`}>{p.phone}</a><button className="copy-email" onClick={async()=>{try{await navigator.clipboard.writeText(p.email);setCopied(true)}catch{window.location.href=`mailto:${p.email}`}}}>{copied?<Check size={18}/>:<Copy size={18}/>}<span role="status">{copied?"Copied!":"Copy email"}</span></button></div><footer className="motion-footer"><div><span className="motion-label">VERSION</span><p>{new Date().getFullYear()} © {p.shortName}</p><a href="/admin">Edit portfolio ↗</a></div><div><span className="motion-label">ELSEWHERE</span><div className="motion-socials">{content.socials.map(s=><a href={s.url} key={s.label} target="_blank" rel="noopener noreferrer">{s.label} ↗</a>)}</div></div><a className="back-top" href="#top" aria-label="Back to top">↑</a></footer></div></section>
 </main></div>;
}
