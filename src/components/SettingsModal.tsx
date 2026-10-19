import React, { useState } from 'react';
import { X, User, Sparkles, Volume2, Check, Heart, ShieldCheck } from 'lucide-react';
import { soundEffects, cartoonVoice } from '../utils/audio';

export interface ChildProfile {
  name: string;
  suffix: string; // 'बेटा' | 'बेटी' | 'बाबू' | 'गुड़िया' | ''
  voiceStyle: 'natural' | 'cat';
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ChildProfile;
  onSaveProfile: (profile: ChildProfile) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
}) => {
  const [childName, setChildName] = useState(profile.name);
  const [suffix, setSuffix] = useState(profile.suffix);
  const [voiceStyle, setVoiceStyle] = useState<'natural' | 'cat'>(profile.voiceStyle);
  const [savedNotice, setSavedNotice] = useState(false);

  if (!isOpen) return null;

  const handleTestVoice = () => {
    soundEffects.playMeow();
    const displayName = childName.trim() ? `${childName} ${suffix}`.trim() : 'प्यारे बच्चे';
    cartoonVoice.speak(`नमस्ते ${displayName}! मैं क्यूटिए बिल्ली हूँ, आपका प्यारा दोस्त! म्याऊं!`, {
      voiceType: voiceStyle,
      force: true,
    });
  };

  const handleSave = () => {
    soundEffects.playBell();
    const finalName = childName.trim() || 'प्यारे बच्चे';
    onSaveProfile({
      name: finalName,
      suffix,
      voiceStyle,
    });
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 700);
  };

  const quickNames = ['आरव', 'चिंटू', 'परी', 'कबीर', 'अनाया', 'रोहन'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-amber-50 via-white to-pink-50 text-amber-950 rounded-3xl p-5 shadow-2xl border-4 border-amber-300 flex flex-col max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-950 active:scale-90 transition-transform shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-300 border-2 border-amber-400 text-2xl mb-1 shadow">
            ⚙️
          </div>
          <h2 className="text-2xl font-black text-amber-950 tracking-wide">
            Cutie सेटिंग्स
          </h2>
          <p className="text-xs text-amber-800 font-bold">
            अपने बच्चे का नाम डालें ताकि क्यूटिए उसी नाम से बुलाए! 💖
          </p>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
          {/* Child Name Input */}
          <div className="bg-white p-3.5 rounded-2xl border-2 border-amber-200 shadow-sm">
            <label className="text-xs font-black text-amber-950 flex items-center gap-1.5 mb-1.5">
              <User className="w-4 h-4 text-pink-500" />
              बच्चे का नाम (Child Name):
            </label>
            <input
              type="text"
              value={childName}
              onChange={e => setChildName(e.target.value)}
              placeholder="उदा. आरव, परी, चिंटू..."
              className="w-full px-3.5 py-2.5 rounded-xl border-2 border-amber-300 focus:border-pink-500 focus:outline-none text-base font-black text-amber-950 bg-amber-50/50"
            />

            {/* Quick Name Suggestions */}
            <div className="flex items-center gap-1.5 flex-wrap mt-2">
              <span className="text-[10px] font-bold text-amber-700">सुझाव:</span>
              {quickNames.map(qName => (
                <button
                  key={qName}
                  type="button"
                  onClick={() => setChildName(qName)}
                  className="px-2 py-0.5 rounded-full bg-amber-100 hover:bg-amber-200 text-[11px] font-bold text-amber-900 border border-amber-300"
                >
                  {qName}
                </button>
              ))}
            </div>
          </div>

          {/* Sweet Suffix / Relation */}
          <div className="bg-white p-3 rounded-2xl border-2 border-amber-200 shadow-sm">
            <label className="text-xs font-black text-amber-950 flex items-center gap-1.5 mb-2">
              <Heart className="w-4 h-4 text-rose-500" />
              प्यार से क्या बुलाएं?
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {['बेटा', 'बेटी', 'बाबू', 'गुड़िया'].map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSuffix(suffix === s ? '' : s)}
                  className={`py-1.5 px-1 rounded-xl text-xs font-black border-2 transition-all ${
                    suffix === s
                      ? 'bg-pink-500 text-white border-pink-400 shadow-sm'
                      : 'bg-amber-50 text-amber-900 border-amber-200 hover:border-amber-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Voice Style Selection */}
          <div className="bg-white p-3 rounded-2xl border-2 border-amber-200 shadow-sm">
            <label className="text-xs font-black text-amber-950 flex items-center gap-1.5 mb-2">
              <Volume2 className="w-4 h-4 text-emerald-600" />
              आवाज़ का प्रकार (Voice Type):
            </label>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <button
                type="button"
                onClick={() => setVoiceStyle('natural')}
                className={`p-2.5 rounded-xl text-left border-2 transition-all ${
                  voiceStyle === 'natural'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className="font-black text-xs">✨ साफ मीठी आवाज़</div>
                <div className="text-[10px] text-gray-500 font-semibold">प्राकृतिक हिंदी</div>
              </button>

              <button
                type="button"
                onClick={() => setVoiceStyle('cat')}
                className={`p-2.5 rounded-xl text-left border-2 transition-all ${
                  voiceStyle === 'cat'
                    ? 'bg-amber-50 border-amber-500 text-amber-950 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className="font-black text-xs">🐱 क्यूटिए आवाज़</div>
                <div className="text-[10px] text-gray-500 font-semibold">हल्की बिल्ली आवाज़</div>
              </button>
            </div>

            <button
              type="button"
              onClick={handleTestVoice}
              className="w-full py-2 bg-amber-100 hover:bg-amber-200 text-amber-950 font-black text-xs rounded-xl border border-amber-300 flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
            >
              <Volume2 className="w-3.5 h-3.5 text-pink-600" />
              आवाज़ टेस्ट करें
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-3 pt-2">
          <button
            type="button"
            onClick={handleSave}
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-base rounded-2xl shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 active:scale-95 transition-transform mb-3"
          >
            {savedNotice ? (
              <>
                <Check className="w-5 h-5" />
                सेव हो गया!
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                नाम और सेटिंग्स सेव करें
              </>
            )}
          </button>

          {/* Hello Group Credits as explicitly requested */}
          <div className="text-center py-2 px-3 bg-amber-100/70 rounded-xl border border-amber-200">
            <p className="text-xs font-black text-amber-950 tracking-wide">
              Produced by Hello Group
            </p>
            <p className="text-[10px] text-amber-700 font-semibold">
              App Name: <span className="font-extrabold text-pink-600">Cutie</span> • Made with ❤️ for Kids
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
