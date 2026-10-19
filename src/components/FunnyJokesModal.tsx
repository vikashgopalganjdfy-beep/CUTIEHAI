import React from 'react';
import { X, Sparkles, Smile, Laugh } from 'lucide-react';
import { soundEffects } from '../utils/audio';

export interface JokeItem {
  id: string;
  title: string;
  hindiText: string;
  soundType: 'sneeze' | 'giggle' | 'meow' | 'pop';
  emoji: string;
}

export const FUNNY_ITEMS: JokeItem[] = [
  {
    id: 'sneeze',
    title: 'बिल्ली की ज़ोरदार छींक!',
    hindiText: 'आ... आ... आ... छींींीं! अरे मेरी मूंछें हिल गईं! हाहाहा!',
    soundType: 'sneeze',
    emoji: '🤧',
  },
  {
    id: 'joke1',
    title: 'चूहा और हाथी का मज़ाक',
    hindiText: 'एक नन्हे चूहे ने हाथी से कहा: अरे भैया, थोड़ा साइड हो जाओ, मुझे आगे जाना है! हाहाहा!',
    soundType: 'giggle',
    emoji: '🐭',
  },
  {
    id: 'joke2',
    title: 'टमाटर लाल क्यों हुआ?',
    hindiText: 'पता है टमाटर लाल क्यों हुआ? क्योंकि उसने टॉम बिल्ली को उल्टा नाचते हुए देख लिया! हीहीही!',
    soundType: 'giggle',
    emoji: '🍅',
  },
  {
    id: 'funny_face',
    title: 'सिल्ली बिल्ली चेहरा!',
    hindiText: 'ब्लेहहह! जीभ बाहर! टॉम बन गया जोकर बिल्ली! हाहाहा!',
    soundType: 'pop',
    emoji: '🤪',
  },
  {
    id: 'lion_meow',
    title: 'शेर जैसी दहाड़!',
    hindiText: 'मैं बिल्ली नहीं, जंगल का बब्बर शेर हूँ! म्याऊं... नहीं, दहाड़! 🦁 म्याऊं!',
    soundType: 'meow',
    emoji: '🦁',
  },
];

interface FunnyJokesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerFunny: (item: JokeItem) => void;
}

export const FunnyJokesModal: React.FC<FunnyJokesModalProps> = ({
  isOpen,
  onClose,
  onTriggerFunny,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-yellow-300 via-amber-200 to-orange-200 text-amber-950 rounded-3xl p-5 shadow-2xl border-4 border-yellow-400 flex flex-col max-h-[85vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-white/70 hover:bg-white text-amber-950 active:scale-90 transition-transform shadow"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-yellow-400 border-2 border-yellow-500 text-3xl mb-1 shadow">
            😹
          </div>
          <h2 className="text-2xl font-black text-amber-950 tracking-wide">
            हंसो और हंसाओ!
          </h2>
          <p className="text-xs text-amber-900 font-bold">
            टॉम बिल्ली आपको गुदगुदाएगा और हंसाएगा! 🤣
          </p>
        </div>

        {/* Jokes Buttons */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {FUNNY_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => {
                soundEffects.playPop();
                onTriggerFunny(item);
                onClose();
              }}
              className="w-full text-left p-3.5 rounded-2xl bg-white hover:bg-yellow-50 border-3 border-amber-300 shadow-md active:scale-95 transition-all flex items-center gap-3"
            >
              <span className="text-3xl flex-shrink-0 p-1.5 rounded-xl bg-amber-100">
                {item.emoji}
              </span>
              <div className="flex-1">
                <h3 className="text-sm font-extrabold text-amber-950 leading-tight">
                  {item.title}
                </h3>
                <p className="text-[11px] text-amber-800 font-semibold truncate max-w-[200px]">
                  {item.hindiText}
                </p>
              </div>
              <span className="text-xs font-black bg-pink-500 text-white px-2 py-1 rounded-full shadow-sm">
                हंसाओ!
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
