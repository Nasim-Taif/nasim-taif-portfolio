import { z } from "zod";

const short = z.string().trim().min(1).max(200);
const url = z.string().max(2000).refine(v => { try { const u = new URL(v); return u.protocol === "https:" && !u.username && !u.password; } catch { return false; } }, "Use a complete HTTPS link.");
const image = z.string().max(2000).refine(v => !v || /^\/(images|api\/media)\/[a-zA-Z0-9._-]+$/.test(v) || (()=>{try{return new URL(v).protocol === "https:"}catch{return false}})(), "Use an HTTPS image link or upload an image.");
export const projectSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(80),
  title: short, subtitle: short, category: z.enum(["Web & mobile", "Mobile app", "Website"]),
  description: z.string().trim().min(1).max(3000),
  role: short, tools: z.string().max(300), year: z.string().max(20),
  cover: image, detailImage: image, behance: url, tags: z.array(short).max(8),
  focus: z.array(z.object({title:short, description:z.string().max(1200)})).max(8),
  published: z.boolean(),
});
export const contentSchema = z.object({
  profile: z.object({
    name: short, shortName: short, title: short, location: short,
    headline: short, headlineAccent: short, intro: z.string().min(1).max(1000),
    aboutTitle: short, about: z.string().min(1).max(2500),
    availability: short, available: z.boolean(), portrait:image,
    email:z.string().email().max(254), phone:z.string().regex(/^\+?[\d ()-]{7,25}$/),
    education:short, institution:short, certification:short, additionalCertifications:z.string().max(2000).default("Complete Product Design Bootcamp — ZTM"),
    contactTitle:short, contactDescription:z.string().max(600),
  }),
  projects:z.array(projectSchema).max(40).refine(p=>new Set(p.map(x=>x.id)).size===p.length,"Project slugs must be unique."),
  services:z.array(z.object({title:short,description:z.string().max(600)})).max(8),
  process:z.array(z.object({title:short,description:z.string().max(600)})).max(8),
  socials:z.array(z.object({label:short,url})).max(15),
});
export type Content = z.infer<typeof contentSchema>;
export type Project = z.infer<typeof projectSchema>;
export const defaultContent:Content = {
  profile:{
    name:"Md. Nasim Taif",shortName:"Nasim Taif",title:"UI/UX Designer",location:"Dhaka, Bangladesh",
    headline:"Thoughtful design.",headlineAccent:"Meaningful experiences.",
    intro:"I’m Nasim, a Google-certified UI/UX designer turning complex ideas into clear, intuitive digital experiences for people.",
    aboutTitle:"A designer’s curiosity. An engineer’s mindset.",
    about:"I’m a professional UI/UX designer and a BSc in Computer Science & Engineering graduate from North South University. My technical foundation helps me connect thoughtful design with how digital products actually work.\n\nFrom understanding people’s needs to refining the smallest interaction, I care about making websites and apps feel clear, useful, and considered.",
    availability:"Available for freelance & full-time",available:true,portrait:"/images/nasim.jpg",
    email:"mdnasimtaif@gmail.com",phone:"+8801410008914",education:"BSc in Computer Science & Engineering",institution:"North South University",certification:"Google-certified UX Designer",additionalCertifications:"Complete Product Design Bootcamp — ZTM",
    contactTitle:"Have something in mind?",contactDescription:"Let’s turn your idea into an experience people love to use. Reach out for a project, a collaboration, or just a conversation.",
  },
  projects:[
    {id:"nishchinto",title:"Nishchinto",subtitle:"A little more confidence in every purchase.",category:"Web & mobile",description:"An e-commerce app and website designed to make online shopping in Bangladesh clearer and more reassuring. Nishchinto brings pricing, delivery, warranty, and return information into the shopping journey, helping people make informed decisions.",role:"UI/UX Designer",tools:"Figma, Photoshop, Illustrator",year:"2026",cover:"/images/nishchinto.jpg",detailImage:"/images/nishchinto-detail.jpg",behance:"https://www.behance.net/gallery/257455743/Nishchinto-E-commerce-App-Website-UIUX-Case-Study",tags:["E-commerce","UX research","Design system"],published:true,focus:[{title:"Clarity before checkout",description:"Delivered-price budgeting and purchase clarity cards bring the details that matter closer to the decision."},{title:"Support after purchase",description:"Order tracking, return progress, and a warranty organizer keep important information within reach."},{title:"One connected experience",description:"Mobile and desktop interfaces share a Figma design system with Bangla typography, responsive grids, and consistent components."}]},
    {id:"turfgo",title:"TurfGo",subtitle:"Bringing the next game closer.",category:"Mobile app",description:"A mobile app design project exploring smart turf booking and management. View the complete project on Behance for the interface designs and the thinking behind the experience.",role:"UI/UX Designer",tools:"Figma",year:"",cover:"/images/turfgo.png",detailImage:"",behance:"https://www.behance.net/gallery/256361555/TurfGo-Smart-Turf-Booking-Management-Mobile-App",tags:["Sports","Booking experience","Mobile UI"],published:true,focus:[]},
    {id:"rentaca",title:"RENTACA",subtitle:"A clearer road from browsing to booking.",category:"Website",description:"A car rental website design and UI/UX case study. Explore the complete collaborative project on Behance to see the full design presentation.",role:"UI/UX design · Collaborative project",tools:"Figma",year:"",cover:"/images/rentaca.jpg",detailImage:"",behance:"https://www.behance.net/gallery/244438513/RENTACA-Car-Rental-Web-Design-UIUX-Case-Study",tags:["Car rental","Web design","Case study"],published:true,focus:[]},
  ],
  services:[{title:"User experience",description:"Research, user flows, and thoughtful structure that help people find their way."},{title:"Interface design",description:"Clear, expressive interfaces for websites and mobile apps, down to the smallest detail."},{title:"Prototypes & systems",description:"Interactive prototypes and reusable components that keep an experience consistent."}],
  process:[{title:"Understand",description:"Start with the people, the problem, and the context. Ask the questions that uncover what matters."},{title:"Explore",description:"Map journeys, sketch possibilities, and give ideas a structure through flows and wireframes."},{title:"Design",description:"Bring the direction to life with thoughtful interfaces, reusable components, and prototypes."},{title:"Refine",description:"Use feedback to challenge assumptions, improve usability, and fine-tune the details."}],
  socials:[{label:"Behance",url:"https://www.behance.net/mdnasimtaifuiux"},{label:"LinkedIn",url:"https://www.linkedin.com/in/md-nasim-taifuiux/"},{label:"Instagram",url:"https://www.instagram.com/ux.bytaif"},{label:"GitHub",url:"https://github.com/Nasim-Taif"},{label:"Upwork",url:"https://www.upwork.com/freelancers/~014b49a5f77f64b11e?mp_source=share"},{label:"Facebook",url:"https://www.facebook.com/nasim.taif.999/"}],
};
