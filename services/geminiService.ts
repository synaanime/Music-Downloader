
import { GoogleGenAI, Type } from "@google/genai";
import { Song } from "../types";

// Always use named parameter for apiKey and directly from process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface EnhancedSong extends Song {
  sources?: { title: string; uri: string }[];
}

export const searchMusic = async (query: string): Promise<EnhancedSong[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Perform a professional music search for: "${query}". 
      Return exactly 8 real songs with their full metadata.
      
      Requirements:
      1. title: Full song title.
      2. artist: Primary artist name.
      3. album: Album name.
      4. year: Release year.
      5. genre: Primary genre.
      6. duration: Format mm:ss.
      7. thumbnailUrl: A high-resolution (at least 600x600) direct image URL to the official album artwork (use sources like iTunes, Spotify, or Discogs).
      8. sampleRate: Suggested audiophile sample rate (e.g. 96kHz).
      9. bitDepth: Suggested bit depth (e.g. 24-bit).
      
      Return the data strictly as a JSON array.`,
      config: {
        tools: [{ googleSearch: {} }],
        // Note: For search grounding, the model might include citations. 
        // We will parse the text carefully.
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
              thumbnailUrl: { type: Type.STRING },
              sampleRate: { type: Type.STRING },
              bitDepth: { type: Type.STRING }
            },
            required: ["title", "artist", "album", "year", "genre", "duration", "thumbnailUrl"]
          },
        },
      },
    });

    const text = response.text || '[]';
    // The response.text with responseMimeType should be clean JSON.
    const songsData = JSON.parse(text);

    // Extract grounding URLs as per requirements
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .filter((chunk: any) => chunk.web)
      .map((chunk: any) => ({
        title: chunk.web.title || 'Source',
        uri: chunk.web.uri
      }));

    return songsData.map((song: any, index: number) => ({
      ...song,
      id: song.id || `song-${Date.now()}-${index}`,
      bitrate: "320kbps",
      sources: sources.length > 0 ? sources : undefined
    }));
  } catch (error) {
    console.error("Gemini Search Error:", error);
    // If JSON fails, it might be due to grounding text. Return empty or attempt fallback.
    return [];
  }
};
