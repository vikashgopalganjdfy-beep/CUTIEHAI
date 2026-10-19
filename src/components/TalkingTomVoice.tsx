import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, MessageCircle, Sparkles, Volume2, X } from 'lucide-react';
import { soundEffects, cartoonVoice } from '../utils/audio';

// Web Speech Recognition typing
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionResultItem {
  transcript: string;
}

interface SpeechRecognitionResultList {
  [index: number]: { [index: number]: SpeechRecognitionResultItem };
  length: number;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => ISpeechRecognition;
    webkitSpeechRecognition?: new () => ISpeechRecognition;
  }
}

const QUICK_TALKS = [
  {
    kidSays: 'नमस्ते टॉम! 👋',
    tomReplies: 'नमस्ते प्यारे बच्चे! कैसे हो? मुझे तुमसे मिलकर बहुत खुशी हुई! म्याऊं!',
  },
  {
    kidSays: 'दूध पियोगे? 🥛',
    tomReplies: 'हाँ! मुझे मलाईदार मीठा दूध बहुत पसंद है! गप-गप-गप! म्याऊं!',
  },
  {
    kidSays: 'तुम्हारा दोस्त कौन है? 💖',
    tomReplies: 'तुम ही तो मेरे सबसे प्यारे और बेस्ट फ्रेंड हो! लव यू!',
  },
  {
    kidSays: 'जादू दिखाओ! ✨',
    tomReplies: 'आबरा का डाबरा, गिली गिली छू! ये देखो ढेर सारे चमकते सितारे! 🌟',
  },
];

interface TalkingTomVoiceProps {
  isOpen: boolean;
  onClose: () => void;
  onCatSpeak: (text: string) => void;
  onListeningState: (isListening: boolean) => void;
}

export const TalkingTomVoice: React.FC<TalkingTomVoiceProps> = ({
  isOpen,
  onClose,
  onCatSpeak,
  onListeningState,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [heardText, setHeardText] = useState('');
  const [supportMic, setSupportMic] = useState(true);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      setSupportMic(false);
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'hi-IN'; // Listen in Hindi

      recognition.onstart = () => {
        setIsRecording(true);
        onListeningState(true);
        soundEffects.playBell();
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        if (event.results && event.results.length > 0) {
          const transcript = event.results[0][0].transcript;
          setHeardText(transcript);

          // Cat repeats in high pitched helium voice!
          setTimeout(() => {
            onListeningState(false);
            soundEffects.playMeow();
            const catResponse = `${transcript}! म्याऊं!`;
            onCatSpeak(catResponse);
            cartoonVoice.speak(catResponse, { pitch: 1.85, rate: 1.25 });
          }, 400);
        }
      };

      recognition.onerror = () => {
        setIsRecording(false);
        onListeningState(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
        onListeningState(false);
      };

      recognitionRef.current = recognition;
    } catch {
      setSupportMic(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, [onCatSpeak, onListeningState]);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      setHeardText('');
      try {
        recognitionRef.current.start();
      } catch {
        // restart
        recognitionRef.current.stop();
        setTimeout(() => {
          recognitionRef.current?.start();
        }, 150);
      }
    }
  };

  const handleQuickTalk = (item: { kidSays: string; tomReplies: string }) => {
    soundEffects.playMeow();
    setHeardText(item.kidSays);
    onCatSpeak(item.tomReplies);
    cartoonVoice.speak(item.tomReplies, { pitch: 1.75, rate: 1.2 });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-emerald-100 via-teal-50 to-amber-100 text-amber-950 rounded-3xl p-5 shadow-2xl border-4 border-emerald-400 flex flex-col max-h-[85vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-white/70 hover:bg-white text-amber-950 active:scale-90 transition-transform shadow"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-400 border-2 border-emerald-500 text-3xl mb-1 shadow text-white">
            🐱🎙️
          </div>
          <h2 className="text-2xl font-black text-emerald-950 tracking-wide">
            टॉम से बात करो!
          </h2>
          <p className="text-xs text-emerald-800 font-bold">
            टॉम आपकी बातें सुनेगा और अपनी बिल्ली आवाज़ में दोहराएगा!
          </p>
        </div>

        {/* Big Mic Button (Talking Tom style) */}
        {supportMic ? (
          <div className="flex flex-col items-center justify-center my-2 p-3 bg-white/80 rounded-2xl border-2 border-emerald-200">
            <button
              onClick={toggleRecording}
              className={`w-20 h-20 rounded-full flex items-center justify-center shadow-xl border-4 transition-all duration-300 ${
                isRecording
                  ? 'bg-rose-500 border-rose-300 text-white animate-pulse scale-110 shadow-rose-300'
                  : 'bg-emerald-500 hover:bg-emerald-600 border-white text-white active:scale-95 shadow-emerald-200'
              }`}
            >
              {isRecording ? <MicOff className="w-9 h-9" /> : <Mic className="w-9 h-9" />}
            </button>
            <p className="text-xs font-black text-emerald-900 mt-2">
              {isRecording ? 'टॉम सुन रहा है... कुछ बोलिए!' : 'माइक दबाकर बोलिए!'}
            </p>
            {heardText && (
              <p className="text-[11px] font-bold text-pink-600 mt-1 bg-pink-50 px-2 py-0.5 rounded-full">
                आपने कहा: &quot;{heardText}&quot;
              </p>
            )}
          </div>
        ) : (
          <div className="p-2.5 bg-amber-100 rounded-xl text-center text-xs text-amber-900 font-semibold mb-2">
            नीचे दिए गए बटनों को दबाकर टॉम से मजेदार बातें करें!
          </div>
        )}

        {/* Quick Dialogue Buttons */}
        <div className="flex-1 overflow-y-auto space-y-2 mt-1">
          <p className="text-[11px] font-extrabold text-emerald-900 uppercase tracking-wider px-1">
            या इनमें से कोई बात पूछें:
          </p>
          {QUICK_TALKS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickTalk(item)}
              className="w-full text-left p-3 rounded-2xl bg-white hover:bg-emerald-50 border-2 border-emerald-200 shadow-sm active:scale-95 transition-all flex items-center justify-between"
            >
              <span className="text-sm font-extrabold text-emerald-950">
                {item.kidSays}
              </span>
              <span className="text-xs font-bold text-pink-600 bg-pink-100 px-2 py-1 rounded-full">
                पूछो 💬
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
