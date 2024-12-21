import { prismaClient } from "@/app/lib/db";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
//import { NextResponse } from "next/server";


const handler = NextAuth({
    providers: [
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID ?? "",
          clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
        })
      ],
      secret: process.env.NEXTAUTH_SECRET ?? "secret",
    callbacks: {
      async signIn(params): Promise<string | boolean> {
        //console.log(params);
        if(!params.user.email) return false;
        try {
          await prismaClient.user.create({
            data:{
              email: params.user.email ?? "",
              provider: "Google"
            }
          })
        } catch (error: unknown) {
          console.error("Error in creating user:", error);
          return false;
          
        }
        return true;
      }
    }
})

export { handler as GET, handler as POST }