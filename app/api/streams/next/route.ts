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
                message: "Unauthorizes user in next"
            },{
                status: 483
            })
        }
        //console.log("before");
        

        const mostUpvotedStream = await prismaClient.stream.findFirst({
            where:{
                userId: user.id,
                played: false,
            },
            orderBy:{
                upvotes:{
                    _count: 'desc'
                }
            }
        })

        await Promise.all([prismaClient.currentStream.upsert({
                    where:{
                        userId: user.id,
                    },
                    update:{
                        userId: user.id,
                        streamId: mostUpvotedStream?.id
                    },
                    create:{
                        userId: user.id,
                        streamId: mostUpvotedStream?.id
                    }
                    }),
                    prismaClient.stream.update({
                        where:{
                            id: mostUpvotedStream?.id
                        },
                        data :{
                            played: true,
                            playedTS: new Date()
                        }
        })])
        // .then(()=>prismaClient.stream.delete({
        //     where:{
        //         id: mostUpvotedStream?.id
        //     }
        // }))

        // console.log(mostUpvotedStream, "after call");
        // console.log(value);
        
        
        return NextResponse.json({
            stream: mostUpvotedStream,
        })
    }