import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { uploadImage } from "@/lib/portfolio";

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "파일이 필요합니다." }, { status: 400 });
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: "지원하지 않는 파일 형식입니다." }, { status: 400 });
  }

  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "파일 크기는 10MB 이하여야 합니다." }, { status: 400 });
  }

  try {
    const url = await uploadImage(file);
    return NextResponse.json({ path: url });
  } catch (e) {
    const message = e instanceof Error ? e.message : "업로드 실패";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
