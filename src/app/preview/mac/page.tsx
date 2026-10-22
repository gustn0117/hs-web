import type { Metadata } from "next";
import Image from "next/image";
import { services } from "@/lib/services";
import { getPortfolioItems } from "@/lib/portfolio";
import styles from "./mac.module.css";

export const revalidate = 300;

export const metadata: Metadata = {
  title: { absolute: "맥 OS 스타일 시안 | 하온" },
  description: "메인 페이지를 macOS 인터페이스로 옮겨본 시안입니다.",
  // 시안이라 검색에 잡히면 안 된다.
  robots: { index: false, follow: false },
};

/** 창 조절 버튼. Figma 키트에서 받은 12px SVG를 그대로 쓴다. */
function Lights() {
  return (
    <span className={styles.lights}>
      <Image src="/mac-ui/close.svg" alt="" width={12} height={12} />
      <Image src="/mac-ui/minimize.svg" alt="" width={12} height={12} />
      <Image src="/mac-ui/zoom.svg" alt="" width={12} height={12} />
    </span>
  );
}

function Window({
  title,
  dark,
  children,
}: {
  title: string;
  dark?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className={`${styles.window} ${dark ? styles.windowDark : ""}`}>
      <div className={styles.titlebar}>
        <Lights />
        <span className={styles.title}>{title}</span>
      </div>
      {children}
    </section>
  );
}

const DOCK = [
  { label: "홈페이지", href: "https://responsive-web.hsweb.pics", bg: "linear-gradient(180deg,#19b8f0,#1762e2)" },
  { label: "쇼핑몰", href: "https://ecommerce.hsweb.pics", bg: "linear-gradient(180deg,#f7b733,#e8890c)" },
  { label: "랜딩", href: "https://landing-page.hsweb.pics", bg: "linear-gradient(180deg,#f46b6b,#d6294e)" },
  { label: "웹 앱", href: "https://web-app.hsweb.pics", bg: "linear-gradient(180deg,#8f7bf5,#5b3fd4)" },
  { label: "CMS", href: "https://cms.hsweb.pics", bg: "linear-gradient(180deg,#4fd08a,#1f9e5e)" },
  { label: "관리", href: "https://enterprise.hsweb.pics", bg: "linear-gradient(180deg,#6d7a8c,#3d4756)" },
  { label: "마케팅", href: "https://marketing.hsweb.pics", bg: "linear-gradient(180deg,#f58fc2,#c03b86)" },
  { label: "문의", href: "/contact", bg: "linear-gradient(180deg,#2b2f38,#12151b)" },
];

export default async function MacPreviewPage() {
  const works = (await getPortfolioItems()).slice(0, 6);

  return (
    <div className={styles.desk}>
      {/* 메뉴 막대 */}
      <div className={styles.menubar}>
        <span className={styles.menubarBrand}>하온</span>
        <a className={styles.menubarItem} href="/services">서비스</a>
        <a className={styles.menubarItem} href="/portfolio">포트폴리오</a>
        <a className={styles.menubarItem} href="/pricing">가격</a>
        <a className={styles.menubarItem} href="/insights">정보공유</a>
        <span className={styles.menubarRight}>
          <span>010-3319-2509</span>
          <span>평일 10:00 — 19:00</span>
        </span>
      </div>

      <div className={styles.stack}>
        {/* 히어로 창 */}
        <Window title="귀사에 맞는 웹 솔루션" dark>
          <div className={styles.body} style={{ padding: "48px 40px 44px" }}>
            <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.5)", letterSpacing: "0.02em" }}>
              WEB AGENCY
            </p>
            <h1
              style={{
                margin: "14px 0 0",
                fontSize: "clamp(30px, 4.4vw, 52px)",
                fontWeight: 800,
                letterSpacing: "-0.035em",
                lineHeight: 1.18,
                color: "#fff",
              }}
            >
              귀사에 맞는 웹 솔루션
            </h1>
            <p
              style={{
                margin: "16px 0 0",
                fontSize: 15,
                lineHeight: 1.85,
                color: "rgba(255,255,255,0.68)",
                maxWidth: 560,
              }}
            >
              홈페이지, 쇼핑몰, 업무용 프로그램, CRM까지 필요한 것만 맞춰 만듭니다.
            </p>
            <div style={{ marginTop: 28, display: "flex", flexWrap: "wrap", gap: 10 }}>
              <a className={styles.btnPrimary} href="/contact">상담 신청</a>
              <a className={styles.btnSecondary} href="/portfolio">제작 사례 보기</a>
            </div>
          </div>
        </Window>

        {/* 서비스 창 — 사이드바 + 본문 */}
        <Window title="서비스">
          <div className={styles.split}>
            <nav className={styles.sidebar}>
              <p className={styles.sidebarHeader}>제작</p>
              {services.slice(0, 4).map((s, i) => (
                <a
                  key={s.slug}
                  href={`https://${s.slug}.hsweb.pics`}
                  className={`${styles.sidebarItem} ${i === 0 ? styles.sidebarItemOn : ""}`}
                >
                  <span className={styles.dot} />
                  {s.title}
                </a>
              ))}
              <p className={styles.sidebarHeader} style={{ marginTop: 10 }}>운영</p>
              {services.slice(4).map((s) => (
                <a key={s.slug} href={`https://${s.slug}.hsweb.pics`} className={styles.sidebarItem}>
                  <span className={styles.dot} />
                  {s.title}
                </a>
              ))}
            </nav>

            <div className={styles.body}>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: "-0.03em" }}>
                {services[0].title}
              </h2>
              <p style={{ margin: "10px 0 0", fontSize: 13, lineHeight: "20px", letterSpacing: "-0.08px", color: "rgba(0,0,0,0.6)" }}>
                {services[0].description}
              </p>
              <ul style={{ listStyle: "none", margin: "22px 0 0", padding: 0, display: "grid", gap: 10 }}>
                {services[0].features.slice(0, 4).map((f) => (
                  <li key={f.title} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span className={styles.dot} style={{ marginTop: 6, background: "var(--c-main)" }} />
                    <span>
                      <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.08px" }}>{f.title}</span>
                      <span style={{ display: "block", fontSize: 12.5, lineHeight: "18px", color: "rgba(0,0,0,0.5)", marginTop: 2 }}>
                        {f.desc}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: 24 }}>
                <a className={styles.btnPrimary} href={`https://${services[0].slug}.hsweb.pics`}>
                  전용 사이트 열기
                </a>
              </div>
            </div>
          </div>
        </Window>

        {/* 작업물 창 — 파인더 격자 */}
        <Window title="최근 작업물">
          <div className={styles.grid}>
            {works.map((w) => (
              <a key={w.id} className={styles.tile} href={`/portfolio/${w.seq}`}>
                <span className={styles.thumb} style={{ display: "block" }} />
                <span className={styles.tileName} style={{ display: "block" }}>{w.title}</span>
                {w.client && w.client !== w.title && (
                  <span className={styles.tileMeta} style={{ display: "block" }}>{w.client}</span>
                )}
              </a>
            ))}
          </div>
        </Window>
      </div>

      {/* 독 */}
      <nav className={styles.dock} aria-label="서비스 바로가기">
        {DOCK.map((d) => (
          <a key={d.label} href={d.href} className={styles.dockApp} style={{ background: d.bg }}>
            {d.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
