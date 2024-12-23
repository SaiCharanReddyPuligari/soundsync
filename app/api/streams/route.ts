import { NextRequest, NextResponse } from "next/server";
import {z} from "zod";
import {prismaClient} from "@/app/lib/db"
const YT_REGEX =
  /^(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com\/(?:watch\?(?!.*\blist=)(?:.*&)?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:[?&]\S+)?$/;
//@ts-expect-error:youtube-search-api has no TypeScript definitions
import youtubesearchapi from "youtube-search-api";
import { getServerSession } from "next-auth";

const CreateSchemeSchema = z.object({
    creatorId : z.string(),
    url: z.string()
})
// try {
//     const data = CreateSchemeSchema.parse(await request.json());
//     //const isYt= data.url.includes("youtube");
//     const isYt = data.url.match(YT_REGEX);
//     // console.log(data, isYt);
    

//     if(!isYt) {
//         return NextResponse.json({
//             message: "Wrong URL ID"
//         },{
//             status: 411
//         })
//     }

//     const extractedId = data.url.split("?v=")[1];

//     const res= await youtubesearchapi.GetVideoDetails(extractedId);
//     const thumbnailss= res.thumbnail.thumbnails;
//     thumbnailss.sort((a:{width:number}, b:{width: number})=> a.width<b.width ? -1: 1)
//     //console.log(data);
    
//     const stream= await prismaClient.stream.create({
//        data: {
//         userId : data.creatorId,
//         url: data.url,
//         extractedId,
//         type: "YouTube",
//         title: res.title ?? "Unable to fetch video",
//         imageSmallUrl: (thumbnailss.length > 1 ? thumbnailss[thumbnailss.length-2].url : thumbnailss[thumbnailss.length-1].url) ?? "https://indietips.com/wp-content/uploads/2022/12/Warm-and-Cool-Tones-In-Music.jpg",
//         imageBigUrl: thumbnailss[thumbnailss.length-1].url ?? "https://indietips.com/wp-content/uploads/2022/12/Warm-and-Cool-Tones-In-Music.jpg"

//        }
//     })
//     return NextResponse.json({
//         message:"added Stream",
//         id: stream.id,
//     })
// } catch (error) {
//     console.log(error);
    
//     return NextResponse.json({
//         message: "Error while adding a stream"
//     },{
//         status: 411
//     })
// }
export async function POST(request:NextRequest) {
    try{
        if (!request.body) {
            return NextResponse.json({
                message: "Request body is required"
            }, {
                status: 400
            });
        }
        
        try {
    const data = CreateSchemeSchema.parse(await request.json());
    //const isYt= data.url.includes("youtube");
    const isYt = data.url.match(YT_REGEX);
    // console.log(data, isYt);
    

    if(!isYt) {
        return NextResponse.json({
            message: "Wrong URL ID"
        },{
            status: 411
        })
    }

    const extractedId = data.url.split("?v=")[1];

    const res= await youtubesearchapi.GetVideoDetails(extractedId);
    const thumbnailss= res.thumbnail.thumbnails;
    thumbnailss.sort((a:{width:number}, b:{width: number})=> a.width<b.width ? -1: 1)
    //console.log(data);
    
    const stream= await prismaClient.stream.create({
       data: {
        userId : data.creatorId,
        url: data.url,
        extractedId,
        type: "YouTube",
        title: res.title ?? "Unable to fetch video",
        imageSmallUrl: (thumbnailss.length > 1 ? thumbnailss[thumbnailss.length-2].url : thumbnailss[thumbnailss.length-1].url) ?? "https://indietips.com/wp-content/uploads/2022/12/Warm-and-Cool-Tones-In-Music.jpg",
        imageBigUrl: thumbnailss[thumbnailss.length-1].url ?? "https://indietips.com/wp-content/uploads/2022/12/Warm-and-Cool-Tones-In-Music.jpg"

       }
    })
    return NextResponse.json({
        message:"added Stream",
        id: stream.id,
    })
} catch (error) {
    console.log(error);
    
    return NextResponse.json({
        message: "Error while adding a stream"
    },{
        status: 411
    })
}
    }catch(error:unknown){
        console.error("unable to parse data",error);
    }
}

export async function GET(request:NextRequest) {
    const creatorId = request.nextUrl.searchParams.get("creatorId");
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

    // if(!creatorId){
    //     return NextResponse.json({
    //         message: "Not a creator"
    //     },{
    //         status: 411,
    //     })
    // }

    
    const [streams, activeStream] = await Promise.all([await prismaClient.stream.findMany({
        where:{
            userId: creatorId ?? "",
            played: false
        },
        orderBy:{
            upvotes:{
                _count: 'desc'
            }
        },
        include:{
            _count:{
                select:{
                    upvotes: true,
                }
            },
            upvotes:{
               where:{
                userId: user.id ?? ""
               } 
            }
        }
    }), prismaClient.currentStream.findFirst({
        where: {
            userId: creatorId ?? "",
        },
        include:{
            Stream: true,
        }
    })])

    return NextResponse.json({
        streams: streams.map(({_count, ...rest})=>({
            ...rest,
            upvotes: _count.upvotes,
            haveUpvoted: rest.upvotes.length? true: false,
        })),
        activeStream
    })
}

export async function DELETE(request:NextRequest) {
    try {
        const body = await request.json();
        const { streamId } = body;
    
    
        if (!streamId) {
          return NextResponse.json(
            { message: 'Stream ID is required' },
            { status: 400 }
          );
        }
    
        const deletedStream = await prismaClient.stream.delete({
          where: {
            id: streamId,
          },
        });

        return NextResponse.json(
          { message: 'Stream deleted successfully', deletedStream },
          { status: 200 }
        );
      } catch (error: unknown) {
        console.error('Error deleting stream:', error);
    
        // Handle Prisma errors or unexpected issues
        return NextResponse.json(
          {
            message: 'Failed to delete stream',
            error: error || 'Unexpected error',
          },
          { status: 500 }
        );
      }
}