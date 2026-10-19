import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Volume2, Sparkles, Check, Send, AlertTriangle, ShieldCheck } from 'lucide-react';
import { soundEffects, cartoonVoice } from '../utils/audio';

export type ScaryCharacterType = 'monster' | 'police' | 'lion';

interface MealtimeHelperModalProps {
  isOpen: boolean;
  onClose: () => void;
  childName: string;
}

export const MealtimeHelperModal: React.FC<MealtimeHelperModalProps> = ({
  isOpen,
  onClose,
  childName,
}) => {
  const [characterType, setCharacterType] = useState<ScaryCharacterType>('monster');
  const [customText, setCustomText] = useState('');
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [isSpeakingNow, setIsSpeakingNow] = useState(false);
  const [hasAteFood, setHasAteFood] = useState(false);

  if (!isOpen) return null;

  const displayName = childName.trim() || 'प्यारे बच्चे';

  const presets = [
    {
      id: 'p1',
      title: 'डराऊँगा और खाना खा जाऊंगा',
      text: `अरे ${displayName}! जल्दी से खाना खा लो, नहीं तो मैं आके डराऊंगा और तुम्हारा सारा खाना खा जाऊंगा! 👻`,
      character: 'monster',
    },
    {
      id: 'p2',
      title: 'पुलिस अंकल की सीटी',
      text: `सावधान ${displayName}! दूध और रोटी जल्दी खत्म करो, नहीं तो पुलिस अंकल आ जाएंगे और सारी चॉकलेट ज़ब्त कर लेंगे! 🚓`,
      character: 'police',
    },
    {
      id: 'p3',
      title: 'खिलौने छुपा दूंगा',
      text: `अरे ${displayName}! हरी सब्ज़ी और दाल-चावल जल्दी खा लो, वरना मैं तुम्हारे सारे खिलौने छुपा दूंगा! हाहाहा!`,
      character: 'monster',
    },
    {
      id: 'p4',
      title: 'शेर भैया की दहाड़',
      text: `दहाड़! अरे ${displayName}! अगर तुमने खाना नहीं खाया तो शेर भैया सारा खाना गप-गप करके खा जाएंगे! 🦁`,
      character: 'lion',
    },
    {
      id: 'p5',
      title: 'बहादुर बच्चा बनो',
      text: `${displayName}, जो बच्चे खाना नहीं खाते वो बड़े कैसे होंगे? जल्दी से अच्छी तरह खाना खा लो! शाबाश!`,
      character: 'police',
    },
  ];

  const currentSpeech = customText.trim() ? customText : presets[selectedPresetIndex].text;

  const handleSpeak = (textToSpeak?: string) => {
    const text = textToSpeak || currentSpeech;
    setIsSpeakingNow(true);

    if (characterType === 'monster') {
      soundEffects.playSpookyLaugh();
    } else if (characterType === 'police') {
      soundEffects.playPoliceWhistle();
    } else {
      soundEffects.playSpookyLaugh();
    }

    cartoonVoice.speak(text, {
      voiceType: 'monster',
      pitch: characterType === 'police' ? 0.85 : 0.68,
      rate: 0.92,
      force: true,
      onEnd: () => setIsSpeakingNow(false),
    });
  };

  const handleChildAteFood = () => {
    soundEffects.playMunch();
    soundEffects.playCheerChime();
    setHasAteFood(true);

    const praiseText = `अरे वाह ${displayName}! तुम तो बहुत बहादुर और समझदार बच्चे हो! तुमने सारा खाना खत्म कर दिया! शाबाश! अब कोई राक्षस या पुलिस नहीं आएगी! म्याऊं! 💖`;
    cartoonVoice.speak(praiseText, {
      voiceType: 'natural',
      pitch: 1.1,
      rate: 1.0,
      force: true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-purple-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-5 shadow-2xl border-4 border-purple-500 flex flex-col max-h-[92vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white active:scale-90 transition-transform shadow"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-800 border-2 border-purple-400 text-2xl mb-1 shadow">
            🍲👹
          </div>
          <h2 className="text-2xl font-black text-amber-300 tracking-wide">
            खाना खिलाओ मोड!
          </h2>
          <p className="text-xs text-purple-200 font-bold">
            डरावना कैरेक्टर बच्चे को खाना खाने के लिए बोलेगा!
          </p>
        </div>

        {/* Character Selector Pills */}
        <div className="grid grid-cols-3 gap-1.5 mb-2.5">
          {[
            { type: 'monster', label: '👹 राक्षस/भूत' },
            { type: 'police', label: '👮 पुलिस अंकल' },
            { type: 'lion', label: '🦁 शेर भैया' },
          ].map(char => (
            <button
              key={char.type}
              type="button"
              onClick={() => setCharacterType(char.type as ScaryCharacterType)}
              className={`py-1.5 px-1 rounded-xl text-xs font-black border-2 transition-all ${
                characterType === char.type
                  ? 'bg-purple-600 border-amber-400 text-white shadow'
                  : 'bg-purple-900/60 border-purple-700/60 text-purple-200'
              }`}
            >
              {char.label}
            </button>
          ))}
        </div>

        {/* Animated Character Stage */}
        <div className="relative flex flex-col items-center justify-center py-2 bg-purple-900/40 rounded-2xl border-2 border-purple-500/50 mb-3">
          {hasAteFood ? (
            /* Happy Celebration Mode when food is eaten */
            <div className="flex flex-col items-center py-3">
              <span className="text-6xl animate-bounce">🎉🍲</span>
              <p className="text-base font-black text-amber-300 mt-2 text-center">
                शाबाश {displayName}! सारा खाना खा लिया!
              </p>
              <button
                onClick={() => setHasAteFood(false)}
                className="mt-2 text-xs font-bold text-purple-300 underline"
              >
                फिर से चलाएं
              </button>
            </div>
          ) : (
            <div className="relative w-36 h-36 flex items-center justify-center">
              {characterType === 'monster' && (
                /* Gogo the Monster SVG */
                <svg
                  viewBox="0 0 100 100"
                  className={`w-full h-full filter drop-shadow-lg ${isSpeakingNow ? 'animate-bounce' : 'animate-pulse'}`}
                >
                  {/* Horns */}
                  <polygon points="25,30 18,10 35,22" fill="#EAB308" stroke="#CA8A04" strokeWidth="2" />
                  <polygon points="75,30 82,10 65,22" fill="#EAB308" stroke="#CA8A04" strokeWidth="2" />
                  {/* Monster Body */}
                  <ellipse cx="50" cy="55" rx="36" ry="34" fill="#7E22CE" stroke="#581C87" strokeWidth="3" />
                  <ellipse cx="50" cy="62" rx="22" ry="18" fill="#A855F7" />
                  {/* Glowing Spooky Eyes */}
                  <circle cx="36" cy="46" r="9" fill="#FEF08A" stroke="#CA8A04" strokeWidth="2" />
                  <circle cx="36" cy="46" r="4" fill="#DC2626" />
                  <circle cx="64" cy="46" r="9" fill="#FEF08A" stroke="#CA8A04" strokeWidth="2" />
                  <circle cx="64" cy="46" r="4" fill="#DC2626" />
                  {/* Big Scary/Goofy Mouth with Fangs */}
                  {isSpeakingNow ? (
                    <g>
                      <ellipse cx="50" cy="68" rx="16" ry="12" fill="#18181B" stroke="#581C87" strokeWidth="2" />
                      <polygon points="42,56 46,64 50,56" fill="#FFFFFF" />
                      <polygon points="50,56 54,64 58,56" fill="#FFFFFF" />
                      <polygon points="45,80 48,72 52,80" fill="#FFFFFF" />
                    </g>
                  ) : (
                    <g>
                      <path d="M 34 68 Q 50 82 66 68" stroke="#18181B" strokeWidth="4" fill="none" strokeLinecap="round" />
                      <polygon points="42,66 45,74 48,66" fill="#FFFFFF" />
                      <polygon points="52,66 55,74 58,66" fill="#FFFFFF" />
                    </g>
                  )}
                  {/* Big Spoon in hand */}
                  <line x1="78" y1="75" x2="90" y2="40" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" />
                  <ellipse cx="90" cy="38" rx="7" ry="5" fill="#E2E8F0" />
                </svg>
              )}

              {characterType === 'police' && (
                /* Inspector Police Uncle SVG */
                <svg
                  viewBox="0 0 100 100"
                  className={`w-full h-full filter drop-shadow-lg ${isSpeakingNow ? 'animate-bounce' : ''}`}
                >
                  {/* Police Cap */}
                  <path d="M 24 38 Q 50 15 76 38 Z" fill="#1E3A8A" stroke="#172554" strokeWidth="2.5" />
                  <rect x="20" y="37" width="60" height="7" rx="3" fill="#172554" />
                  <polygon points="50,24 53,30 47,30" fill="#EAB308" />
                  {/* Face */}
                  <circle cx="50" cy="58" r="30" fill="#FBBF24" stroke="#D97706" strokeWidth="2.5" />
                  {/* Big Moustache */}
                  <path d="M 32 64 Q 50 58 68 64 Q 50 72 32 64 Z" fill="#1E293B" />
                  {/* Eyes */}
                  <circle cx="40" cy="50" r="4.5" fill="#1E293B" />
                  <circle cx="60" cy="50" r="4.5" fill="#1E293B" />
                  {/* Whistle */}
                  <rect x="58" y="65" width="14" height="6" rx="2" fill="#94A3B8" />
                </svg>
              )}

              {characterType === 'lion' && (
                /* Lion Sheru SVG */
                <svg
                  viewBox="0 0 100 100"
                  className={`w-full h-full filter drop-shadow-lg ${isSpeakingNow ? 'animate-bounce' : ''}`}
                >
                  {/* Lion Mane */}
                  <circle cx="50" cy="52" r="38" fill="#B45309" stroke="#78350F" strokeWidth="3" />
                  {/* Ears */}
                  <circle cx="26" cy="28" r="10" fill="#F59E0B" />
                  <circle cx="74" cy="28" r="10" fill="#F59E0B" />
                  {/* Face */}
                  <circle cx="50" cy="54" r="28" fill="#FCD34D" stroke="#D97706" strokeWidth="2.5" />
                  {/* Eyes */}
                  <circle cx="40" cy="46" r="4.5" fill="#78350F" />
                  <circle cx="60" cy="46" r="4.5" fill="#78350F" />
                  {/* Nose & Roaring mouth */}
                  <polygon points="50,56 45,51 55,51" fill="#78350F" />
                  <path d="M 40 64 Q 50 78 60 64" fill="#991B1B" stroke="#78350F" strokeWidth="2" />
                  <polygon points="46,63 48,68 50,63" fill="#FFFFFF" />
                  <polygon points="50,63 52,68 54,63" fill="#FFFFFF" />
                </svg>
              )}
            </div>
          )}

          {/* Current Dialogue Preview Banner */}
          <div className="w-[92%] bg-black/60 rounded-xl p-2 mt-1 border border-purple-400/40 text-center">
            <p className="text-xs text-amber-200 font-bold leading-snug">
              &quot;{currentSpeech}&quot;
            </p>
          </div>
        </div>

        {/* Action Speak Button */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <button
            onClick={() => handleSpeak()}
            disabled={isSpeakingNow}
            className={`py-3 px-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-lg border-2 active:scale-95 transition-all ${
              isSpeakingNow
                ? 'bg-rose-600 border-rose-400 animate-pulse text-white'
                : 'bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white border-rose-400 shadow-rose-900/50'
            }`}
          >
            <Volume2 className="w-4 h-4 flex-shrink-0" />
            {isSpeakingNow ? 'बोल रहा है...' : 'डराओ / बोलो! 🔊'}
          </button>

          {/* Success "Maine Kha Liya" Button */}
          <button
            onClick={handleChildAteFood}
            className="py-3 px-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 border-2 border-emerald-300 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950/50 active:scale-95 transition-all"
          >
            <Check className="w-4 h-4" />
            मैंने खा लिया! 🥣
          </button>
        </div>

        {/* Parent Option Presets List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          <span className="text-[11px] font-black uppercase tracking-wider text-purple-300 px-1">
            माता-पिता डायलॉग चुनें (Select Dialogue):
          </span>
          {presets.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => {
                soundEffects.playPop();
                setSelectedPresetIndex(idx);
                setCustomText('');
                setCharacterType(p.character as ScaryCharacterType);
                handleSpeak(p.text);
              }}
              className={`w-full text-left p-2.5 rounded-xl border-2 transition-all ${
                selectedPresetIndex === idx && !customText
                  ? 'bg-purple-800 border-amber-400 text-white shadow'
                  : 'bg-purple-950/60 border-purple-800/80 text-purple-200 hover:border-purple-600'
              }`}
            >
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-xs font-black text-amber-300">{p.title}</span>
                <span className="text-[10px] bg-purple-700 text-purple-200 px-1.5 py-0.5 rounded-full font-bold">
                  चुनें 📢
                </span>
              </div>
              <p className="text-[11px] text-purple-100 font-medium leading-tight">
                {p.text}
              </p>
            </button>
          ))}

          {/* Custom Parent Message Input */}
          <div className="p-2.5 rounded-xl bg-purple-900/60 border-2 border-purple-700 mt-2">
            <label className="text-[11px] font-bold text-amber-300 block mb-1">
              ✏️ अपनी पसंद की बात लिखवाएं:
            </label>
            <div className="flex gap-1.5">
              <input
                type="text"
                value={customText}
                onChange={e => setCustomText(e.target.value)}
                placeholder={`उदा. ${displayName} जल्दी से दूध पी लो!`}
                className="flex-1 px-3 py-1.5 rounded-lg bg-black/50 border border-purple-400 text-white text-xs focus:outline-none focus:border-amber-400 font-semibold"
              />
              <button
                type="button"
                onClick={() => handleSpeak()}
                className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-purple-950 font-black text-xs rounded-lg active:scale-95 shadow flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" /> बुलवाएं
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
