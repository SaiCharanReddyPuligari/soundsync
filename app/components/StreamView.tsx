'use client'

import { useState, useEffect } from 'react'
import { RetroCard, RetroButton, RetroInput, RetroHeading } from '@/app/components/retro-elements'
import { ShareButton } from '@/app/components/share-button'
import { ChevronDown,LucideDelete, ChevronUp, Loader } from 'lucide-react'
import { NextResponse } from 'next/server'
import { ToastContainer } from 'react-toastify'
import ReactPlayer from 'react-player'
// import { Stream } from 'stream'


interface Stream {
  id: string
  title: string
  url: string
  upvotes: number
  haveUpvoted: boolean
  imageSmallUrl:string  
  imageBigUrl: string
  createdAt?: Date
}

const Refresh_Interval_ms = 30000 // 30 seconds

export default function StreamView({
    creatorId,
    playVideo = false,
}:{
    creatorId: string,
    playVideo :boolean
}) {
  const [videoUrl, setVideoUrl] = useState('')
  const [streams, setStreams] = useState<Stream[]>([])
  const [currentStream, setCurrentStream] = useState<Stream | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [playing] = useState(true)


  async function refreshStreams() {
    try {
      const res = await fetch(`/api/streams/?creatorId=${creatorId}`, {
        credentials: "include"
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch streams');
      }
      
      const data = await res.json();
      console.log(data);
      if (!currentStream && data.streams.length > 0) {
        const firstStream = data.streams[0]
        setCurrentStream(firstStream)
        
        const remainingStreams = data.streams
          .filter((stream: Stream) => stream.id !== firstStream.id)
          .sort((a:Stream, b:Stream) => {
            if (a.upvotes === b.upvotes) {
              return new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime()
            }
            return b.upvotes - a.upvotes
          })
        
        setStreams(remainingStreams)
      } else {
        const queuedStreams = data.streams
          .filter((stream : Stream) => stream.id !== currentStream?.id)
          .sort((a:Stream, b:Stream) => {
            if (a.upvotes === b.upvotes) {
                return new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime()
            }
            return b.upvotes - a.upvotes
          })
        
        setStreams(queuedStreams)
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching streams:', err);
      setError('Failed to load streams. Please try again later.');
    }finally{
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshStreams();
    const interval = setInterval(()=>{
      refreshStreams()  
    }, Refresh_Interval_ms)
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const videoId = extractVideoId(videoUrl);
    console.log(videoId);
    
    if (!videoId) {
      console.error("Invalid YouTube URL");
      setError("Invalid YouTube URL. Please check and try again.");
      return;
    }
    //setLoading(true);
    
    try {
      setIsSubmitting(true);
      const requestBody = JSON.stringify({
        creatorId: creatorId,
        url: videoUrl,   
      });
      console.log("This is req",requestBody);
      
      const response = await fetch('/api/streams', {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        credentials: "include", // Add this only if cookies/session are required
        body: requestBody
      });
  
      //Handle response
      const data = await response.json();
      console.log("Here is response and body",response,data);
      
  
      if (!response.ok) {
        throw new Error(data.message || "Failed to add stream");
      }
  
      //setStreams([...streams, await response.json()]);
      setVideoUrl(""); 
      setError(null);
      await refreshStreams(); 
    } catch (err) {
      console.error("Error submitting stream:", err);
      setError("Failed to add stream. Please try again.");
    }finally{
      //setLoading(false);
      setIsSubmitting(false);
    }
  }

  const handleVote = async (id: string, increment: number, haveUpvoted: boolean) => {
    setStreams(streams.map(stream => 
      stream.id === id ? { 
        ...stream, 
        upvotes: stream.upvotes + increment,
        haveUpvoted: !stream.haveUpvoted
      } : stream
    ).sort((a, b) => (b.upvotes) - (a.upvotes)))

    
      fetch(`/api/streams/${haveUpvoted ? "upvote": "downvote"}`,{
        method: "POST",
        body: JSON.stringify({
          streamId: id,
        })
      })
    
  }

  const extractVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    if(!url){
      return NextResponse.json({
        message:"undefined URL"
      })
    }
    const match = url.match(regExp)
    //console.log(match);
    
    return (match && match[2].length === 11) ? match[2] : null
  }

  const handleDelete = async (id: string)=>{
      await fetch('/api/streams',{
        method: "DELETE",
        body: JSON.stringify({
          streamId : id,
        })
      })
      refreshStreams()
  }
  const playNext = async () => {
    if (streams.length >= 0) {
      const nextStream = await fetch('/api/streams/next',{
        method: "GET",
      })
      const json= await nextStream.json();
      //console.log(json);
      await refreshStreams()
      setCurrentStream(json.stream);
      setStreams(streams.slice(1)); // Remove the current stream from the queue
    } else {
      setCurrentStream(null); // No more streams to play
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-black flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white text-black flex items-center justify-center">
        <RetroCard>
          <p className="text-xl font-bold mb-4">{error}</p>
          <RetroButton onClick={refreshStreams} disabled={loading}>Try Again</RetroButton>
        </RetroCard>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-black p-8">
      <div className="flex justify-between items-center mb-8">
        <RetroHeading>SoundSync Voting</RetroHeading>
        <ShareButton creatorId={creatorId}/>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Currently Playing</h2>
          <RetroCard className="aspect-video">
          {currentStream ? (
              <div className="aspect-video">
                <ReactPlayer
                  url={`https://www.youtube.com/embed/${extractVideoId(currentStream.url)}`}
                  width="100%"
                  height="100%"
                  playing={playing}
                  controls={true}
                  onEnded={playNext}
                  config={{
                    youtube: {
                      playerVars: {
                        autoplay: 1,
                        accelerometer: 1,
                        encrypted_media: 1,
                        gyroscope: 1,
                        picture_in_picture: 1
                      }
                    }
                  }}
                />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-xl font-bold">No stream currently playing</p>
              </div>
            )}
          </RetroCard>
          {playVideo && <RetroButton onClick={playNext} className='w-100%'>Play Next</RetroButton>}
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-4">Add to Queue</h2>
          <RetroCard>
            <form onSubmit={handleSubmit} className="space-y-4">
              <RetroInput
                type="text"
                value={videoUrl}
                onChange={(e) => {
                  setVideoUrl(e.target.value);
                  if (!extractVideoId(e.target.value)) {
                    alert("Enter a valid YouTube URL") // Clear error if valid
                  }
                }}
                placeholder="Paste YouTube URL here"
              />
              <RetroButton type="submit" className="w-full justify-center" disabled={isSubmitting}>
              {isSubmitting ? <Loader className="w-5 h-5 animate-spin" /> : "Add to Queue"}
              </RetroButton>
            </form>
            
            {videoUrl && extractVideoId(videoUrl) && (
              <div className="mt-4 aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${extractVideoId(videoUrl)}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  onEnded={playNext}
                ></iframe>
              </div>
            )}
          </RetroCard>
        </div>
      </div>
      {/* Upcoming Streams */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Upcoming Streams</h2>
        <RetroCard>
          {streams.length > 0 ? (
            <ul className="space-y-4">
              {streams.map((stream) => (
                <li key={stream.id} className="flex items-center justify-between p-2 border-b-2 border-black last:border-b-0">
                  <img src={stream.imageSmallUrl} alt={`Thumbnail for ${stream.title}`} className='w-30 h-20 object-cover rounded'/>
                  <span className="font-bold">{stream.title}</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold">{stream.upvotes}</span>
                    <RetroButton onClick={() => handleVote(stream.id,stream.haveUpvoted? -1: 1, stream.haveUpvoted? false: true)} className="p-2">
                      {stream.haveUpvoted? <ChevronDown className="w-5 h-5" />: <ChevronUp className="w-5 h-5" />}
                    </RetroButton>
                    <RetroButton onClick={
                      ()=>handleDelete(stream.id)
                      }className="p-2">
                       <LucideDelete/>
                    </RetroButton>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center py-4">No streams in the queue</p>
          )}
        </RetroCard>
      </div>
      <ToastContainer
            position= 'top-right'
            autoClose= {3000}
            hideProgressBar= {false}
            closeOnClick= {true}
            pauseOnHover= {true}
            draggable= {true}
      />
    </div>
  )
}
