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

const SEED_DATA: PortfolioItem[] = [];

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
