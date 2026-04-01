import { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: "Neon Drive (AI Gen)",
    artist: "CyberMinds",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "text-fuchsia-500",
    glow: "shadow-[0_0_15px_rgba(217,70,239,0.5)]"
  },
  {
    id: 2,
    title: "Digital Horizon (AI Gen)",
    artist: "SynthNet",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "text-cyan-400",
    glow: "shadow-[0_0_15px_rgba(34,211,238,0.5)]"
  },
  {
    id: 3,
    title: "Cyberpunk City (AI Gen)",
    artist: "NeuralBeats",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    color: "text-lime-400",
    glow: "shadow-[0_0_15px_rgba(163,230,53,0.5)]"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    } else if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleEnded = () => {
    nextTrack();
  };

  return (
    <div className={`bg-gray-900/80 backdrop-blur-md border border-gray-800 rounded-2xl p-6 flex flex-col items-center w-full max-w-md mx-auto transition-all duration-500 ${currentTrack.glow}`}>
      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onEnded={handleEnded}
      />
      
      <div className="w-full flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-full bg-gray-800 ${currentTrack.color} animate-pulse`}>
            <Music size={24} />
          </div>
          <div>
            <h3 className={`font-bold text-lg ${currentTrack.color} drop-shadow-[0_0_8px_currentColor]`}>
              {currentTrack.title}
            </h3>
            <p className="text-gray-400 text-sm">{currentTrack.artist}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              setIsMuted(false);
            }}
            className="w-20 accent-cyan-400"
          />
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 w-full">
        <button 
          onClick={prevTrack}
          className="text-gray-400 hover:text-white transition-colors p-2"
        >
          <SkipBack size={28} />
        </button>
        
        <button 
          onClick={togglePlay}
          className={`p-4 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-all ${isPlaying ? currentTrack.glow : ''}`}
        >
          {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
        </button>
        
        <button 
          onClick={nextTrack}
          className="text-gray-400 hover:text-white transition-colors p-2"
        >
          <SkipForward size={28} />
        </button>
      </div>
      
      {/* Visualizer bars (fake) */}
      <div className="flex items-end justify-center gap-1 h-8 mt-6 w-full opacity-70">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className={`w-2 rounded-t-sm ${currentTrack.color.replace('text-', 'bg-')}`}
            style={{ 
              height: isPlaying ? `${Math.random() * 100}%` : '10%',
              transition: 'height 0.2s ease-in-out',
              animation: isPlaying ? `bounce ${0.5 + Math.random()}s infinite alternate` : 'none'
            }}
          />
        ))}
      </div>
    </div>
  );
}
