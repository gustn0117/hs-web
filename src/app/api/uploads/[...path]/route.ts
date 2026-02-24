import { NextResponse } from "next/server";
import { UPLOADS_DIR } from "@/lib/portfolio";
import fs from "fs";
import path from "path";

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: pathParts } = await params;
  const filename = pathParts.join("/");

  // Prevent directory traversal
  const sanitized = path.normalize(filename).replace(/^(\.\.(\/|\\|$))+/, "");
  const filePath = path.join(UPLOADS_DIR, sanitized);

  if (!filePath.startsWith(UPLOADS_DIR)) {
    return NextResponse.json({ error: "접근 불가" }, { status: 403 });
  }

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "파일을 찾을 수 없습니다." }, { status: 404 });
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";
  const buffer = fs.readFileSync(filePath);

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
