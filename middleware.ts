import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // อนุญาต static & system paths
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/assets") ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|css|js|txt|woff|woff2|ttf|otf)$/)
  ) {
    return NextResponse.next();
  }

  // เปิดให้ API เสมอ (ให้ไปตรวจสิทธิ์ใน handler)
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // เปิดให้ path สาธารณะ (เช่น /login)
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // ตรวจ cookie session
  const session = req.cookies.get("session")?.value;
  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname); // จำปลายทางเดิม
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|.*\\..*).*)",
  ],
};
