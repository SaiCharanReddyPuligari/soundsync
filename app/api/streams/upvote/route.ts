import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import {z} from 'zod';

const UpvoteSchema = z.object({
    streamId : z.string(),
})

export async function POST(request:NextRequest) {

    const session = await getServerSession();
    //get rid of the db call here
    const user = await prismaClient.user.findFirst({
        where:{
            email: session?.user?.email ?? ""
        }
    });

    //console.log(user);
    

    if(!user){
        return NextResponse.json({
            message: "Unauthorizes user"
        },{
            status: 403
        })
    }

    try {
        const data = UpvoteSchema.parse(await request.json());
        await prismaClient.upvote.create({
            data:{
                userId: user.id,
                streamId: data.streamId,
            }
        })
        return NextResponse.json({
            message: "Upvote done!"
        })
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        } else {
            return NextResponse.json({ error: "An unknown error while upvoting" }, { status: 500 });
        }
    }
}