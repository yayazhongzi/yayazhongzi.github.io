import type { Metadata } from "next";
import { MemberDirectory } from "./member-directory";

export const metadata: Metadata = {
  title: "yaya种子社群同路人｜找到值得认真聊聊的人",
  description: "一份属于社群成员的真实名牌册。按关键词搜索，找到经历相近、能力互补、正在做同一件事的人。",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Home() {
  return <MemberDirectory />;
}
