import { useState } from "react";

interface Window {
  id: number;
  appId: string;
  title: string;
  isFullscreen: boolean;
  zIndex: number;
}

export default function useWindowManager() {
  const [openWindows, setOpenWindows] = useState<Window[]>([]);

  const openWindow = (appId: string) => {
    setOpenWindows((prevWindows) => [
      ...prevWindows,
      {
        id: Date.now(),
        appId,
        title: appId.charAt(0).toUpperCase() + appId.slice(1),
        isFullscreen: true,
        zIndex: prevWindows.length,
      },
    ]);
  };

  const closeWindow = (id: number) => {
    setOpenWindows((prevWindows) =>
      prevWindows.filter((window) => window.id !== id)
    );
  };

  const focusWindow = (id: number) => {
    setOpenWindows((prevWindows) => {
      const windowToFocus = prevWindows.find((w) => w.id === id);
      if (!windowToFocus) return prevWindows;
      return [
        ...prevWindows.filter((w) => w.id !== id),
        {
          ...windowToFocus,
          zIndex: Math.max(...prevWindows.map((w) => w.zIndex)) + 1,
        },
      ];
    });
  };

  return { openWindows, openWindow, closeWindow, focusWindow };
}
