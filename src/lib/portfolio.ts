import fs from "fs";
import path from "path";
import crypto from "crypto";

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  client: string;
  date: string;
  description: string;
  content: string;
  thumbnail: string;
  images: string[];
  tags: string[];
  url: string;
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const UPLOADS_DIR = path.join(DATA_DIR, "uploads");
const DATA_FILE = path.join(DATA_DIR, "portfolio.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const SEED_DATA: PortfolioItem[] = [
  {
    id: "seed-1",
    title: "프리미엄 카페 브랜딩",
    category: "브랜드 홈페이지",
    client: "카페 브랜드",
    date: "2024-03",
    description: "감성적인 브랜드 스토리를 담은 프리미엄 카페 웹사이트 제작. 온라인 예약 시스템과 메뉴 관리 기능 포함.",
    content: "프리미엄 카페 브랜드의 아이덴티티를 온라인으로 확장하는 프로젝트였습니다.\n\n감성적인 브랜드 스토리텔링을 중심으로, 시각적으로 아름다운 웹사이트를 구현했습니다. 온라인 예약 시스템, 메뉴 관리, 매장 안내 등의 기능을 포함하며, 모바일에서도 완벽하게 동작하는 반응형 디자인을 적용했습니다.\n\n특히 메뉴 페이지에서는 고화질 음식 사진과 함께 직관적인 카테고리 필터를 구현하여 사용자 경험을 극대화했습니다.",
    thumbnail: "",
    images: [],
    tags: ["React", "Next.js", "Tailwind CSS"],
    url: "",
    featured: true,
    order: 0,
    createdAt: "2024-03-01T00:00:00Z",
    updatedAt: "2024-03-01T00:00:00Z",
  },
  {
    id: "seed-2",
    title: "패션 온라인 스토어",
    category: "쇼핑몰",
    client: "패션 브랜드",
    date: "2024-05",
    description: "트렌디한 패션 브랜드의 온라인 쇼핑몰. PG 결제 연동과 재고 관리 시스템을 구축했습니다.",
    content: "패션 브랜드를 위한 풀 기능 온라인 쇼핑몰을 구축했습니다.\n\nPG 결제 시스템 연동, 실시간 재고 관리, 회원 시스템, 위시리스트, 리뷰 시스템 등 쇼핑몰에 필요한 모든 기능을 구현했습니다.\n\n특히 상품 검색과 필터링 기능을 최적화하여 사용자가 원하는 상품을 빠르게 찾을 수 있도록 했으며, 모바일 결제 경험을 개선하여 전환율을 크게 높였습니다.",
    thumbnail: "",
    images: [],
    tags: ["Vue.js", "Node.js", "PostgreSQL"],
    url: "",
    featured: true,
    order: 1,
    createdAt: "2024-05-01T00:00:00Z",
    updatedAt: "2024-05-01T00:00:00Z",
  },
  {
    id: "seed-3",
    title: "메디컬 클리닉",
    category: "기업 홈페이지",
    client: "메디컬 클리닉",
    date: "2024-07",
    description: "신뢰감을 주는 깔끔한 디자인의 병원 웹사이트. 온라인 진료 예약 시스템을 포함합니다.",
    content: "메디컬 클리닉의 전문성과 신뢰감을 전달하는 웹사이트를 제작했습니다.\n\n환자분들이 쉽게 진료 예약을 할 수 있는 온라인 시스템을 구축하고, 의료진 소개, 진료 과목 안내, 오시는 길 등의 정보를 직관적으로 제공합니다.\n\n접근성과 사용성을 최우선으로 고려하여, 고령 사용자도 쉽게 이용할 수 있는 큰 글씨와 명확한 네비게이션을 적용했습니다.",
    thumbnail: "",
    images: [],
    tags: ["React", "Express", "MongoDB"],
    url: "",
    featured: false,
    order: 2,
    createdAt: "2024-07-01T00:00:00Z",
    updatedAt: "2024-07-01T00:00:00Z",
  },
  {
    id: "seed-4",
    title: "부동산 분양 랜딩",
    category: "랜딩페이지",
    client: "부동산 분양",
    date: "2024-09",
    description: "전환율을 극대화한 부동산 분양 랜딩페이지. A/B 테스트를 통해 최적의 전환율을 달성했습니다.",
    content: "부동산 분양을 위한 고전환율 랜딩페이지를 제작했습니다.\n\n방문자의 관심을 즉시 끌 수 있는 히어로 섹션과 함께, 단지 정보, 평형 안내, 입지 분석, 분양 일정 등을 효과적으로 전달합니다.\n\nA/B 테스트를 반복 진행하여 CTA 버튼 배치, 색상, 문구를 최적화했고, 결과적으로 상담 신청 전환율을 기존 대비 40% 이상 높였습니다.",
    thumbnail: "",
    images: [],
    tags: ["Next.js", "Tailwind CSS", "Analytics"],
    url: "",
    featured: false,
    order: 3,
    createdAt: "2024-09-01T00:00:00Z",
    updatedAt: "2024-09-01T00:00:00Z",
  },
  {
    id: "seed-5",
    title: "SaaS 대시보드",
    category: "웹 애플리케이션",
    client: "SaaS 스타트업",
    date: "2024-11",
    description: "데이터 시각화 대시보드를 포함한 SaaS 웹 애플리케이션. 실시간 데이터 업데이트를 지원합니다.",
    content: "SaaS 스타트업의 핵심 대시보드 애플리케이션을 개발했습니다.\n\n실시간 데이터 시각화, 사용자 관리, 팀 협업 기능, 리포트 생성 등 다양한 기능을 구현했습니다.\n\nWebSocket을 활용한 실시간 데이터 업데이트와 차트 라이브러리를 연동하여 복잡한 데이터를 직관적으로 보여주는 대시보드를 구현했습니다. 성능 최적화를 통해 대량의 데이터도 부드럽게 렌더링됩니다.",
    thumbnail: "",
    images: [],
    tags: ["React", "TypeScript", "WebSocket"],
    url: "",
    featured: true,
    order: 4,
    createdAt: "2024-11-01T00:00:00Z",
    updatedAt: "2024-11-01T00:00:00Z",
  },
  {
    id: "seed-6",
    title: "F&B 온라인 주문",
    category: "쇼핑몰",
    client: "F&B 브랜드",
    date: "2025-01",
    description: "모바일 최적화된 온라인 주문 시스템. 실시간 주문 추적과 결제 시스템을 포함합니다.",
    content: "F&B 브랜드를 위한 모바일 퍼스트 온라인 주문 시스템을 구축했습니다.\n\n메뉴 탐색, 장바구니, 결제, 실시간 주문 추적까지 원스톱으로 이용할 수 있는 시스템입니다.\n\n특히 모바일 사용자 경험에 집중하여, 한 손으로 편하게 주문할 수 있는 UI를 설계했습니다. 매장별 메뉴 관리와 할인 이벤트 기능도 포함되어 있습니다.",
    thumbnail: "",
    images: [],
    tags: ["Next.js", "Node.js", "PostgreSQL"],
    url: "",
    featured: false,
    order: 5,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  },
];

