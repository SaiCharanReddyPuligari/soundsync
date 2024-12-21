import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import {z} from 'zod';

const UpvoteSchema = z.object({
    streamId : z.string(),
})

export async function POST(request:NextRequest) {
    const session = await getServerSession();
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
        await prismaClient.upvote.delete({
            where:{
                userId_streamId:{
                    userId: user.id,
                    streamId: data.streamId,
                }
            }
        })
        return NextResponse.json({
            message: "Downvote done!"
        })
    } catch (error) {
        return NextResponse.json({
            message: "Error in downvoting"
        },{
            status: 403
        })
    }
}