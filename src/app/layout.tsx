import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Routes",
  description: "Plan and optimize Boston truck and bike delivery routes with real routing and fuel prices.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0a0c0f]">{children}</body>
    </html>
  );
}
