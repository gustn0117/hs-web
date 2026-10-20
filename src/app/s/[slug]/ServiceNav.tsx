"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const PHONE = "010-3319-2509";

export type NavItem = { label: string; href: string };
export type PanelGroup = { key: string; items: { href: string; label: string; icon: string }[] };

/**
 * 서비스 전용 사이트의 머리말.
 * 본 사이트와 같은 모양새를 쓰되 메뉴만 그 서비스 것으로 바꾼다.
 */
export default function ServiceNav({
  siteName,
  nav,
  groups,
}: {
  siteName: string;
  nav: NavItem[];
  groups: PanelGroup[];
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [group, setGroup] = useState(groups[0]?.key ?? "");

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // 서브도메인이라 주소는 /about 처럼 보이지만 내부 경로는 /s/<slug>/about 이다.
  const here = pathname.replace(/^\/s\/[^/]+/, "") || "/";
  const active = (href: string) => (href === "/" ? here === "/" : here.startsWith(href));
  const close = () => setOpen(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-[var(--c-line)]">
        <div className="max-w-[1280px] mx-auto px-5 h-[68px] md:h-[80px] grid grid-cols-[1fr_auto] lg:grid-cols-[1fr_auto_1fr] items-center gap-4">
          <Link href="/" className="no-underline min-w-0">
            <span className="block text-[15px] md:text-[17px] font-extrabold tracking-[-0.035em] text-[var(--c-text)] truncate">
              {siteName}
            </span>
          </Link>

          <nav className="hidden lg:flex items-center justify-center gap-7">
            {nav.map((m) => (
              <Link
                key={m.href}
                href={m.href}
                className={`relative text-[15px] no-underline transition-colors py-2 ${
                  active(m.href)
                    ? "text-[var(--c-main)] font-extrabold"
                    : "text-[var(--c-text)] font-bold hover:text-[var(--c-main)]"
                }`}
              >
                {m.label}
                {active(m.href) && (
                  <span className="absolute -bottom-0.5 left-0 right-0 h-[3px] bg-[var(--c-main)] rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-2">
            <a
              href={`tel:${PHONE}`}
              className="hidden md:inline-flex items-center gap-1.5 text-[14px] font-bold text-[var(--c-text)] no-underline hover:text-[var(--c-main)] transition-colors tnum"
            >
              {PHONE}
            </a>
            <Link
              href="/contact"
              className="hidden sm:inline-flex items-center h-10 px-4 bg-[var(--c-main)] text-white text-[13.5px] font-bold no-underline hover:opacity-90 transition-opacity"
            >
              상담 신청
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="전체메뉴 열기"
              className="w-11 h-11 inline-flex items-center justify-center text-[var(--c-text)] hover:bg-[var(--c-bg-2)] rounded-lg cursor-pointer bg-transparent border-0 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* 전체메뉴 패널 */}
      <div className={`fixed inset-0 z-[60] ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
        <div
          onClick={close}
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="전체메뉴"
          className={`absolute top-0 right-0 h-full w-full sm:w-[420px] bg-white shadow-[0_0_60px_-10px_rgba(0,0,0,0.35)] transition-transform duration-300 flex flex-col ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="bg-[var(--c-text)] text-white px-5 h-14 flex items-center justify-between shrink-0">
            <span className="text-[12.5px] font-semibold tracking-[0.22em] truncate">{siteName}</span>
            <button
              type="button"
              onClick={close}
              aria-label="전체메뉴 닫기"
              className="w-8 h-8 -mr-1.5 shrink-0 inline-flex items-center justify-center text-white/70 hover:text-white cursor-pointer bg-transparent border-0 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 min-h-0 grid grid-cols-[84px_1fr]">
            <nav className="border-r border-[var(--c-line)] py-4">
              {groups.map((g) => (
                <button
                  key={g.key}
                  type="button"
                  onClick={() => {
                    setGroup(g.key);
                    document.getElementById(`sg-${g.key}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className={`w-full text-left px-4 py-2.5 text-[12.5px] cursor-pointer bg-transparent border-0 transition-colors ${
                    group === g.key
                      ? "text-[var(--c-text)] font-bold"
                      : "text-[var(--c-sub)] hover:text-[var(--c-text)]"
                  }`}
                >
                  {g.key}
                </button>
              ))}
            </nav>

            <div className="overflow-y-auto px-5 py-4">
              {groups.map((g) => (
                <section key={g.key} id={`sg-${g.key}`} className="mb-7 last:mb-2">
                  <p className="text-[13px] font-bold text-[var(--c-text)] pb-2 border-b border-[var(--c-line)]">
                    {g.key}
                  </p>
                  <ul className="list-none m-0 p-0 mt-1.5">
                    {g.items.map((it) => {
                      const external = it.href.startsWith("http");
                      const on = !external && active(it.href);
                      const inner = (
                        <>
                          <svg
                            className={`w-[17px] h-[17px] shrink-0 ${
                              on ? "text-[var(--c-main)]" : "text-[var(--c-sub-2)]"
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d={it.icon} />
                          </svg>
                          <span className="text-[13.5px]">{it.label}</span>
                        </>
                      );
                      const cls = `flex items-center gap-2.5 h-10 pl-3 border-l-2 no-underline transition-colors ${
                        on
                          ? "border-[var(--c-main)] text-[var(--c-text)] font-bold"
                          : "border-transparent text-[var(--c-text-2)] hover:text-[var(--c-main)]"
                      }`;
                      return (
                        <li key={it.href}>
                          {external ? (
                            <a href={it.href} className={cls}>
                              {inner}
                            </a>
                          ) : (
                            <Link href={it.href} onClick={close} className={cls}>
                              {inner}
                            </Link>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}
            </div>
          </div>

          <div className="border-t border-[var(--c-line)] px-5 py-3 flex items-center justify-between gap-3">
            <a href={`tel:${PHONE}`} className="text-[13.5px] font-bold text-[var(--c-text)] no-underline tnum">
              {PHONE}
            </a>
            <Link
              href="/contact"
              onClick={close}
              className="inline-flex items-center h-9 px-4 bg-[var(--c-main)] text-white text-[13px] font-bold no-underline hover:opacity-90 transition-opacity"
            >
              상담 신청
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
