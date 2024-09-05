// BlackHole.tsx
"use client";

import React, { useEffect, useRef } from "react";

interface BlackHoleProps {
  size: number;
}

const BlackHole: React.FC<BlackHoleProps> = ({ size }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      initBlackhole(canvasRef.current);
    }
  }, []);

  return (
    <div id="blackhole" style={{ width: size, height: size }}>
      <div className="centerHover"></div>
      <canvas
        ref={canvasRef}
        width={size * 2}
        height={size * 2}
        style={{ width: size, height: size }}
      />
      <style jsx>{`
        #blackhole {
          position: relative;
          display: flex;
        }
        .centerHover {
          width: 100%;
          height: 100%;
          background-color: transparent;
          border-radius: 50%;
          position: absolute;
          left: 0;
          top: 0;
          z-index: 2;
          cursor: pointer;
        }
        canvas {
          position: relative;
          z-index: 1;
          margin: auto;
        }
      `}</style>
    </div>
  );
};

function initBlackhole(canvas: HTMLCanvasElement) {
  const h = canvas.height;
  const w = canvas.width;
  const cw = w;
  const ch = h;
  const maxorbit = Math.min(w, h) / 2 - 2;
  const centery = ch / 2;
  const centerx = cw / 2;

  let startTime = new Date().getTime();
  let currentTime = 0;

  const stars: Star[] = [];
  let collapse = true; // Start collapsed by default
  let expanse = false;

  const context = canvas.getContext("2d");

  if (!context) return;

  context.globalCompositeOperation = "source-over";

  function setDPI(canvas: HTMLCanvasElement, dpi: number) {
    const scaleFactor = dpi / 96;
    canvas.width = Math.ceil(canvas.width * scaleFactor);
    canvas.height = Math.ceil(canvas.height * scaleFactor);
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(scaleFactor, scaleFactor);
  }

  function rotate(cx: number, cy: number, x: number, y: number, angle: number) {
    const radians = angle;
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    const nx = cos * (x - cx) + sin * (y - cy) + cx;
    const ny = cos * (y - cy) - sin * (x - cx) + cy;
    return [nx, ny];
  }

  setDPI(canvas, 192);

  class Star {
    orbital: number;
    x: number;
    y: number;
    yOrigin: number;
    speed: number;
    rotation: number;
    startRotation: number;
    id: number;
    collapseBonus: number;
    color: string;
    hoverPos: number;
    expansePos: number;
    prevR: number;
    prevX: number;
    prevY: number;

    constructor() {
      const rands = [];
      rands.push(Math.random() * (maxorbit / 2) + 1);
      rands.push(Math.random() * (maxorbit / 2) + maxorbit);

      this.orbital = rands.reduce((p, c) => p + c, 0) / rands.length;
      this.x = centerx;
      this.y = centery + this.orbital;
      this.yOrigin = centery + this.orbital;
      this.speed = ((Math.floor(Math.random() * 2.5) + 1.5) * Math.PI) / 180;
      this.rotation = 0;
      this.startRotation =
        ((Math.floor(Math.random() * 360) + 1) * Math.PI) / 180;
      this.id = stars.length;
      this.collapseBonus = this.orbital - maxorbit * 0.7;
      if (this.collapseBonus < 0) {
        this.collapseBonus = 0;
      }
      stars.push(this);
      this.color = "rgba(255,255,255," + (1 - this.orbital / 255) + ")";
      this.hoverPos = centery + maxorbit / 2 + this.collapseBonus;
      this.expansePos =
        centery + (this.id % 100) * -10 + (Math.floor(Math.random() * 20) + 1);
      this.prevR = this.startRotation;
      this.prevX = this.x;
      this.prevY = this.y;
    }

    draw() {
      if (!context) return;

      if (!expanse) {
        this.rotation = this.startRotation + currentTime * this.speed;
        if (collapse) {
          if (this.y > this.yOrigin) {
            this.y -= 2.5;
          }
          if (this.y < this.yOrigin - 4) {
            this.y += (this.yOrigin - this.y) / 10;
          }
        } else {
          if (this.y < this.hoverPos) {
            this.y += (this.hoverPos - this.y) / 5;
          }
          if (this.y > this.hoverPos + 4) {
            this.y -= 2.5;
          }
        }
      } else {
        this.rotation = this.startRotation + currentTime * (this.speed / 2);
        if (this.y > this.expansePos) {
          this.y -= Math.floor(this.expansePos - this.y) / -140;
        }
      }

      context.save();
      context.fillStyle = this.color;
      context.strokeStyle = this.color;
      context.beginPath();
      const oldPos = rotate(
        centerx,
        centery,
        this.prevX,
        this.prevY,
        -this.prevR
      );
      context.moveTo(oldPos[0], oldPos[1]);
      context.translate(centerx, centery);
      context.rotate(this.rotation);
      context.translate(-centerx, -centery);
      context.lineTo(this.x, this.y);
      context.stroke();
      context.restore();

      this.prevR = this.rotation;
      this.prevX = this.x;
      this.prevY = this.y;
    }
  }

  const centerHover = canvas.parentElement?.querySelector(
    ".centerHover"
  ) as HTMLElement;
  if (centerHover) {
    centerHover.addEventListener("mouseover", () => {
      if (!expanse) {
        collapse = false;
      }
    });
    centerHover.addEventListener("mouseout", () => {
      if (!expanse) {
        collapse = true;
      }
    });
    centerHover.addEventListener("click", () => {
      collapse = true;
      expanse = true;
      centerHover.classList.add("open");
    });
  }

  function loop() {
    const now = new Date().getTime();
    currentTime = (now - startTime) / 50;

    if (!context) return;

    context.fillStyle = "rgba(25,25,25,0.2)";
    context.clearRect(0, 0, cw, ch);

    for (let i = 0; i < stars.length; i++) {
      stars[i].draw();
    }

    requestAnimationFrame(loop);
  }

  function init() {
    if (!context) return;

    context.clearRect(0, 0, cw, ch);
    for (let i = 0; i < 900; i++) {
      new Star();
    }
    loop();
  }

  init();
}

export default BlackHole;
