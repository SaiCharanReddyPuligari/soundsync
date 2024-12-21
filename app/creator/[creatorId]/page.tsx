import StreamView from "@/app/components/StreamView";

export default function Creator({
  params,
}: {
  params: { creatorId: string };
}) {
  return <StreamView creatorId={params.creatorId} playVideo={false} />;
}
