import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";



export async function GET(req: NextRequest){
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); 
        }

        const userId = session.user.id;

        const enrolledCourses = await prisma.courseEnrollment.findMany({
            where:{userId},
            include:{course: true}
        })

        return NextResponse.json({
            enrolledCourses: enrolledCourses.map((enrollment) => enrollment.course),
          });

    } catch (e) {
        return NextResponse.json({ error: "Something went wrong", e }, { status: 500 });
    }
}