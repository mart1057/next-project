import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const session = cookies().get("session")?.value;
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // ปกติจะ decode token หา user จริง ๆ
  // ที่นี่ mock คืน user คงที่
  return NextResponse.json({
    user: { id: "1", name: "Admin", email: "admin@example.com" },
  });
}
