import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "yaya种子社群同路人",
  description: "在这里，找到值得认真聊聊的人。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
