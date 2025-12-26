
import React, { useEffect, useState } from 'react';
import { CheckCircle, Loader2, FileAudio, Tag, Music, X } from 'lucide-react';
import { Song } from '../types';

interface DownloadProgressProps {
  song: Song;
  onClose: () => void;
}

const DownloadProgress: React.FC<DownloadProgressProps> = ({ song, onClose }) => {
  const [step, setStep] = useState<'fetching' | 'converting' | 'tagging' | 'done'>('fetching');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer: any;
    
    const runSimulation = async () => {
      // Step 1: Fetching
      setStep('fetching');
      for (let i = 0; i <= 30; i += 2) {
        setProgress(i);
        await new Promise(r => setTimeout(r, 40));
      }
      
      // Step 2: Converting (Simulating FFmpeg)
      setStep('converting');
      for (let i = 30; i <= 75; i += 1) {
        setProgress(i);
        await new Promise(r => setTimeout(r, 60));
      }
      
      // Step 3: Tagging (Simulating Mutagen)
      setStep('tagging');
      for (let i = 75; i <= 95; i += 3) {
        setProgress(i);
        await new Promise(r => setTimeout(r, 100));
      }
      
      // Step 4: Done
      setStep('done');
      setProgress(100);
    };

    runSimulation();
    
    return () => clearTimeout(timer);
  }, []);

  const getStepIcon = (currentStep: typeof step) => {
    if (step === 'done') return <CheckCircle className="w-6 h-6 text-green-500" />;
    if (currentStep === step) return <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />;
    return <div className="w-2 h-2 rounded-full bg-gray-600" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#1c1c1c] border border-white/10 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex gap-4">
              <img src={song.thumbnailUrl} className="w-16 h-16 rounded-lg object-cover border border-white/10 shadow-lg" alt="" />
              <div>
                <h2 className="text-xl font-bold text-white truncate max-w-[200px]">{song.title}</h2>
                <p className="text-sm text-gray-400">{song.artist}</p>
              </div>
            </div>
            {step === 'done' && (
              <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            )}
          </div>

          <div className="space-y-6">
            <div className="relative h-2 w-full bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-blue-600 transition-all duration-300 ease-out" 
                style={{ width: `${progress}%` }}
              />
            </div>
            
            <div className="space-y-4">
              <div className={`flex items-center justify-between ${step === 'fetching' ? 'text-white' : 'text-gray-500'}`}>
                <div className="flex items-center gap-3">
                  <FileAudio className="w-5 h-5" />
                  <span className="text-sm font-medium">Extracting Audio Stream (yt-dlp)</span>
                </div>
                {getStepIcon('fetching')}
              </div>
              
              <div className={`flex items-center justify-between ${step === 'converting' ? 'text-white' : 'text-gray-500'}`}>
                <div className="flex items-center gap-3">
                  <Music className="w-5 h-5" />
                  <span className="text-sm font-medium">Converting to {song.bitrate} (FFmpeg)</span>
                </div>
                {getStepIcon('converting')}
              </div>
              
              <div className={`flex items-center justify-between ${step === 'tagging' ? 'text-white' : 'text-gray-500'}`}>
                <div className="flex items-center gap-3">
                  <Tag className="w-5 h-5" />
                  <span className="text-sm font-medium">Embedding ID3 Metadata (Mutagen)</span>
                </div>
                {getStepIcon('tagging')}
              </div>
            </div>
          </div>

          {step === 'done' && (
            <div className="mt-8">
              <button 
                onClick={onClose}
                className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Download Ready
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DownloadProgress;
