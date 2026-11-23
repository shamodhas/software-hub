import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, signAdminToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    const validUsername = process.env.ADMIN_USERNAME || "admin";
    const validPassword = process.env.ADMIN_PASSWORD || "changeme123";

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
      secure: process.env.NODE_ENV === "production",
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

