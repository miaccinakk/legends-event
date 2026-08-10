import { NextResponse } from "next/server"
import { SESSION_COOKIE, expectedSessionToken, verifyCredentials } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { email, password } = (await request.json()) as { email?: string; password?: string }

    if (!email || !password || !verifyCredentials(email, password)) {
      return NextResponse.json({ error: "Неверный email или пароль." }, { status: 401 })
    }

    const token = await expectedSessionToken()
    const response = NextResponse.json({ ok: true })
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
    return response
  } catch {
    return NextResponse.json({ error: "Не удалось выполнить вход." }, { status: 500 })
  }
}
