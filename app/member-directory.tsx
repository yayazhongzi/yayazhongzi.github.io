"use client";

import { useMemo, useState } from "react";
import { filterTags, members, type Member } from "./members";

function searchableText(member: Member) {
  return [
    member.name,
    ...member.cities,
    member.identity,
    ...member.story,
    ...member.doing,
    ...member.offers,
    ...member.seeks,
    ...member.tags,
  ]
    .join(" ")
    .toLocaleLowerCase("zh-CN");
}

function Section({ number, title, items }: { number: string; title: string; items: string[] }) {
  if (!items.length) return null;

  return (
    <section className="card-section">
      <div className="section-title">
        <span>{number}</span>
        <h2>{title}</h2>
      </div>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

function MemberCard({ member, index, total }: { member: Member; index: number; total: number }) {
  return (
    <article className={`member-card accent-${member.accent}`} aria-labelledby={`member-${member.id}`}>
      <div className="card-topline">
        <span className="card-index">NO. {String(index + 1).padStart(2, "0")}</span>
        <span className="card-count">{index + 1} / {total}</span>
      </div>

      <header className="member-head">
        <div>
          <p className="eyebrow">HELLO, I AM</p>
          <h1 id={`member-${member.id}`}>{member.name}</h1>
        </div>
        <div className="city-list" aria-label="所在城市">
          {member.cities.map((city) => <span key={city}>⌖ {city}</span>)}
        </div>
      </header>

      <p className="identity">{member.identity}</p>

      <div className="member-content">
        <Section number="01" title="我走过的路" items={member.story} />
        <Section number={member.story.length ? "02" : "01"} title="我正在搞的事" items={member.doing} />
        <Section number={member.story.length ? "03" : "02"} title="我能给你的" items={member.offers} />
        <Section number={member.story.length ? "04" : "03"} title="我想链接的" items={member.seeks} />
      </div>

      <footer className="card-footer">
        <div className="member-tags">
          {member.tags.map((tag) => <span key={tag}>#{tag}</span>)}
        </div>
        <span className="card-mark" aria-hidden="true">同路人</span>
      </footer>
    </article>
  );
}

export function MemberDirectory() {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState("全部");

  const visibleMembers = useMemo(() => {
    const keyword = query.trim().toLocaleLowerCase("zh-CN");
    return members.filter((member) => {
      const matchesQuery = !keyword || searchableText(member).includes(keyword);
      const matchesTag =
        activeTag === "全部" ||
        member.tags.includes(activeTag) ||
        searchableText(member).includes(activeTag.toLocaleLowerCase("zh-CN"));
      return matchesQuery && matchesTag;
    });
  }, [activeTag, query]);

  const reset = () => {
    setQuery("");
    setActiveTag("全部");
  };

  return (
    <main className="directory-shell">
      <header className="site-header">
        <div className="brand-block">
          <div className="brand-kicker"><span /> SEED COMMUNITY · 2026</div>
          <h1>同路人名牌</h1>
          <p>在这里，找到值得认真聊聊的人。</p>
        </div>
        <div className="member-total">
          <strong>{members.length}</strong>
          <span>位同行者</span>
        </div>
      </header>

      <section className="finder" aria-label="查找成员">
        <label className="search-box">
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜城市、经历、技能或正在做的事…"
            aria-label="搜索成员"
          />
          {query && <button type="button" onClick={() => setQuery("")} aria-label="清空搜索">×</button>}
        </label>

        <div className="filter-row" aria-label="按标签筛选">
          {filterTags.map((tag) => (
            <button
              type="button"
              key={tag}
              className={activeTag === tag ? "active" : ""}
              onClick={() => setActiveTag(tag)}
              aria-pressed={activeTag === tag}
            >
              {tag}
            </button>
          ))}
        </div>

        <p className="result-note" aria-live="polite">
          {visibleMembers.length === members.length && !query ? "向上滑动，翻阅每一张名牌" : `找到 ${visibleMembers.length} 位可能聊得来的人`}
        </p>
      </section>

      {visibleMembers.length ? (
        <section className="card-deck" aria-label="成员名牌列表">
          {visibleMembers.map((member, index) => (
            <MemberCard key={member.id} member={member} index={index} total={visibleMembers.length} />
          ))}
          <div className="deck-ending">
            <span>END</span>
            <p>认真认识一个人，可能就是一件新事情的开始。</p>
          </div>
        </section>
      ) : (
        <section className="empty-state">
          <span>没有搜到这位同路人</span>
          <p>换一个城市、技能或正在做的事试试。</p>
          <button type="button" onClick={reset}>清空条件</button>
        </section>
      )}

      <div className="swipe-cue" aria-hidden="true">
        <span>↑</span>
        上滑看下一位
      </div>
    </main>
  );
}
