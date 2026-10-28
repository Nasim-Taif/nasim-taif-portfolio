import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
