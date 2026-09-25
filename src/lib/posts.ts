import { supabase } from "./supabase";

export interface PostFaq {
  q: string;
  a: string;
}

export interface Post {
  id: string;
  /** 주소에 쓰는 순번. /insights/1 형태 */
  seq: number;
  title: string;
  /** 검색 결과와 AI 답변에 쓰이는 핵심 요약 */
  summary: string;
  /** "## 소제목" 형식의 본문 */
  content: string;
  category: string;
  tags: string[];
  coverImage: string;
  /** 지역 타겟. 예: "서울 강남구" */
  region: string;
  regionDetail: string;
  faq: PostFaq[];
  published: boolean;
  publishedAt: string;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export type PostInput = Omit<Post, "id" | "seq" | "views" | "createdAt" | "updatedAt">;

function rowToPost(row: Record<string, unknown>): Post {
  return {
    id: row.id as string,
    seq: (row.seq as number) ?? 0,
    title: (row.title as string) ?? "",
    summary: (row.summary as string) ?? "",
    content: (row.content as string) ?? "",
    category: (row.category as string) ?? "",
    tags: (row.tags as string[]) ?? [],
    coverImage: (row.cover_image as string) ?? "",
    region: (row.region as string) ?? "",
    regionDetail: (row.region_detail as string) ?? "",
    faq: (row.faq as PostFaq[]) ?? [],
    published: Boolean(row.published),
    publishedAt: (row.published_at as string) ?? "",
    views: (row.views as number) ?? 0,
    createdAt: (row.created_at as string) ?? "",
    updatedAt: (row.updated_at as string) ?? "",
  };
}

function toRow(input: Partial<PostInput>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (input.title !== undefined) row.title = input.title;
  if (input.summary !== undefined) row.summary = input.summary;
  if (input.content !== undefined) row.content = input.content;
  if (input.category !== undefined) row.category = input.category;
  if (input.tags !== undefined) row.tags = input.tags;
  if (input.coverImage !== undefined) row.cover_image = input.coverImage;
  if (input.region !== undefined) row.region = input.region;
  if (input.regionDetail !== undefined) row.region_detail = input.regionDetail;
  if (input.faq !== undefined) row.faq = input.faq;
  if (input.published !== undefined) {
    row.published = input.published;
    if (input.published && !input.publishedAt) row.published_at = new Date().toISOString();
  }
  if (input.publishedAt !== undefined && input.publishedAt) row.published_at = input.publishedAt;
  return row;
}

/** 공개된 글만. 목록·사이트맵·RSS에 쓴다. */
export async function getPublishedPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (error) return [];
  return (data ?? []).map(rowToPost);
}

/** 관리자용. 임시 저장 글도 포함한다. */
export async function getAllPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(`정보공유 글 조회 실패: ${error.message}`);
  return (data ?? []).map(rowToPost);
}

export async function getPostBySeq(seq: number): Promise<Post | null> {
  const { data, error } = await supabase.from("posts").select("*").eq("seq", seq).single();
  if (error) return null;
  return rowToPost(data);
}

export async function getPostById(id: string): Promise<Post | null> {
  const { data, error } = await supabase.from("posts").select("*").eq("id", id).single();
  if (error) return null;
  return rowToPost(data);
}

export async function createPost(input: PostInput): Promise<Post> {
  // 다음 순번을 붙인다. 주소가 /insights/1 부터 차례로 늘어난다.
  const { data: last } = await supabase
    .from("posts")
    .select("seq")
    .order("seq", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextSeq = ((last?.seq as number) ?? 0) + 1;

  const { data, error } = await supabase
    .from("posts")
    .insert({ ...toRow(input), seq: nextSeq })
    .select()
    .single();

  if (error) throw new Error(`정보공유 글 생성 실패: ${error.message}`);
  return rowToPost(data);
}

export async function updatePost(id: string, input: Partial<PostInput>): Promise<Post | null> {
  const { data, error } = await supabase
    .from("posts")
    .update({ ...toRow(input), updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) return null;
  return rowToPost(data);
}

export async function deletePost(id: string): Promise<boolean> {
  const { error } = await supabase.from("posts").delete().eq("id", id);
  return !error;
}
