'use client'

import { useEffect, useState } from 'react';
import StreamView from "@/app/components/StreamView";

type Params = Promise<{ creatorId: string }>;

interface CreatorProps {
  params: Params;
}

const Creator = async ({ params }: CreatorProps) => {
  // Await the params to extract creatorId
  const { creatorId } = await params;

  // Optional: You can use state here if needed for additional logic

  return <StreamView creatorId={creatorId} playVideo={false} />;
};

export default Creator;
