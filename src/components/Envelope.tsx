import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MailOpen, Heart, Shield, Award, Sparkles, Cake, PartyPopper, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface EnvelopeProps {
  onOpen: () => void;
  playSpark: () => void;
}

export const Envelope: React.FC<EnvelopeProps> = ({ onOpen, playSpark }) => {
  const [isOpened, setIsOpened] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);

  const handleOpenClick = () => {
    if (isOpened) return;
    setIsOpened(true);
    playSpark(); // Play instant chime
    
    // Show spectacular popup custom modal after 4.5s (giving plenty of time to enjoy the beautiful letter reveal)
    setTimeout(() => {
      setShowCelebrationModal(true);
      // Trigger some epic golden confetti
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#ffd700', '#fbbf24', '#f59e0b', '#d97706', '#ffffff']
      });
    }, 4500);
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[85vh] text-center select-none p-4">
      {/* Dynamic Background Sparks */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Greeting Accent */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-8 z-10"
      >
        <div className="flex justify-center gap-2 mb-2">
          <Heart className="text-rose-500 w-5 h-5 fill-rose-500/30 animate-pulse" />
          <span className="text-amber-500 tracking-[0.3em] font-sans text-[10px] sm:text-xs uppercase font-semibold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            Zaman Family Special
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mt-1 uppercase">
          Ahmed Zaman <span className="gold-text font-black block sm:inline">Bhai!</span>
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-2 max-w-sm mx-auto font-light tracking-wide">
          Aapke liye humare dil se aik buhut hi khubsurat aur dilchasp surprise... Aapka bhai Adil Zaman.
        </p>
      </motion.div>

      {/* THE 3D ENVELOPE DESIGN */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 70 }}
        className="relative w-80 sm:w-[350px] h-60 cursor-pointer z-20"
        onClick={!isOpened ? handleOpenClick : undefined}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* ENVELOPE BACKBODY */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-800 to-indigo-950 rounded-2xl shadow-2xl border border-purple-500/30 overflow-hidden flex items-end">
          
          {/* Subtle interior gold border design */}
          <div className="absolute inset-2 border border-dashed border-amber-500/15 rounded-xl pointer-events-none" />
          
          {/* Heart felt pattern background */}
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#e11d48_1px,transparent_1px)] [background-size:16px_16px]" />
          
          {/* "TO" Handwritten Address Tag on envelope center back */}
          {!isOpened && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 pointer-events-none">
              <span className="text-[10px] font-mono tracking-widest text-violet-300/60 uppercase">Addressed to:</span>
              <h2 className="text-xl font-bold text-amber-100 font-sans tracking-wide mt-1">
                Ahmed Zaman
              </h2>
              <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent my-1.5" />
              <span className="text-[11px] text-slate-400/80 italic font-mono">
                From: Adil Zaman Bhai
              </span>
            </div>
          )}
        </div>

        {/* GLOWING REVEAL LETTER INSIDE (slides up when opened) */}
        <motion.div
          initial={{ y: 0, opacity: 0 }}
          animate={isOpened ? { y: -110, opacity: 1, scale: 1.02 } : { y: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 40, damping: 14, delay: 0.6 }}
          className="absolute inset-x-4 top-4 bg-white rounded-xl shadow-2xl p-4 text-slate-800 flex flex-col justify-between border-2 border-amber-400 z-10 h-52 text-left"
        >
          <div>
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider font-mono">
                Urgent Celebration!
              </span>
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            </div>
            <h3 className="text-sm font-bold text-indigo-950">
              Assalam-o-Alaikum Ahmed Bhai! ❤️
            </h3>
            <p className="text-[11px] text-slate-600 leading-relaxed mt-2 font-sans font-medium">
              Aapko janam din buhut buhut mubarak ho! Yeh app khas taur par maine apne pyare bhai ke liye banwai hai.
            </p>
            <p className="text-[11px] text-purple-900 font-bold mt-1.5 italic">
              "Bhai ka sath dunya ki sab se bari taqat hoti hai."
            </p>
          </div>
          <div className="border-t border-slate-100 pt-2 flex items-center justify-between">
            <span className="text-[10px] font-bold text-amber-600 font-mono">From: Adil Zaman</span>
            <span className="text-[9px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-bold">Unlocking...</span>
          </div>
        </motion.div>

        {/* FLAP TOP OF ENVELOPE (Folds back/down) */}
        <motion.div
          initial={{ rotateX: 0 }}
          animate={isOpened ? { rotateX: 180, zIndex: 0 } : { rotateX: 0, zIndex: 12 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          style={{ transformOrigin: "top" }}
          className="absolute inset-x-0 top-0 h-28 bg-indigo-900 rounded-t-2xl border-x border-t border-purple-400/40 clip-path-envelope"
        >
          {/* Triangular shape simulating typical envelope flap */}
          <div className="w-full h-full bg-gradient-to-b from-purple-800 to-indigo-900 flex justify-center items-center">
            {/* Soft decorative golden line along edge */}
            <svg className="absolute bottom-0 w-full h-12" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,0 L50,100 L100,0" fill="none" stroke="#d97706" strokeWidth="1" opacity="0.4" />
            </svg>
          </div>
        </motion.div>

        {/* WAX SEAL BADGE (splits/cracks or fades when opened) */}
        <motion.div
          animate={isOpened ? { scale: 0, rotate: 180, opacity: 0 } : { scale: isHovered ? 1.1 : 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 120 }}
          className="absolute left-1/2 top-1/2 -ml-8 -mt-8 w-16 h-16 bg-gradient-to-tr from-amber-600 via-yellow-500 to-amber-700 hover:brightness-110 rounded-full shadow-lg border-2 border-amber-200 flex items-center justify-center z-30"
        >
          {/* Wax Emblem Symbol (Zaman Shield) */}
          <div className="absolute inset-1 border border-amber-300/40 rounded-full border-dashed" />
          <span className="text-xl font-black font-serif text-amber-50/90 tracking-wide select-none drop-shadow">
            AZ
          </span>
          {/* Pulse Ripple when waiting */}
          <span className="absolute inset-0 rounded-full ring-4 ring-amber-400/30 animate-ping opacity-60" />
        </motion.div>

        {/* ENVELOPE SEAMS LEFT & RIGHT (Overlaying front layers) */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-indigo-950/90 rounded-b-2xl border-x border-b border-purple-500/20 z-15 clip-path-flaps pointer-events-none flex justify-between items-end p-4">
          <Shield className="w-4 h-4 text-amber-500/30" />
          <Award className="w-4 h-4 text-amber-500/30" />
        </div>
      </motion.div>

      {/* CALL TO ACTION BUTTON */}
      <motion.div
        animate={isOpened ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
        className="mt-10 z-10"
      >
        <button
          onClick={handleOpenClick}
          className="group relative inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white text-sm font-bold rounded-full overflow-hidden shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
        >
          <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <MailOpen className="w-4 h-4" />
          Dhamaka Birthday Wish Kholo!
        </button>
        <p className="text-[10px] text-slate-500 font-mono mt-2 uppercase tracking-widest">
          Sikkay par tap karein ya button dabayein
        </p>
      </motion.div>

      {/* SUCCESS POPUP MODAL (HAPPY BIRTHDAY AHMED BHAI) */}
      <AnimatePresence>
        {showCelebrationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[#0f0f18] border-2 border-amber-500/30 shadow-2xl text-center overflow-hidden"
            >
              {/* Outer decorative line elements */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600" />
              
              {/* Confetti celebration triggers and floating icons */}
              <div className="flex justify-center gap-3 mb-4">
                <PartyPopper className="w-8 h-8 text-amber-400 animate-bounce" />
                <Cake className="w-8 h-8 text-yellow-500 animate-pulse" />
                <Sparkles className="w-8 h-8 text-amber-300 animate-spin" />
              </div>

              {/* Glowing decorative radial background */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Special Badge */}
              <span className="inline-block px-3 py-1 mb-3 text-[10px] sm:text-xs font-semibold tracking-widest text-amber-400 uppercase bg-amber-500/15 border border-amber-500/30 rounded-full">
                Mubarakbaad! 🎉
              </span>

              {/* Title Typography */}
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
                <span className="block text-slate-300 font-sans text-xs sm:text-sm font-light uppercase tracking-[0.2em] mb-1">HAPPY BIRTHDAY</span>
                <span className="gold-text font-black text-3xl sm:text-4xl block">
                  Ahmed Zaman Bhai!
                </span>
              </h2>

              {/* Custom Urdu Greeting Card Text with Nastaleeq fallback font */}
              <div className="p-4 sm:p-5 bg-[#171725]/80 border border-amber-500/15 rounded-2xl mb-6 shadow-inner" dir="rtl">
                <p className="text-lg sm:text-xl leading-normal text-amber-200 font-urdu text-center leading-extra-loose drop-shadow-md select-text">
                  میرے پیارے اور عظیم بھائی احمد زمان کو سالگرہ بہت بہت مبارک ہو! اللہ پاک آپ کو صحت، خوشیاں اور لمبی زندگی عطا فرمائے۔ آمین۔
                </p>
                <p className="text-[10px] sm:text-[11px] text-slate-400 mt-2 text-center font-sans tracking-wide not-italic font-light">
                  Aapka bhai Malik Muhammad Adil Zaman.
                </p>
              </div>

              {/* Continue button */}
              <button
                onClick={() => {
                  onOpen();
                }}
                className="group relative w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-sm sm:text-base font-black rounded-xl overflow-hidden shadow-xl transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <span>Chalein, Birthday Gift Kholo! 🎁</span>
                <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
              </button>

              <p className="text-[10px] text-slate-500 mt-3 font-mono">
                Adil Zaman Special Surprise Interface
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
