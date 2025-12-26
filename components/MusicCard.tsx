
import React from 'react';
import { Download, Music, Disc, Calendar, Clock, HardDrive } from 'lucide-react';
import { Song } from '../types';

interface MusicCardProps {
  song: Song;
  onDownload: (song: Song) => void;
}

const MusicCard: React.FC<MusicCardProps> = ({ song, onDownload }) => {
  return (
    <div className="group relative bg-[#181818] border border-white/5 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 transform hover:-translate-y-1">
      <div className="aspect-square relative overflow-hidden">
        <img 
          src={song.thumbnailUrl} 
          alt={song.album} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button 
            onClick={() => onDownload(song)}
            className="bg-blue-600 hover:bg-blue-500 p-3 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300"
          >
            <Download className="w-6 h-6 text-white" />
          </button>
        </div>
        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-blue-400 border border-white/10 uppercase tracking-widest">
          {song.bitrate}
        </div>
      </div>
      
      <div className="p-4 space-y-2">
        <h3 className="font-bold text-white truncate text-lg leading-tight" title={song.title}>
          {song.title}
        </h3>
        <p className="text-sm text-gray-400 truncate flex items-center gap-1.5">
          <Disc className="w-3.5 h-3.5" /> {song.artist}
        </p>
        
        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-500 uppercase font-semibold">
          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {song.year}</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {song.duration}</span>
        </div>
      </div>
    </div>
  );
};

export default MusicCard;
