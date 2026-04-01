/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import MusicPlayer from './components/MusicPlayer';
import SnakeGame from './components/SnakeGame';

export default function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans selection:bg-cyan-500/30 overflow-hidden relative flex flex-col">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-fuchsia-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/20 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Header */}
      <header className="w-full p-6 text-center relative z-10">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">Neon</span>
          <span className="text-white mx-2">Snake</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-500 drop-shadow-[0_0_10px_rgba(217,70,239,0.5)]">& Beats</span>
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 p-6 relative z-10 w-full max-w-7xl mx-auto">
        
        {/* Left/Top: Snake Game */}
        <div className="flex-1 flex justify-center w-full">
          <SnakeGame />
        </div>

        {/* Right/Bottom: Music Player */}
        <div className="w-full lg:w-[400px] flex-shrink-0">
          <MusicPlayer />
        </div>

      </main>
      
      {/* Footer */}
      <footer className="p-4 text-center text-gray-600 text-xs font-mono relative z-10">
        AI Studio Demo • {new Date().getFullYear()}
      </footer>
    </div>
  );
}
