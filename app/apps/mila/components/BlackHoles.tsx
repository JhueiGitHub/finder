// BlackHoles.tsx

import React from "react";

interface BlackHoleProps {
  type: string;
}

const BlackHole: React.FC<BlackHoleProps> = ({ type }) => {
  return (
    <div className="w-32 h-32 relative">
      <div className={`purple-energy ${type}`}></div>
      <div className="black-hole"></div>
    </div>
  );
};

export const BlackHoles: React.FC = () => {
  const types = [
    "bh-1",
    "bh-2",
    "bh-3",
    "bh-4",
    "bh-5",
    "bh-6",
    "bh-7",
    "bh-8",
    "bh-9",
  ];

  return (
    <div className="grid grid-cols-3 gap-6 p-6">
      {types.map((type) => (
        <BlackHole key={type} type={type} />
      ))}
      <style jsx global>{`
        .purple-energy {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at center,
            rgba(128, 0, 128, 0.7) 0%,
            transparent 70%
          );
          filter: blur(5px);
        }

        .black-hole {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 40%;
          height: 40%;
          background: black;
          border-radius: 50%;
          transform: translate(-50%, -50%);
        }

        .bh-1 {
          animation: fall 5s linear infinite;
        }
        .bh-2 {
          animation: spiral 8s linear infinite;
        }
        .bh-3 {
          animation: pulse 4s ease-in-out infinite;
        }
        .bh-4 {
          animation: expand 6s ease-in-out infinite;
        }
        .bh-5 {
          animation: fade 3s ease-in infinite;
        }
        .bh-6 {
          animation: wobble 7s ease-in-out infinite;
        }
        .bh-7 {
          animation: stretch 5s ease-in-out infinite;
        }
        .bh-8 {
          animation: flicker 0.5s linear infinite;
        }
        .bh-9 {
          animation: slow 10s linear infinite;
        }

        @keyframes fall {
          0% {
            transform: translateY(-20%);
          }
          100% {
            transform: translateY(20%);
          }
        }

        @keyframes spiral {
          0% {
            transform: rotate(0deg) scale(1.2);
          }
          100% {
            transform: rotate(360deg) scale(0.8);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
        }

        @keyframes expand {
          0% {
            transform: scale(0.8);
          }
          100% {
            transform: scale(1.2);
          }
        }

        @keyframes fade {
          0% {
            opacity: 0.3;
          }
          100% {
            opacity: 0.7;
          }
        }

        @keyframes wobble {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(10%);
          }
          75% {
            transform: translateX(-10%);
          }
        }

        @keyframes stretch {
          0%,
          100% {
            transform: scaleY(1);
          }
          50% {
            transform: scaleY(1.2);
          }
        }

        @keyframes flicker {
          0%,
          100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.7;
          }
        }

        @keyframes slow {
          0% {
            transform: scale(1.2);
            opacity: 0.3;
          }
          100% {
            transform: scale(0.8);
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  );
};

export default BlackHoles;
