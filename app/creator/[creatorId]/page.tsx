import StreamView from "@/app/components/StreamView";

export default async function Creator({
    params: {
        creatorId,
    }
}:{
    params: {
        creatorId: string
    }
}){
   return <StreamView creatorId={creatorId} playVideo={false}/>
}