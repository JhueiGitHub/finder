"use client";

import React from "react";
import { motion } from "framer-motion";
import ColorSection from "./components/ColorSection";
import FontSection from "./components/FontSection";
import IconSection from "./components/IconSection";
import WallpaperSection from "./components/WallpaperSection";

const Flow: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="absolute inset-4 flex items-start justify-center overflow-auto rounded-lg bg-black bg-opacity-80 p-8"
    >
      <div className="w-full max-w-4xl">
        <h1 className="mb-8 text-center text-4xl font-bold text-white">
          Flow Design System
        </h1>
        <div className="space-y-12">
          <ColorSection />
          <FontSection />
          <IconSection />
          <WallpaperSection />
        </div>
      </div>
    </motion.div>
  );
};

export default Flow;
