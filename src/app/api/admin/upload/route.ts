import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "未認証" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) return NextResponse.json({ error: "ファイルがありません" }, { status: 400 });

  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "ファイルサイズは10MB以下にしてください" }, { status: 400 });
  }

  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowed.includes(file.type)) {
    return NextResponse.json({ error: "JPEG・PNG・WebP・GIFのみ対応しています" }, { status: 400 });
  }

  const ext = file.name.split(".").pop();
  const filename = `${randomUUID()}.${ext}`;
  const bytes = await file.arrayBuffer();
  await writeFile(join(process.cwd(), "public", "uploads", filename), Buffer.from(bytes));

  return NextResponse.json({ url: `/uploads/${filename}` });
}
