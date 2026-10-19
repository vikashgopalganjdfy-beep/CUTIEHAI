import React from 'react';
import { soundEffects } from '../utils/audio';

export interface AccessoryOption {
  id: string;
  name: string;
  icon: string;
}

const ACCESSORIES: AccessoryOption[] = [
  { id: 'none', name: 'सादा', icon: '🐱' },
  { id: 'party_hat', name: 'पार्टी टोपी', icon: '🥳' },
  { id: 'crown', name: 'राजा मुकुट', icon: '👑' },
  { id: 'sunglasses', name: 'स्टाइलिश चश्मा', icon: '😎' },
  { id: 'nightcap', name: 'लोरी टोपी', icon: '🌙' },
  { id: 'cape', name: 'हीरो केप', icon: '🦸' },
];

interface AccessoriesBarProps {
  currentAccessory: string;
  onSelectAccessory: (id: string) => void;
}

export const AccessoriesBar: React.FC<AccessoriesBarProps> = ({
  currentAccessory,
  onSelectAccessory,
}) => {
  const handleSelect = (id: string) => {
    soundEffects.playPop();
    onSelectAccessory(id);
  };

  return (
    <div className="w-full max-w-md px-2 py-1.5">
      <div className="flex items-center justify-between mb-1 px-2">
        <span className="text-xs font-black text-amber-950 flex items-center gap-1">
          🎨 क्यूटिए को सजाओ:
        </span>
        <span className="text-[11px] text-amber-800 font-bold">टोपी या चश्मा पहनाएं!</span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 px-1 scrollbar-none snap-x">
        {ACCESSORIES.map(acc => {
          const isSelected = currentAccessory === acc.id;
          return (
            <button
              key={acc.id}
              onClick={() => handleSelect(acc.id)}
              className={`flex-shrink-0 flex flex-col items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl transition-all duration-200 border-3 ${
                isSelected
                  ? 'border-pink-500 scale-105 shadow-md shadow-pink-200 bg-white ring-2 ring-pink-300'
                  : 'border-amber-200 hover:border-amber-300 bg-white/90 active:scale-95'
              }`}
            >
              <span className="text-2xl sm:text-3xl leading-none">{acc.icon}</span>
              <span className="text-[10px] font-black text-amber-950 mt-0.5 truncate max-w-[52px]">
                {acc.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
