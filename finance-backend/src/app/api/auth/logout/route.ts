import { NextResponse } from "next/server";

export async function POST() {
  // Untuk demo, kita hanya return success
  // Nanti bisa ditambahkan invalidate session token
  return NextResponse.json({
    success: true,
    message: "Logout berhasil",
  });
}
