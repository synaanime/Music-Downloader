
import React from 'react';
import { Download, Disc, Clock, Image as ImageIcon, Headphones, Activity } from 'lucide-react';
import { Song } from '../types';

interface MusicCardProps {
  song: Song;
  onDownload: (song: Song) => void;
  onDownloadArt: (song: Song) => void;
}

const MusicCard: React.FC<MusicCardProps> = ({ song, onDownload, onDownloadArt }) => {
  return (
    <div className="group relative bg-[#111111] border border-white/5 rounded-2xl overflow-hidden hover:border-blue-500/40 transition-all duration-500 shadow-2xl flex flex-col">
      <div className="aspect-square relative overflow-hidden bg-black">
        <img 
          src={song.thumbnailUrl} 
          alt={`${song.album} cover`} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-80 group-hover:opacity-100"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=600&auto=format&fit=crop';
          }}
        />
        
        {/* Quality Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
          <div className="bg-black/80 backdrop-blur-md px-2 py-1 rounded text-[10px] font-black text-blue-400 border border-blue-500/20 uppercase tracking-widest flex items-center gap-1.5">
            <Activity className="w-3 h-3" /> {song.bitrate}
          </div>
          {song.sampleRate && (
            <div className="bg-black/80 backdrop-blur-md px-2 py-1 rounded text-[9px] font-bold text-gray-400 border border-white/10 uppercase tracking-tighter">
              {song.sampleRate} {song.bitDepth && `/ ${song.bitDepth}`}
            </div>
          )}
        </div>

        {/* Action Overlay */}
        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-3 p-4">
          <button 
            onClick={() => onDownload(song)}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all"
          >
            <Download className="w-4 h-4" /> Export High-Res
          </button>
          <button 
            onClick={() => onDownloadArt(song)}
            className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-lg text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest border border-white/10 flex items-center justify-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all delay-75"
          >
            <ImageIcon className="w-4 h-4" /> Save Master Art
          </button>
        </div>
      </div>
      
      <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          <h3 className="font-bold text-white truncate text-lg tracking-tight" title={song.title}>
            {song.title}
          </h3>
          <p className="text-sm text-gray-400 truncate flex items-center gap-2 font-medium">
            <Disc className="w-4 h-4 text-blue-500/60" /> {song.artist}
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-[11px] text-gray-500 font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5"><Headphones className="w-3.5 h-3.5" /> {song.genre}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {song.duration}</span>
          </div>
          
          <div className="pt-3 border-t border-white/5 flex items-center justify-between">
            <span className="text-[10px] text-gray-600 font-medium truncate max-w-[140px] italic">{song.album}</span>
            <span className="text-[10px] text-gray-400 font-black">{song.year}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicCard;
