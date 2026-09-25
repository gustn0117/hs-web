import { revalidatePath } from "next/cache";

// 글이 바뀌면 캐시된 페이지도 바로 새로 만든다.
export function refreshInsightPages(seq?: number) {
  revalidatePath("/insights");
  if (seq) revalidatePath(`/insights/${seq}`);
  revalidatePath("/sitemap.xml");
  revalidatePath("/feed.xml");
}
