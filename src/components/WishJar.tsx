import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Compass, Send, Trash2, Heart } from 'lucide-react';
import { VirtualWish } from '../types';

interface WishJarProps {
  playSpark: () => void;
  playFlamePop: () => void;
}

export const WishJar: React.FC<WishJarProps> = ({ playSpark, playFlamePop }) => {
  const [wishText, setWishText] = useState('');
  const [wishes, setWishes] = useState<VirtualWish[]>([]);
  const [floatingLant, setFloatingLant] = useState<{ id: string; text: string; color: string } | null>(null);

  // Load saved wishes from local storage upon mount
  useEffect(() => {
    const saved = localStorage.getItem('ahmed_birthday_wishes');
    if (saved) {
      try {
        setWishes(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse wishes", e);
      }
    }
  }, []);

  const handleFloatWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishText.trim()) return;

    const newWish: VirtualWish = {
      id: Math.random().toString(36).substring(2, 9),
      text: wishText,
      timestamp: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
      color: ['#fdba74', '#fb7185', '#c084fc', '#6ee7b7', '#38bdf8'][Math.floor(Math.random() * 5)],
    };

    const updated = [newWish, ...wishes].slice(0, 5); // Limit to top 5 wishes
    setWishes(updated);
    localStorage.setItem('ahmed_birthday_wishes', JSON.stringify(updated));

    // SILENTLY SYNC WITH SERVER BACKEND!
    fetch('/api/wishes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newWish)
    }).catch(err => console.log('Silent sync log ignored:', err));

    // Fire sound
    playFlamePop();

    // Trigger visual floating lantern animation
    setFloatingLant({
      id: newWish.id,
      text: newWish.text,
      color: newWish.color,
    });

    setWishText('');
    playSpark();

    // Clear lantern after flying animation finishes
    setTimeout(() => {
      setFloatingLant(null);
    }, 4500);
  };

  const deleteWish = (id: string) => {
    const updated = wishes.filter((w) => w.id !== id);
    setWishes(updated);
    localStorage.setItem('ahmed_birthday_wishes', JSON.stringify(updated));
    playFlamePop();

    // Silently delete from server backend
    fetch(`/api/wishes/${id}`, {
      method: 'DELETE'
    }).catch(err => console.log('Silent sync delete ignored:', err));
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4 sm:p-6 card-gradient rounded-3xl border border-amber-500/15 backdrop-blur-md shadow-2xl relative">
      
      {/* Visual Animation: Floating Lantern climbing to space */}
      <AnimatePresence>
        {floatingLant && (
          <motion.div
            key={floatingLant.id}
            initial={{ bottom: 20, opacity: 1, scale: 0.6, x: 0 }}
            animate={{
              bottom: 450,
              opacity: 0,
              scale: 1.2,
              x: [0, 40, -40, 60],
            }}
            transition={{ duration: 4.5, ease: "linear" }}
            className="absolute left-1/2 -ml-16 z-50 pointer-events-none flex flex-col items-center justify-center p-3 rounded-2xl shadow-lg border border-amber-400"
            style={{
              background: `linear-gradient(135deg, ${floatingLant.color}15, rgba(15, 10, 45, 0.95))`,
              boxShadow: `0 0 20px ${floatingLant.color}40`,
            }}
          >
            {/* SVG glowing lantern illustration */}
            <svg viewBox="0 0 100 100" className="w-12 h-12 mb-1">
              {/* Outer shape of paper lantern */}
              <path d="M 30,10 C 30,5 70,5 70,10 L 80,60 C 80,75 20,75 20,60 Z" fill={floatingLant.color} opacity="0.8" />
              {/* Inner fire flame glowing */}
              <circle cx="50" cy="65" r="8" fill="#f59e0b" className="animate-ping" />
              <circle cx="50" cy="65" r="5" fill="#fef08a" />
            </svg>
            <p className="text-[10px] text-white font-mono rounded bg-black/40 px-2 py-0.5 truncate max-w-[120px]">
              {floatingLant.text}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center mb-4">
        <h3 className="text-md sm:text-lg font-black text-amber-300 tracking-wide font-sans flex items-center justify-center gap-2">
          <Compass className="w-5 h-5 text-amber-500 animate-spin" />
          Ahmed Ki Birthday Wishes Jar 🗺️
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Ahmed Bhai, aap apni koi bhi dil ki murad ya dua yahan likhein aur asmaan par urhaen!
        </p>
      </div>

      <form onSubmit={handleFloatWish} className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={wishText}
          onChange={(e) => setWishText(e.target.value)}
          placeholder="Apni pyari khwahish likhein..."
          maxLength={100}
          className="w-full sm:flex-1 px-4 py-2.5 bg-[#1a1a2e]/30 text-slate-200 text-sm placeholder-slate-500 rounded-xl border border-amber-500/15 focus:outline-none focus:ring-1 focus:ring-amber-500/40"
        />
        <button
          type="submit"
          className="w-full sm:w-auto px-5 py-2.5 sm:py-2 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 active:scale-95 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
          Urhaen!
        </button>
      </form>

      {/* Past wishes list */}
      <div className="mt-5 border-t border-white/5 pt-4">
        <h4 className="text-xs font-mono text-slate-400 mb-3 flex items-center gap-1.5 justify-center sm:justify-start">
          <Heart className="w-3 h-3 text-rose-500" />
          Aapke Asmaan par bheje gae Sapne ({wishes.length}/5):
        </h4>

        {wishes.length === 0 ? (
          <p className="text-[11px] font-mono text-slate-500 text-center py-4 bg-purple-950/10 rounded-xl border border-dashed border-purple-500/10">
            Abhi tak koi wish float nahi ki gayi — write one above!
          </p>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            <AnimatePresence>
              {wishes.map((wish) => (
                <motion.div
                  key={wish.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex justify-between items-center px-3.5 py-2.5 bg-purple-950/15 border border-purple-500/5 rounded-xl hover:border-amber-500/15 transition-all text-left"
                >
                  <div className="flex-1 pr-3">
                    <p className="text-xs text-slate-200 font-sans leading-relaxed select-text font-medium">
                      "{wish.text}"
                    </p>
                    <span className="text-[9px] text-slate-500 font-mono mt-0.5 block">
                      Launched on {wish.timestamp}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteWish(wish.id)}
                    className="p-1.5 hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 rounded-lg transition-all"
                    title="Remove from Sky"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

    </div>
  );
};
