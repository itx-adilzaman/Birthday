import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, RefreshCw } from 'lucide-react';

interface BirthdayCakeProps {
  onAllBlown: () => void;
  playFlamePop: () => void;
  playSpark: () => void;
}

export const BirthdayCake: React.FC<BirthdayCakeProps> = ({
  onAllBlown,
  playFlamePop,
  playSpark,
}) => {
  // Array of 5 candles with state (isLit: boolean)
  const [candles, setCandles] = useState([
    { id: 1, isLit: true, offset: -60 },
    { id: 2, isLit: true, offset: -30 },
    { id: 3, isLit: true, offset: 0 },
    { id: 4, isLit: true, offset: 30 },
    { id: 5, isLit: true, offset: 60 },
  ]);
  const [puffTarget, setPuffTarget] = useState<{ x: number; y: number } | null>(null);
  
  // Interactive eating states!
  const [bites, setBites] = useState<{ x: number; y: number; r: number }[]>([]);
  const [crumbs, setCrumbs] = useState<{ id: number; x: number; y: number; color: string; angle: number; speed: number }[]>([]);

  const litCount = candles.filter((c) => c.isLit).length;

  const handleCandleClick = (id: number, offset: number, e: React.MouseEvent) => {
    const candleIndex = candles.findIndex((c) => c.id === id);
    if (!candles[candleIndex].isLit) return; // Already extinguished

    // Extinguish candle
    const updated = [...candles];
    updated[candleIndex].isLit = false;
    setCandles(updated);

    // Play sweet flame sound
    playFlamePop();

    // Spawn puff visual effect near the candle tip
    setPuffTarget({
      x: offset,
      y: -140, // Height near flame level on SVG coords
    });
    setTimeout(() => setPuffTarget(null), 1000);

    // Check if that was the last candle
    const newLitCount = updated.filter((c) => c.isLit).length;
    if (newLitCount === 0) {
      setTimeout(() => {
        onAllBlown();
      }, 500);
    }
  };

  const handleCakeClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (litCount > 0) return; // Blow candles out first!
    if (bites.length >= 12) return; // Entirely devoured!

    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    
    // Map screen click to SVG 300x350 coordinate space
    const x = ((e.clientX - rect.left) / rect.width) * 300;
    const y = ((e.clientY - rect.top) / rect.height) * 350;

    // Add a bite hole
    setBites((prev) => [...prev, { x, y, r: 20 + Math.random() * 8 }]);
    
    // Play bite sound
    playFlamePop();

    // Spawn animated crumb particles inside the SVG space
    const crumbColors = ['#f472b6', '#be185d', '#701a75', '#fef08a', '#fbbf24', '#ffffff'];
    const newCrumbs = Array.from({ length: 8 }).map((_, idx) => ({
      id: Date.now() + idx,
      x,
      y,
      color: crumbColors[Math.floor(Math.random() * crumbColors.length)],
      angle: Math.random() * Math.PI * 2,
      speed: 15 + Math.random() * 30,
    }));

    setCrumbs((prev) => [...prev, ...newCrumbs]);

    // Cleanup crumbs of this bite after animation finishes
    setTimeout(() => {
      setCrumbs((prev) => prev.filter((c) => !newCrumbs.find((nc) => nc.id === c.id)));
    }, 800);
  };

  const relightCandles = () => {
    setCandles(candles.map((c) => ({ ...c, isLit: true })));
    setBites([]);
    setCrumbs([]);
    playSpark();
  };

  return (
    <div className="relative flex flex-col items-center justify-center p-6 card-gradient rounded-3xl backdrop-blur-md border border-amber-500/20 max-w-sm mx-auto shadow-xl shadow-amber-500/5">
      
      {/* Decorative Ribbon & Title */}
      <div className="text-center mb-6 w-full text-slate-100">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] tracking-wider uppercase font-semibold bg-amber-500/10 text-amber-300 border border-amber-400/20 font-sans">
          <Sparkles className="w-3 h-3 animate-spin text-amber-400" />
          Interactive Birthday Cake 🎂
        </span>
        <h3 className="text-xs font-semibold mt-3 font-sans tracking-wide leading-relaxed min-h-[32px] flex items-center justify-center">
          {litCount > 0 
            ? `Tap all ${litCount} candles to extinguish them!` 
            : bites.length === 0
              ? 'MashaAllah! Now click anywhere on the cake to eat it! 😋🍰'
              : bites.length < 12
                ? `Yummy! Keep tapping to eat! 🍰 (${bites.length}/12)`
                : 'Cake fully finished! Best wishes for a glorious year! 🎉'
          }
        </h3>
      </div>

      <div className="relative w-64 h-72 flex items-end justify-center select-none">
        
        {/* Glow behind the lit cake */}
        <div className="absolute bottom-10 w-44 h-44 rounded-full bg-amber-500/10 blur-3xl transition-opacity duration-1000 pointer-events-none" 
             style={{ opacity: litCount > 0 ? 1 : 0.2 }} />

        {/* The SVG Layer Art */}
        <svg 
          viewBox="0 0 300 350" 
          className={`w-full h-full drop-shadow-2xl z-10 ${litCount === 0 && bites.length < 12 ? 'cursor-pointer active:scale-98 transition-transform duration-100' : ''}`}
          onClick={handleCakeClick}
        >
          {/* Base Plate / Platter */}
          <ellipse cx="150" cy="300" rx="110" ry="25" fill="#e2e8f0" opacity="0.15" />
          <ellipse cx="150" cy="300" rx="100" ry="15" fill="url(#plateGradient)" />
          
          <defs>
            <linearGradient id="plateGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#b45309" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
            
            <linearGradient id="cakeLayerLower" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#1e1b4b" />
              <stop offset="10%" stopColor="#2e1065" />
              <stop offset="50%" stopColor="#581c87" />
              <stop offset="90%" stopColor="#2e1065" />
              <stop offset="100%" stopColor="#1e1b4b" />
            </linearGradient>

            <linearGradient id="cakeLayerUpper" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#1e1b4b" />
              <stop offset="10%" stopColor="#4c1d95" />
              <stop offset="50%" stopColor="#701a75" />
              <stop offset="90%" stopColor="#4c1d95" />
              <stop offset="100%" stopColor="#1e1b4b" />
            </linearGradient>

            <linearGradient id="frostingTop" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f472b6" />
              <stop offset="100%" stopColor="#be185d" />
            </linearGradient>
            
            <linearGradient id="goldCandle" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="40%" stopColor="#fef08a" />
              <stop offset="70%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>

            <linearGradient id="cakeGoldText" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="40%" stopColor="#fbbf24" />
              <stop offset="80%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>

            {/* MASK FOR EATING CUTOUTS */}
            <mask id="cakeMask">
              <rect x="0" y="0" width="300" height="350" fill="white" />
              {bites.map((bite, idx) => (
                <circle key={idx} cx={bite.x} cy={bite.y} r={bite.r} fill="black" />
              ))}
            </mask>
          </defs>

          {/* MASK-WRAPPED CAKE GRAPHIC LAYERS */}
          <g mask="url(#cakeMask)">
            {/* LAYER 1: BOTTOM CAKE FLOOR */}
            <path d="M 60,300 C 60,320 240,320 240,300 L 240,220 C 240,240 60,240 60,220 Z" fill="url(#cakeLayerLower)" />
            <ellipse cx="150" cy="220" rx="90" ry="18" fill="#5c1a7c" />

            {/* Beautiful Golden Writing: "AHMED ZAMAN" */}
            <text 
              x="150" 
              y="274" 
              textAnchor="middle" 
              fill="url(#cakeGoldText)" 
              stroke="#1e1b4b"
              strokeWidth="0.5"
              fontSize="14" 
              fontWeight="900" 
              fontFamily="'Montserrat', sans-serif" 
              letterSpacing="1.2"
              filter="drop-shadow(1px 1.5px 2px rgba(0,0,0,0.85))"
            >
              AHMED ZAMAN
            </text>

            <text 
              x="150" 
              y="288" 
              textAnchor="middle" 
              fill="#ffffff" 
              fontSize="10" 
              fontWeight="bold" 
              fontFamily="var(--font-urdu), serif" 
              opacity="0.8"
            >
              سالگرہ مبارک بھائی!
            </text>

            {/* Drips of strawberry frosting - bottom layer */}
            <path d="M 60,220 
                     c 12,5 18,-2 30,5 
                     c 10,6 15,18 25,2 
                     c 12,-15 14,8 24,1
                     c 8,-6 14,-3 20,4
                     c 10,12 18,-6 28,-1
                     c 15,7 22,-8 33,2
                     c 12,11 20,-12 20,-13 Z" fill="url(#frostingTop)" opacity="0.95" />

            {/* Sprinkles on Bottom Floor (Polka-dot dots) */}
            <circle cx="90" cy="265" r="3" fill="#fef08a" />
            <circle cx="120" cy="285" r="3" fill="#6ee7b7" />
            <circle cx="210" cy="270" r="3" fill="#60a5fa" />
            <circle cx="180" cy="290" r="3" fill="#f472b6" />
            <circle cx="150" cy="275" r="3.5" fill="#fb923c" />

            {/* LAYER 2: TOP CAKE FLOOR */}
            <path d="M 85,215 C 85,232 215,232 215,215 L 215,160 C 215,177 85,177 85,160 Z" fill="url(#cakeLayerUpper)" />
            <ellipse cx="150" cy="160" rx="65" ry="12" fill="#701a75" />

            {/* Frosting dripping - top layer */}
            <path d="M 85,160
                     c 10,4 12,-2 20,4
                     c 6,5 12,12 18,2
                     c 10,-8 10,6 16,1
                     c 8,-4 14,-2 18,3
                     c 8,8 14,-4 22,-1
                     c 10,4 16,-8 16,-9 Z" fill="url(#frostingTop)" />

            {/* Elegant Sprinkles on Top Floor */}
            <circle cx="110" cy="190" r="2.5" fill="#a7f3d0" />
            <circle cx="140" cy="205" r="2.5" fill="#fef08a" />
            <circle cx="190" cy="195" r="2.5" fill="#f9a8d4" />
            <circle cx="165" cy="192" r="2.5" fill="#93c5fd" />

            {/* Sparkly Cream Dollops on top of the cake */}
            <circle cx="110" cy="160" r="8" fill="#ffffff" opacity="0.9" />
            <circle cx="130" cy="164" r="8" fill="#ffffff" opacity="0.9" />
            <circle cx="150" cy="166" r="8" fill="#ffffff" opacity="0.9" />
            <circle cx="170" cy="164" r="8" fill="#ffffff" opacity="0.9" />
            <circle cx="190" cy="160" r="8" fill="#ffffff" opacity="0.9" />
          </g>

          {/* GORGEOUS CANDLES AND FLAMES */}
          {/* Note: We put the lit candles outside/on top of the cake masking so they display fully when lit */}
          {candles.map((candle) => {
            const candleX = 150 + candle.offset;
            const candleYStart = 160 + (Math.abs(candle.offset) * 0.08); // curve candles slightly to match elliptic perspective
            const candleHeight = 55;

            // Check if any bite covers the center/bottom of the candle, so we hide it if eaten
            const isEatenUnder = bites.some(b => {
              const dx = b.x - candleX;
              const dy = b.y - (candleYStart - candleHeight / 2);
              return Math.sqrt(dx * dx + dy * dy) < b.r;
            });

            if (isEatenUnder) return null; // Candle is eaten!

            return (
              <g 
                key={candle.id} 
                className="cursor-pointer group"
                onClick={(e) => {
                  e.stopPropagation(); // Avoid triggering cake bites on candle tap
                  handleCandleClick(candle.id, candle.offset, e);
                }}
              >
                {/* Thick candle sticks with gold gradients */}
                <rect 
                  x={candleX - 4} 
                  y={candleYStart - candleHeight} 
                  width="8" 
                  height={candleHeight} 
                  fill="url(#goldCandle)" 
                  rx="2"
                  className="transition-all group-hover:brightness-110" 
                />
                
                {/* Spiral ribbons */}
                <path d={`M ${candleX - 4},${candleYStart - 10} L ${candleX + 4},${candleYStart - 20}`} stroke="#ffffff" strokeWidth="2" opacity="0.6" strokeLinecap="round" />
                <path d={`M ${candleX - 4},${candleYStart - 30} L ${candleX + 4},${candleYStart - 40}`} stroke="#ffffff" strokeWidth="2" opacity="0.6" strokeLinecap="round" />
                
                {/* Black wick */}
                <line 
                  x1={candleX} 
                  y1={candleYStart - candleHeight} 
                  x2={candleX} 
                  y2={candleYStart - candleHeight - 6} 
                  stroke="#374151" 
                  strokeWidth="1.5" 
                />

                {/* ANIMATED FLAME */}
                {candle.isLit ? (
                  <g className="animate-pulse">
                    {/* Outer fire glow */}
                    <ellipse 
                      cx={candleX} 
                      cy={candleYStart - candleHeight - 16} 
                      rx="10" 
                      ry="15" 
                      fill="#f59e0b" 
                      opacity="0.3" 
                    />
                    
                    {/* Main Flame body */}
                    <path 
                      className="origin-bottom animate-bounce duration-300"
                      d={`M ${candleX},${candleYStart - candleHeight - 6} 
                         C ${candleX - 6},${candleYStart - candleHeight - 14} ${candleX - 4},${candleYStart - candleHeight - 26} ${candleX},${candleYStart - candleHeight - 30} 
                         C ${candleX + 4},${candleYStart - candleHeight - 26} ${candleX + 6},${candleYStart - candleHeight - 14} ${candleX},${candleYStart - candleHeight - 6} Z`} 
                      fill="#ef4444" 
                    />
                    
                    {/* Core hot flame (yellow-gold) */}
                    <path 
                      d={`M ${candleX},${candleYStart - candleHeight - 8} 
                         C ${candleX - 3},${candleYStart - candleHeight - 12} ${candleX - 2.5},${candleYStart - candleHeight - 20} ${candleX},${candleYStart - candleHeight - 24} 
                         C ${candleX + 2.5},${candleYStart - candleHeight - 20} ${candleX + 3},${candleYStart - candleHeight - 12} ${candleX},${candleYStart - candleHeight - 8} Z`} 
                      fill="#f59e0b" 
                    />

                    {/* Blue igniter core */}
                    <ellipse 
                      cx={candleX} 
                      cy={candleYStart - candleHeight - 10} 
                      rx="2.5" 
                      ry="5" 
                      fill="#60a5fa" 
                      opacity="0.8"
                    />
                  </g>
                ) : (
                  // Smoke puff when extinguished
                  <g className="pointer-events-none opacity-30">
                    <line 
                      x1={candleX} 
                      y1={candleYStart - candleHeight - 8} 
                      x2={candleX + Math.sin(candle.id) * 4} 
                      y2={candleYStart - candleHeight - 22} 
                      stroke="#cbd5e1" 
                      strokeWidth="1.5" 
                      strokeDasharray="2 2"
                    />
                  </g>
                )}
              </g>
            );
          })}

          {/* DYNAMIC CRUMB PARTICLES RENDERED IN SVG COORDS */}
          {crumbs.map((crumb) => (
            <motion.circle
              key={crumb.id}
              cx={crumb.x}
              cy={crumb.y}
              r={3.5 + Math.random() * 2}
              fill={crumb.color}
              initial={{ opacity: 1, scale: 1 }}
              animate={{
                x: Math.cos(crumb.angle) * crumb.speed,
                y: Math.sin(crumb.angle) * crumb.speed + 45, // includes visual gravity arc
                opacity: 0,
                scale: 0.1,
              }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />
          ))}

          {/* Virtual Smoke/Puff animation elements inside the canvas */}
          <AnimatePresence>
            {puffTarget && (
              <g>
                <motion.circle
                  initial={{ cx: 150 + puffTarget.x, cy: puffTarget.y, r: 2, opacity: 0.8 }}
                  animate={{ cx: 150 + puffTarget.x + (Math.random() * 20 - 10), cy: puffTarget.y - 40, r: 12, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  fill="#ffffff"
                />
                <motion.circle
                  initial={{ cx: 146 + puffTarget.x, cy: puffTarget.y - 5, r: 1, opacity: 0.6 }}
                  animate={{ cx: 150 + puffTarget.x + (Math.random() * 15 - 7), cy: puffTarget.y - 30, r: 8, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                  fill="#cbd5e1"
                />
              </g>
            )}
          </AnimatePresence>

        </svg>
      </div>

      {/* Relight/Reset button if any candles were blown or cake is getting eaten */}
      {litCount === 0 && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={relightCandles}
          className="mt-4 flex items-center justify-center gap-2 px-4 py-2 hover:bg-amber-600/20 text-xs text-amber-300 font-mono ring-1 ring-amber-500/30 rounded-lg transition-all cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          {bites.length >= 12 ? 'Naya Cake Banayein! 🎂' : 'Reset & Re-light Candles'}
        </motion.button>
      )}

      {/* Touch guidelines */}
      {litCount > 0 ? (
        <span className="text-[10px] text-slate-500 font-mono mt-4 text-center">
          Tap each flame to blow it out.
        </span>
      ) : (
        bites.length < 12 && (
          <span className="text-[10px] text-amber-400/80 font-mono mt-4 text-center animate-pulse">
            ★ Cake par click karke bites khana shuru karein! ★
          </span>
        )
      )}
    </div>
  );
};
