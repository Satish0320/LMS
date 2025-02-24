import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    try {
       const {title, description, price} = await req.json()

       const numericPrice = parseFloat(price);
       if (isNaN(numericPrice)) {
           return NextResponse.json({ error: "Invalid price value" }, { status: 400 });
       }

       const content = await prisma.course.create({
        data:{
            title,
            description,
            price:numericPrice
        }
       })
       return NextResponse.json({
        message: "Content Created",
        content
       },{status:200})
    } catch (e) {
        return NextResponse.json({error: "something went wrong", e},{status: 500})
    }
}

export async function GET(req: NextRequest){
    try {
        const Allcourses = await prisma.course.findMany({})
        return NextResponse.json({
            message: "courses",
            Allcourses
        })
    } catch (e) {
        return NextResponse.json({error: "something went wrong", e},{status: 500})
    }
}
