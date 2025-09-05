import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  // mock auth (กำหนดได้ตามใจ)
  const isValid = email === "admin@example.com" && password === "password123";
  if (!isValid) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  // สร้าง token mock
  const token = "mock-token-" + Math.random().toString(36).slice(2);

  const res = NextResponse.json({
    user: { id: "1", name: "Admin", email },
    token,
  });

  // set cookie httpOnly
  res.cookies.set("session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 วัน
  });

  return res;
}
