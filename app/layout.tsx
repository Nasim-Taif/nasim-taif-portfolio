import type { Metadata } from "next";
import "./globals.css";
import "./motion.css";
import "./blue-motion.css";
import "./studio.css";
import PageTransitions from "./page-transitions";

export const metadata: Metadata = {
  title: "Md. Nasim Taif — UI/UX Designer",
  description: "Thoughtful design. Meaningful experiences. Explore the work of Google-certified UI/UX designer Md. Nasim Taif.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased"><script dangerouslySetInnerHTML={{__html: `try{document.documentElement.dataset.motionPaused=sessionStorage.getItem('portfolio-motion-paused')||'false';if(sessionStorage.getItem('portfolio-navigation')){sessionStorage.removeItem('portfolio-navigation');if(document.documentElement.dataset.motionPaused!=='true'&&!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.dataset.pageEntering='true';setTimeout(()=>delete document.documentElement.dataset.pageEntering,1800)}}}catch{}`}}/><PageTransitions/>{children}</body>
    </html>
  );
}
