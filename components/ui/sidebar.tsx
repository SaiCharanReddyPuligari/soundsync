import { Dispatch, SetStateAction, useState } from 'react';
import { LogOut, Settings, User, List, Home, Menu ,LogIn} from 'lucide-react';
import {signIn, signOut, useSession } from 'next-auth/react';
//import { useRouter } from 'next/navigation';

interface SidebarProps {
  setIsExpanded: Dispatch<SetStateAction<boolean>>;
}

export default function Sidebar({ setIsExpanded }: SidebarProps) {
  const [isExpanded, setLocalIsExpanded] = useState(true);
  const session = useSession();
  //const router = useRouter

  const sidebarWidth = isExpanded ? 'w-[10%]' : 'w-[5%]';
  //const textStyle = isExpanded ? 'opacity-100 ml-3' : 'opacity-0 ml-0';

  const toggleSidebar = () => {
    const newState = !isExpanded;
    setLocalIsExpanded(newState);
    setIsExpanded(newState); // Update parent state
  };

  return (
    <div
      className={`${sidebarWidth} bg-black text-white h-screen flex flex-col justify-between fixed transition-all duration-300`}
    >
      {/* Header Section */}
      <div className="flex items-center justify-between p-4">
        <button
          onClick={toggleSidebar}
          className="flex items-center justify-center p-2 hover:bg-gray-700 rounded-md"
        >
          <Menu className="w-6 h-6" />
        </button>
        {/* <div className="flex items-center justify-center w-full">
          <div className="relative w-10 h-10 border-2 border-white transform rotate-45">
            <div className="absolute inset-0 flex items-center justify-center -rotate-45">
              <span className="text-xl font-bold text-white">S</span>
            </div>
          </div>
          <span
            className={`text-2xl font-bold transition-opacity duration-300 ${textStyle}`}
          >
            SoundSync
          </span>
        </div> */}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-6 mt-4">
        <NavItem icon={Home} label="Home" isExpanded={isExpanded} />
        <NavItem icon={User} label="Profile" isExpanded={isExpanded} />
        <NavItem icon={List} label="Creator" isExpanded={isExpanded} />
        <NavItem icon={Settings} label="Settings" isExpanded={isExpanded} />
      </nav>

      <div className="flex items-center p-4 hover:bg-gray-700 rounded-md cursor-pointer">
        {session?.data?.user ? (
          <NavItem
            icon={LogOut}
            label="Logout"
            isExpanded={isExpanded}
            onClick={() => signOut({ 
              redirect: true,
              callbackUrl: '/' 
            })}
          />
        ) : (
          <NavItem
            icon={LogIn}
            label="Sign In"
            isExpanded={isExpanded}
            onClick={() => signIn()}
          />
        )}
      </div>
    </div>
  );
}

function NavItem({
  icon: Icon,
  label,
  isExpanded,
  onClick
}: {
  icon: React.ComponentType<any>;
  label: string;
  isExpanded: boolean;
  onClick?: () => void | Promise<void>;
}) {
  return (
    <div 
      className="flex items-center p-3 hover:bg-gray-700 rounded-md cursor-pointer"
      onClick={onClick}
    >
      {/* Icon is always visible */}
      <Icon className="w-6 h-6" />
      {/* Text appears only when expanded */}
      <span
        className={`text-sm font-medium transition-opacity duration-300 ${
          isExpanded ? 'opacity-100 ml-3' : 'opacity-0 ml-0 hidden'
        }`}
      >
        {label}
      </span>
    </div>
  );
}
