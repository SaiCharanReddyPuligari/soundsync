import StreamView from "@/app/components/StreamView";
import { NextPage } from "next";

interface CreatorProps {
    params: {
        creatorId: string;
    };
}

const Creator: NextPage<CreatorProps> = ({ params }) => {
    return <StreamView creatorId={params.creatorId} playVideo={false} />;
};

export default Creator;
