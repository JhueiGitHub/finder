import React from "react";
import Image from "next/image";
import { motion, useTransform, useSpring, MotionValue } from "framer-motion";

interface DockIconProps {
  app: { id: string; name: string; icon: string };
  onClick: () => void;
  mouseX: MotionValue<number>;
  iconCenter: number;
  magnification: number;
  magnificationRange: number;
}

export default function DockIcon({
  app,
  onClick,
  mouseX,
  iconCenter,
  magnification,
  magnificationRange,
}: DockIconProps) {
  const distance = useTransform(mouseX, (value) =>
    Math.abs(value - iconCenter)
  );
  const scale = useTransform(
    distance,
    [0, magnificationRange],
    [magnification, 1],
    { clamp: true }
  );

  const smoothScale = useSpring(scale, {
    stiffness: 300,
    damping: 30,
  });

  return (
    <motion.button
      onClick={onClick}
      className="focus:outline-none mx-1"
      style={{ scale: smoothScale }}
    >
      <Image
        id={`dock-icon-${app.id}`}
        src={app.icon}
        alt={app.name}
        width={64}
        height={64}
        className="rounded-lg"
      />
    </motion.button>
  );
}
