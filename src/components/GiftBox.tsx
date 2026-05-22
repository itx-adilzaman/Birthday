import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, Sparkles, AlertCircle, RefreshCw, Eye, Smile, PartyPopper } from 'lucide-react';
import confetti from 'canvas-confetti';
import watchImage from '../assets/images/luxury_geneva_watch_1779434566143.png';

interface GiftBoxProps {
  playSpark: () => void;
  playFlamePop: () => void;
}

export const GiftBox: React.FC<GiftBoxProps> = ({ playSpark, playFlamePop }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScratching, setIsScratching] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchProgress, setScratchProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  // Initialize the canvas with a sparkling gold scratch layer
  const initCanvas = (targetCanvas?: HTMLCanvasElement | null) => {
    const canvas = targetCanvas || canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fixed logical size for stability
    canvas.width = 320;
    canvas.height = 320;

    // Paint solid gold background - ALWAYS RESET source-over so it fills gold and is NOT transparent!
    ctx.globalCompositeOperation = 'source-over';

    // Draw luxury golden gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#d97706'); // Amber 600
    gradient.addColorStop(0.2, '#fbbf24'); // Amber 400
    gradient.addColorStop(0.5, '#fef08a'); // Yellow 200
    gradient.addColorStop(0.8, '#f59e0b'); // Amber 500
    gradient.addColorStop(1, '#78350f'); // Amber 900
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw some shining stellar dust stars
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    for (let i = 0; i < 30; i++) {
      const r = Math.random() * 2 + 1;
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Outer decorative dashed line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
    ctx.setLineDash([]);

    // Draw center placeholder badge
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)'; // Dark slate background
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 75, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#fde047'; // Yellow 300
    ctx.stroke();

    // Icon / Symbol placeholder
    ctx.fillStyle = '#f59e0b'; // Amber 500
    ctx.font = '28px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🎁', canvas.width / 2, canvas.height / 2 - 25);

    // Urdu guidelines
    ctx.fillStyle = '#fde047';
    ctx.font = 'bold 15px "Noto Nastaliq Urdu", "Times New Roman", serif';
    ctx.fillText('احمد بھائی اسے گھسیں!', canvas.width / 2, canvas.height / 2 + 12);

    // English instruction
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '600 10px "Montserrat", sans-serif';
    ctx.fillText('SCRATCH WITH FINGER/MOUSE', canvas.width / 2, canvas.height / 2 + 38);
    
    setScratchProgress(0);
  };

  // Highly reliable Callback Ref to draw on the canvas as soon as Framer Motion mounts it
  const setCanvasRef = (node: HTMLCanvasElement | null) => {
    canvasRef.current = node;
    if (node) {
      initCanvas(node);
      // Extra safety render to ensure it fills even on layout shifts
      setTimeout(() => {
        if (canvasRef.current === node) {
          initCanvas(node);
        }
      }, 50);
    }
  };

  // Re-initialize when box opens as a fallback
  useEffect(() => {
    if (isOpen && !isRevealed) {
      setTimeout(() => {
        initCanvas();
      }, 350); // Wait for the box open transition
    }
  }, [isOpen]);

  const handleOpenBox = () => {
    if (isOpen) return;
    setIsOpen(true);
    playSpark();
    playFlamePop();

    // Throw stunning colorful sparkles
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.75 },
      colors: ['#fbbf24', '#f59e0b', '#3b82f6', '#ec4899', '#10b981']
    });
  };

  const checkScratchPercentage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const imgData = ctx.getImageData(0, 0, width, height);
    const pixels = imgData.data;
    let transparentCount = 0;

    // Check transparency in alpha channel (every 4th element)
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) {
        transparentCount++;
      }
    }

    const currentPercent = Math.round((transparentCount / (pixels.length / 4)) * 100);
    setScratchProgress(currentPercent);

    // If scratched more than 45%, complete the reveal automatically
    if (currentPercent > 45 && !isRevealed) {
      setIsRevealed(true);
      
      // Paint full transparency to clear canvas smoothly
      ctx.clearRect(0, 0, width, height);

      // Play magnificent surprise chime and confetti drops
      playSpark();
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#fbbf24', '#f59e0b', '#ffd700', '#ffffff']
      });
    }
  };

  // Convert client cursor coords to canvas local mapping
  const getMousePos = (e: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

    // Account for canvas actual rendering resolution vs CSS visual size
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;
    return { x, y };
  };

  const drawScratch = (e: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas || !isScratching || isRevealed) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getMousePos(e);
    if (!coords) return;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = 32; // Scratch thickness

    ctx.beginPath();
    if (lastPosRef.current) {
      // Draw smooth line from previous point to avoid gaps
      ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    } else {
      ctx.arc(coords.x, coords.y, 16, 0, Math.PI * 2);
      ctx.fill();
    }

    lastPosRef.current = coords;
  };

  // Event handlers
  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (isRevealed) return;
    setIsScratching(true);
    const nativeEvent = e.nativeEvent;
    const coords = getMousePos(nativeEvent);
    if (coords) {
      lastPosRef.current = coords;
    }
    // Prevent scrolling on mobile during scratching
    if (e.cancelable) {
      e.preventDefault();
    }
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isScratching || isRevealed) return;
    drawScratch(e.nativeEvent);
    // Prevent scrolling on mobile
    if (e.cancelable) {
      e.preventDefault();
    }
  };

  const handleEnd = () => {
    if (!isScratching) return;
    setIsScratching(false);
    lastPosRef.current = null;
    checkScratchPercentage();
  };

  // Reset function to scratch again
  const handleReset = () => {
    setIsRevealed(false);
    setScratchProgress(0);
    playFlamePop();
    setTimeout(() => {
      initCanvas();
    }, 50);
  };

  return (
    <div 
      ref={containerRef}
      className="relative flex flex-col items-center justify-center p-6 card-gradient rounded-3xl border border-amber-500/15 max-w-sm mx-auto shadow-2xl overflow-hidden"
    >
      {/* Decorative upper visual indicators */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* SECTION HEADER */}
      <div className="text-center mb-6 relative z-10 w-full">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] tracking-wider uppercase font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/25">
          <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
          Ahmed's Premium Birthday Gift 🎁
        </span>
        <h3 className="text-sm font-bold text-slate-100 mt-2 font-sans uppercase">
          {!isOpen 
            ? 'Open your surprise gift!' 
            : isRevealed 
              ? 'Ahmed Bhai, Yeh Aapka Gift Hai!' 
              : 'Scratch the card to reveal!'
          }
        </h3>
      </div>

      {/* Surprising content container */}
      <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] bg-[#0c0c14] border border-amber-500/10 rounded-2xl overflow-hidden flex items-center justify-center shadow-inner">
        <AnimatePresence mode="wait">
          {!isOpen ? (
            /* LAYER A: CLOSED GIFT BOX WITH VIBRANT BOUNCING IDLE ANIMATION */
            <motion.div
              key="closed-box"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.7, opacity: 0, rotate: -15 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="flex flex-col items-center justify-center h-full w-full cursor-pointer group"
              onClick={handleOpenBox}
            >
              {/* Animated Glowing light halo behind gift */}
              <div className="absolute inset-0 bg-radial-gradient from-amber-500/10 via-transparent to-transparent opacity-80 group-hover:scale-125 transition-transform duration-700 pointer-events-none" />

              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, -2, 2, -2, 0]
                }}
                transition={{ 
                  duration: 2.5, 
                  repeat: Infinity,
                  repeatType: "loop"
                }}
                className="relative text-7xl select-none"
              >
                🎁
                {/* Micro sparks orbiting */}
                <span className="absolute -top-2 -right-2 text-xl animate-pulse delay-75">✨</span>
                <span className="absolute -bottom-2 -left-2 text-lg animate-pulse delay-300">⭐</span>
              </motion.div>

              <p className="mt-4 text-xs font-semibold text-amber-400 group-hover:text-amber-300 tracking-widest uppercase transition-colors">
                Tap Box to Open
              </p>
              
              <div className="mt-2 text-[10px] text-slate-400 tracking-wider">
                Surprise inside for my dear brother
              </div>
            </motion.div>
          ) : (
            /* LAYER B: SCRATCH AREA OR FULLY REVEALED PREMIUM BOX GIFT */
            <motion.div
              key="scratch-card"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 80 }}
              className="relative w-full h-full flex items-center justify-center"
            >
              {/* HIDDEN GIFT REVEAL VIEW (Shows Geneva Watch with fine details) */}
              <div className="absolute inset-0 w-full h-full p-2 flex flex-col items-center justify-center bg-[#07070c]">
                
                {/* Watch product display space */}
                <div className="relative w-full h-[180px] sm:h-[200px] bg-black rounded-xl border border-amber-500/10 overflow-hidden flex items-center justify-center shadow-lg group">
                  <img
                    src={watchImage}
                    alt="Luxury Geneva Chronograph Watch for Ahmed Bhai"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Glowing background behind watch image */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-2 text-center">
                    <span className="text-[10px] sm:text-xs font-bold text-amber-400 tracking-widest uppercase font-sans">
                      Geneva Luxury Chronograph
                    </span>
                  </div>
                </div>

                {/* Subtitle description with brother message */}
                <div className="mt-3 text-center w-full px-2">
                  <p className="text-[11px] sm:text-xs font-semibold text-amber-300 tracking-wide uppercase font-sans flex items-center justify-center gap-1">
                    <Smile className="w-3.5 h-3.5 inline text-amber-400" />
                    Bhai Ka Dil Se Tohfa! ⌚
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1 sm:mt-1.5 leading-relaxed leading-extra-loose line-clamp-2 max-w-xs mx-auto">
                    Kaisa laga surprise gift Ahmed bhai? Aapki wrist par ye boht hi shandaar lagegi InshaAllah! - Adil Zaman
                  </p>
                </div>
              </div>

              {/* INTERACTIVE GOLD SCRATCH OVERLAY CANVAS */}
              <canvas
                ref={setCanvasRef}
                onMouseDown={handleStart}
                onMouseMove={handleMove}
                onMouseUp={handleEnd}
                onMouseLeave={handleEnd}
                onTouchStart={handleStart}
                onTouchMove={handleMove}
                onTouchEnd={handleEnd}
                className="absolute inset-0 w-full h-full cursor-crosshair rounded-2xl z-20 touch-none transition-opacity duration-300"
                style={{
                  opacity: isRevealed ? 0 : 1,
                  pointerEvents: isRevealed ? 'none' : 'auto',
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* SCRATCH PERCENTAGE PROGRESS INDICATOR */}
      {isOpen && !isRevealed && (
        <div className="mt-4 w-full text-center relative z-10">
          <div className="w-full bg-slate-800/60 rounded-full h-2 overflow-hidden border border-white/5 mb-1.5 max-w-[200px] mx-auto">
            <div 
              className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full transition-all duration-150"
              style={{ width: `${Math.min(100, (scratchProgress / 45) * 100)}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 tracking-wider">
            Scratched Area: <strong className="text-amber-400 font-bold">{scratchProgress}%</strong> (Scratch 45% to reveal)
          </p>
        </div>
      )}

      {/* IF REVEALED: SHOW CONGRATULATORY DETAILS & CONTROLS */}
      {isRevealed && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-center relative z-10 flex flex-col items-center gap-2"
        >
          <div className="flex items-center gap-1 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/25 animate-bounce">
            <PartyPopper className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[10px] sm:text-xs font-bold text-amber-400 tracking-widest uppercase">
              Surprise Unlocked!
            </span>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold bg-slate-800 hover:bg-slate-700 hover:text-white text-slate-300 rounded-lg border border-slate-700 cursor-pointer transition-all duration-200"
          >
            <RefreshCw className="w-3 h-3" />
            Lafafa Dobara Scratch Karein
          </button>
        </motion.div>
      )}
    </div>
  );
};
