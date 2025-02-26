import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";


const enrollSchema = z.object({
  courseId: z.string().min(1, "Course ID is required"), 
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

   
    const body = await req.json();
    const result = enrollSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.format() }, { status: 400 });
    }

    const { courseId } = result.data;
    const userId = session.user.id;

   
    const existingEnrollment = await prisma.courseEnrollment.findFirst({
      where: { userId, courseId },
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { error: "You are already enrolled in this course" },
        { status: 400 }
      );
    }


    await prisma.courseEnrollment.create({
      data: { userId, courseId },
    });

    return NextResponse.json({ message: "Successfully enrolled!" }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: "Something went wrong", e }, { status: 500 });
  }
}
