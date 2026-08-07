"use client";

import { useEffect, useMemo, useState } from "react";
import { filterTags, members, type Member } from "./members";

const currentCityCount = new Set(members.map((member) => member.cities[0]).filter(Boolean)).size;

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

function shorten(text: string, limit: number) {
  return text.length > limit ? `${text.slice(0, limit - 1)}…` : text;
}

function mobileItems(items: string[], limit = 2, characterLimit = 40) {
  return items.slice(0, limit).map((item) => shorten(item, characterLimit));
}

function mobileSentence(items: string[], limit = 2, characterLimit = 58) {
  return shorten(items.slice(0, limit).join("；"), characterLimit);
}

function MemberCard({
  member,
  index,
  total,
  onOpen,
}: {
  member: Member;
  index: number;
  total: number;
  onOpen: (member: Member) => void;
}) {
  const sectionNumber = (position: number) => String(position).padStart(2, "0");
  const currentCity = member.cities[0];
  const railLocation = currentCity || "SEED COMMUNITY";
  let position = 1;

  return (
    <article className="member-card feature-card" aria-labelledby={`member-${member.id}`}>
      <div className="feature-issue">
        <span>yaya种子用户社群 · 人物特刊</span>
        <span>ISSUE {String(index + 1).padStart(3, "0")}</span>
      </div>

      <aside className="feature-rail" aria-hidden="true">
        <strong>PERSON / {railLocation}</strong>
        <em>一路在做</em>
      </aside>

      <header className="feature-cover">
        {currentCity && <div className="feature-place">{currentCity}</div>}
        <h1 id={`member-${member.id}`}>{member.name}</h1>
        <p className="feature-full">{member.identity}</p>
        <p className="feature-mobile">{shorten(member.identity, 50)}</p>
        <div className="feature-seal">
          <b>NO.</b>
          {String(index + 1).padStart(2, "0")}
        </div>
      </header>

      {member.story.length > 0 && (
        <section className="feature-section feature-story">
          <div className="feature-label"><span>{sectionNumber(position++)}</span> 我走过的路</div>
          <ul className="feature-full">{member.story.map((item) => <li key={item}>{item}</li>)}</ul>
          <ul className="feature-mobile">{mobileItems(member.story).map((item) => <li key={item}>{item}</li>)}</ul>
        </section>
      )}

      <section className="feature-section feature-doing">
        <div className="feature-label"><span>{sectionNumber(position++)}</span> 我正在搞的事</div>
        <p className="feature-full">{member.doing.join("；")}</p>
        <p className="feature-mobile">{mobileSentence(member.doing)}</p>
      </section>

      {member.offers.length > 0 && (
        <section className="feature-section feature-offers">
          <div className="feature-label"><span>{sectionNumber(position++)}</span> 我能给你的</div>
          <ul className="feature-full">{member.offers.map((item) => <li key={item}>{item}</li>)}</ul>
          <ul className="feature-mobile">{mobileItems(member.offers).map((item) => <li key={item}>{item}</li>)}</ul>
        </section>
      )}

      <section className="feature-section feature-seeks">
        <div className="feature-label"><span>{sectionNumber(position++)}</span> 我想链接的</div>
        <p className="feature-full">{member.seeks.join("；")}</p>
        <p className="feature-mobile">{mobileSentence(member.seeks, 2, 50)}</p>
        <div className="feature-tags feature-full">{member.tags.slice(0, 5).map((tag) => <span key={tag}>{tag}</span>)}</div>
        <div className="feature-tags feature-mobile">
          {member.tags.slice(0, 5).map((tag) => <span key={tag}>{tag}</span>)}
        </div>
        <div className="feature-actions">
          <div className="feature-contact">在群内搜索昵称「{member.name}」联系</div>
          <button className="feature-more" type="button" onClick={() => onOpen(member)}>查看完整介绍</button>
        </div>
      </section>

      <div className="feature-page-count">{index + 1} / {total}</div>
    </article>
  );
}

function MemberDetail({ member, onClose }: { member: Member; onClose: () => void }) {
  return (
    <div className="member-detail" role="dialog" aria-modal="true" aria-labelledby={`detail-${member.id}`}>
      <div className="member-detail-panel">
        <header>
          <div>
            <span>yaya种子用户社群 · 完整介绍</span>
            <h2 id={`detail-${member.id}`}>{member.name}</h2>
            <p>{member.cities[0] || "社群成员"}</p>
          </div>
          <button type="button" onClick={onClose} autoFocus aria-label="关闭完整介绍">×</button>
        </header>

        <p className="member-detail-identity">{member.identity}</p>

        {member.story.length > 0 && <section><h3>我走过的路</h3><ul>{member.story.map((item) => <li key={item}>{item}</li>)}</ul></section>}
        <section><h3>我正在搞的事</h3><ul>{member.doing.map((item) => <li key={item}>{item}</li>)}</ul></section>
        {member.offers.length > 0 && <section><h3>我能给你的</h3><ul>{member.offers.map((item) => <li key={item}>{item}</li>)}</ul></section>}
        <section><h3>我想链接的</h3><ul>{member.seeks.map((item) => <li key={item}>{item}</li>)}</ul></section>

        <div className="member-detail-tags">{member.tags.slice(0, 5).map((tag) => <span key={tag}>{tag}</span>)}</div>
        <div className="member-detail-contact">在群内搜索昵称「{member.name}」联系</div>
      </div>
    </div>
  );
}

export function MemberDirectory() {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState("全部");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  useEffect(() => {
    if (!selectedMember) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedMember(null);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [selectedMember]);

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
          <h1>yaya种子社群同路人</h1>
          <p className="brand-summary">
            <span className="summary-full">
              目前已有 <strong>{members.length}</strong> 位朋友参加「yaya 种子用户社群」自我介绍，来自 <strong>{currentCityCount}</strong> 个现居城市。这里聚集了正在探索 AI 工具、小红书、一人公司、副业、电商、个人 IP 与内容创作的人。你可以按城市、经历、技能或正在做的事，找到值得认真聊聊的同路人。
            </span>
            <span className="summary-mobile">{members.length} 人已介绍 · {currentCityCount} 座城市 · AI / 一人公司 / 内容与生意</span>
          </p>
        </div>
        <div className="member-total">
          <strong>{members.length}</strong>
          <span>位同行者 · {currentCityCount} 座城市</span>
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
            <MemberCard key={member.id} member={member} index={index} total={visibleMembers.length} onOpen={setSelectedMember} />
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

      {selectedMember && <MemberDetail member={selectedMember} onClose={() => setSelectedMember(null)} />}
    </main>
  );
}
