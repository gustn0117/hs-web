import type { Metadata } from "next";
import Link from "next/link";
import { BottomCTA } from "@/components/PageShell";
import Reveal from "@/components/portfolio/Reveal";
import TypeLine from "@/components/portfolio/TypeLine";
import WorkIndex from "@/components/portfolio/WorkIndex";
import {
  FieldArtwork,
  HeroArtwork,
  PanoramaArtwork,
  SpotlightArtwork,
  selectVisualWorks,
} from "@/components/portfolio/WorkVisuals";
import styles from "@/components/portfolio/Stage.module.css";
import { getPortfolioItems, PortfolioItem } from "@/lib/portfolio";
import { abs } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "포트폴리오 - 홈페이지 제작 사례",
  description:
    "하온이 제작한 홈페이지 포트폴리오를 확인하세요. 다양한 산업군의 클라이언트와 함께한 반응형 홈페이지, 쇼핑몰, 랜딩페이지 프로젝트를 소개합니다.",
  keywords: ["홈페이지 제작 포트폴리오", "웹사이트 제작 사례", "홈페이지 디자인 포트폴리오", "웹에이전시 포트폴리오"],
  alternates: { canonical: abs("/portfolio") },
};

const HERO_LINE = "만든 것으로 말합니다.";

/** 분야마다 그 분야가 어떤 일인지 보여 줄 제목 하나씩. 많이 한 분야가 앞에 온다. */
function groupByField(items: PortfolioItem[]) {
  const map = new Map<string, { count: number; sample: string }>();
  for (const item of items) {
    const key = item.category || "기타";
    const hit = map.get(key);
    if (hit) hit.count += 1;
    else map.set(key, { count: 1, sample: item.title });
  }
  return [...map.entries()].sort((a, b) => b[1].count - a[1].count);
}

export default async function PortfolioPage() {
  let items: PortfolioItem[] = [];
  try {
    items = await getPortfolioItems();
  } catch { /* 목록을 못 가져와도 페이지는 열려야 한다 */ }

  const fields = groupByField(items);
  const visualWorks = selectVisualWorks(items);
  const lead = items.find((i) => i.featured) || items[0];
  const leadBlurb = lead && lead.description.trim() !== lead.title.trim() ? lead.description.trim() : "";

  if (items.length === 0) {
    return (
      <>
        <div className={styles.stage}>
          <section className={styles.hero}>
            <h1 className={styles.heroTitle}>작업물을 정리하는 중입니다.</h1>
            <p className={styles.heroSub}>곧 공개합니다. 먼저 어떤 걸 만들고 싶은지 들려주셔도 좋습니다.</p>
          </section>
        </div>
        <BottomCTA />
      </>
    );
  }

  return (
    <>
      <div className={styles.stage}>
        <section className={styles.hero}>
          <p className={styles.heroEyebrow}>HAON — SELECTED WORKS</p>
          <h1 className={styles.heroTitle}>
            <TypeLine text={HERO_LINE} />
          </h1>
          <p className={styles.heroSub}>
            기업 홈페이지, 쇼핑몰, 랜딩페이지, 업무 시스템.<br />
            하온이 직접 만들어 넘긴 작업들입니다.
          </p>
          <div className={styles.heroArt}>
            <HeroArtwork works={visualWorks} />
          </div>
          <a href="#all-works" className={styles.cue}>
            전체 {items.length}개 프로젝트 살펴보기 <span aria-hidden="true">↓</span>
          </a>
        </section>

        {visualWorks.length > 0 && (
          <section className={styles.wide} aria-label="다양한 분야의 실제 제작 화면">
            <div className={styles.wideInner}>
              <div className={styles.visualCaption}>
                <span>서로 다른 이야기. 같은 기준의 완성도.</span>
                <span>WEB · COMMERCE · SYSTEM</span>
              </div>
              <div className={styles.wideBox}>
                <PanoramaArtwork works={visualWorks} />
              </div>
            </div>
          </section>
        )}

        <section className={styles.chapter} aria-labelledby="fields-claim">
          <div className={styles.wrap}>
            <div className={styles.chapterGrid}>
              <div className={styles.chapterMedia}>
                <Reveal>
                  <div className={styles.growBox}>
                    <FieldArtwork works={visualWorks} />
                  </div>
                </Reveal>
              </div>

              <div className={styles.chapterText}>
                <Reveal>
                  <p className={styles.lede}>하온이 다루는 분야</p>
                  <p className={styles.claim} id="fields-claim">
                    한 가지만 만들어 본 곳이 아닙니다.
                  </p>
                </Reveal>

                <div className={styles.fields}>
                  {fields.map(([name, { sample, count }], i) => (
                    <Reveal key={name} delay={i * 70}>
                      <div className={styles.field}>
                        <h2 className={styles.fieldName}>
                          {name}
                          <span className={styles.fieldCount}>{String(count).padStart(2, "0")}</span>
                        </h2>
                        <p className={styles.fieldSample}>{sample}</p>
                      </div>
                    </Reveal>
                  ))}
                </div>

                <Reveal>
                  <p className={styles.claim}>
                    업종이 달라도 막히는 지점은 대개 비슷합니다.
                  </p>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {lead && (
          <section className={styles.spotlight} aria-labelledby="lead-title">
            <div className={styles.wrap}>
              <div className={styles.chapterGrid}>
                <div className={styles.chapterText}>
                  <Reveal>
                    <p className={styles.spotlightTag}>{lead.category || "프로젝트"}</p>
                    <h2 className={styles.spotlightTitle} id="lead-title">{lead.title}</h2>
                    {/* 설명을 제목과 똑같이 적어 둔 건이 있다. 그대로 찍으면 제목이 두 번 나온다. */}
                    {leadBlurb && <p className={styles.spotlightBody}>{leadBlurb}</p>}
                    <Link href={`/portfolio/${lead.seq}`} className={styles.spotlightLink}>
                      이 작업 자세히 보기
                    </Link>
                  </Reveal>
                </div>

                <div className={styles.chapterMedia}>
                  <Reveal>
                    <div className={styles.growBox}>
                      <SpotlightArtwork work={lead} />
                    </div>
                  </Reveal>
                </div>
              </div>
            </div>
          </section>
        )}

        <WorkIndex items={items} />
      </div>

      <BottomCTA />
    </>
  );
}
