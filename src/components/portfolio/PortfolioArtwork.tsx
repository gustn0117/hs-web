import Image from "next/image";
import styles from "./Stage.module.css";

const ARTWORKS = {
  hero: {
    width: 2400,
    height: 1200,
    alt: "검은 공간에서 빛을 머금은 유리와 티타늄의 디지털 스크린 조형",
    sizes: "(max-width: 1230px) calc(100vw - 40px), 1180px",
  },
  panorama: {
    width: 2800,
    height: 1200,
    alt: "은빛의 미세한 결이 파도처럼 펼쳐지는 넓은 디지털 캔버스",
    sizes: "(max-width: 1480px) calc(100vw - 32px), 1448px",
  },
  fields: {
    width: 1200,
    height: 1500,
    alt: "유리, 금속, 그라파이트가 하나로 연결된 조형물과 호박색 유리 구체",
    sizes: "(max-width: 899px) calc(100vw - 40px), 530px",
  },
  focus: {
    width: 1600,
    height: 1000,
    alt: "푸른 바다의 질감을 담은 티타늄 프레임과 은은한 호박색 빛",
    sizes: "(max-width: 899px) calc(100vw - 40px), 530px",
  },
} as const;

/** Newly generated raster artwork, sized to the four original image slots. */
export default function PortfolioArtwork({ kind }: { kind: keyof typeof ARTWORKS }) {
  const artwork = ARTWORKS[kind];

  return (
    <Image
      src={`/portfolio-artwork/${kind}.webp`}
      alt={artwork.alt}
      width={artwork.width}
      height={artwork.height}
      sizes={artwork.sizes}
      quality={95}
      priority={kind === "hero"}
      className={styles.artworkImage}
    />
  );
}
