"use client";
import {useEffect, useRef} from "react";

/** Full-document navigation keeps route errors and browser history native. */
export default function PageTransitions(){
 const wipe=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const el=wipe.current!;
  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)");
  let navigating=false;
  const timers:ReturnType<typeof setTimeout>[]=[];
  const later=(fn:()=>void,ms:number)=>timers.push(setTimeout(fn,ms));
  function reset(){navigating=false;delete document.documentElement.dataset.pageEntering;el.className="navigation-wipe";el.style.pointerEvents="none";}
  if(document.documentElement.dataset.pageEntering){
   delete document.documentElement.dataset.pageEntering;
   if(!reduced.matches){el.className="navigation-wipe is-revealing";later(reset,750);}else reset();
  }
  function navigate(e:MouseEvent){
   if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||reduced.matches||document.documentElement.dataset.motionPaused==="true")return;
   const link=(e.target instanceof Element?e.target.closest("a[href]"):null) as HTMLAnchorElement|null;
   if(!link||link.hasAttribute("download")||(link.target&&link.target!=="_self"))return;
   const url=new URL(link.href,window.location.href);
   if(url.origin!==location.origin||url.pathname.startsWith("/admin")||location.pathname.startsWith("/admin")||url.pathname.startsWith("/api/")||url.pathname.startsWith("/signin")||(url.pathname===location.pathname&&url.search===location.search))return;
   e.preventDefault();if(navigating)return;navigating=true;
   const title=link.querySelector("h2,h3")?.textContent|| (url.pathname==="/"?"Back to the studio":"Selected work");
   const label=el.querySelector("[data-wipe-title]");if(label)label.textContent=title;
   el.className="navigation-wipe is-covering";el.style.pointerEvents="auto";
   later(()=>{
    try{sessionStorage.setItem("portfolio-navigation","1")}catch{/* Storage may be blocked; outbound motion still works. */}
    location.assign(url.href);
   },420);
   // Recover the current document if the navigation is interrupted or fails.
   later(()=>{try{sessionStorage.removeItem("portfolio-navigation")}catch{}reset()},6000);
  }
  const pageShow=(e:PageTransitionEvent)=>{if(e.persisted)reset()};
  document.addEventListener("click",navigate);
  window.addEventListener("pageshow",pageShow);
  reduced.addEventListener("change",reset);
  return ()=>{timers.forEach(clearTimeout);document.removeEventListener("click",navigate);window.removeEventListener("pageshow",pageShow);reduced.removeEventListener("change",reset)};
 },[]);
 return <div ref={wipe} className="navigation-wipe" aria-hidden="true"><span className="wipe-star">✳</span><span data-wipe-title>Design in motion.</span><small>NASIM TAIF — PORTFOLIO</small></div>;
}
