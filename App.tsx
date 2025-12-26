
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Library, 
  Download, 
  Settings, 
  History, 
  Music2, 
  LayoutGrid,
  Zap,
  Github,
  Info,
  Loader2
} from 'lucide-react';
import { Song } from './types';
import { searchMusic } from './services/geminiService';
import MusicCard from './components/MusicCard';
import DownloadProgress from './components/DownloadProgress';

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadingSong, setDownloadingSong] = useState<Song | null>(null);
  const [recentDownloads, setRecentDownloads] = useState<Song[]>([]);
  const [selectedQuality, setSelectedQuality] = useState<'320kbps' | 'FLAC'>('320kbps');

  // Initial popular search
  useEffect(() => {
    handleSearch('Top Hits 2024');
  }, []);

  const handleSearch = async (query: string) => {
    if (!query) return;
    setIsLoading(true);
    try {
      const results = await searchMusic(query);
      // Map existing results to the currently selected quality
      const updatedResults = results.map(song => ({ ...song, bitrate: selectedQuality }));
      setSongs(updatedResults);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onDownload = (song: Song) => {
    // Ensure the downloaded song reflects the current global quality preference
    setDownloadingSong({ ...song, bitrate: selectedQuality });
  };

  const handleDownloadComplete = () => {
    if (downloadingSong) {
      setRecentDownloads(prev => [downloadingSong, ...prev].slice(0, 5));
    }
    setDownloadingSong(null);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col md:flex-row">
      {/* Sidebar - Desktop Only */}
      <aside className="hidden md:flex w-64 bg-[#111] border-r border-white/5 flex-col p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-2 mb-10 px-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">SonicFetch</span>
        </div>

        <nav className="flex-1 space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-white bg-white/5 rounded-lg border border-white/5">
            <LayoutGrid className="w-4 h-4 text-blue-500" /> Dashboard
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all rounded-lg">
            <Library className="w-4 h-4" /> My Library
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all rounded-lg">
            <History className="w-4 h-4" /> Downloads
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all rounded-lg">
            <Settings className="w-4 h-4" /> Settings
          </button>
        </nav>

        <div className="mt-auto space-y-4">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-4 text-white shadow-xl shadow-blue-900/20">
            <p className="text-xs font-bold opacity-80 mb-1">PRO FEATURES</p>
            <p className="text-sm mb-3">Upgrade for FLAC and unlimited exports.</p>
            <button className="w-full py-2 bg-white text-blue-700 rounded-lg text-xs font-bold hover:bg-opacity-90 transition-colors">
              Upgrade Now
            </button>
          </div>
          <div className="flex items-center justify-between text-gray-500 px-2">
            <Github className="w-5 h-5 cursor-pointer hover:text-white" />
            <Info className="w-5 h-5 cursor-pointer hover:text-white" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Header / Search */}
        <header className="sticky top-0 z-30 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 p-4 md:p-6">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4 items-center">
            <div className="md:hidden flex items-center gap-2 mb-2 w-full">
              <Zap className="w-5 h-5 text-blue-500" />
              <span className="text-lg font-bold">SonicFetch</span>
            </div>
            
            <div className="relative flex-1 w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="text"
                placeholder="Search for song, artist, or paste URL..."
                className="w-full bg-[#181818] border border-white/5 text-white pl-12 pr-4 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-gray-600 shadow-inner"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
              />
              {isLoading && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 no-scrollbar">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">Quality:</span>
              <button 
                onClick={() => setSelectedQuality('320kbps')}
                className={`px-4 py-2 text-xs font-bold rounded-full border transition-all whitespace-nowrap ${
                  selectedQuality === '320kbps' 
                    ? 'bg-blue-600/10 text-blue-500 border-blue-500/30' 
                    : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10'
                }`}
              >
                320kbps MP3
              </button>
              <button 
                onClick={() => setSelectedQuality('FLAC')}
                className={`px-4 py-2 text-xs font-bold rounded-full border transition-all whitespace-nowrap ${
                  selectedQuality === 'FLAC' 
                    ? 'bg-blue-600/10 text-blue-500 border-blue-500/30' 
                    : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10'
                }`}
              >
                Lossless FLAC
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full">
          {/* Recent Activity (Optional / Conditional) */}
          {recentDownloads.length > 0 && (
            <section className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <History className="w-4 h-4" /> Recent Exports
                </h2>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                {recentDownloads.map((song) => (
                  <div key={song.id + '-rec'} className="flex-shrink-0 w-48 bg-[#111] p-3 rounded-xl border border-white/5 flex gap-3 items-center">
                    <img src={song.thumbnailUrl} className="w-10 h-10 rounded object-cover" alt="" />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white truncate">{song.title}</p>
                      <p className="text-xs text-gray-500 truncate">{song.artist}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Results Grid */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Music2 className="w-5 h-5 text-blue-500" /> 
                {isLoading ? 'Fetching Results...' : 'Top Results'}
              </h2>
              <p className="text-sm text-gray-500">{songs.length} songs found</p>
            </div>

            {songs.length === 0 && !isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">No Music Found</h3>
                <p className="max-w-xs text-sm">Try searching for a different artist or song name to start downloading.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {songs.map((song) => (
                  <MusicCard key={song.id} song={{...song, bitrate: selectedQuality}} onDownload={onDownload} />
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Footer */}
        <footer className="p-8 border-t border-white/5 text-center text-xs text-gray-600">
          <p>© 2024 SonicFetch Pro. All rights reserved.</p>
          <p className="mt-2 flex items-center justify-center gap-4">
            <span>Powered by Gemini AI</span>
            <span className="w-1 h-1 bg-gray-800 rounded-full"></span>
            <span>Metadata Extraction Active</span>
            <span className="w-1 h-1 bg-gray-800 rounded-full"></span>
            <span>FFmpeg Ready</span>
          </p>
        </footer>
      </main>

      {/* Download Overlay */}
      {downloadingSong && (
        <DownloadProgress 
          song={downloadingSong} 
          onClose={handleDownloadComplete} 
        />
      )}
    </div>
  );
};

export default App;
