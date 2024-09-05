"use client";

import React, { useState, useEffect } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { appDefinitions, AppDefinition } from "../types/AppTypes";
import DockIcon from "./DockIcon";

const DOCK_SIZE = 64;
const DOCK_PADDING = 8;
const MAGNIFICATION = 1.4; // Reduced by 2.5 times from 2
const MAGNIFICATION_RANGE = 150;
const PROXIMITY_THRESHOLD = 150;

interface DockManagerProps {
  toggleApp: (appId: string) => void;
}

const DockManager: React.FC<DockManagerProps> = ({ toggleApp }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 300, damping: 30 };
  const dockY = useSpring(100, springConfig);
  const dockScale = useSpring(0.5, springConfig);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const updateMouse = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const shouldShow = window.innerHeight - e.clientY < PROXIMITY_THRESHOLD;
      dockY.set(shouldShow ? 0 : 100);
      dockScale.set(shouldShow ? 1 : 0.5);
    };

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("mousemove", updateMouse);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("mousemove", updateMouse);
      window.removeEventListener("resize", handleResize);
    };
  }, [mouseX, mouseY, dockY, dockScale]);

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 flex justify-center"
      style={{ y: dockY, scale: dockScale, transformOrigin: "bottom" }}
    >
      <div className="bg-opacity-24 flex items-end rounded-t-[19px] bg-black px-2 py-2 backdrop-blur-md">
        {appDefinitions.map((app, index) => {
          const iconCenter =
            windowWidth / 2 +
            (index - appDefinitions.length / 2 + 0.5) * (DOCK_SIZE + DOCK_PADDING);
          
          return (
            <DockIcon
              key={app.id}
              app={app}
              onClick={() => {
                console.log(`Clicked ${app.id}`);
                toggleApp(app.id);
              }}
              mouseX={mouseX}
              iconCenter={iconCenter}
              magnification={MAGNIFICATION}
              magnificationRange={MAGNIFICATION_RANGE}
            />
          );
        })}
      </div>
    </motion.div>
  );
};

export default DockManager;