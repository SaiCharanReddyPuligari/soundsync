import { RetroButton } from './retro-elements';
import { Share2 } from 'lucide-react';
import {toast} from 'react-toastify';

export function ShareButton({ creatorId }: { creatorId: string }) {
  // console.log(window.location.hostname);
  const handleShare = () => {
    
    
    //const shareableLink = `${window.location.protocol}//${window.location.hostname}:3000/creator/${creatorId}`;//for testing local environment
    const shareableLink = `${window.location.protocol}//${window.location.hostname}/creator/${creatorId}`; //for production environment

    
    // Copy the link to the clipboard
    navigator.clipboard
      .writeText(shareableLink)
      .then(() => {
        toast.success('Link copied to clipboard!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        // Open the link in a new tab
        window.open(shareableLink, '_blank', 'noopener,noreferrer');
      })
      .catch((err) => {
        console.error('Could not copy text:', err);
        toast.error('Failed to copy link. Please try again.', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      });
  };

  return (
    <RetroButton onClick={handleShare} className="flex items-center space-x-2">
      <Share2 className="w-5 h-5" />
      <span>Share</span>
    </RetroButton>
  );
}
