import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import {prismaClient} from "@/app/lib/db"

export async function GET(){
    const session = await getServerSession();
        //get rid of the db call here
        const user = await prismaClient.user.findFirst({
            where:{
                email: session?.user?.email ?? ""
            }
        });
    
        if(!user){
            return NextResponse.json({
                message: "Unauthorizes user"
            },{
                status: 483
            })
        }
        //const creatorId = request.nextUrl.searchParams.get("creatorId");

        const streams = await prismaClient.stream.findMany({
            where:{
                userId: user.id ?? ""
            },
            include:{
                _count:{
                    select:{
                        upvotes: true,
                    }
                },
                upvotes:{
                   where:{
                    userId: user.id
                   } 
                }
            }
        })
    
        return NextResponse.json({
            streams: streams.map(({_count, ...rest})=>({
                ...rest,
                upvotes: _count.upvotes,
                haveUpvoted: rest.upvotes.length? true: false,
            })),
        })
}