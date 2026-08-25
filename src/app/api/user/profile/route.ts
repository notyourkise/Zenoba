import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/client";
import { getCurrentUser } from "@/lib/auth";

const profileUpdateSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .trim(),
});

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate input strictly to prevent privileged field mutation
    const result = profileUpdateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { name } = result.data;

    // Update allowed fields only (never mutate role, emailVerified, or id from client)
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { name },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while updating profile" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const sessionUser = await getCurrentUser();

    if (!sessionUser?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: sessionUser.id },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while fetching profile" },
      { status: 500 }
    );
  }
}
