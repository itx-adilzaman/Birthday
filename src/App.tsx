import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Music, Volume2, VolumeX, Mail, Gift, Flame, PartyPopper } from 'lucide-react';
import confetti from 'canvas-confetti';

import { AppStage } from './types';
import { BirthdayMusicBox } from './utils/audio';
import { Envelope } from './components/Envelope';
import { BirthdayCake } from './components/BirthdayCake';
import { FireworksCanvas } from './components/FireworksCanvas';
import { HeartfeltWishes } from './components/HeartfeltWishes';
import { WishJar } from './components/WishJar';
import { GiftBox } from './components/GiftBox';

export default function App() {
  const [stage, setStage] = useState<AppStage>('envelope');
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [autoFireworks, setAutoFireworks] = useState(true);
  const [celebrationMessage, setCelebrationMessage] = useState('');

  // Instantiate the custom music-box synthesiser
  const musicBoxRef = useRef<BirthdayMusicBox | null>(null);

  useEffect(() => {
    // Lazy initialize the music box class
    musicBoxRef.current = new BirthdayMusicBox((playing) => {
      setIsAudioPlaying(playing);
    });

    return () => {
      if (musicBoxRef.current) {
        musicBoxRef.current.stop();
      }
    };
  }, []);

  const playSparkSound = () => {
    if (musicBoxRef.current) musicBoxRef.current.playSpark();
  };

  const playFlamePopSound = () => {
    if (musicBoxRef.current) musicBoxRef.current.playFlamePop();
  };

  const toggleMusic = () => {
    if (musicBoxRef.current) {
      musicBoxRef.current.togglePlay();
    }
  };

  // Launch explosive side sprays of high-energy confetti
  const triggerConfettiBlast = () => {
    playSparkSound();
    
    // Left side burst
    confetti({
      particleCount: 100,
      angle: 60,
      spread: 70,
      origin: { x: 0, y: 0.8 },
      colors: ['#ffd700', '#ff3366', '#00ffcc', '#9933ff']
    });

    // Right side burst
    confetti({
      particleCount: 100,
      angle: 120,
      spread: 70,
      origin: { x: 1, y: 0.8 },
      colors: ['#ffd700', '#ff3366', '#00ffcc', '#9933ff']
    });
  };

  // Automated trigger when Ahmed blows out all candles
  const handleAllCandlesBlown = () => {
    triggerConfettiBlast();
    setCelebrationMessage("Aapki saari duaein kabool hon Ahmed Bhai! ❤️ - Adil Zaman");
    
    // Continuously drop gold confetti slowly for 6 seconds
    const duration = 6 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#f59e0b', '#fbbf24']
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#f59e0b', '#fbbf24']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    setTimeout(() => {
      setCelebrationMessage('');
    }, 8000);
  };

  // Handle transitions out of envelope stage
  const handleEnvelopeOpen = () => {
    setStage('celebration');
    triggerConfettiBlast();
    // Start playing background instrumental automatically after user interaction gesture!
    setTimeout(() => {
      if (musicBoxRef.current) {
        musicBoxRef.current.play();
      }
    }, 400);
  };

  return (
    <main className="min-h-screen text-slate-200 bg-[#0c0c14] font-sans overflow-x-hidden relative flex flex-col justify-between border-[8px] sm:border-[12px] border-[#1a1a2e]">
      
      {/* Geometric Background Blows & Decor */}
      <div className="burst w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] -top-24 -left-24 opacity-50 pointer-events-none" />
      <div className="burst w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] -bottom-16 -right-16 opacity-40 pointer-events-none" />

      {/* Geometric Minimal Corner Line Accents */}
      <div className="absolute top-6 right-6 hidden md:flex gap-2 pointer-events-none opacity-40">
        <div className="w-12 h-1 bg-amber-500"></div>
        <div className="w-12 h-1 bg-amber-500"></div>
      </div>
      <div className="absolute bottom-16 left-6 hidden md:flex gap-2 pointer-events-none opacity-40">
        <div className="w-12 h-1 bg-amber-500"></div>
        <div className="w-12 h-1 bg-amber-500"></div>
      </div>

      {/* Floating Animated Music Notes when playing */}
      {isAudioPlaying && (
        <div className="absolute top-28 left-1/2 -translate-x-1/2 w-full max-w-lg h-32 pointer-events-none z-10 overflow-hidden">
          <div className="absolute text-amber-500/40 text-lg animate-bounce" style={{ left: '10%', animationDelay: '0s' }}>♪</div>
          <div className="absolute text-yellow-400/35 text-xl animate-bounce" style={{ left: '30%', animationDelay: '0.4s' }}>♫</div>
          <div className="absolute text-amber-600/40 text-sm animate-bounce" style={{ left: '70%', animationDelay: '0.2s' }}>♪</div>
          <div className="absolute text-amber-400/35 text-lg animate-bounce" style={{ left: '90%', animationDelay: '0.6s' }}>♫</div>
        </div>
      )}

      {/* STAGE CONTAINER */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-center relative z-10">
        
        <AnimatePresence mode="wait">
          {stage === 'envelope' ? (
            <motion.div
              key="envelope-view"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.6 }}
              className="w-full"
            >
              <Envelope onOpen={handleEnvelopeOpen} playSpark={playSparkSound} />
            </motion.div>
          ) : (
            <motion.div
              key="celebration-view"
              initial={{ opacity: 0, scale: 0.98, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 60, damping: 20 }}
              className="space-y-6 relative"
            >
              
              {/* THE ACTIVE FIREWORKS CANVAS IN CELEBRATION MODE */}
              <FireworksCanvas autoSpawn={autoFireworks} />

              {/* CELEBRATION CENTRAL BANNER HEADER */}
              <div className="text-center space-y-3 relative z-10">
                <div className="space-y-1">
                  <span className="text-amber-500 tracking-[0.3em] sm:tracking-[0.4em] uppercase text-[10px] sm:text-xs font-semibold mb-1 block">
                    A Special Day for a Special Brother
                  </span>
                  
                  {/* Central Divider element */}
                  <div className="flex items-center gap-4 my-2 w-full justify-center opacity-85">
                    <div className="h-[1px] w-24 bg-gradient-to-r from-transparent to-amber-500/50" />
                    <div className="w-3 h-3 rotate-45 border border-amber-500" />
                    <div className="h-[1px] w-24 bg-gradient-to-l from-transparent to-amber-500/50" />
                  </div>
                </div>

                <h1 className="text-3xl sm:text-6xl font-black uppercase tracking-tight">
                  <span className="block text-slate-300 font-sans tracking-tight text-xl sm:text-2xl font-light">Happy Birthday</span>
                  <span className="gold-text font-black text-4xl sm:text-6xl tracking-tight text-white block mt-0.5">
                    Ahmed Zaman!
                  </span>
                </h1>

                <p className="text-slate-400 text-[11px] sm:text-xs max-w-md mx-auto tracking-wider font-light">
                  Phataakhon ki goonj aur music box ki dhun ke sath saalgira celebrate karein! Click anywhere to burst fireworks.
                </p>

                {/* DYNAMIC CELEBRATION POPUP NOTIFICATION */}
                <AnimatePresence>
                  {celebrationMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.8 }}
                      className="inline-flex items-center gap-2.5 px-5 py-3 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-2xl shadow-amber-500/10 border border-amber-300"
                    >
                      <PartyPopper className="w-4 h-4 text-slate-950 animate-bounce" />
                      {celebrationMessage}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* MASTER CONTROL PANEL */}
              <div className="flex flex-wrap items-center justify-center gap-3 bg-[#111119] p-3 rounded-2xl border border-amber-500/10 max-w-xl mx-auto backdrop-blur-md relative z-20">
                {/* Music trigger */}
                <button
                  onClick={toggleMusic}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-sans font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    isAudioPlaying
                      ? 'bg-amber-500 text-[#0c0c14] font-black'
                      : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
                  }`}
                  title={isAudioPlaying ? "Mute birthday melody" : "Play beautiful birthday tune"}
                >
                  {isAudioPlaying ? (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-slate-950 animate-pulse" />
                      Tune: ON 🎵
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                      Tune: OFF 🔇
                    </>
                  )}
                </button>

                {/* Confetti Blast Trigger */}
                <button
                  onClick={triggerConfettiBlast}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 active:scale-95 text-slate-950 font-bold rounded-xl text-[11px] uppercase tracking-wider transition-all cursor-pointer"
                >
                  <PartyPopper className="w-3.5 h-3.5" />
                  Confetti! 🎉
                </button>

                {/* Auto Fireworks Toggle */}
                <button
                  onClick={() => {
                    setAutoFireworks(!autoFireworks);
                    playSparkSound();
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-sans font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    autoFireworks
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                      : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  <Flame className={`w-3.5 h-3.5 ${autoFireworks ? 'animate-pulse text-amber-400' : 'text-slate-400'}`} />
                  Fireworks: {autoFireworks ? 'AUTO' : 'MANUAL'}
                </button>
              </div>

              {/* GRID HUB: CAKE + FIREWORKS LEFT, LETTERS + WISHES RIGHT */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
                {/* LEFT COLUMN (Interactive Birthday Cake & Gift Surprise) */}
                <div className="lg:col-span-5 space-y-6 flex flex-col justify-start">
                  <BirthdayCake
                    onAllBlown={handleAllCandlesBlown}
                    playFlamePop={playFlamePopSound}
                    playSpark={playSparkSound}
                  />
                  
                  <GiftBox 
                    playSpark={playSparkSound}
                    playFlamePop={playFlamePopSound}
                  />
                </div>

                {/* RIGHT COLLUM (Scroll Duas, Letters deck, Wishes Jar) */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Hearts Blessings Slides */}
                  <HeartfeltWishes playSpark={playSparkSound} />

                  {/* Wishes Float Jar */}
                  <WishJar playSpark={playSparkSound} playFlamePop={playFlamePopSound} />
                </div>
              </div>

              {/* ENVELOPE RETURN SHORTCUT */}
              <div className="text-center pt-4">
                <button
                  onClick={() => {
                    setStage('envelope');
                    if (musicBoxRef.current) musicBoxRef.current.stop();
                    playSparkSound();
                  }}
                  className="inline-flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-widest text-slate-500 hover:text-slate-300 py-1.5 px-3 rounded-lg border border-slate-800 hover:border-slate-700 hover:bg-slate-900/20 transition-all"
                >
                  <Mail className="w-3 H-3" />
                  Lafafa Dobara Band Karein (Go Back)
                </button>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* FOOTER */}
      <footer className="w-full py-4 text-center border-t border-white/5 relative z-10 bg-[#070311]/40 backdrop-blur-sm">
        <p className="text-[11px] font-mono text-slate-500">
          Created with intense brotherhood love by <strong className="text-amber-400/80 font-semibold text-xs">Adil Zaman</strong> for his beloved brother <strong className="text-pink-400/80 font-semibold text-xs">Ahmed Zaman</strong>. Saalgira boht boht Mubarak!
        </p>
      </footer>
    </main>
  );
}
