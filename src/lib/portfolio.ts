import { supabase } from "./supabase";

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

const STORAGE_BUCKET = "hs-web-portfolio";

export function getStorageUrl(filePath: string): string {
  const supabaseUrl = process.env.SUPABASE_URL!;
  return `${supabaseUrl}/storage/v1/object/public/${STORAGE_BUCKET}/${filePath}`;
}

function rowToItem(row: Record<string, unknown>): PortfolioItem {
  return {
    id: row.id as string,
    title: row.title as string,
    category: row.category as string,
    client: row.client as string,
    date: row.date as string,
    description: row.description as string,
    content: row.content as string,
    thumbnail: row.thumbnail as string,
    images: (row.images as string[]) || [],
    tags: (row.tags as string[]) || [],
    url: row.url as string,
    featured: row.featured as boolean,
    order: row.order as number,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  const { data, error } = await supabase
    .from("portfolio")
    .select("*")
    .order("order", { ascending: true });

  if (error) throw new Error(`포트폴리오 조회 실패: ${error.message}`);
  return (data || []).map(rowToItem);
}

export async function getPortfolioItem(id: string): Promise<PortfolioItem | null> {
  const { data, error } = await supabase
    .from("portfolio")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return rowToItem(data);
}

export async function createPortfolioItem(
  input: Omit<PortfolioItem, "id" | "createdAt" | "updatedAt">
): Promise<PortfolioItem> {
  const { data, error } = await supabase
    .from("portfolio")
    .insert({
      title: input.title,
      category: input.category,
      client: input.client,
      date: input.date,
      description: input.description,
      content: input.content,
      thumbnail: input.thumbnail,
      images: input.images,
      tags: input.tags,
      url: input.url,
      featured: input.featured,
      order: input.order,
    })
    .select()
    .single();

  if (error) throw new Error(`포트폴리오 생성 실패: ${error.message}`);
  return rowToItem(data);
}

export async function updatePortfolioItem(
  id: string,
  input: Partial<PortfolioItem>
): Promise<PortfolioItem | null> {
  const updateData: Record<string, unknown> = {};
  if (input.title !== undefined) updateData.title = input.title;
  if (input.category !== undefined) updateData.category = input.category;
  if (input.client !== undefined) updateData.client = input.client;
  if (input.date !== undefined) updateData.date = input.date;
  if (input.description !== undefined) updateData.description = input.description;
  if (input.content !== undefined) updateData.content = input.content;
  if (input.thumbnail !== undefined) updateData.thumbnail = input.thumbnail;
  if (input.images !== undefined) updateData.images = input.images;
  if (input.tags !== undefined) updateData.tags = input.tags;
  if (input.url !== undefined) updateData.url = input.url;
  if (input.featured !== undefined) updateData.featured = input.featured;
  if (input.order !== undefined) updateData.order = input.order;
  updateData.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("portfolio")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) return null;
  return rowToItem(data);
}

export async function deletePortfolioItem(id: string): Promise<boolean> {
  const { error } = await supabase
    .from("portfolio")
    .delete()
    .eq("id", id);

  return !error;
}

export async function uploadImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const filename = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filename, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) throw new Error(`이미지 업로드 실패: ${error.message}`);
  return getStorageUrl(filename);
}

export async function deleteImage(imageUrl: string): Promise<void> {
  const prefix = `/storage/v1/object/public/${STORAGE_BUCKET}/`;
  const idx = imageUrl.indexOf(prefix);
  if (idx === -1) return;
  const filePath = imageUrl.slice(idx + prefix.length);

  await supabase.storage.from(STORAGE_BUCKET).remove([filePath]);
}

export { STORAGE_BUCKET };
