
export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  year: string;
  genre: string;
  thumbnailUrl: string;
  duration: string;
  bitrate: "320kbps" | "FLAC";
  status?: 'idle' | 'searching' | 'converting' | 'tagging' | 'completed';
}

export interface SearchResponse {
  results: Song[];
}
