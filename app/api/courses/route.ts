import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";


const courseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z.string().min(5, "Description must be at least 5 characters long"),
  price: z.preprocess(
    (val) => (typeof val === "string" ? parseFloat(val) : val),
    z.number().positive("Price must be a positive number")
  ),
});


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = courseSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid input", details: result.error.format() }, { status: 400 });
    }

    const { title, description, price } = result.data;

    const content = await prisma.course.create({
      data: { title, description, price },
    });

    return NextResponse.json({ message: "Course Created", content }, { status: 201 });
  } catch (e) {
    console.error("Error creating course:", e);
    return NextResponse.json({ error: "Something went wrong", details: e }, { status: 500 });
  }
}


export async function GET(req: NextRequest) {
  try {
    const allCourses = await prisma.course.findMany();
    return NextResponse.json({ message: "Courses fetched successfully", allCourses }, 
        { status: 200 });
  } catch (e) {
    console.error("Error fetching courses:", e);
    return NextResponse.json({ error: "Something went wrong", details: e },
         { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    console.log(id);
    
    const existingCourse = await prisma.course.findUnique({
      where: { id },
    });

    if (!existingCourse) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    console.log("Existing Course:", existingCourse);
    await prisma.courseEnrollment.deleteMany({
      where:{courseId: id}
    })

    await prisma.course.delete({
      where: { id },
    });
    console.log("Course deleted successfully:", id);
    return NextResponse.json({ message: "Course deleted successfully" }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: "Something went wrong", details: e }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const { id, title, description, price } = body;

    if (!id) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
    }

    const result = courseSchema.safeParse({ title, description, price });

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.format() },
        { status: 400 }
      );
    }

    const existingCourse = await prisma.course.findUnique({
      where: { id }, 
    });

    if (!existingCourse) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const updatedCourse = await prisma.course.update({
      where: { id }, 
      data: { title, description, price: Number(price) }, 
    });

    return NextResponse.json(
      { message: "Course updated successfully", updatedCourse },
      { status: 200 }
    );

  } catch (e) {
    console.error("Error updating course:", e);
    return NextResponse.json(
      { error: "Something went wrong", details: e },
      { status: 500 }
    );
  }
}

