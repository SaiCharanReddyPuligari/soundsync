'use client';

import StreamView from '../components/StreamView';
import Sidebar from '@/components/ui/sidebar';
import { useState, useEffect } from 'react';

const creatorId = "9ff634d9-dcb4-45c4-a604-b0cd227d3d6d";

export default function VotingPage() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // return (
  //   <div className="flex">
  //     {/* Sidebar */}
  //     <Sidebar setIsExpanded={setIsSidebarExpanded} />

  //     {/* Content Area */}
  //     <div
  //       className={`transition-all duration-300 ${
  //         isSidebarExpanded ? 'ml-[10%]' : 'ml-[5%]'
  //       } flex-1 overflow-y-auto p-8 bg-white text-black h-screen`}
  //     >
  //       <StreamView creatorId={creatorId} playVideo={true}/>
  //     </div>
  //   </div>
  // );
  return (
    <div className="flex">
      <Sidebar setIsExpanded={setIsSidebarExpanded} />

      <div
        className={`transition-all duration-300 ${
          !isMobile && isSidebarExpanded ? 'ml-[10%]' : isMobile ? 'ml-0' : 'ml-[5%]'
        } flex-1 overflow-y-auto p-8 bg-white text-black h-screen`}
      >
        <StreamView creatorId={creatorId} playVideo={true}/>
      </div>
    </div>
  );
}
