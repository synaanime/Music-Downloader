
import React, { useEffect, useState } from 'react';
import { CheckCircle, Loader2, FileAudio, Tag, Music, X, DownloadCloud } from 'lucide-react';
import { Song } from '../types';

interface DownloadProgressProps {
  song: Song;
  onClose: () => void;
}

const DownloadProgress: React.FC<DownloadProgressProps> = ({ song, onClose }) => {
  const [step, setStep] = useState<'fetching' | 'converting' | 'tagging' | 'finalizing' | 'done'>('fetching');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const runSimulation = async () => {
      // Step 1: Fetching
      setStep('fetching');
      for (let i = 0; i <= 25; i += 5) {
        setProgress(i);
        await new Promise(r => setTimeout(r, 60));
      }
      
      // Step 2: Converting (Simulating FFmpeg)
      setStep('converting');
      for (let i = 25; i <= 70; i += 2) {
        setProgress(i);
        await new Promise(r => setTimeout(r, 80));
      }
      
      // Step 3: Tagging (Simulating Mutagen)
      setStep('tagging');
      for (let i = 70; i <= 90; i += 5) {
        setProgress(i);
        await new Promise(r => setTimeout(r, 150));
      }

      // Step 4: Finalizing & Checksum
      setStep('finalizing');
      for (let i = 90; i <= 100; i += 2) {
        setProgress(i);
        await new Promise(r => setTimeout(r, 50));
      }
      
      // Step 5: Done
      setStep('done');
    };

    runSimulation();
  }, []);

  const triggerActualDownload = () => {
    // Creating a dummy blob to simulate a real file download
    const dummyContent = "Simulated high-quality audio data for " + song.title;
    const blob = new Blob([dummyContent], { type: 'audio/mpeg' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${song.artist} - ${song.title} (${song.bitrate}).mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onClose();
  };

  const getStepIcon = (currentStep: typeof step) => {
    if (step === 'done') return <CheckCircle className="w-5 h-5 text-green-500" />;
    const order = ['fetching', 'converting', 'tagging', 'finalizing', 'done'];
    if (order.indexOf(step) > order.indexOf(currentStep)) return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (currentStep === step) return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
    return <div className="w-2 h-2 rounded-full bg-gray-700 ml-1.5" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="bg-[#141414] border border-white/10 w-full max-w-md rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="p-8">
          <div className="flex justify-between items-start mb-8">
            <div className="flex gap-5">
              <div className="relative">
                <img src={song.thumbnailUrl} className="w-20 h-20 rounded-xl object-cover border border-white/10 shadow-2xl" alt="" />
                <div className="absolute -bottom-2 -right-2 bg-blue-600 p-1.5 rounded-lg shadow-lg">
                  <Music className="w-3 h-3 text-white" />
                </div>
              </div>
              <div className="pt-1">
                <h2 className="text-xl font-black text-white truncate max-w-[220px] tracking-tight">{song.title}</h2>
                <p className="text-sm text-gray-400 font-medium">{song.artist}</p>
                <div className="flex gap-2 mt-2">
                   <span className="text-[9px] bg-white/5 px-1.5 py-0.5 rounded text-gray-500 border border-white/5 uppercase font-bold">{song.bitrate}</span>
                   <span className="text-[9px] bg-white/5 px-1.5 py-0.5 rounded text-gray-500 border border-white/5 uppercase font-bold">{song.sampleRate}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                <span>{step.replace('_', ' ')}</span>
                <span>{progress}%</span>
              </div>
              <div className="relative h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className={`absolute top-0 left-0 h-full transition-all duration-300 ease-out ${step === 'done' ? 'bg-green-500' : 'bg-blue-600'}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            
            <div className="grid gap-3">
              <div className={`flex items-center justify-between p-3 rounded-xl border transition-all ${step === 'fetching' ? 'bg-blue-500/5 border-blue-500/20 text-white' : 'bg-white/5 border-transparent text-gray-500'}`}>
                <div className="flex items-center gap-3">
                  <DownloadCloud className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-tight">Stream Extraction</span>
                </div>
                {getStepIcon('fetching')}
              </div>
              
              <div className={`flex items-center justify-between p-3 rounded-xl border transition-all ${step === 'converting' ? 'bg-blue-500/5 border-blue-500/20 text-white' : 'bg-white/5 border-transparent text-gray-500'}`}>
                <div className="flex items-center gap-3">
                  <FileAudio className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-tight">HQ Encoding ({song.bitrate})</span>
                </div>
                {getStepIcon('converting')}
              </div>
              
              <div className={`flex items-center justify-between p-3 rounded-xl border transition-all ${step === 'tagging' ? 'bg-blue-500/5 border-blue-500/20 text-white' : 'bg-white/5 border-transparent text-gray-500'}`}>
                <div className="flex items-center gap-3">
                  <Tag className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-tight">ID3v2 Metadata Embed</span>
                </div>
                {getStepIcon('tagging')}
              </div>
            </div>
          </div>

          {step === 'done' && (
            <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <button 
                onClick={triggerActualDownload}
                className="w-full bg-green-600 hover:bg-green-500 text-white font-black py-4 rounded-2xl shadow-[0_10px_30px_rgba(34,197,94,0.3)] transition-all flex items-center justify-center gap-3 text-sm uppercase tracking-widest"
              >
                <DownloadCloud className="w-5 h-5" />
                Save File to Device
              </button>
              <button 
                onClick={onClose}
                className="w-full mt-3 text-gray-500 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors"
              >
                Cancel and Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DownloadProgress;
