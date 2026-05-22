import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ChevronRight, ChevronLeft, Award, Sparkles, Send } from 'lucide-react';
import { WishItem } from '../types';

const COMPREHENSIVE_WISHES: WishItem[] = [
  {
    id: 'w1',
    title: 'Deen aur Dunya Ki Kamyaabi 🌟',
    urdu: 'اللہ میرے پیارے بھائی احمد زمان کو دین اور دنیا کی ہر بلندی اور کامیابی نصیب فرمائے، اور ہر بری آفت سے دور رکھے۔ آمین۔',
    roman: 'Allah mere pyaare bhai Ahmed Zaman ko deen aur dunya ki har bulandi aur kamyaabi naseeb farmaye, aur har buri aafat se door rakhe. Ameen.',
    english: 'May Allah bless Ahmed with magnificent success in both this world and the hereafter, shielding you from any harm.',
    category: 'dua',
  },
  {
    id: 'w2',
    title: 'Brotherly Pride & Strength 💪',
    urdu: 'آپ صرف میرے بڑے بھائی ہی نہیں ہیں، بلکہ آپ عادل زمان کا مان ہیں، میری سب سے بڑی طاقت اور میرا فخر ہیں احمد بھائی!',
    roman: 'Aap sirf mere bare bhai hi nahi hain, balki aap Adil Zaman ka maan hain, meri sab se bari taqat aur mera fahr hain Ahmed bhai!',
    english: 'You are not just my elder brother; you are the pride, honor, and muscle of Adil Zaman. I look up to you with immense respect!',
    category: 'brotherhood',
  },
  {
    id: 'w3',
    title: 'Sada Bahar Muskurahat 😊',
    urdu: 'دعا ہے کہ آپ کے چہرے کی یہ مسکراہٹ مرجھانے نہ پائے۔ اللہ آپ کو صحتِ کاملہ، عافیت، اور بے مثال خوشیاں عطا فرمائے۔',
    roman: 'Dua hai ke aapke chehre ki yeh muskurahat murjhane na paye. Allah aapko sehat-e-kamila, aafiyat, aur bemisaal khushyan ata farmaye.',
    english: 'I pray that this beautiful smile on your face never fades. May Divine grace wrap you in stellar health and absolute joy.',
    category: 'future',
  },
  {
    id: 'w4',
    title: 'Hamesha Ka Sath aur Hifazat 🛡️',
    urdu: 'زندگی کے چاہے کتنے ہی اونچے نیچے راستے آئیں، آپ عادل زمان کو ہمیشہ اپنا سب سے پکا دوست اور پکا پشتبان پائیں گے۔',
    roman: 'Zindagi ke chahe jitne hi oonche neeche raaste aayen, aap Adil Zaman ko hamesha apna sab se pakka dost aur pakka pushtibaal paenge.',
    english: 'No matter which path life takes us, you will always find Adil Zaman standing first in line to defend and support you.',
    category: 'gratitude',
  },
];

interface HeartfeltWishesProps {
  playSpark: () => void;
}

export const HeartfeltWishes: React.FC<HeartfeltWishesProps> = ({ playSpark }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextCard = () => {
    setActiveIndex((prev) => (prev + 1) % COMPREHENSIVE_WISHES.length);
    playSpark();
  };

  const prevCard = () => {
    setActiveIndex((prev) => (prev - 1 + COMPREHENSIVE_WISHES.length) % COMPREHENSIVE_WISHES.length);
    playSpark();
  };

  const activeWish = COMPREHENSIVE_WISHES[activeIndex];

  // Real WhatsApp sharing button that lets Ahmed say thank you to Adil in a single tap
  const getWhatsAppLink = () => {
    const message = `Pyaare Bhai Adil Zaman! Main ne aap ke banaye hue birthday gift app ko dekha aur jhaanki ki. Mujhe animated cake, candles aur aapki likhi hui pyari duayein buhut pasand aayeen. Boht shukriya bhai! Allah humara sath hamesha salamat rakhe. ❤️`;
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4 sm:p-6 card-gradient rounded-3xl border border-amber-500/15 backdrop-blur-md shadow-2xl relative overflow-hidden">
      {/* Decorative floating gold glow behind card */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#1a1a2e]/50 rounded-full blur-2xl" />

      {/* Header Tabs/Visual category */}
      <div className="flex justify-between items-center mb-6 border-b border-amber-500/10 pb-4">
        <h4 className="text-xs font-sans font-bold tracking-widest text-amber-500 uppercase flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          Duaon Ka Guldasta {activeIndex + 1}/{COMPREHENSIVE_WISHES.length}
        </h4>
        <div className="flex gap-1.5">
          {COMPREHENSIVE_WISHES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveIndex(idx);
                playSpark();
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx === activeIndex ? 'bg-amber-400 w-5' : 'bg-slate-700 hover:bg-slate-500'
              }`}
            />
          ))}
        </div>
      </div>

      {/* MAIN CARDS ROTATING WITH MOTION */}
      <div className="min-h-[290px] flex flex-col justify-between relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeWish.id}
            initial={{ opacity: 0, x: 20, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="flex flex-col gap-4 text-center select-text"
          >
            {/* Header Badge */}
            <h3 className="text-md sm:text-lg font-black text-amber-200 tracking-wide font-sans flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              {activeWish.title}
            </h3>

            {/* Urdu Calligraphy stylized typography card */}
            <div className="p-4 bg-[#1a1a2e]/30 border border-amber-500/15 rounded-2xl shadow-inner min-h-[110px] flex items-center justify-center" dir="rtl">
              <p className="text-xl sm:text-2xl font-normal leading-extra-loose text-[#fef08a] font-urdu text-center drop-shadow-sm select-text">
                {activeWish.urdu}
              </p>
            </div>

            {/* Roman Urdu translation block */}
            <p className="text-xs sm:text-sm text-amber-300/80 leading-relaxed italic select-text p-2 hover:bg-white/5 rounded-lg transition-all duration-300">
              " {activeWish.roman} "
            </p>

            {/* English translation block */}
            <p className="text-[11px] text-slate-300 font-mono tracking-wide mt-1 select-text">
              English: {activeWish.english}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* CONTROLS (Prev / Next triggers & Responsive Reply Button) */}
        <div className="flex flex-col gap-4 mt-6 pt-4 border-t border-amber-500/10">
          <div className="flex justify-between items-center w-full">
            <button
              onClick={prevCard}
              className="p-2 sm:p-2.5 hover:bg-white/5 rounded-full border border-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
              title="Previous wish"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Current Indicator index */}
            <span className="text-[10px] sm:text-xs font-mono text-slate-500 tracking-wider">
              Dua {activeIndex + 1} of {COMPREHENSIVE_WISHES.length}
            </span>

            <button
              onClick={nextCard}
              className="p-2 sm:p-2.5 hover:bg-white/5 rounded-full border border-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
              title="Next wish"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Quick reply WhatsApp button - 100% responsive, with full click padding and elegant layout */}
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={playSpark}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600/15 text-green-300 hover:bg-green-600/25 font-bold border border-green-500/20 hover:border-green-500/40 text-[11px] sm:text-xs rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-95 w-full text-center"
          >
            <Send className="w-3.5 h-3.5 text-green-400 fill-current animate-pulse shrink-0" />
            <span className="truncate">Adil Zaman Ko Shukriya Kahein! (WhatsApp)</span>
          </a>
        </div>
      </div>
    </div>
  );
};