function readData(): PortfolioItem[] {
  ensureDataDir();
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ items: SEED_DATA }, null, 2), "utf-8");
    return SEED_DATA;
  }
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw).items as PortfolioItem[];
}

function writeData(items: PortfolioItem[]) {
  ensureDataDir();
  fs.writeFileSync(DATA_FILE, JSON.stringify({ items }, null, 2), "utf-8");
}

export function getPortfolioItems(): PortfolioItem[] {
  return readData().sort((a, b) => a.order - b.order);
}

export function getPortfolioItem(id: string): PortfolioItem | undefined {
  return readData().find((item) => item.id === id);
}

export function createPortfolioItem(data: Omit<PortfolioItem, "id" | "createdAt" | "updatedAt">): PortfolioItem {
  const items = readData();
  const now = new Date().toISOString();
  const newItem: PortfolioItem = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  items.push(newItem);
  writeData(items);
  return newItem;
}

export function updatePortfolioItem(id: string, data: Partial<PortfolioItem>): PortfolioItem | null {
  const items = readData();
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return null;
  items[index] = {
    ...items[index],
    ...data,
    id: items[index].id,
    createdAt: items[index].createdAt,
    updatedAt: new Date().toISOString(),
  };
  writeData(items);
  return items[index];
}

export function deletePortfolioItem(id: string): boolean {
  const items = readData();
  const filtered = items.filter((item) => item.id !== id);
  if (filtered.length === items.length) return false;
  writeData(filtered);
  return true;
}

export { DATA_DIR, UPLOADS_DIR };
