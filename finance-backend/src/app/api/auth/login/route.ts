import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  name: z.string().min(2, "Nama terlalu pendek"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name } = loginSchema.parse(body);

    // Cari user berdasarkan email
    let user = await prisma.user.findUnique({
      where: { email },
    });

    // Jika user tidak ada, buat user baru
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name,
          passwordHash: "demo-password", // Untuk demo, nanti bisa diganti dengan hash yang proper
        },
      });
    } else {
      // Update nama jika berbeda
      if (user.name !== name) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { name },
        });
      }
    }

    // Buat session token sederhana (untuk demo)
    const sessionToken = `session_${user.id}_${Date.now()}`;

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      sessionToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: "Data tidak valid", errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
