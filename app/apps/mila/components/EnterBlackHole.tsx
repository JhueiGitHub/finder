// EnterBlackHole.tsx
"use client";

import React, { useEffect, useRef } from "react";

interface EnterBlackHoleProps {
  size: number;
}

const EnterBlackHole: React.FC<EnterBlackHoleProps> = ({ size }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      initBlackhole(canvas, size);
    }
  }, [size]);

  return <canvas ref={canvasRef} width={size} height={size} />;
};

function initBlackhole(canvas: HTMLCanvasElement, size: number) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const centerX = size / 2;
  const centerY = size / 2;
  const maxRadius = size / 2;

  function drawStar(x: number, y: number, radius: number, opacity: number) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
    ctx.fill();
  }

  function draw() {
    ctx.clearRect(0, 0, size, size);

    // Draw black hole
    ctx.beginPath();
    ctx.arc(centerX, centerY, maxRadius / 4, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();

    // Draw stars
    for (let i = 0; i < 50; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * maxRadius;
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;
      const radius = Math.random() * 1.5;
      const opacity = 1 - distance / maxRadius;

      drawStar(x, y, radius, opacity);
    }

    requestAnimationFrame(draw);
  }

  draw();
}

export default EnterBlackHole;
