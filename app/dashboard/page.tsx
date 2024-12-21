'use client';

import StreamView from '../components/StreamView';
import Sidebar from '@/components/ui/sidebar';
import { useState } from 'react';

const creatorId = "04f48e7f-865f-494d-bfb8-d86fc2e31510";

export default function VotingPage() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar setIsExpanded={setIsSidebarExpanded} />

      {/* Content Area */}
      <div
        className={`transition-all duration-300 ${
          isSidebarExpanded ? 'ml-[10%]' : 'ml-[5%]'
        } flex-1 overflow-y-auto p-8 bg-white text-black h-screen`}
      >
        <StreamView creatorId={creatorId} playVideo={true}/>
      </div>
    </div>
  );
}
