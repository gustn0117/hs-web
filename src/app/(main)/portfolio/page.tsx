import type { Metadata } from "next";
import Link from "next/link";
import { BottomCTA } from "@/components/PageShell";
import Hatch from "@/components/portfolio/Hatch";
import Reveal from "@/components/portfolio/Reveal";
import TypeLine from "@/components/portfolio/TypeLine";
import WorkIndex from "@/components/portfolio/WorkIndex";
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
  const lead = items.find((i) => i.featured) || items[0];

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
          <h1 className={styles.heroTitle}>
            <TypeLine text={HERO_LINE} />
          </h1>
          <p className={styles.heroSub}>
            기업 홈페이지, 쇼핑몰, 랜딩페이지, 업무 시스템.
            하온이 직접 만들어 넘긴 작업들입니다.
          </p>
          <div className={styles.heroArt}>
            <div className={styles.growBox}>
              <Hatch
                label="작업물을 한 화면에 모아 놓은 들머리 이미지"
                spec="2400 × 1200 px · webp · 검정 배경"
                ratio="2 / 1"
              />
            </div>
          </div>
          <p className={styles.cue}>아래로 내리면 전부 나옵니다</p>
        </section>

        <section className={styles.wide} aria-hidden="true">
          <div className={styles.wideInner}>
            <div className={styles.wideBox}>
              <Hatch
                label="스크롤하면 양옆으로 열리는 넓은 한 장"
                spec="2800 × 1200 px · webp"
                ratio="21 / 9"
              />
            </div>
          </div>
        </section>

        <section className={styles.chapter} aria-labelledby="fields-claim">
          <div className={styles.wrap}>
            <div className={styles.chapterGrid}>
              <div className={styles.chapterMedia}>
                <Reveal>
                  <div className={styles.growBox}>
                    <Hatch
                      label="분야별 대표 화면을 겹쳐 놓은 이미지"
                      spec="1200 × 1500 px · webp"
                      ratio="4 / 5"
                    />
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
                  {fields.map(([name, { sample }], i) => (
                    <Reveal key={name} delay={i * 70}>
                      <div className={styles.field}>
                        <h2 className={styles.fieldName}>{name}</h2>
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
                    {lead.description && <p className={styles.spotlightBody}>{lead.description}</p>}
                    <Link href={`/portfolio/${lead.seq}`} className={styles.spotlightLink}>
                      이 작업 자세히 보기
                    </Link>
                  </Reveal>
                </div>

                <div className={styles.chapterMedia}>
                  <Reveal>
                    <div className={styles.growBox}>
                      <Hatch
                        label={`${lead.title} 전체 화면 이미지`}
                        spec="1600 × 1000 px · webp"
                        ratio="16 / 10"
                      />
                    </div>
                  </Reveal>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className={styles.breakSection}>
          <div className={styles.wrap}>
            <Reveal>
              <h2 className={styles.breakTitle}>여기까지가 남의 회사 이야기입니다.</h2>
              <p className={styles.breakBody}>
                어떤 걸 만들고 싶은지 한 줄만 적어 주시면, 비슷하게 작업했던 것부터 찾아서 보여드립니다.
                첫 상담은 무료입니다.
              </p>
              <Link href="/contact" className={styles.breakLink}>상담 신청하기</Link>
            </Reveal>
          </div>
        </section>

        <WorkIndex items={items} />
      </div>

      <BottomCTA />
    </>
  );
}
