import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, signAdminToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const username = String(body.username || "").trim();
    const password = String(body.password || "");

    const isProd =
      process.env.NODE_ENV === "production" ||
      process.env.APP_ENV === "production";

    const validUsername =
      process.env.ADMIN_USERNAME || (isProd ? "" : "admin");
    const validPassword =
      process.env.ADMIN_PASSWORD || (isProd ? "" : "123456");

    if (!validUsername || !validPassword) {
      return NextResponse.json(
        {
          error:
            "Server authentication credentials (ADMIN_USERNAME / ADMIN_PASSWORD) are not configured.",
        },
        { status: 500 }
      );
    }

    if (username !== validUsername || password !== validPassword) {
      return NextResponse.json(
        { error: "Invalid admin username or password." },
        { status: 401 }
      );
    }

    const token = await signAdminToken({ username, role: "admin" });
    const res = NextResponse.json({ success: true, username });

    res.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: isProd,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch {
    return NextResponse.json(
      { error: "Invalid login request payload." },
      { status: 400 }
    );
  }
}
