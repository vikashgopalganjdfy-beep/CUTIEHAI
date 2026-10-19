import React from 'react';
import { Sparkles } from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface MilestoneModalProps {
  score: number;
  badgeName: string;
  badgeIcon: string;
  onClose: () => void;
}

export const MilestoneModal: React.FC<MilestoneModalProps> = ({
  score,
  badgeName,
  badgeIcon,
  onClose,
}) => {
  const handleClose = () => {
    soundEffects.playMeow();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xs bg-white rounded-3xl p-6 shadow-2xl border-4 border-yellow-400 text-center flex flex-col items-center animate-bounce-wiggle">
        {/* Big Badge Icon */}
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-yellow-300 via-amber-200 to-pink-200 border-4 border-yellow-400 flex items-center justify-center text-5xl shadow-lg mb-3">
          {badgeIcon}
        </div>

        <span className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-wider text-pink-600 bg-pink-100 px-3 py-1 rounded-full mb-1">
          <Sparkles className="w-3.5 h-3.5" /> नया तमगा मिला!
        </span>

        <h2 className="text-2xl font-black text-amber-950 mb-1">{badgeName}</h2>

        <p className="text-sm font-bold text-amber-800 mb-4">
          अरे वाह! आपने टॉम को <span className="text-pink-600 text-lg">{score}</span> प्यारी मुस्कानें दी हैं!
        </p>

        <button
          onClick={handleClose}
          className="w-full py-3.5 px-6 bg-gradient-to-r from-pink-500 to-amber-500 hover:from-pink-600 hover:to-amber-600 text-white font-black text-lg rounded-2xl shadow-lg shadow-pink-200 active:scale-95 transition-transform"
        >
          और खेलें! 💖
        </button>
      </div>
    </div>
  );
};
