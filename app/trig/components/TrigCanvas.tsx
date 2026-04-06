"use client";

import React, { useRef, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface TrigCanvasProps {
  angle: number;
  level: number;
}

export default function TrigCanvas({ angle, level }: TrigCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width, h = canvas.height;
    const ox = w / 2, oy = h / 2;
    const radius = level === 1 ? 160 : level === 4 ? 140 : 120;

    const isDark = resolvedTheme === 'dark';
    const colors = {
      grid: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
      circle: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
      axis: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)',
      primary: isDark ? '#60a5fa' : '#007AFF',
      secondary: isDark ? '#f87171' : '#FF3B30',
      text: isDark ? '#ffffff' : '#1D1D1F',
      line: isDark ? '#ffffff' : '#1D1D1F',
      hypotenuse: '#10B981',
      sineRule: '#F59E0B'
    };

    const render = () => {
      ctx.clearRect(0, 0, w, h);

      // Grid
      ctx.strokeStyle = colors.grid; ctx.lineWidth = 1;
      for(let i=-200; i<=200; i+=50) {
        ctx.beginPath(); ctx.moveTo(ox + i, 0); ctx.lineTo(ox + i, h); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, oy + i); ctx.lineTo(w, oy + i); ctx.stroke();
      }

      // Axes
      if (level !== 4) {
        ctx.strokeStyle = colors.axis; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(0, oy); ctx.lineTo(w, oy); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(ox, 0); ctx.lineTo(ox, h); ctx.stroke();
      }

      const rad = (angle * Math.PI) / 180;
      const targetX = ox + Math.cos(rad) * radius;
      const targetY = oy - Math.sin(rad) * radius;

      if (level === 2 || level === 3) {
        ctx.strokeStyle = colors.circle; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(ox, oy, radius, 0, Math.PI * 2); ctx.stroke();
      }

      // Draw Triangle Components (Levels 1-3)
      if (level === 1 || level === 2 || level === 3) {
        // Hypotenuse (Green)
        ctx.strokeStyle = colors.hypotenuse; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(targetX, targetY); ctx.stroke();

        // Adjacent / Cos (Blue)
        ctx.strokeStyle = colors.primary; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(targetX, oy); ctx.stroke();

        // Opposite / Sin (Red)
        ctx.strokeStyle = colors.secondary; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(targetX, oy); ctx.lineTo(targetX, targetY); ctx.stroke();

        // Point
        ctx.fillStyle = colors.line;
        ctx.beginPath(); ctx.arc(targetX, targetY, 6, 0, Math.PI * 2); ctx.fill();

        // Angle Arc
        ctx.strokeStyle = colors.text; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(ox, oy, 30, 0, -rad, true); ctx.stroke();
      }

      // Level 3: Identity Visualization (right angle marker)
      if (level === 3) {
        const size = 15;
        const signX = Math.cos(rad) >= 0 ? 1 : -1;
        const signY = Math.sin(rad) >= 0 ? 1 : -1;

        ctx.strokeStyle = colors.text; ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(targetX - (size * signX), oy);
        ctx.lineTo(targetX - (size * signX), oy - (size * signY));
        ctx.lineTo(targetX, oy - (size * signY));
        ctx.stroke();
      }

      // Level 4: Sine Rule Visualization
      if (level === 4) {
        // Circumcircle
        ctx.strokeStyle = colors.circle; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(ox, oy, radius, 0, Math.PI * 2); ctx.stroke();

        const angleRad = angle * Math.PI / 180;

        const Ax = ox;
        const Ay = oy - radius;

        // Draw Triangle ABC
        ctx.strokeStyle = colors.text; ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(Ax, Ay);
        ctx.lineTo(ox - radius * Math.sin(angleRad), oy + radius * Math.cos(angleRad));
        ctx.lineTo(ox + radius * Math.sin(angleRad), oy + radius * Math.cos(angleRad));
        ctx.closePath();
        ctx.stroke();

        // Diameter reference
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = colors.grid;
        ctx.beginPath(); ctx.moveTo(ox, oy-radius); ctx.lineTo(ox, oy+radius); ctx.stroke();
        ctx.setLineDash([]);

        // Side 'a' (BC)
        ctx.strokeStyle = colors.sineRule; ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(ox - radius * Math.sin(angleRad), oy + radius * Math.cos(angleRad));
        ctx.lineTo(ox + radius * Math.sin(angleRad), oy + radius * Math.cos(angleRad));
        ctx.stroke();

        // Labels
        ctx.fillStyle = colors.text; ctx.font = "bold 16px Geist Sans";
        ctx.fillText("A", Ax, Ay - 15);
        ctx.fillText("B", ox - radius * Math.sin(angleRad) - 20, oy + radius * Math.cos(angleRad) + 20);
        ctx.fillText("C", ox + radius * Math.sin(angleRad) + 10, oy + radius * Math.cos(angleRad) + 20);

        // R label
        ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(Ax, Ay); ctx.strokeStyle = colors.grid; ctx.stroke();
        ctx.fillStyle = colors.grid; ctx.font = "12px Geist Sans";
        ctx.fillText("R", ox + 5, oy - radius/2);
      }

      // Level 5: Cosine Rule Visualization
      if (level === 5) {
        const sideB = 100;
        const sideC = 140;

        const Ax = ox - 20;
        const Ay = oy + 50;
        const Bx = Ax + sideC;
        const By = Ay;
        const Cx = Ax + sideB * Math.cos(angle * Math.PI / 180);
        const Cy = Ay - sideB * Math.sin(angle * Math.PI / 180);

        ctx.lineWidth = 3;

        // Side c (AB) - Blue
        ctx.strokeStyle = colors.primary;
        ctx.beginPath(); ctx.moveTo(Ax, Ay); ctx.lineTo(Bx, By); ctx.stroke();

        // Side b (AC) - Green
        ctx.strokeStyle = colors.hypotenuse;
        ctx.beginPath(); ctx.moveTo(Ax, Ay); ctx.lineTo(Cx, Cy); ctx.stroke();

        // Side a (BC) - Red
        ctx.strokeStyle = colors.secondary;
        ctx.beginPath(); ctx.moveTo(Bx, By); ctx.lineTo(Cx, Cy); ctx.stroke();

        // Points
        ctx.fillStyle = colors.text;
        ctx.beginPath(); ctx.arc(Ax, Ay, 4, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(Bx, By, 4, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(Cx, Cy, 4, 0, Math.PI*2); ctx.fill();

        // Labels
        ctx.font = "bold 16px Geist Sans";
        ctx.fillText("A", Ax - 20, Ay + 10);
        ctx.fillText("B", Bx + 10, By + 10);
        ctx.fillText("C", Cx, Cy - 15);

        // Side Labels
        ctx.font = "14px Geist Sans";
        ctx.fillStyle = colors.primary;
        ctx.fillText("c=14", Ax + sideC/2, Ay + 20);

        ctx.fillStyle = colors.hypotenuse;
        ctx.fillText("b=10", (Ax+Cx)/2 - 20, (Ay+Cy)/2 - 10);

        ctx.fillStyle = colors.secondary;
        ctx.fillText("a=?", (Bx+Cx)/2 + 10, (By+Cy)/2);

        // Angle Arc
        ctx.strokeStyle = colors.text; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(Ax, Ay, 30, 0, -(angle * Math.PI / 180), true); ctx.stroke();
      }

      // Level 6: Triangle Area Visualization
      if (level === 6) {
        const sideB = 100;
        const sideC = 140;

        const Ax = ox - 50;
        const Ay = oy + 50;
        const Bx = Ax + sideC;
        const By = Ay;
        const Cx = Ax + sideB * Math.cos(angle * Math.PI / 180);
        const Cy = Ay - sideB * Math.sin(angle * Math.PI / 180);
        const Hx = Cx;
        const Hy = Ay;

        // Fill Area
        ctx.fillStyle = isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.1)';
        ctx.beginPath();
        ctx.moveTo(Ax, Ay); ctx.lineTo(Bx, By); ctx.lineTo(Cx, Cy); ctx.closePath();
        ctx.fill();

        // Height Line (Dashed)
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = colors.secondary; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(Cx, Cy); ctx.lineTo(Hx, Hy); ctx.stroke();
        ctx.setLineDash([]);

        // Triangle Sides
        ctx.lineWidth = 3;

        // Side c (AB) - Blue (Base)
        ctx.strokeStyle = colors.primary;
        ctx.beginPath(); ctx.moveTo(Ax, Ay); ctx.lineTo(Bx, By); ctx.stroke();

        // Side b (AC) - Green
        ctx.strokeStyle = colors.hypotenuse;
        ctx.beginPath(); ctx.moveTo(Ax, Ay); ctx.lineTo(Cx, Cy); ctx.stroke();

        // Side a (BC) - Grey
        ctx.strokeStyle = colors.line; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(Bx, By); ctx.lineTo(Cx, Cy); ctx.stroke();

        // Points
        ctx.fillStyle = colors.text;
        ctx.beginPath(); ctx.arc(Ax, Ay, 4, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(Bx, By, 4, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(Cx, Cy, 4, 0, Math.PI*2); ctx.fill();

        // Labels
        ctx.font = "bold 16px Geist Sans";
        ctx.fillText("A", Ax - 20, Ay + 10);
        ctx.fillText("B", Bx + 10, By + 10);
        ctx.fillText("C", Cx, Cy - 10);

        // Height Label
        ctx.fillStyle = colors.secondary;
        ctx.fillText("h", Hx + 5, (Cy + Hy) / 2);

        // Side Labels
        ctx.fillStyle = colors.primary;
        ctx.fillText("c", (Ax+Bx)/2, Ay + 20);

        ctx.fillStyle = colors.hypotenuse;
        ctx.fillText("b", (Ax+Cx)/2 - 15, (Ay+Cy)/2 - 5);

        // Angle Arc
        ctx.strokeStyle = colors.text; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(Ax, Ay, 30, 0, -(angle * Math.PI / 180), true); ctx.stroke();
      }
    };
    render();
  }, [angle, level, resolvedTheme]);

  return (
    <canvas ref={canvasRef} width={400} height={400} className="w-full h-full" />
  );
}
