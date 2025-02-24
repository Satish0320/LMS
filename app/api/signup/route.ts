import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt" 


export async function POST(req: NextRequest){
    try {
        const {name, email, password,role} = await req.json()

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
