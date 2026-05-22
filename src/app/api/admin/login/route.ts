import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: "メールアドレスとパスワードを入力してください" }, { status: 400 });
  }

  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
    return NextResponse.json({ error: "メールアドレスまたはパスワードが間違っています" }, { status: 401 });
  }

  await createSession(admin.id);
  return NextResponse.json({ ok: true });
}
