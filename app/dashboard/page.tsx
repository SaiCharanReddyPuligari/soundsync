'use client';

import StreamView from '../components/StreamView';
import Sidebar from '@/components/ui/sidebar';
import { useState } from 'react';

const creatorId = "9ff634d9-dcb4-45c4-a604-b0cd227d3d6d";

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
