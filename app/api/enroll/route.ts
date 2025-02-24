import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest){
    try {
        const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId } = await req.json();
    const userId = session.user.id;

    const existingEnrollment = await prisma.courseEnrollment.findFirst({
        where: { userId, courseId },
      });

      if (existingEnrollment) {
        return NextResponse.json({ error: "You are already enrolled in this course" }, { status: 400 });
      }

      await prisma.courseEnrollment.create({
        data: { userId, courseId },
      });

      return NextResponse.json({ message: "Successfully enrolled!" }, { status: 200 });
    } catch (e) {
        return NextResponse.json({ error: "Something went wrong", e }, { status: 500 }); 
    }


}