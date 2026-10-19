import React, { useState, useEffect } from 'react';
import { Moon, Star, X, Play, Square, Music, Sparkles } from 'lucide-react';
import { soundEffects, cartoonVoice } from '../utils/audio';

export interface LoriItem {
  id: string;
  title: string;
  lyrics: string;
  speechText: string;
}

export const LORI_SONGS: LoriItem[] = [
  {
    id: 'chanda_mama',
    title: '🌙 चंदा मामा दूर के',
    lyrics: 'चंदा मामा दूर के, पुए पकाएं बूर के!\nआप खाएं थाली में, मुन्ने को दें प्याली में!\nप्याली गई टूट, मुन्ना गया रूठ!\nलाएंगे नई प्यालियां, बजा बजा के तालियां!',
    speechText: 'चंदा मामा दूर के, पुए पकाएं बूर के! आप खाएं थाली में, मुन्ने को दें प्याली में! प्याली गई टूट, मुन्ना गया रूठ! लाएंगे नई प्यालियां, बजा बजा के तालियां! सो जाओ मेरे प्यारे बच्चे!',
  },
  {
    id: 'lakdi_kaathi',
    title: '🐴 लकड़ी की काठी',
    lyrics: 'लकड़ी की काठी, काठी पे घोड़ा!\nघोड़े की दुम पे जो मारा हथौड़ा!\nदौड़ा दौड़ा दौड़ा घोड़ा दुम उठा के दौड़ा!',
    speechText: 'लकड़ी की काठी, काठी पे घोड़ा! घोड़े की दुम पे जो मारा हथौड़ा! दौड़ा दौड़ा दौड़ा घोड़ा दुम उठा के दौड़ा! टिक-टिक टिक-टिक!',
  },
  {
    id: 'soja_rajkumari',
    title: '⭐ सूरज दादा सो गए',
    lyrics: 'सूरज दादा सो गए, चंदा मामा आ गए!\nसो जाओ मेरे प्यारे मुन्ना, नीले आसमान तले!\nतारों की बारात सजी, परियां आईं लोरी गाने!',
    speechText: 'सूरज दादा सो गए, चंदा मामा आ गए! सो जाओ मेरे प्यारे बच्चे, नीले आसमान तले! मीठे-मीठे सपने देखो!',
  },
];

interface LoriModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartLori: (lori: LoriItem) => void;
  onStopLori: () => void;
  currentPlayingId: string | null;
}

export const LoriModal: React.FC<LoriModalProps> = ({
  isOpen,
  onClose,
  onStartLori,
  onStopLori,
  currentPlayingId,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-indigo-950/80 backdrop-blur-md">
      {/* Night Sky Stars */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
        <span className="absolute top-8 left-12 text-3xl animate-pulse">✨</span>
        <span className="absolute top-24 right-16 text-4xl animate-bounce">🌙</span>
        <span className="absolute bottom-20 left-20 text-3xl animate-pulse">⭐</span>
        <span className="absolute bottom-16 right-24 text-3xl animate-pulse">✨</span>
      </div>

      <div className="relative w-full max-w-sm bg-gradient-to-b from-indigo-900 to-indigo-950 text-white rounded-3xl p-5 shadow-2xl border-4 border-indigo-400 flex flex-col max-h-[85vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white active:scale-90 transition-transform"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-indigo-800 border-2 border-indigo-300 text-3xl mb-1 shadow-inner">
            🌙
          </div>
          <h2 className="text-2xl font-black text-amber-300 tracking-wide">
            टॉम की प्यारी लोरियां
          </h2>
          <p className="text-xs text-indigo-200 font-semibold">
            टॉम बिल्ली बच्चे को मीठी नींद की लोरी सुनाएगा 💤
          </p>
        </div>

        {/* Songs List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {LORI_SONGS.map(song => {
            const isPlaying = currentPlayingId === song.id;
            return (
              <div
                key={song.id}
                className={`p-3.5 rounded-2xl border-2 transition-all duration-200 ${
                  isPlaying
                    ? 'bg-indigo-800/90 border-amber-400 shadow-lg shadow-indigo-500/50 scale-[1.02]'
                    : 'bg-indigo-900/60 border-indigo-700/80 hover:border-indigo-500'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-base font-extrabold text-amber-300 flex items-center gap-1.5">
                    {song.title}
                  </h3>
                  <button
                    onClick={() => {
                      if (isPlaying) {
                        onStopLori();
                      } else {
                        onStartLori(song);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-full font-black text-xs flex items-center gap-1.5 shadow active:scale-90 transition-all ${
                      isPlaying
                        ? 'bg-rose-500 hover:bg-rose-600 text-white'
                        : 'bg-amber-400 hover:bg-amber-300 text-amber-950'
                    }`}
                  >
                    {isPlaying ? (
                      <>
                        <Square className="w-3.5 h-3.5 fill-white" />
                        रोकें
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        सुनें
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-indigo-100 font-medium whitespace-pre-line leading-relaxed opacity-90">
                  {song.lyrics}
                </p>
              </div>
            );
          })}
        </div>

        {/* Footer controls */}
        {currentPlayingId && (
          <div className="mt-3 pt-2.5 border-t border-indigo-700/60 flex items-center justify-between">
            <span className="text-xs text-amber-300 font-bold flex items-center gap-1.5 animate-pulse">
              <Music className="w-4 h-4" /> टॉम लोरी गा रहा है...
            </span>
            <button
              onClick={onStopLori}
              className="px-3 py-1 bg-rose-500 hover:bg-rose-600 text-white text-xs font-black rounded-full shadow active:scale-95"
            >
              लोरी बंद करें
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
