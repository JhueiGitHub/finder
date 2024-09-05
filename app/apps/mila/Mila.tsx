"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { db } from "@/lib/firebase";
import { ref, onValue, set, push, update, remove } from "firebase/database";
import ContextMenu from "../../../contexts/ContextMenu";
import TextBox from "./components/TextBox";
import MilaFolder from "./components/MilaFolder";

interface TextBoxData {
  id: string;
  text: string;
  position: { x: number; y: number };
  style?: {
    fontFamily?: string;
    fontSize?: string;
    background?: string;
    WebkitBackgroundClip?: string;
    WebkitTextFillColor?: string;
    color?: string;
  };
}

interface FolderData {
  id: string;
  name: string;
  position: { x: number; y: number };
  parentId: string | null;
}

const Mila: React.FC = () => {
  const [textBoxes, setTextBoxes] = useState<TextBoxData[]>([]);
  const [folders, setFolders] = useState<FolderData[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingPosition, setTypingPosition] = useState({ x: 0, y: 0 });
  const [currentText, setCurrentText] = useState("");
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    type: "canvas" | "folder";
    folderId?: string;
  } | null>(null);
  const [isCommandMenuVisible, setIsCommandMenuVisible] = useState(false);
  const [currentCommand, setCurrentCommand] = useState("");
  const [currentStyle, setCurrentStyle] = useState<TextBoxData["style"]>();
  const [currentFolder, setCurrentFolder] = useState<string>("root");
  const [navigationHistory, setNavigationHistory] = useState<string[]>([
    "root",
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const canvasRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const textBoxesRef = ref(db, "mila/textBoxes");
    const foldersRef = ref(db, "mila/folders");

    const unsubscribeTextBoxes = onValue(textBoxesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const textBoxesArray = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...(value as Omit<TextBoxData, "id">),
        }));
        setTextBoxes(textBoxesArray);
      } else {
        setTextBoxes([]);
      }
    });

    const unsubscribeFolders = onValue(foldersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const foldersArray = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...(value as Omit<FolderData, "id">),
        }));
        setFolders(foldersArray);
      } else {
        setFolders([]);
      }
    });

    return () => {
      unsubscribeTextBoxes();
      unsubscribeFolders();
    };
  }, []);

  const handleCanvasDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const newPosition = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      setTypingPosition(newPosition);
      setIsTyping(true);
      setCurrentText("");
      setCurrentStyle(undefined);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      createTextBox();
    } else if (e.key === "/") {
      setIsCommandMenuVisible(true);
      setCurrentCommand("/");
    } else if (isCommandMenuVisible) {
      if (
        e.key === "Tab" &&
        (currentCommand === "/ex" || currentCommand === "/e")
      ) {
        e.preventDefault();
        handleCommandSelect("exemplar");
      } else if (e.key === "Escape") {
        setIsCommandMenuVisible(false);
        setCurrentCommand("");
      } else {
        setCurrentCommand((prev) => prev + e.key);
      }
    }
  };

  const createTextBox = () => {
    if (currentText) {
      const textBoxesRef = ref(db, "mila/textBoxes");
      const newTextBox: Omit<TextBoxData, "id"> = {
        text: currentText,
        position: typingPosition,
      };

      if (currentStyle) {
        newTextBox.style = currentStyle;
      }

      push(textBoxesRef, newTextBox);
    }
    setIsTyping(false);
    setCurrentText("");
    setIsCommandMenuVisible(false);
    setCurrentCommand("");
    setCurrentStyle(undefined);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentText(e.target.value);
  };

  const handleTextBoxDrag = (
    id: string,
    newPosition: { x: number; y: number }
  ) => {
    const updates: { [key: string]: any } = {};
    updates[`/mila/textBoxes/${id}/position`] = newPosition;
    update(ref(db), updates);
  };

  const handleContextMenu = (
    e: React.MouseEvent,
    type: "canvas" | "folder",
    folderId?: string
  ) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, type, folderId });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  const wipeDatabase = () => {
    const milaRef = ref(db, "mila");
    remove(milaRef).then(() => {
      setTextBoxes([]);
      setFolders([]);
    });
    closeContextMenu();
  };

  const handleCommandSelect = (command: string) => {
    if (command === "exemplar") {
      setCurrentStyle({
        fontFamily: "ExemplarPro",
        fontSize: "1.2em",
        background: "linear-gradient(45deg, #FF0000, #FF6666)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        color: "transparent",
      });
      setCurrentText("");
    }
    setIsCommandMenuVisible(false);
    setCurrentCommand("");
    inputRef.current?.focus();
  };

  const createFolder = (name: string, position: { x: number; y: number }) => {
    const foldersRef = ref(db, "mila/folders");
    push(foldersRef, {
      name,
      position,
      parentId: currentFolder,
    });
  };

  const navigateToFolder = (folderId: string) => {
    setCurrentFolder(folderId);
    setNavigationHistory((prev) => [
      ...prev.slice(0, historyIndex + 1),
      folderId,
    ]);
    setHistoryIndex((prev) => prev + 1);
  };

  const navigateUp = () => {
    const parentFolder = folders.find(
      (folder) => folder.id === currentFolder
    )?.parentId;
    if (parentFolder) {
      navigateToFolder(parentFolder);
    }
  };

  const navigateForward = () => {
    if (historyIndex < navigationHistory.length - 1) {
      setHistoryIndex((prev) => prev + 1);
      setCurrentFolder(navigationHistory[historyIndex + 1]);
    }
  };

  const handleFolderDrag = (
    id: string,
    newPosition: { x: number; y: number }
  ) => {
    const updates: { [key: string]: any } = {};
    updates[`/mila/folders/${id}/position`] = newPosition;
    update(ref(db), updates);
  };

  const renameFolder = (id: string, newName: string) => {
    const updates: { [key: string]: any } = {};
    updates[`/mila/folders/${id}/name`] = newName;
    update(ref(db), updates);
  };

  const deleteFolder = (id: string) => {
    remove(ref(db, `mila/folders/${id}`));
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="relative h-full w-full overflow-hidden opacity-30"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute w-full h-full object-cover bg-black bg-opacity-25"
          style={{ transform: "translateY(-55%)" }}
        ></div>
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="relative h-full w-full overflow-hidden opacity-30"
          style={{ transform: "translateY(45%)" }}
        >
          <source src="/media/bh.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="absolute left-0 top-0 flex space-x-2 p-4">
        <button onClick={navigateUp} className="text-white">
          Up
        </button>
        <button
          onClick={navigateForward}
          className="text-white"
          disabled={historyIndex >= navigationHistory.length - 1}
        >
          Forward
        </button>
      </div>
      <div
        ref={canvasRef}
        className="absolute inset-0 mt-12"
        onDoubleClick={handleCanvasDoubleClick}
        onClick={() => {
          if (isTyping) {
            createTextBox();
          }
          closeContextMenu();
        }}
        onContextMenu={(e) => handleContextMenu(e, "canvas")}
      >
        {isTyping && (
          <input
            ref={inputRef}
            type="text"
            value={currentText}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            className={`font-dank-mono absolute z-10 bg-transparent italic outline-none ${
              currentStyle?.fontFamily === "ExemplarPro"
                ? "font-exemplar text-[1.2em]"
                : "text-[#748393]"
            }`}
            style={{
              left: typingPosition.x,
              top: typingPosition.y,
              width: `${Math.max(1, currentText.length)}ch`,
              ...currentStyle,
              backgroundClip: currentStyle?.WebkitBackgroundClip,
              WebkitBackgroundClip: currentStyle?.WebkitBackgroundClip,
              color: currentStyle?.color,
            }}
            autoFocus
          />
        )}
        {textBoxes.map((textBox) => (
          <TextBox
            key={textBox.id}
            textBox={textBox}
            onDrag={handleTextBoxDrag}
          />
        ))}
        {folders
          .filter((folder) => folder.parentId === currentFolder)
          .map((folder) => (
            <MilaFolder
              key={folder.id}
              folder={folder}
              onDrag={handleFolderDrag}
              onDoubleClick={() => navigateToFolder(folder.id)}
              onContextMenu={(e) => handleContextMenu(e, "folder", folder.id)}
            />
          ))}
      </div>
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          options={
            contextMenu.type === "canvas"
              ? [
                  {
                    label: "New Folder",
                    onClick: () =>
                      createFolder("New Folder", {
                        x: contextMenu.x,
                        y: contextMenu.y,
                      }),
                  },
                  { label: "Wipe Database", onClick: wipeDatabase },
                ]
              : [
                  {
                    label: "Rename",
                    onClick: () =>
                      renameFolder(contextMenu.folderId!, "Renamed Folder"),
                  },
                  {
                    label: "Delete",
                    onClick: () => deleteFolder(contextMenu.folderId!),
                  },
                ]
          }
          onClose={closeContextMenu}
          onWipeDatabase={wipeDatabase}
        />
      )}
      {isCommandMenuVisible && (
        <div
          className="absolute z-50 rounded-md border border-gray-700 bg-black bg-opacity-80 py-1 shadow-lg"
          style={{ left: typingPosition.x, top: typingPosition.y + 20 }}
        >
          <div
            className="font-dank-mono cursor-pointer px-4 py-2 text-white hover:bg-gray-700"
            onClick={() => handleCommandSelect("exemplar")}
          >
            Exemplar
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Mila;
