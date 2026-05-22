import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  size: number;
  decay: number;
  gravity: number;
}

interface FireworksCanvasProps {
  autoSpawn?: boolean;
}

export const FireworksCanvas: React.FC<FireworksCanvasProps> = ({ autoSpawn = true }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  const colors = [
    '#ffd700', // Gold
    '#ff3366', // Rose pink
    '#00ffcc', // Mint/Cyan
    '#ff6600', // Neon Orange
    '#9933ff', // Radiant Purple
    '#33ccff', // Electric Blue
    '#ff33cc', // Magenta
  ];

  const createExplosion = (x: number, y: number, color?: string) => {
    const particleCount = 80 + Math.floor(Math.random() * 40);
    const chosenColor = color || colors[Math.floor(Math.random() * colors.length)];
    
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 6;
      
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: chosenColor,
        alpha: 1,
        size: 1.5 + Math.random() * 2.5,
        decay: 0.012 + Math.random() * 0.015,
        gravity: 0.04 + Math.random() * 0.04,
      });
    }

    // Add extra tiny sparkler outline
    const sparklingRing = 20;
    for (let i = 0; i < sparklingRing; i++) {
      const angle = (i / sparklingRing) * Math.PI * 2;
      const speed = 5 + Math.random() * 1.5;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: '#ffffff', // White sparks
        alpha: 0.9,
        size: 1.0,
        decay: 0.02,
        gravity: 0.06,
      });
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      canvas.width = parent ? parent.clientWidth : window.innerWidth;
      canvas.height = parent ? parent.clientHeight : window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initial warm sparks
    setTimeout(() => {
      if (canvas) {
        createExplosion(canvas.width / 2, canvas.height * 0.35);
      }
    }, 1000);

    const updateAndDraw = () => {
      ctx.fillStyle = 'rgba(10, 5, 20, 0.25)'; // Dark violet trail background
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity; // Gravity pull down
        p.vx *= 0.98; // Friction
        p.vy *= 0.98;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        
        // Glow effect
        ctx.shadowBlur = p.size * 2.5;
        ctx.shadowColor = p.color;
        
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameRef.current = requestAnimationFrame(updateAndDraw);
    };

    animationFrameRef.current = requestAnimationFrame(updateAndDraw);

    // Custom automatic random spawner
    let intervalId: any = null;
    if (autoSpawn) {
      intervalId = setInterval(() => {
        const randX = 0.15 * canvas.width + Math.random() * (canvas.width * 0.7);
        const randY = 0.15 * canvas.height + Math.random() * (canvas.height * 0.4);
        createExplosion(randX, randY);
      }, 3500); // Trigger a firework every 3.5 seconds in background
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoSpawn]);

  // Click on canvas to burst custom fireworks!
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Create random colorful blast
    createExplosion(x, y);
  };

  return (
    <canvas
      id="fireworks-celebration-canvas"
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-auto cursor-pointer z-0 opacity-80"
      onClick={handleCanvasClick}
      title="Click or tap anywhere to launch custom fireworks!"
    />
  );
};
