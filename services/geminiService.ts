
import { GoogleGenAI, Type } from "@google/genai";
import { Song } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const searchMusic = async (query: string): Promise<Song[]> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Search for popular music matching the query: "${query}". Provide a list of 6-8 songs with accurate metadata including title, artist, album, year, and genre. Be creative with the IDs but consistent.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            artist: { type: Type.STRING },
            album: { type: Type.STRING },
            year: { type: Type.STRING },
            genre: { type: Type.STRING },
            duration: { type: Type.STRING },
          },
          required: ["id", "title", "artist", "album", "year", "genre", "duration"],
        },
      },
    },
  });

  const songsData = JSON.parse(response.text || '[]');
  
  // Enhance with placeholder images for the UI
  return songsData.map((song: any, index: number) => ({
    ...song,
    bitrate: "320kbps",
    thumbnailUrl: `https://picsum.photos/seed/${encodeURIComponent(song.album + index)}/400/400`,
  }));
};
