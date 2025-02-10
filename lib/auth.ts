import  { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt"
import prisma from "./prisma";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {label: "Email", type:"text", placeholder:"abc@gmail.com"},
                password: {label: "Password", type:"password"},
            },
            async authorize (credentials) {
                if (!credentials?.email || !credentials.password) {
                    throw new Error ("Email and password is required")
                }

                const user = await prisma.user.findUnique({
                    where:{
                        email: credentials.email
                    }
                }) 

                if (!user) {
                    throw new Error("User not found")
                }

                const hashpassword = await bcrypt.compare(credentials.password , user.password)

                if (!hashpassword) {
                    throw new Error ("Invalid password")
                }
                
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                }

            }
        })
    ],
    callbacks:{
        async jwt({token, user}) {
            if (user) {
                token.id = user.id;
                token.role = user.role
            }
            return token
        },
        async session({token, session}){
            if (session.user) {
                session.user.id = token.id;
                session.user.role = token.role

            }
            return session
        }
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages:{
        signIn: "/auth/login"
    }
};
