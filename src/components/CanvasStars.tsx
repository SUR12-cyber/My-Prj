import React, { useEffect, useRef } from 'react';

export const CanvasStars: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Star data structure
    interface Star {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      alpha: number;
      decay: number;
    }

    const stars: Star[] = [];
    const numStars = 120;

    // Initialize stars
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.5 + 0.5,
        speedX: (Math.random() - 0.5) * 0.05,
        speedY: (Math.random() - 0.5) * 0.05,
        alpha: Math.random() * 0.8 + 0.2,
        decay: (Math.random() * 0.01 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
      });
    }

    // Handle mouse movement for parallax
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX - width / 2) * 0.03;
      mouseRef.current.targetY = (e.clientY - height / 2) * 0.03;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // Pulse factor for the glowing solar corona in the background
    let solarPulse = 0;

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Interpolate mouse movements for butter smooth lag-behind
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Draw faint deep space glowing nebulae blobs
      const gradient = ctx.createRadialGradient(
        width * 0.75 + mouse.x * 0.5,
        height * 0.25 + mouse.y * 0.5,
        50,
        width * 0.75 + mouse.x * 0.5,
        height * 0.25 + mouse.y * 0.5,
        width * 0.6
      );
      gradient.addColorStop(0, 'rgba(0, 229, 255, 0.04)');
      gradient.addColorStop(0.5, 'rgba(77, 159, 255, 0.02)');
      gradient.addColorStop(1, 'rgba(7, 19, 30, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw dynamic pulsing sun corona glow in background
      solarPulse += 0.005;
      const pulseCoeff = Math.sin(solarPulse) * 10;
      const sunGradient = ctx.createRadialGradient(
        width * 0.85 + mouse.x * 0.8,
        height * 0.15 + mouse.y * 0.8,
        0,
        width * 0.85 + mouse.x * 0.8,
        height * 0.15 + mouse.y * 0.8,
        280 + pulseCoeff
      );
      sunGradient.addColorStop(0, 'rgba(0, 229, 255, 0.08)');
      sunGradient.addColorStop(0.3, 'rgba(0, 229, 255, 0.03)');
      sunGradient.addColorStop(0.7, 'rgba(77, 159, 255, 0.01)');
      sunGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = sunGradient;
      ctx.beginPath();
      ctx.arc(width * 0.85 + mouse.x * 0.8, height * 0.15 + mouse.y * 0.8, 300 + pulseCoeff, 0, Math.PI * 2);
      ctx.fill();

      // Render stars with parallax
      stars.forEach(star => {
        // Drift + mouse parallax
        star.x += star.speedX - mouse.x * 0.02 * (star.size * 0.5);
        star.y += star.speedY - mouse.y * 0.02 * (star.size * 0.5);

        // Flashing shimmer effect
        star.alpha += star.decay;
        if (star.alpha > 0.95 || star.alpha < 0.1) {
          star.decay = -star.decay;
        }

        // Keep bounds
        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;

        ctx.beginPath();
        ctx.fillStyle = `rgba(248, 250, 252, ${star.alpha})`;
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Highlight stars occasionally with mini glows
        if (star.size > 1.6) {
          ctx.beginPath();
          const starGlow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 3);
          starGlow.addColorStop(0, `rgba(0, 229, 255, ${star.alpha * 0.5})`);
          starGlow.addColorStop(1, 'rgba(0, 229, 255, 0)');
          ctx.fillStyle = starGlow;
          ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};
