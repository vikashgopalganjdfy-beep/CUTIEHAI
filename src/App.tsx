import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX, Moon, MessageCircle, Laugh, Smile, Settings, Utensils, Shirt, Sparkles, Heart } from 'lucide-react';
import { CartoonCat, CatMood } from './components/CartoonCat';
import { AccessoriesBar } from './components/AccessoriesBar';
import { CelebrationEffects } from './components/CelebrationEffects';
import { PermissionOverlay } from './components/PermissionOverlay';
import { MilestoneModal } from './components/MilestoneModal';
import { LoriModal, LoriItem } from './components/LoriModal';
import { FunnyJokesModal, JokeItem } from './components/FunnyJokesModal';
import { TalkingTomVoice } from './components/TalkingTomVoice';
import { SettingsModal, ChildProfile } from './components/SettingsModal';
import { MealtimeHelperModal } from './components/MealtimeHelperModal';
import { soundEffects, cartoonVoice } from './utils/audio';

const STORAGE_KEY_POINTS = 'cutie_happy_smiles';
const STORAGE_KEY_PROFILE = 'cutie_child_profile';

export default function App() {
  // App States
  const [hasStarted, setHasStarted] = useState(false);
  const [catMood, setCatMood] = useState<CatMood>('waiting');
  const [accessory, setAccessory] = useState('none');
  const [showWardrobe, setShowWardrobe] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Child Profile & Personalization
  const [childProfile, setChildProfile] = useState<ChildProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return {
      name: 'प्यारे बच्चे',
      suffix: '',
      voiceStyle: 'natural',
    };
  });

  const fullChildName = childProfile.name.trim()
    ? `${childProfile.name} ${childProfile.suffix}`.trim()
    : 'प्यारे बच्चे';

  // Happy Points
  const [happyPoints, setHappyPoints] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_POINTS);
    return saved ? parseInt(saved, 10) : 0;
  });

  // Speech bubble text
  const [speechText, setSpeechText] = useState(`अरे ${fullChildName}! थोड़ा सा मुस्कुराओ ना! 🥺`);

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMealtimeOpen, setIsMealtimeOpen] = useState(false);
  const [isLoriOpen, setIsLoriOpen] = useState(false);
  const [isFunnyOpen, setIsFunnyOpen] = useState(false);
  const [isTalkOpen, setIsTalkOpen] = useState(false);
  const [currentPlayingLoriId, setCurrentPlayingLoriId] = useState<string | null>(null);

  // Celebrations & Milestones
  const [showCelebration, setShowCelebration] = useState(false);
  const [milestone, setMilestone] = useState<{ badge: string; icon: string; count: number } | null>(null);

  // Timers
  const lastStateChangeRef = useRef<number>(Date.now());
  const resetMoodTimeoutRef = useRef<number | null>(null);
  const celebrationTimeoutRef = useRef<number | null>(null);

  // Sound toggle
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundEffects.setSoundEnabled(next);
    if (!next) {
      cartoonVoice.stop();
      soundEffects.stopLullaby();
    }
  };

  // Profile save
  const handleSaveProfile = (newProfile: ChildProfile) => {
    setChildProfile(newProfile);
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(newProfile));
    const newName = newProfile.name.trim()
      ? `${newProfile.name} ${newProfile.suffix}`.trim()
      : 'प्यारे बच्चे';
    const updatedSpeech = catMood === 'smiling'
      ? `अरे वाह ${newName}! कितनी प्यारी मुस्कान है! 💖`
      : `अरे ${newName}! थोड़ा सा मुस्कुराओ ना! 🥺`;
    setSpeechText(updatedSpeech);
  };

  // Temporary mood handler
  const setTempMood = useCallback((mood: CatMood, text: string, durationMs: number = 2400) => {
    if (resetMoodTimeoutRef.current) clearTimeout(resetMoodTimeoutRef.current);
    setCatMood(mood);
    setSpeechText(text);

    resetMoodTimeoutRef.current = window.setTimeout(() => {
      setCatMood('waiting');
      setSpeechText(`अरे ${fullChildName}! थोड़ा सा मुस्कुराओ ना! 🥺`);
    }, durationMs);
  }, [fullChildName]);

  // Smile celebration trigger
  const triggerSmileCelebration = () => {
    soundEffects.playCheerChime();
    soundEffects.playMeow();
    setCatMood('smiling');
    const msg = `अरे वाह ${fullChildName}! कितनी प्यारी मुस्कान है! म्याऊं! 💖`;
    setSpeechText(msg);

    cartoonVoice.speak(msg, {
      voiceType: childProfile.voiceStyle,
      pitch: childProfile.voiceStyle === 'cat' ? 1.15 : 1.05,
      rate: 1.0,
      force: true,
    });

    setShowCelebration(true);
    if (celebrationTimeoutRef.current) clearTimeout(celebrationTimeoutRef.current);
    celebrationTimeoutRef.current = window.setTimeout(() => {
      setShowCelebration(false);
    }, 2500);

    setHappyPoints(prev => {
      const updated = prev + 1;
      localStorage.setItem(STORAGE_KEY_POINTS, updated.toString());
      if (updated === 5) {
        setMilestone({ badge: 'नन्हा सितारा', icon: '☀️', count: updated });
      } else if (updated === 10) {
        setMilestone({ badge: 'हंसमुख चैंपियन', icon: '🏆', count: updated });
      } else if (updated === 20) {
        setMilestone({ badge: 'सुपर स्टार स्माइलर', icon: '👑', count: updated });
      }
      return updated;
    });

    if (resetMoodTimeoutRef.current) clearTimeout(resetMoodTimeoutRef.current);
    resetMoodTimeoutRef.current = window.setTimeout(() => {
      setCatMood('waiting');
      setSpeechText(`अरे ${fullChildName}! थोड़ा सा मुस्कुराओ ना! 🥺`);
    }, 3200);
  };

  // Periodic gentle prompt when idle
  useEffect(() => {
    if (!hasStarted || catMood === 'sleeping' || catMood === 'tickled') return;

    const interval = setInterval(() => {
      const timeSinceChange = Date.now() - lastStateChangeRef.current;
      if (timeSinceChange > 9000) {
        soundEffects.playMeow();
        const prompts = [
          `अरे ${fullChildName}! थोड़ा सा मुस्कुराओ ना!`,
          `अरे ${fullChildName}, एक प्यारी सी स्माइल दो ना!`,
          `क्यूटिए आपकी सुंदर मुस्कान देखना चाहती है! म्याऊं!`,
        ];
        const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
        setSpeechText(randomPrompt);
        cartoonVoice.speak(randomPrompt, {
          voiceType: childProfile.voiceStyle,
          pitch: childProfile.voiceStyle === 'cat' ? 1.12 : 1.05,
          rate: 1.0,
        });
        lastStateChangeRef.current = Date.now();
      }
    }, 9500);

    return () => clearInterval(interval);
  }, [hasStarted, catMood, fullChildName, childProfile.voiceStyle]);

  // Interactive Touch Actions
  const handleTickle = () => {
    soundEffects.playCatGiggle();
    const tickleTexts = [
      `हाहाहा! अरे ${fullChildName} गुदगुदी कर रहा है! 😹`,
      `बस करो ${fullChildName}! हीहीही! 💖`,
      `गुदगुदी गुदगुदी! म्याऊं हाहाहा! 🤣`,
    ];
    const quote = tickleTexts[Math.floor(Math.random() * tickleTexts.length)];
    setTempMood('tickled', quote, 1800);
    cartoonVoice.speak(quote, {
      voiceType: childProfile.voiceStyle,
      pitch: childProfile.voiceStyle === 'cat' ? 1.18 : 1.08,
      rate: 1.1,
      force: true,
    });
  };

  const handlePetHead = () => {
    soundEffects.playPurr();
    soundEffects.playMeow();
    const petTexts = [
      `पुर्रर्र... ${fullChildName} मुझे सहला रहा है! 🐱💖`,
      `म्याऊं! ${fullChildName} तुम मेरे सबसे अच्छे दोस्त हो! 🐾`,
      `कितना मज़ा आ रहा है! म्याऊं! ✨`,
    ];
    const quote = petTexts[Math.floor(Math.random() * petTexts.length)];
    setTempMood('purring', quote, 2200);
    cartoonVoice.speak(quote, {
      voiceType: childProfile.voiceStyle,
      pitch: childProfile.voiceStyle === 'cat' ? 1.1 : 1.02,
      rate: 1.0,
      force: true,
    });
  };

  const handleTapTail = () => {
    soundEffects.playMeow();
    const quote = `अरे ${fullChildName}, मेरी पूंछ मत खींचो! म्याऊं! 😹`;
    setTempMood('funny', quote, 2000);
    cartoonVoice.speak(quote, {
      voiceType: childProfile.voiceStyle,
      pitch: childProfile.voiceStyle === 'cat' ? 1.14 : 1.05,
      rate: 1.05,
      force: true,
    });
  };

  // Lori Lullaby
  const handleStartLori = (lori: LoriItem) => {
    setCurrentPlayingLoriId(lori.id);
    setCatMood('sleeping');
    const personalizedSpeech = lori.speechText.replace('मुन्ने', fullChildName).replace('प्यारे बच्चे', fullChildName);
    setSpeechText(`🌙 ${lori.title}`);

    soundEffects.playLullabyMelody(() => {
      setCurrentPlayingLoriId(null);
      setCatMood('waiting');
    });

    cartoonVoice.speak(personalizedSpeech, {
      voiceType: 'natural',
      pitch: 1.02,
      rate: 0.92,
      force: true,
    });
  };

  const handleStopLori = () => {
    setCurrentPlayingLoriId(null);
    soundEffects.stopLullaby();
    cartoonVoice.stop();
    setCatMood('waiting');
    setSpeechText(`अरे वाह ${fullChildName}! लोरी खत्म हुई! ☀️`);
  };

  // Funny Jokes
  const handleTriggerFunny = (item: JokeItem) => {
    if (item.soundType === 'sneeze') {
      soundEffects.playFunnySneeze();
    } else if (item.soundType === 'giggle') {
      soundEffects.playCatGiggle();
    } else {
      soundEffects.playMeow();
    }

    setTempMood('funny', item.hindiText, 3500);
    cartoonVoice.speak(item.hindiText, {
      voiceType: childProfile.voiceStyle,
      pitch: childProfile.voiceStyle === 'cat' ? 1.15 : 1.05,
      rate: 1.05,
      force: true,
    });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-amber-50 via-rose-50/50 to-pink-100 flex flex-col justify-between items-center select-none font-sans overflow-x-hidden">
      {/* Launch Overlay */}
      {!hasStarted && (
        <PermissionOverlay
          onStart={() => {
            setHasStarted(true);
            soundEffects.playMeow();
            cartoonVoice.speak(`अरे ${fullChildName}! थोड़ा सा मुस्कुराओ ना!`, {
              voiceType: childProfile.voiceStyle,
              pitch: 1.05,
              rate: 1.0,
            });
          }}
        />
      )}

      {/* Confetti & Celebrations */}
      <CelebrationEffects active={showCelebration} />

      {/* Milestone Modal */}
      {milestone && (
        <MilestoneModal
          score={milestone.count}
          badgeName={milestone.badge}
          badgeIcon={milestone.icon}
          onClose={() => setMilestone(null)}
        />
      )}

      {/* Settings Modal (Produced by Hello Group) */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        profile={childProfile}
        onSaveProfile={handleSaveProfile}
      />

      {/* Mealtime Helper / Feeding Monster Modal */}
      <MealtimeHelperModal
        isOpen={isMealtimeOpen}
        onClose={() => setIsMealtimeOpen(false)}
        childName={fullChildName}
      />

      {/* Lori Modal */}
      <LoriModal
        isOpen={isLoriOpen}
        onClose={() => setIsLoriOpen(false)}
        onStartLori={handleStartLori}
        onStopLori={handleStopLori}
        currentPlayingId={currentPlayingLoriId}
      />

      {/* Funny Laugh Modal */}
      <FunnyJokesModal
        isOpen={isFunnyOpen}
        onClose={() => setIsFunnyOpen(false)}
        onTriggerFunny={handleTriggerFunny}
      />

      {/* Talking Tom Voice Mimic Modal */}
      <TalkingTomVoice
        isOpen={isTalkOpen}
        onClose={() => setIsTalkOpen(false)}
        onCatSpeak={text => {
          setTempMood('speaking', text, 3000);
        }}
        onListeningState={listening => {
          if (listening) {
            setCatMood('listening');
            setSpeechText(`क्यूटिए सुन रही है... बोलो ${fullChildName}! 👂`);
          } else {
            setCatMood('waiting');
          }
        }}
      />

      {/* SLIM NATIVE APP CONTAINER (Max width mobile, edge-to-edge fluid height) */}
      <div className="w-full max-w-md flex-1 flex flex-col justify-between p-3.5 sm:py-5">
        
        {/* SLIM TOP BAR: Brand + Star Points + Actions */}
        <header className="w-full flex items-center justify-between z-20 pb-2">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-2">
            <div className="px-3.5 py-1.5 rounded-2xl bg-white shadow-sm border-2 border-amber-300 flex items-center gap-1.5">
              <span className="text-xl leading-none">🐱</span>
              <span className="text-base font-black text-amber-950 tracking-tight">Cutie</span>
            </div>

            {/* Happy Points Pill */}
            <div className="flex items-center gap-1 bg-amber-100/90 px-2.5 py-1 rounded-xl border border-amber-300">
              <span className="text-sm">⭐</span>
              <span className="text-xs font-black text-amber-950">{happyPoints}</span>
            </div>
          </div>

          {/* Right Header Buttons */}
          <div className="flex items-center gap-1.5">
            {/* Active Lori Badge */}
            {currentPlayingLoriId && (
              <button
                onClick={() => setIsLoriOpen(true)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-indigo-600 text-amber-300 font-black text-[11px] shadow animate-pulse border border-indigo-400"
              >
                <Moon className="w-3 h-3" /> लोरी
              </button>
            )}

            {/* Wardrobe Drawer Toggle */}
            <button
              onClick={() => {
                soundEffects.playPop();
                setShowWardrobe(!showWardrobe);
              }}
              title="ड्रेस-अप"
              className={`p-2 rounded-2xl border-2 shadow-sm active:scale-90 transition-all ${
                showWardrobe
                  ? 'bg-pink-500 text-white border-pink-400'
                  : 'bg-white text-amber-950 border-amber-300'
              }`}
            >
              <Shirt className="w-4 h-4" />
            </button>

            {/* Settings (Produced by Hello Group) */}
            <button
              onClick={() => {
                soundEffects.playPop();
                setIsSettingsOpen(true);
              }}
              title="सेटिंग्स (Produced by Hello Group)"
              className="p-2 rounded-2xl bg-white border-2 border-amber-300 shadow-sm text-amber-950 active:scale-90 transition-transform"
            >
              <Settings className="w-4 h-4 text-amber-700" />
            </button>

            {/* Sound Mute/Unmute */}
            <button
              onClick={toggleSound}
              aria-label="आवाज़ चालू/बंद करें"
              className="p-2 rounded-2xl bg-white border-2 border-amber-300 shadow-sm text-amber-950 active:scale-90 transition-transform"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <VolumeX className="w-4 h-4 text-gray-400" />
              )}
            </button>
          </div>
        </header>

        {/* WARDROBE DRAWER (Opens smoothly when tapped, does not clutter screen) */}
        {showWardrobe && (
          <div className="w-full bg-white/95 rounded-3xl p-3 shadow-lg border-2 border-pink-300 mb-2 animate-fade-in">
            <AccessoriesBar
              currentAccessory={accessory}
              onSelectAccessory={acc => {
                setAccessory(acc);
                soundEffects.playPop();
              }}
            />
          </div>
        )}

        {/* CENTER HERO STAGE: Cutie Cat (Spacious & Clean) */}
        <main className="w-full flex-1 flex flex-col items-center justify-center my-auto py-2">
          <CartoonCat
            mood={catMood}
            accessory={accessory}
            onTickle={handleTickle}
            onPetHead={handlePetHead}
            onTapTail={handleTapTail}
            speechText={speechText}
          />
        </main>

        {/* CLEAN DEDICATED ACTION DECK (Organized separately, NOT crowded) */}
        <div className="w-full space-y-2 mt-auto pt-2 z-10">
          {/* ROW 1: CORE ENTERTAINMENT (2 Spacious Distinct Cards) */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* 1. HASAO / JOKES */}
            <button
              onClick={() => {
                soundEffects.playPop();
                setIsFunnyOpen(true);
              }}
              className="py-3 px-3 rounded-2xl bg-gradient-to-r from-amber-300 to-yellow-400 hover:from-amber-400 hover:to-yellow-500 border-2 border-amber-400 text-amber-950 font-black text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span className="text-2xl leading-none">🤣</span>
              <span className="tracking-wide">मुझे हंसाओ!</span>
            </button>

            {/* 2. KHANA KHILAO (MEALTIME HELPER) */}
            <button
              onClick={() => {
                soundEffects.playPop();
                setIsMealtimeOpen(true);
              }}
              className="py-3 px-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 border-2 border-purple-400 text-white font-black text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span className="text-2xl leading-none">🍲</span>
              <span className="tracking-wide">खाना खा लो!</span>
            </button>
          </div>

          {/* ROW 2: RELAX & TALK (2 Spacious Distinct Cards) */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* 3. LORI SUNO */}
            <button
              onClick={() => {
                soundEffects.playPop();
                setIsLoriOpen(true);
              }}
              className="py-3 px-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 border-2 border-indigo-300 text-white font-black text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span className="text-2xl leading-none">🌙</span>
              <span className="tracking-wide">लोरी सुनो</span>
            </button>

            {/* 4. BAAT KARO (TALKING TOM VOICE) */}
            <button
              onClick={() => {
                soundEffects.playPop();
                setIsTalkOpen(true);
              }}
              className="py-3 px-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 border-2 border-emerald-300 text-white font-black text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span className="text-2xl leading-none">🎤</span>
              <span className="tracking-wide">बात करो</span>
            </button>
          </div>

          {/* ROW 3: QUICK INTERACTIVE ACTIONS */}
          <div className="grid grid-cols-2 gap-2.5 pt-0.5">
            {/* Tickle Button */}
            <button
              onClick={handleTickle}
              className="py-2.5 px-3 rounded-2xl bg-white hover:bg-rose-50 border-2 border-rose-300 text-rose-600 font-black text-xs shadow-sm active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <span>🪶</span>
              <span>गुदगुदी करो!</span>
            </button>

            {/* Smile Celebration Button */}
            <button
              onClick={triggerSmileCelebration}
              className="py-2.5 px-3 rounded-2xl bg-white hover:bg-pink-50 border-2 border-pink-300 text-pink-600 font-black text-xs shadow-sm active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <Smile className="w-4 h-4 text-pink-500" />
              <span>स्माइल जादू! ✨</span>
            </button>
          </div>

          {/* SLIM NATIVE FOOTER: Produced by Hello Group */}
          <footer className="text-center pt-2 pb-1">
            <p className="text-[11px] font-black text-amber-900/70 tracking-wider">
              Produced by Hello Group • Cutie 🐱
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
