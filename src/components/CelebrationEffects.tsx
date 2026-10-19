import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { motion } from 'motion/react';

interface CelebrationEffectsProps {
  active: boolean;
}

export const CelebrationEffects: React.FC<CelebrationEffectsProps> = ({ active }) => {
  useEffect(() => {
    if (!active) return;

    // Fire colorful celebratory confetti bursts
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      disableForReducedMotion: true,
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      colors: ['#FF6B8B', '#FFD166', '#06D6A0', '#118AB2'],
    });

    fire(0.2, {
      spread: 60,
      colors: ['#FF6B8B', '#FFE66D', '#4ECDC4'],
    });

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 1.2,
      colors: ['#FF007F', '#FFBE0B', '#FB5607', '#3A86FF'],
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.5,
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }, [active]);

  if (!active) return null;

  const floatingItems = ['⭐', '💖', '🌟', '🌈', '🍭', '🥳', '✨', '🎈'];

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      {floatingItems.map((item, idx) => (
        <motion.div
          key={idx}
          initial={{
            opacity: 0,
            scale: 0.5,
            x: `${10 + idx * 11}%`,
            y: '90%',
          }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0.5, 1.4, 1.2, 0.8],
            y: ['90%', '15%'],
            rotate: [0, (idx % 2 === 0 ? 1 : -1) * 45, 0],
          }}
          transition={{
            duration: 2.2 + (idx % 3) * 0.4,
            ease: 'easeOut',
            times: [0, 0.2, 0.8, 1],
          }}
          className="absolute text-4xl sm:text-5xl filter drop-shadow-md select-none"
        >
          {item}
        </motion.div>
      ))}
    </div>
  );
};
