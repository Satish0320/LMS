import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt" 
import { z } from "zod";

const signupSchema = z.object({
   name: z.string(),
   email:z.string().email(),
   password:z.string(),
   role:z.string()
  });

export async function POST(req: NextRequest){
    try {
        const body = await req.json();
        const result = signupSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: "Invalid input", details: result.error.format() }, { status: 400 });
          }
          const { email, name, password, role } = result.data;

        const existinguser = await prisma.user.findUnique({
            where:{
                email
            }
        });

        if (existinguser) {
            return NextResponse.json({
                message: "email already exist"
            },{status:400
        })
    };

    const hashpassword = await bcrypt.hash(password, 10);
    const userRole = role && ["ADMIN"].includes(role) ? role : "STUDENT";


    const newUser = await prisma.user.create({
        data:{
            email,
            name,
            password: hashpassword,
            role: userRole
        }
    })
    return NextResponse.json({
        message: "User Registered sucessfully", user: newUser
    },{status: 200})

    } catch (e) {
        return NextResponse.json({error: "something went wrong", e},{status: 500})
    }
}
