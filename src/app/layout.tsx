import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Routes",
  description: "A Next.js app created in this workspace.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0a0c0f]">{children}</body>
    </html>
  );
}
