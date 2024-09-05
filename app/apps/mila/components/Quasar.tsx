// Quasar.tsx
"use client";

import React, { useEffect } from "react";

const Quasar: React.FC = () => {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      :root {
        --photon: #00e8ff;
        --accretion: #bc00f3;
        --doppler: #5b3cf5;
      }

      .bh-container {
        width: 64px;
        height: 64px;
        position: relative;
        display: grid;
        place-items: center;
        overflow: visible;
      }

      .bh-event-horizon {
        position: absolute;
        width: 24px;
        height: 24px;
        background: black;
        border-radius: 50%;
        z-index: 5;
      }

      .bh-accretion-disk {
        position: absolute;
        width: 64px;
        height: 64px;
        background: radial-gradient(circle, transparent 20%, var(--accretion) 30%, var(--doppler) 60%, transparent 70%);
        border-radius: 50%;
        animation: rotate 10s linear infinite, breathe 4s ease-in-out infinite;
        filter: blur(4px);
      }

      .bh-photon-sphere {
        position: absolute;
        width: 28px;
        height: 28px;
        border: 2px solid var(--photon);
        border-radius: 50%;
        animation: pulse 4s ease-in-out infinite;
        filter: blur(1px);
        opacity: 0.7;
      }

      .bh-gravitational-lensing {
        position: absolute;
        width: 64px;
        height: 64px;
        background: radial-gradient(circle, transparent 30%, rgba(255,255,255,0.1) 40%, transparent 50%);
        border-radius: 50%;
        filter: blur(4px);
        animation: breathe 4s ease-in-out infinite;
      }

      @keyframes rotate {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 0.7; }
        50% { transform: scale(1.05); opacity: 0.9; }
      }

      @keyframes breathe {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
      }

      .bh-container::before {
        content: '';
        position: absolute;
        width: 80px;
        height: 80px;
        background: radial-gradient(circle, var(--doppler) 0%, transparent 70%);
        border-radius: 50%;
        animation: wobble 8s ease-in-out infinite;
        opacity: 0.3;
      }

      @keyframes wobble {
        0%, 100% { transform: translate(0, 0); }
        25% { transform: translate(-2px, 2px); }
        50% { transform: translate(2px, -2px); }
        75% { transform: translate(2px, 2px); }
      }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <div className="bh-container">
      <div className="bh-gravitational-lensing"></div>
      <div className="bh-accretion-disk"></div>
      <div className="bh-photon-sphere"></div>
      <div className="bh-event-horizon"></div>
    </div>
  );
};

export default Quasar;
