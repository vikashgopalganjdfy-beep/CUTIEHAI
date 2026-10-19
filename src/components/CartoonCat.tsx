import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundEffects } from '../utils/audio';

export type CatMood = 'waiting' | 'smiling' | 'tickled' | 'purring' | 'sleeping' | 'listening' | 'speaking' | 'funny';

interface CartoonCatProps {
  mood: CatMood;
  accessory: string;
  onTickle: () => void;
  onPetHead: () => void;
  onTapTail: () => void;
  speechText: string;
}

export const CartoonCat: React.FC<CartoonCatProps> = ({
  mood,
  accessory,
  onTickle,
  onPetHead,
  onTapTail,
  speechText,
}) => {
  const [touchEffects, setTouchEffects] = useState<{ id: number; x: number; y: number; text: string }[]>([]);

  const addTouchPopup = (x: number, y: number, text: string) => {
    const id = Date.now() + Math.random();
    setTouchEffects(prev => [...prev.slice(-3), { id, x, y, text }]);
    setTimeout(() => {
      setTouchEffects(prev => prev.filter(item => item.id !== id));
    }, 950);
  };

  const handleHeadTap = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    onPetHead();
    soundEffects.playPurr();
    soundEffects.playMeow();
    const rect = e.currentTarget.getBoundingClientRect();
    addTouchPopup(rect.width / 2, 20, 'प्यार! 🐱💖');
  };

  const handleBellyTap = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    onTickle();
    soundEffects.playCatGiggle();
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate([40, 20, 60]);
      } catch {
        // Safe ignore
      }
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const tickleWords = ['गुदगुदी! 😹', 'हाहाहा! 🤣', 'हीहीही! 💖', 'म्याऊं! 🐾'];
    const randomWord = tickleWords[Math.floor(Math.random() * tickleWords.length)];
    addTouchPopup(rect.width / 2, rect.height / 2, randomWord);
  };

  const handleBellTap = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    soundEffects.playBell();
    const rect = e.currentTarget.getBoundingClientRect();
    addTouchPopup(rect.width / 2, 160, 'टन-टन! 🔔');
  };

  const handleTailTap = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    onTapTail();
    soundEffects.playMeow();
    addTouchPopup(250, 240, 'अरे पूंछ! 🐾');
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-sm mx-auto select-none">
      {/* Tom's Hindi Speech Bubble */}
      <AnimatePresence mode="wait">
        <motion.div
          key={speechText}
          initial={{ opacity: 0, scale: 0.85, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -6 }}
          transition={{ type: 'spring', damping: 16, stiffness: 280 }}
          className="relative mb-2 px-5 py-3 rounded-3xl bg-white shadow-xl border-4 border-amber-300 max-w-[94%] text-center cursor-pointer active:scale-95 transition-transform"
          onClick={onPetHead}
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl animate-bounce">
              {mood === 'smiling'
                ? '🌟'
                : mood === 'tickled'
                ? '😹'
                : mood === 'sleeping'
                ? '😴'
                : mood === 'listening'
                ? '👂'
                : '🐱'}
            </span>
            <p className="text-lg sm:text-xl font-black text-amber-950 leading-snug tracking-wide">
              {speechText}
            </p>
          </div>

          {/* Pointer triangle */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[12px] border-t-amber-300" />
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-white" />
        </motion.div>
      </AnimatePresence>

      {/* Floating text reactions */}
      {touchEffects.map(effect => (
        <motion.div
          key={effect.id}
          initial={{ opacity: 1, scale: 0.7, y: effect.y, x: effect.x }}
          animate={{ opacity: 0, scale: 1.35, y: effect.y - 75 }}
          transition={{ duration: 0.85, ease: 'easeOut' }}
          className="absolute z-40 pointer-events-none text-lg font-black text-pink-600 bg-white/95 px-3 py-1 rounded-full shadow-lg border-2 border-pink-400"
        >
          {effect.text}
        </motion.div>
      ))}

      {/* MAIN TALKING CAT SVG CONTAINER */}
      <div
        className={`relative w-64 h-64 sm:w-72 sm:h-72 cursor-pointer transition-transform duration-300 ${
          mood === 'tickled'
            ? 'animate-gudgudi'
            : mood === 'smiling'
            ? 'animate-bounce-wiggle'
            : mood === 'sleeping'
            ? 'animate-pulse'
            : 'animate-float'
        }`}
      >
        <svg viewBox="0 0 300 320" className="w-full h-full filter drop-shadow-2xl overflow-visible">
          <defs>
            {/* Tom's Grey Fur Gradients */}
            <radialGradient id="tomFurGrad" cx="45%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#94A3B8" />
              <stop offset="60%" stopColor="#64748B" />
              <stop offset="100%" stopColor="#475569" />
            </radialGradient>

            <linearGradient id="tomBibGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#F1F5F9" />
            </linearGradient>

            <radialGradient id="tomEyeGrad" cx="40%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#4ADE80" />
              <stop offset="70%" stopColor="#16A34A" />
              <stop offset="100%" stopColor="#14532D" />
            </radialGradient>

            <radialGradient id="catEarInner" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FDA4AF" />
              <stop offset="100%" stopColor="#F43F5E" />
            </radialGradient>

            <radialGradient id="bellGrad" cx="35%" cy="30%" r="60%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="60%" stopColor="#EAB308" />
              <stop offset="100%" stopColor="#A16207" />
            </radialGradient>
          </defs>

          {/* Listening soundwave halo when Tom is listening to kid's voice */}
          {mood === 'listening' && (
            <circle
              cx="150"
              cy="150"
              r="135"
              fill="none"
              stroke="#22C55E"
              strokeWidth="5"
              strokeDasharray="12 12"
              className="animate-spin"
            />
          )}

          {/* Wagging Cat Tail */}
          <g onClick={handleTailTap} className="origin-[220px_230px] cursor-pointer">
            <motion.path
              d="M 215 230 C 265 240, 280 180, 255 140 C 245 125, 235 140, 240 155 C 255 190, 235 220, 205 235 Z"
              fill="url(#tomFurGrad)"
              stroke="#334155"
              strokeWidth="4.5"
              animate={
                mood === 'smiling' || mood === 'tickled'
                  ? { rotate: [-20, 30, -20] }
                  : { rotate: [-5, 15, -5] }
              }
              transition={{ repeat: Infinity, duration: mood === 'tickled' ? 0.35 : 1.4 }}
            />
            {/* White tip on tail */}
            <path
              d="M 255 140 C 245 125, 235 140, 240 155 C 248 165, 252 155, 255 140 Z"
              fill="#FFFFFF"
            />
          </g>

          {/* Superhero Cape Accessory */}
          {accessory === 'cape' && (
            <motion.path
              d="M 70 170 Q 20 250 40 290 Q 150 270 260 290 Q 280 250 230 170 Z"
              fill="#E11D48"
              stroke="#9F1239"
              strokeWidth="5"
              animate={{
                d: [
                  'M 70 170 Q 20 250 40 290 Q 150 270 260 290 Q 280 250 230 170 Z',
                  'M 70 170 Q 10 255 35 295 Q 150 265 265 295 Q 290 255 230 170 Z',
                  'M 70 170 Q 20 250 40 290 Q 150 270 260 290 Q 280 250 230 170 Z',
                ],
              }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            />
          )}

          {/* CAT EARS */}
          {/* Left Cat Ear */}
          <g className="origin-[95px_70px]">
            <motion.path
              d="M 75 75 L 80 15 Q 105 30 120 70 Z"
              fill="url(#tomFurGrad)"
              stroke="#334155"
              strokeWidth="5"
              animate={
                mood === 'listening'
                  ? { scale: [1, 1.15, 1], rotate: [-10, -5, -10] }
                  : mood === 'tickled'
                  ? { rotate: [-15, 18, -15] }
                  : mood === 'purring'
                  ? { rotate: [-8, -2, -8] }
                  : { rotate: [-3, 3, -3] }
              }
              transition={{ repeat: Infinity, duration: mood === 'listening' ? 0.6 : 1.8 }}
            />
            {/* Left Ear Pink Inner */}
            <path d="M 82 65 L 86 28 Q 102 38 112 65 Z" fill="url(#catEarInner)" />
          </g>

          {/* Right Cat Ear */}
          <g className="origin-[205px_70px]">
            <motion.path
              d="M 180 70 Q 195 30 220 15 L 225 75 Z"
              fill="url(#tomFurGrad)"
              stroke="#334155"
              strokeWidth="5"
              animate={
                mood === 'listening'
                  ? { scale: [1, 1.15, 1], rotate: [10, 5, 10] }
                  : mood === 'tickled'
                  ? { rotate: [15, -18, 15] }
                  : mood === 'purring'
                  ? { rotate: [8, 2, 8] }
                  : { rotate: [3, -3, 3] }
              }
              transition={{ repeat: Infinity, duration: mood === 'listening' ? 0.6 : 1.8 }}
            />
            {/* Right Ear Pink Inner */}
            <path d="M 188 65 Q 198 38 214 28 L 218 65 Z" fill="url(#catEarInner)" />
          </g>

          {/* CAT BODY (Tubby, soft cat body) */}
          <ellipse
            cx="150"
            cy="210"
            rx="75"
            ry="75"
            fill="url(#tomFurGrad)"
            stroke="#334155"
            strokeWidth="5"
            onClick={handleBellyTap}
            className="cursor-pointer"
          />

          {/* White Chest Bib */}
          <path
            d="M 120 170 Q 150 250 180 170 Q 150 185 120 170 Z"
            fill="url(#tomBibGrad)"
            onClick={handleBellyTap}
          />

          {/* CAT HEAD (Tom style rounded with chubby cheeks) */}
          <g onClick={handleHeadTap} className="cursor-pointer">
            <path
              d="M 85 85 Q 150 65 215 85 Q 245 130 225 170 Q 150 195 75 170 Q 55 130 85 85 Z"
              fill="url(#tomFurGrad)"
              stroke="#334155"
              strokeWidth="5.5"
            />

            {/* Tabby Forehead Stripes */}
            <path d="M 150 78 L 150 98" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
            <path d="M 138 80 L 142 94" stroke="#334155" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 162 80 L 158 94" stroke="#334155" strokeWidth="3.5" strokeLinecap="round" />

            {/* Rosy Cheek Blush */}
            <ellipse
              cx="92"
              cy="150"
              rx={mood === 'smiling' || mood === 'tickled' || mood === 'purring' ? 20 : 14}
              ry={mood === 'smiling' || mood === 'tickled' || mood === 'purring' ? 14 : 9}
              fill="#FB7185"
              opacity={mood === 'smiling' || mood === 'tickled' ? 0.75 : 0.45}
            />
            <ellipse
              cx="208"
              cy="150"
              rx={mood === 'smiling' || mood === 'tickled' || mood === 'purring' ? 20 : 14}
              ry={mood === 'smiling' || mood === 'tickled' || mood === 'purring' ? 14 : 9}
              fill="#FB7185"
              opacity={mood === 'smiling' || mood === 'tickled' ? 0.75 : 0.45}
            />

            {/* EYES */}
            {mood === 'tickled' || mood === 'purring' ? (
              /* Joyful closed squinting laughing eyes > < */
              <g stroke="#1E293B" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none">
                <path d="M 100 115 L 120 126 L 100 137" />
                <path d="M 200 115 L 180 126 L 200 137" />
              </g>
            ) : mood === 'sleeping' ? (
              /* Sleeping eyes gently curved down u u */
              <g stroke="#1E293B" strokeWidth="5.5" strokeLinecap="round" fill="none">
                <path d="M 98 126 Q 115 138 132 126" />
                <path d="M 168 126 Q 185 138 202 126" />
              </g>
            ) : mood === 'funny' ? (
              /* Silly cross-eyed goofy expression */
              <g>
                <ellipse cx="115" cy="125" rx="19" ry="24" fill="#FFFFFF" stroke="#334155" strokeWidth="3" />
                <circle cx="124" cy="125" r="10" fill="url(#tomEyeGrad)" />
                <circle cx="124" cy="125" r="5" fill="#000000" />

                <ellipse cx="185" cy="125" rx="19" ry="24" fill="#FFFFFF" stroke="#334155" strokeWidth="3" />
                <circle cx="176" cy="125" r="10" fill="url(#tomEyeGrad)" />
                <circle cx="176" cy="125" r="5" fill="#000000" />
              </g>
            ) : mood === 'smiling' ? (
              /* Big bright emerald Tom eyes with stars */
              <g>
                {/* Left Eye */}
                <ellipse cx="115" cy="125" rx="20" ry="25" fill="#FFFFFF" stroke="#334155" strokeWidth="3.5" />
                <circle cx="115" cy="125" r="14" fill="url(#tomEyeGrad)" />
                <ellipse cx="115" cy="125" rx="5" ry="12" fill="#022C22" />
                <circle cx="110" cy="116" r="6" fill="#FFFFFF" />
                <circle cx="120" cy="132" r="3" fill="#FFFFFF" />

                {/* Right Eye */}
                <ellipse cx="185" cy="125" rx="20" ry="25" fill="#FFFFFF" stroke="#334155" strokeWidth="3.5" />
                <circle cx="185" cy="125" r="14" fill="url(#tomEyeGrad)" />
                <ellipse cx="185" cy="125" rx="5" ry="12" fill="#022C22" />
                <circle cx="180" cy="116" r="6" fill="#FFFFFF" />
                <circle cx="190" cy="132" r="3" fill="#FFFFFF" />
              </g>
            ) : (
              /* Waiting / Pleading puppy-cat eyes */
              <g>
                <ellipse cx="115" cy="125" rx="19" ry="24" fill="#FFFFFF" stroke="#334155" strokeWidth="3" />
                <circle cx="115" cy="125" r="13" fill="url(#tomEyeGrad)" />
                <circle cx="115" cy="125" r="8" fill="#022C22" />
                <circle cx="111" cy="118" r="5" fill="#FFFFFF" />
                <circle cx="119" cy="130" r="2.5" fill="#FFFFFF" />

                <ellipse cx="185" cy="125" rx="19" ry="24" fill="#FFFFFF" stroke="#334155" strokeWidth="3" />
                <circle cx="185" cy="125" r="13" fill="url(#tomEyeGrad)" />
                <circle cx="185" cy="125" r="8" fill="#022C22" />
                <circle cx="181" cy="118" r="5" fill="#FFFFFF" />
                <circle cx="189" cy="130" r="2.5" fill="#FFFFFF" />

                {/* Pleading curved eyebrows */}
                <path d="M 98 102 Q 115 95 130 105" stroke="#334155" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                <path d="M 202 102 Q 185 95 170 105" stroke="#334155" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              </g>
            )}

            {/* Pink Cat Nose */}
            <polygon points="150,144 142,135 158,135" fill="#F43F5E" stroke="#E11D48" strokeWidth="1.5" />

            {/* WHISKERS (3 on each cheek) */}
            <g stroke="#334155" strokeWidth="2.5" strokeLinecap="round">
              {/* Left Whiskers */}
              <line x1="130" y1="145" x2="68" y2="138" />
              <line x1="130" y1="148" x2="65" y2="149" />
              <line x1="130" y1="152" x2="72" y2="160" />

              {/* Right Whiskers */}
              <line x1="170" y1="145" x2="232" y2="138" />
              <line x1="170" y1="148" x2="235" y2="149" />
              <line x1="170" y1="152" x2="228" y2="160" />
            </g>

            {/* MOUTH */}
            {mood === 'tickled' ? (
              /* Wide Open Laughing Mouth with vibrating pink tongue */
              <g>
                <path
                  d="M 125 150 Q 150 205 175 150 Q 150 144 125 150 Z"
                  fill="#991B1B"
                  stroke="#334155"
                  strokeWidth="3.5"
                />
                {/* Cute vampire fangs */}
                <polygon points="132,150 136,158 140,150" fill="#FFFFFF" />
                <polygon points="160,150 164,158 168,150" fill="#FFFFFF" />
                {/* Bouncing tongue */}
                <ellipse cx="150" cy="182" rx="18" ry="12" fill="#FB7185" />
              </g>
            ) : mood === 'smiling' ? (
              /* Big Happy Smile with cute cat fangs */
              <g>
                <path
                  d="M 125 148 Q 150 198 175 148 Q 150 142 125 148 Z"
                  fill="#991B1B"
                  stroke="#334155"
                  strokeWidth="3.5"
                />
                {/* Cute baby cat fangs */}
                <polygon points="132,148 136,156 140,148" fill="#FFFFFF" />
                <polygon points="160,148 164,156 168,148" fill="#FFFFFF" />
                <ellipse cx="150" cy="178" rx="16" ry="10" fill="#FB7185" />
              </g>
            ) : mood === 'speaking' ? (
              /* Mouth moving in speech */
              <g>
                <ellipse cx="150" cy="155" rx="12" ry="8" fill="#991B1B" stroke="#334155" strokeWidth="2.5" />
                <ellipse cx="150" cy="158" rx="7" ry="4" fill="#FB7185" />
              </g>
            ) : mood === 'funny' ? (
              /* Goofy mouth with tongue sticking out */
              <g>
                <path d="M 132 148 Q 142 156 150 148 Q 158 156 168 148" stroke="#334155" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                <path d="M 144 148 Q 146 172 152 172 Q 158 172 156 148 Z" fill="#FB7185" stroke="#E11D48" strokeWidth="2" />
              </g>
            ) : (
              /* Classic 3-shaped cute cat mouth */
              <path
                d="M 135 148 Q 142 155 150 146 Q 158 155 165 148"
                stroke="#334155"
                strokeWidth="3.5"
                fill="none"
                strokeLinecap="round"
              />
            )}
          </g>

          {/* RED COLLAR & JINGLE BELL (Tom's signature bell!) */}
          <g onClick={handleBellTap} className="cursor-pointer">
            {/* Red Collar Band */}
            <path
              d="M 115 174 Q 150 190 185 174 Q 185 183 183 186 Q 150 200 117 186 Z"
              fill="#DC2626"
              stroke="#991B1B"
              strokeWidth="2.5"
            />
            {/* Golden Jingle Bell */}
            <circle cx="150" cy="192" r="13" fill="url(#bellGrad)" stroke="#854D0E" strokeWidth="2.5" />
            <circle cx="147" cy="188" r="3.5" fill="#FEF08A" />
            <circle cx="150" cy="196" r="3" fill="#713F12" />
            <line x1="142" y1="194" x2="158" y2="194" stroke="#713F12" strokeWidth="2" />
          </g>

          {/* CAT PAWS */}
          {mood === 'smiling' ? (
            /* Dancing waving paws up */
            <g>
              {/* Left dancing paw */}
              <motion.g
                animate={{ y: [-8, 8, -8], rotate: [-10, 15, -10] }}
                transition={{ repeat: Infinity, duration: 0.55 }}
                className="origin-[75px_150px]"
              >
                <ellipse cx="68" cy="145" rx="18" ry="15" fill="url(#tomFurGrad)" stroke="#334155" strokeWidth="3.5" />
                <ellipse cx="68" cy="145" rx="8" ry="6" fill="#FDA4AF" />
              </motion.g>
              {/* Right dancing paw */}
              <motion.g
                animate={{ y: [8, -8, 8], rotate: [10, -15, 10] }}
                transition={{ repeat: Infinity, duration: 0.55 }}
                className="origin-[225px_150px]"
              >
                <ellipse cx="232" cy="145" rx="18" ry="15" fill="url(#tomFurGrad)" stroke="#334155" strokeWidth="3.5" />
                <ellipse cx="232" cy="145" rx="8" ry="6" fill="#FDA4AF" />
              </motion.g>
            </g>
          ) : mood === 'tickled' ? (
            /* Tickled covering tummy paws */
            <g>
              <ellipse cx="98" cy="205" rx="17" ry="14" fill="url(#tomFurGrad)" stroke="#334155" strokeWidth="3.5" />
              <ellipse cx="202" cy="205" rx="17" ry="14" fill="url(#tomFurGrad)" stroke="#334155" strokeWidth="3.5" />
            </g>
          ) : (
            /* Cute resting paws on tummy */
            <g onClick={handleBellyTap}>
              <ellipse cx="95" cy="198" rx="18" ry="14" fill="url(#tomFurGrad)" stroke="#334155" strokeWidth="3.5" />
              <ellipse cx="95" cy="198" rx="8" ry="6" fill="#FDA4AF" />

              <ellipse cx="205" cy="198" rx="18" ry="14" fill="url(#tomFurGrad)" stroke="#334155" strokeWidth="3.5" />
              <ellipse cx="205" cy="198" rx="8" ry="6" fill="#FDA4AF" />
            </g>
          )}

          {/* Chubby Cat Back Paws / Feet */}
          <ellipse cx="110" cy="280" rx="26" ry="17" fill="url(#tomFurGrad)" stroke="#334155" strokeWidth="4" />
          <ellipse cx="110" cy="281" rx="13" ry="8" fill="#FDA4AF" />

          <ellipse cx="190" cy="280" rx="26" ry="17" fill="url(#tomFurGrad)" stroke="#334155" strokeWidth="4" />
          <ellipse cx="190" cy="281" rx="13" ry="8" fill="#FDA4AF" />

          {/* ACCESSORIES OVERLAYS */}
          {/* Nightcap for Lori Mode */}
          {(accessory === 'nightcap' || mood === 'sleeping') && (
            <g className="origin-[150px_60px]">
              <path
                d="M 95 65 C 130 10, 210 -10, 240 45 C 248 60, 210 70, 185 68 Z"
                fill="#3B82F6"
                stroke="#1D4ED8"
                strokeWidth="4"
              />
              {/* White stars on nightcap */}
              <circle cx="140" cy="35" r="4" fill="#FEF08A" />
              <circle cx="180" cy="25" r="5" fill="#FEF08A" />
              <circle cx="215" cy="35" r="4" fill="#FEF08A" />
              {/* Fluffy white pompom at tip */}
              <circle cx="240" cy="50" r="12" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="3" />
            </g>
          )}

          {/* Party Hat */}
          {accessory === 'party_hat' && mood !== 'sleeping' && (
            <g className="origin-[150px_60px] animate-bounce">
              <polygon points="120,65 150,5 180,65" fill="#F43F5E" stroke="#BE123C" strokeWidth="4" />
              <circle cx="150" cy="28" r="5" fill="#FDE047" />
              <circle cx="138" cy="48" r="5" fill="#38BDF8" />
              <circle cx="162" cy="48" r="5" fill="#4ADE80" />
              <circle cx="150" cy="5" r="9" fill="#FACC15" stroke="#EAB308" strokeWidth="2" />
            </g>
          )}

          {/* King Crown */}
          {accessory === 'crown' && mood !== 'sleeping' && (
            <g className="origin-[150px_60px]">
              <path
                d="M 108 65 L 115 28 L 132 48 L 150 18 L 168 48 L 185 28 L 192 65 Z"
                fill="#FACC15"
                stroke="#CA8A04"
                strokeWidth="4"
              />
              <circle cx="115" cy="28" r="4.5" fill="#EF4444" />
              <circle cx="150" cy="18" r="6" fill="#3B82F6" />
              <circle cx="185" cy="28" r="4.5" fill="#10B981" />
              <circle cx="150" cy="55" r="4" fill="#EC4899" />
            </g>
          )}

          {/* Star Sunglasses */}
          {accessory === 'sunglasses' && mood !== 'sleeping' && (
            <g>
              <line x1="130" y1="125" x2="170" y2="125" stroke="#0F172A" strokeWidth="5" />
              <path
                d="M 115 106 L 121 118 L 135 118 L 124 126 L 128 139 L 115 131 L 102 139 L 106 126 L 95 118 L 109 118 Z"
                fill="#0F172A"
                stroke="#38BDF8"
                strokeWidth="3.5"
              />
              <path
                d="M 185 106 L 191 118 L 205 118 L 194 126 L 198 139 L 185 131 L 172 139 L 176 126 L 165 118 L 179 118 Z"
                fill="#0F172A"
                stroke="#38BDF8"
                strokeWidth="3.5"
              />
            </g>
          )}
        </svg>

        {/* Toddler Interactive Clue Badge */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-950 font-black text-xs px-3.5 py-1 rounded-full shadow-md whitespace-nowrap border-2 border-white flex items-center gap-1.5">
          <span>🐾</span>
          <span>क्यूटिए को छुओ: सिर सहलाओ या पेट पर गुदगुदी करो!</span>
        </div>
      </div>
    </div>
  );
};
