export type Member = {
  id: string;
  name: string;
  cities: string[];
  identity: string;
  story: string[];
  doing: string[];
  offers: string[];
  seeks: string[];
  tags: string[];
  accent: string;
};

// 后续新增成员时，复制其中一段对象并替换文字即可。
export const members: Member[] = [
  {
    id: "yaya",
    name: "yaya",
    cities: ["广州"],
    identity: "离开职场，正在探索一人公司的长期主义者",
    story: [
      "12 年互联网电商经验，2025 年 6 月离开职场",
      "公众号「有ya说ya」日更 800+ 天",
      "播客「在读」8000+ 订阅",
      "有丰富的个人旅行经验",
    ],
    doing: ["经营一个小而美的种子用户社群", "探索一人公司，已跑通 5 个变现项目"],
    offers: ["小红书闭环电商实操", "一人公司真实探索记录", "AI 工具与 Obsidian 协作经验"],
    seeks: ["正在做自己项目的人", "深度使用 AI 工具的人", "想做一人公司、愿意真诚交流的人"],
    tags: ["一人公司", "小红书", "电商", "AI 工具", "内容创作"],
    accent: "tomato",
  },
  {
    id: "huaixu",
    name: "槐序",
    cities: ["成都", "山东"],
    identity: "刚毕业就进庙里清修，什么都想试试的副业人",
    story: [],
    doing: ["研究用 AI 做一个自己的资讯网站", "学习塔罗牌"],
    offers: ["东玄、西玄相关资源", "对玄学世界的探索和交流"],
    seeks: ["愿意认识有趣的人，也在慢慢确认自己想链接的方向"],
    tags: ["AI 网站", "玄学", "塔罗", "副业探索"],
    accent: "sage",
  },
];

export const filterTags = ["全部", "一人公司", "AI 工具", "内容创作", "电商", "副业探索", "玄学"];
