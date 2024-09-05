// src/apps/Mila/index.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import TextEditor from "./Mila";

const Mila: React.FC = () => {
  return (
    <motion.div
      className="h-full w-full overflow-hidden"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <TextEditor />
    </motion.div>
  );
};

export default Mila;
