import React from 'react';
import { Sparkles, Play, ShieldCheck, Heart } from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface PermissionOverlayProps {
  onStart: () => void;
}

export const PermissionOverlay: React.FC<PermissionOverlayProps> = ({ onStart }) => {
  const handleStart = () => {
    soundEffects.playMeow();
    soundEffects.playBell();
    onStart();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-br from-amber-400 via-rose-400 to-pink-500 overflow-y-auto">
      {/* Background Floating Toys */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <span className="absolute top-10 left-10 text-6xl animate-bounce">🐱</span>
        <span className="absolute top-24 right-12 text-7xl animate-pulse">🌙</span>
        <span className="absolute bottom-20 left-16 text-6xl animate-float">🍭</span>
        <span className="absolute bottom-12 right-16 text-7xl animate-bounce">🎈</span>
      </div>

      <div className="relative w-full max-w-sm bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-2xl border-4 border-amber-300 text-center flex flex-col items-center">
        {/* Animated Cutie Cat Avatar */}
        <div className="relative mb-3">
          <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-slate-200 to-amber-100 p-2 shadow-inner flex items-center justify-center animate-bounce-wiggle border-3 border-amber-300">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <polygon points="20,40 25,10 45,30" fill="#64748B" stroke="#334155" strokeWidth="2" />
              <polygon points="26,35 28,18 40,28" fill="#FDA4AF" />
              <polygon points="80,40 75,10 55,30" fill="#64748B" stroke="#334155" strokeWidth="2" />
              <polygon points="74,35 72,18 60,28" fill="#FDA4AF" />
              <circle cx="50" cy="55" r="38" fill="#64748B" stroke="#334155" strokeWidth="2.5" />
              <circle cx="28" cy="62" r="7" fill="#FB7185" opacity="0.8" />
              <circle cx="72" cy="62" r="7" fill="#FB7185" opacity="0.8" />
              <ellipse cx="38" cy="50" rx="8" ry="10" fill="#16A34A" />
              <circle cx="36" cy="46" r="3" fill="#FFFFFF" />
              <ellipse cx="62" cy="50" rx="8" ry="10" fill="#16A34A" />
              <circle cx="60" cy="46" r="3" fill="#FFFFFF" />
              <polygon points="50,62 46,58 54,58" fill="#F43F5E" />
              <line x1="38" y1="62" x2="18" y2="60" stroke="#334155" strokeWidth="1.5" />
              <line x1="38" y1="65" x2="16" y2="67" stroke="#334155" strokeWidth="1.5" />
              <line x1="62" y1="62" x2="82" y2="60" stroke="#334155" strokeWidth="1.5" />
              <line x1="62" y1="65" x2="84" y2="67" stroke="#334155" strokeWidth="1.5" />
              <path d="M 44 65 Q 50 70 56 65" stroke="#334155" strokeWidth="2" fill="none" strokeLinecap="round" />
            </svg>
          </div>
          <span className="absolute -bottom-1 -right-1 bg-pink-500 text-white p-2 rounded-full shadow-lg animate-pulse">
            <Sparkles className="w-5 h-5" />
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-black text-amber-950 tracking-tight leading-none mb-1">
          Cutie
        </h1>
        <p className="text-sm font-bold text-pink-600 mb-4">
          क्यूटिए बिल्ली का मजेदार खेल! 🐱✨
        </p>

        {/* Features Preview Pills */}
        <div className="grid grid-cols-3 gap-2 w-full mb-5">
          <div className="p-2.5 rounded-2xl bg-amber-100 flex flex-col items-center">
            <span className="text-2xl mb-1">🤣</span>
            <span className="text-xs font-black text-amber-950">हंसाएगा</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-indigo-100 flex flex-col items-center">
            <span className="text-2xl mb-1">🌙</span>
            <span className="text-xs font-black text-indigo-950">लोरी</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-purple-100 flex flex-col items-center">
            <span className="text-2xl mb-1">🍲</span>
            <span className="text-xs font-black text-purple-950">खाना खिलाओ</span>
          </div>
        </div>

        {/* Big Start Button */}
        <button
          onClick={handleStart}
          className="w-full py-4 px-6 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-600 hover:to-amber-600 text-white text-xl font-black rounded-2xl shadow-lg shadow-pink-300 transform active:scale-95 transition-all flex items-center justify-center gap-3 border-2 border-white mb-3"
        >
          <Play className="w-7 h-7 fill-white" />
          खेलना शुरू करें!
        </button>

        {/* Hello Group Credits */}
        <div className="mt-3 pt-2 border-t border-amber-100 text-center w-full">
          <p className="text-xs font-extrabold text-amber-900">
            Produced by Hello Group
          </p>
          <p className="text-[10px] text-gray-500 font-medium">
            100% Kid Safe • No Ads • Made with ❤️
          </p>
        </div>
      </div>
    </div>
  );
};
