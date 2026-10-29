import Image from "next/image";
import Link from "next/link";
import type { PortfolioItem } from "@/lib/portfolio";
import styles from "./WorkVisuals.module.css";

type Work = Pick<PortfolioItem, "seq" | "title" | "category" | "client" | "thumbnail">;

// Screen crops of our existing portfolio photographs. Only use a crop while its
// original thumbnail still matches; an admin's replacement should appear at once.
const SCREENS: Record<number, { original: string; file: string }> = {
  67: { original: "kmong/307029.jpg", file: "sun-care" },
  90: { original: "kmong/241048.jpg", file: "marine" },
  89: { original: "kmong/253593.jpg", file: "residence" },
  62: { original: "kmong/307016.jpg", file: "jewelry" },
  82: { original: "kmong/307021.jpg", file: "fashion" },
  42: { original: "904b17a1-ef69-4a1c-8995-cea943e48f09", file: "community" },
  33: { original: "da09cb50-5b8f-4626-a29e-9f19a01d4fe6", file: "commerce" },
  3: { original: "0c61cc21-6e9a-4a8c-8852-26a7fed2c782", file: "education" },
  14: { original: "107befe2-b724-4b88-b1a7-eccdda99c020", file: "coffee" },
};

export function selectVisualWorks(items: PortfolioItem[]): PortfolioItem[] {
  const preferred = [90, 82, 67, 89, 62, 14, 42, 33, 3];
  const withImages = items.filter((item) => item.thumbnail);
  const selected = preferred.flatMap((seq) => withImages.filter((item) => item.seq === seq));
  const selectedSeqs = new Set(selected.map((item) => item.seq));
  return [...selected, ...withImages.filter((item) => !selectedSeqs.has(item.seq))].slice(0, 9);
}

function WorkScreen({ work, priority = false }: { work: Work; priority?: boolean }) {
  const crop = SCREENS[work.seq];
  const local = crop && work.thumbnail.includes(crop.original);
  const src = local ? `/portfolio/${crop.file}.webp` : work.thumbnail;

  return (
    <div className={styles.screen}>
      <div className={styles.screenBar} aria-hidden="true">
        <span>{work.client || "HAON"}</span>
        <span>{work.category}</span>
      </div>
      <div className={styles.screenImage}>
        <Image
          src={src}
          alt={`${work.title} 실제 제작 화면`}
          fill
          sizes="(max-width: 599px) 80vw, (max-width: 899px) 60vw, 720px"
          quality={95}
          unoptimized={!local}
          priority={priority}
        />
      </div>
    </div>
  );
}

export function HeroArtwork({ works }: { works: Work[] }) {
  if (!works.length) return null;

  return (
    <div className={styles.hero} aria-label="하온의 실제 제작 프로젝트">
      {works.slice(0, 3).map((work, i) => (
        <Link
          key={work.seq}
          href={`/portfolio/${work.seq}`}
          className={styles.heroScreen}
          data-position={i}
          aria-label={`${work.title} 자세히 보기`}
        >
          <WorkScreen work={work} priority={i === 0} />
        </Link>
      ))}
    </div>
  );
}

export function PanoramaArtwork({ works }: { works: Work[] }) {
  if (!works.length) return null;

  return (
    <div className={styles.panorama}>
      <div className={styles.wall}>
        {works.map((work) => (
          <div key={work.seq} className={styles.wallScreen}>
            <WorkScreen work={work} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function FieldArtwork({ works }: { works: Work[] }) {
  if (!works.length) return null;
  const preferred = ["브랜드 홈페이지", "쇼핑몰", "기업 관리 시스템"]
    .flatMap((category) => works.filter((work) => work.category === category).slice(0, 1));
  const categories = new Set<string>();
  const diverse = [...preferred, ...works].filter((work) => {
    if (categories.has(work.category)) return false;
    categories.add(work.category);
    return true;
  }).slice(0, 3);

  return (
    <div className={styles.fields}>
      <p className={styles.fieldEyebrow}>DIFFERENT FIELDS. SAME STANDARD.</p>
      <div className={styles.stack}>
        {diverse.map((work, i) => (
          <Link
            key={work.seq}
            href={`/portfolio/${work.seq}`}
            className={styles.stackScreen}
            data-position={i}
            aria-label={`${work.category}: ${work.title} 자세히 보기`}
          >
            <WorkScreen work={work} />
          </Link>
        ))}
      </div>
      <p className={styles.fieldCaption}>분야에 맞는 설계. 하온다운 완성도.</p>
    </div>
  );
}

export function SpotlightArtwork({ work }: { work: PortfolioItem }) {
  if (!work.thumbnail) return null;

  return (
    <Link
      href={`/portfolio/${work.seq}`}
      className={styles.spotlight}
      aria-label={`${work.title} 프로젝트 자세히 보기`}
    >
      <div className={styles.spotlightHeading}>
        <span>PROJECT IN FOCUS</span>
        <span>{String(work.seq).padStart(3, "0")}</span>
      </div>
      <div className={styles.spotlightScreen}>
        <WorkScreen work={work} />
      </div>
      <div className={styles.spotlightCaption}>
        <span>{work.client || work.category}</span>
        <span className={styles.viewProject}>프로젝트 보기</span>
      </div>
    </Link>
  );
}
