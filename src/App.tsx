import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Music, Volume2, VolumeX, Mail, Gift, Flame, PartyPopper, Trash2, Key, X, Lock, ShieldAlert } from 'lucide-react';
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

  // SECRET PORTAL STATE (FOR ADIL)
  const [showPortalModal, setShowPortalModal] = useState(false);
  const [typedPin, setTypedPin] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [adminWishes, setAdminWishes] = useState<any[]>([]);
  const [portalError, setPortalError] = useState('');
  const [isRefreshingPortal, setIsRefreshingPortal] = useState(false);

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

  // ADMIN SECRET PORTAL OPERATIONS
  const loadPortalWishes = async () => {
    setIsRefreshingPortal(true);
    setPortalError('');
    try {
      const response = await fetch('/api/wishes');
      const data = await response.json();
      if (data.success) {
        setAdminWishes(data.wishes || []);
      } else {
        setPortalError('Failed to load. Try again.');
      }
    } catch (e) {
      setPortalError('Server is disconnected or loading.');
      console.error(e);
    } finally {
      setIsRefreshingPortal(false);
    }
  };

  const handleAuthorizePortal = (e: React.FormEvent) => {
    e.preventDefault();
    if (typedPin === '1122' || typedPin === '1234') {
      setIsAuthorized(true);
      setPortalError('');
      loadPortalWishes();
      playSparkSound();
    } else {
      setPortalError('Ghalat code! Please ask Adil Zaman for code.');
      playFlamePopSound();
    }
  };

  const deleteSecretWish = async (id: string) => {
    playFlamePopSound();
    try {
      const resp = await fetch(`/api/wishes/${id}`, { method: 'DELETE' });
      const data = await resp.json();
      if (data.success) {
        setAdminWishes(data.wishes || []);
      }
    } catch (e) {
      console.error(e);
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
          Created with intense brotherhood love by <strong onClick={() => { setShowPortalModal(true); setTypedPin(''); setIsAuthorized(false); setPortalError(''); playSparkSound(); }} className="text-amber-400/80 font-semibold text-xs cursor-pointer hover:underline hover:text-amber-300">Adil Zaman</strong> for his beloved brother <strong className="text-pink-400/80 font-semibold text-xs">Ahmed Zaman</strong>. Saalgira boht boht Mubarak!
        </p>
      </footer>

      {/* SECRET BROTHERHOOD DASHBOARD PORTAL (FOR ADIL ZAMAN) */}
      <AnimatePresence>
        {showPortalModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.92, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 15 }}
              className="bg-[#0f0e1a] border border-amber-500/20 max-w-md w-full rounded-3xl p-6 shadow-2xl relative text-left"
            >
              {/* Top Close Button */}
              <button
                onClick={() => { setShowPortalModal(false); playFlamePopSound(); }}
                className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors cursor-pointer text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              {!isAuthorized ? (
                /* SCREEN 1: PORTAL SECURE LOCK */
                <div className="space-y-5 text-center py-4">
                  <div className="mx-auto w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/25">
                    <Lock className="w-5 h-5 text-amber-400 animate-pulse" />
                  </div>

                  <div className="space-y-1">
                    <h2 className="text-md sm:text-lg font-bold text-slate-100 font-sans tracking-tight">
                      Adil's Secret Portal 🕵️‍♂️
                    </h2>
                    <p className="text-xs text-slate-400 max-w-[280px] mx-auto leading-relaxed">
                      Enter your secret brother code to monitor the Wish Jar submissions silently!
                    </p>
                  </div>

                  <form onSubmit={handleAuthorizePortal} className="space-y-3 max-w-[250px] mx-auto">
                    <input
                      type="password"
                      placeholder="Enter 4-digit code..."
                      maxLength={8}
                      value={typedPin}
                      onChange={(e) => setTypedPin(e.target.value)}
                      className="w-full text-center tracking-[0.4em] font-mono text-lg py-2.5 bg-black/50 border border-amber-500/25 rounded-xl text-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-500/40"
                      autoFocus
                    />
                    
                    {portalError && (
                      <p className="text-[10px] text-rose-400 font-medium flex items-center gap-1 justify-center animate-bounce">
                        <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                        {portalError}
                      </p>
                    )}

                    <button
                      type="submit"
                      className="w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 active:scale-98 text-slate-950 text-xs uppercase tracking-wider font-extrabold rounded-lg cursor-pointer transition-all"
                    >
                      Unlock Portal ⚡
                    </button>
                  </form>

                  <div className="text-[10px] text-slate-500 font-mono tracking-wide pt-2 border-t border-white/5">
                    (Default code is <strong className="text-slate-400">1122</strong> or <strong className="text-slate-400">1234</strong>)
                  </div>
                </div>
              ) : (
                /* SCREEN 2: AUTHORIZED MONITOR DASHBOARD */
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                    <div>
                      <h2 className="text-sm font-bold text-amber-400 tracking-wide font-sans flex items-center gap-1.5">
                        <Key className="w-4 h-4 text-amber-400 animate-spin" />
                        Ahmed's Private Wishes Monitor
                      </h2>
                      <span className="text-[9px] text-slate-500 font-mono block mt-0.5">
                        Database Loaded Safely in Real-Time
                      </span>
                    </div>

                    <button
                      onClick={loadPortalWishes}
                      disabled={isRefreshingPortal}
                      className="px-2.5 py-1 text-[9px] uppercase tracking-wider font-bold bg-slate-800 hover:bg-slate-700 hover:text-white text-slate-300 rounded-md border border-slate-700 transition-all cursor-pointer flex items-center gap-1"
                    >
                      {isRefreshingPortal ? 'Loading...' : 'Refresh 🔄'}
                    </button>
                  </div>

                  {portalError && (
                    <div className="p-2.5 bg-rose-950/25 border border-rose-500/10 rounded-xl text-center text-[10px] text-rose-400">
                      {portalError}
                    </div>
                  )}

                  {/* SUBMISSIONS LIST CONTAINER */}
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {adminWishes.length === 0 ? (
                      <div className="text-center py-8 text-slate-500 text-xs italic bg-black/20 rounded-2xl border border-dashed border-white/5">
                        Ahmed hasn't saved or floated any wishes yet!<br />
                        <span className="text-[10px] text-slate-600 mt-1 block">
                          (Ask Ahmed bhai to write a wish inside his wishes jar, then refresh!)
                        </span>
                      </div>
                    ) : (
                      adminWishes.map((wish: any) => (
                        <div
                          key={wish.id}
                          style={{ borderColor: `${wish.color}20` }}
                          className="p-3 bg-black/40 rounded-xl border flex justify-between items-start gap-4 hover:border-amber-500/25 transition-all"
                        >
                          <div className="space-y-1 flex-1">
                            <p className="text-xs text-slate-200 font-sans leading-relaxed select-text italic">
                              "{wish.text}"
                            </p>
                            <span className="text-[9px] text-slate-500 font-mono block">
                              Logged on {wish.timestamp || wish.createdAt}
                            </span>
                          </div>

                          <button
                            onClick={() => deleteSecretWish(wish.id)}
                            className="p-1.5 hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 rounded-md transition-all self-center shrink-0 cursor-pointer"
                            title="Delete permanently from server records"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="pt-2 border-t border-white/5 text-center">
                    <p className="text-[10px] text-slate-500 leading-relaxed font-sans">
                      This is your secret back-door portal. Your brother has absolutely no idea this exists. All of his dreams and wishes are private for you to prepare surprises accordingly!
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
