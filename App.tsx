
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Library, 
  Settings, 
  History, 
  Music2, 
  LayoutGrid,
  Zap,
  Github,
  Loader2,
  Sparkles,
  SearchX,
  ExternalLink
} from 'lucide-react';
import { Song } from './types';
import { searchMusic, EnhancedSong } from './services/geminiService';
import MusicCard from './components/MusicCard';
import DownloadProgress from './components/DownloadProgress';

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [songs, setSongs] = useState<EnhancedSong[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadingSong, setDownloadingSong] = useState<Song | null>(null);
  const [recentDownloads, setRecentDownloads] = useState<Song[]>([]);
  const [selectedQuality, setSelectedQuality] = useState<'320kbps' | 'FLAC'>('320kbps');
  const [searchSources, setSearchSources] = useState<{ title: string; uri: string }[]>([]);

  // Initial popular search
  useEffect(() => {
    handleSearch('Top Audiophile Master Tracks 2024');
  }, []);

  const handleSearch = async (query: string) => {
    if (!query || isLoading) return;
    setIsLoading(true);
    setSearchSources([]);
    try {
      const results = await searchMusic(query);
      if (results.length > 0) {
        const updatedResults = results.map(song => ({ ...song, bitrate: selectedQuality }));
        setSongs(updatedResults);
        // Collect all sources from all songs
        const allSources = results.reduce((acc: any[], curr) => {
          if (curr.sources) return [...acc, ...curr.sources];
          return acc;
        }, []);
        // Unique sources
        const uniqueSources = Array.from(new Set(allSources.map(s => s.uri)))
          .map(uri => allSources.find(s => s.uri === uri))
          .filter(Boolean) as { title: string; uri: string }[];
        setSearchSources(uniqueSources);
      } else {
        setSongs([]);
      }
    } catch (error) {
      console.error("Search failed:", error);
      setSongs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const onDownload = (song: Song) => {
    setDownloadingSong({ ...song, bitrate: selectedQuality });
  };

  const onDownloadArt = (song: Song) => {
    window.open(song.thumbnailUrl, '_blank');
  };

  const handleDownloadComplete = () => {
    if (downloadingSong) {
      setRecentDownloads(prev => [downloadingSong, ...prev].slice(0, 5));
    }
    setDownloadingSong(null);
  };

  return (
    <div className="min-h-screen bg-[#060606] flex flex-col md:flex-row text-white selection:bg-blue-600/40">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-72 bg-[#0a0a0a] border-r border-white/5 flex-col p-8 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/20 border border-blue-400/20">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <div>
            <span className="text-2xl font-black tracking-tighter block leading-none">SONICFETCH</span>
            <span className="text-[10px] text-blue-500 font-black tracking-[0.3em] uppercase opacity-80">Studio Engine</span>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <button className="w-full flex items-center gap-4 px-4 py-3.5 text-sm font-black text-white bg-blue-600/10 rounded-2xl border border-blue-500/20 shadow-lg">
            <LayoutGrid className="w-5 h-5 text-blue-500" /> Dashboard
          </button>
          <button className="w-full flex items-center gap-4 px-4 py-3.5 text-sm font-black text-gray-500 hover:text-white hover:bg-white/5 transition-all rounded-2xl group">
            <Library className="w-5 h-5 group-hover:text-blue-500" /> Hi-Fi Library
          </button>
          <button className="w-full flex items-center gap-4 px-4 py-3.5 text-sm font-black text-gray-500 hover:text-white hover:bg-white/5 transition-all rounded-2xl group">
            <History className="w-5 h-5 group-hover:text-blue-500" /> Export History
          </button>
          <button className="w-full flex items-center gap-4 px-4 py-3.5 text-sm font-black text-gray-500 hover:text-white hover:bg-white/5 transition-all rounded-2xl group">
            <Settings className="w-5 h-5 group-hover:text-blue-500" /> Engine Settings
          </button>
        </nav>

        <div className="mt-auto space-y-6">
          <div className="relative group overflow-hidden bg-gradient-to-br from-gray-900 to-black rounded-3xl p-6 border border-white/10 shadow-2xl">
            <div className="relative z-10">
              <Sparkles className="w-8 h-8 mb-4 text-blue-500" />
              <p className="text-[10px] font-black text-gray-500 mb-1 tracking-widest uppercase">Master Subscription</p>
              <p className="text-sm font-bold mb-5 leading-tight text-white">Unlock 192kHz Studio Master quality exports.</p>
              <button className="w-full py-3 bg-blue-600 text-white rounded-xl text-xs font-black hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20">
                Go Professional
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between text-gray-600 px-2 text-[10px] font-black uppercase tracking-widest">
            <Github className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
            <span>Core v3.2.0</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-[#060606]/95 backdrop-blur-2xl border-b border-white/5 p-4 md:px-12 md:py-10">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 items-center">
            <div className="md:hidden flex items-center gap-3 mb-4 w-full">
              <Zap className="w-8 h-8 text-blue-500" />
              <span className="text-2xl font-black tracking-tighter">SONICFETCH</span>
            </div>
            
            <div className="relative flex-1 w-full group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-blue-500 transition-all" />
              <input 
                type="text"
                placeholder="Find any song in studio quality..."
                className="w-full bg-[#111111] border border-white/10 text-white pl-16 pr-6 py-5 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-500/50 transition-all placeholder:text-gray-700 shadow-2xl text-lg font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
              />
              {isLoading && (
                <div className="absolute right-6 top-1/2 -translate-y-1/2">
                  <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto pb-1 no-scrollbar bg-[#111111] p-2 rounded-2xl border border-white/10 shadow-inner">
              <button 
                onClick={() => setSelectedQuality('320kbps')}
                className={`px-6 py-3 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all whitespace-nowrap ${
                  selectedQuality === '320kbps' 
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30' 
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                HQ MP3
              </button>
              <button 
                onClick={() => setSelectedQuality('FLAC')}
                className={`px-6 py-3 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all whitespace-nowrap ${
                  selectedQuality === 'FLAC' 
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30' 
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                LOSSLESS FLAC
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full">
          {/* Grounding Sources */}
          {searchSources.length > 0 && (
            <div className="mb-8 p-4 bg-blue-600/5 rounded-2xl border border-blue-500/10">
              <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <ExternalLink className="w-3 h-3" /> Search Verification Sources
              </h3>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {searchSources.map((source, i) => (
                  <a 
                    key={i} 
                    href={source.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] text-gray-500 hover:text-blue-400 transition-colors underline decoration-blue-500/30"
                  >
                    {source.title}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Recent Exports */}
          {recentDownloads.length > 0 && (
            <section className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] flex items-center gap-3">
                  <History className="w-4 h-4 text-blue-600" /> Recent Exports
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {recentDownloads.map((song) => (
                  <div key={song.id + '-rec'} className="bg-[#0c0c0c] p-4 rounded-2xl border border-white/5 flex gap-4 items-center group cursor-pointer hover:border-blue-500/20 transition-all shadow-xl">
                    <img src={song.thumbnailUrl} className="w-12 h-12 rounded-xl object-cover shadow-2xl group-hover:scale-105 transition-transform" alt="" />
                    <div className="min-w-0">
                      <p className="text-[11px] font-black text-white truncate leading-tight">{song.title}</p>
                      <p className="text-[9px] text-gray-600 font-bold uppercase truncate mt-1">{song.artist}</p>
                      <div className="flex gap-2 mt-1.5">
                        <span className="text-[8px] text-blue-500 font-black tracking-widest">MASTER</span>
                        <span className="text-[8px] text-gray-700 font-black">{song.bitrate}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Results Grid */}
          <section>
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-black text-white tracking-tighter flex items-center gap-4">
                  <Music2 className="w-8 h-8 text-blue-600" /> 
                  {isLoading ? 'Scanning Digital Archives...' : 'Verified Records'}
                </h2>
                <p className="text-xs text-gray-600 font-black uppercase tracking-[0.2em] mt-2">Audiophile-grade search active</p>
              </div>
            </div>

            {songs.length === 0 && !isLoading ? (
              <div className="flex flex-col items-center justify-center py-40 text-center">
                <div className="w-32 h-32 bg-[#0c0c0c] rounded-[2.5rem] flex items-center justify-center mb-8 border border-white/5 shadow-2xl">
                  <SearchX className="w-12 h-12 text-gray-800" />
                </div>
                <h3 className="text-3xl font-black mb-3 tracking-tighter">Digital Library Empty</h3>
                <p className="max-w-md text-gray-500 font-medium leading-relaxed">Search for a specific track, album, or artist to begin high-bitrate extraction and metadata processing.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                {songs.map((song) => (
                  <MusicCard 
                    key={song.id} 
                    song={{...song, bitrate: selectedQuality}} 
                    onDownload={onDownload} 
                    onDownloadArt={onDownloadArt}
                  />
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Footer */}
        <footer className="p-16 border-t border-white/5 text-center bg-black/20">
          <div className="flex flex-col items-center gap-6">
             <div className="flex items-center gap-3 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
                <Zap className="w-5 h-5 text-blue-600" />
                <span className="text-lg font-black tracking-tighter">SONICFETCH STUDIO</span>
             </div>
             <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.4em] max-w-xl leading-loose">
               Real-time Bit-Perfect Encoding • 64-bit Floating Point Processing • AI-Driven Metadata Normalization
             </p>
             <div className="flex items-center gap-10 mt-6 text-[10px] font-black tracking-widest text-gray-500">
               <a href="#" className="hover:text-blue-500 transition-colors">SECURITY</a>
               <a href="#" className="hover:text-blue-500 transition-colors">PROTOCOL</a>
               <a href="#" className="hover:text-blue-500 transition-colors">VERSION INFO</a>
             </div>
          </div>
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
