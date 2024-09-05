import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { db } from "@/lib/firebase";
import { ref, onValue, push, update, remove } from "firebase/database";
import TextBox from "./components/TextBox";
import ContextMenu from "./components/ContextMenu";

interface TextBoxData {
  id: string;
  text: string;
  position: { x: number; y: number };
  style?: {
    fontFamily?: string;
    fontSize?: string;
    fontStyle?: string;
    background?: string;
    WebkitBackgroundClip?: string;
    WebkitTextFillColor?: string;
    color?: string;
  };
}

const TextEditor: React.FC = () => {
  const [textBoxes, setTextBoxes] = useState<TextBoxData[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingPosition, setTypingPosition] = useState({ x: 0, y: 0 });
  const [currentText, setCurrentText] = useState("");
  const [currentStyle, setCurrentStyle] = useState<TextBoxData["style"]>({
    fontFamily: "Dank Mono",
    fontStyle: "italic",
    color: "#748393",
  });
  const [isExemplarMode, setIsExemplarMode] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [inputWidth, setInputWidth] = useState(1);
  const measureRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const textBoxesRef = ref(db, "textEditor/textBoxes");
    const unsubscribe = onValue(textBoxesRef, (snapshot) => {
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

    return () => unsubscribe();
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
      setCurrentStyle({
        fontFamily: "Dank Mono",
        color: "#748393",
        fontStyle: "italic",
      });
      setIsExemplarMode(false);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      createTextBox();
    }
  };

  const createTextBox = useCallback(() => {
    if (currentText) {
      const textBoxesRef = ref(db, "textEditor/textBoxes");
      const newTextBox: Omit<TextBoxData, "id"> = {
        text: currentText,
        position: typingPosition,
        style: currentStyle,
      };
      push(textBoxesRef, newTextBox);
    }
    setIsTyping(false);
    setCurrentText("");
    setCurrentStyle({
      fontFamily: "Dank Mono",
      color: "#748393",
      fontStyle: "italic",
    });
    setIsExemplarMode(false);
  }, [currentText, typingPosition, currentStyle]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;

    if (newText.endsWith("/exemplar")) {
      setIsExemplarMode(true);
      setCurrentStyle({
        fontFamily: "ExemplarPro",
        fontSize: "1.4em",
        background: "linear-gradient(45deg, #FF0000, #FF6666)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        color: "transparent",
      });
      setCurrentText(newText.slice(0, -9)); // Remove "/exemplar" from the text
    } else {
      if (isExemplarMode) {
        setCurrentText(newText);
      } else {
        setCurrentText(newText);
        setCurrentStyle({
          fontFamily: "Dank Mono",
          color: "#748393",
          fontStyle: "italic",
        });
      }
    }
    if (measureRef.current) {
      const newWidth = measureRef.current.offsetWidth;
      setInputWidth(newWidth + 10); // Add a small buffer
    }
  };

  const handleTextBoxDrag = useCallback(
    (id: string, newPosition: { x: number; y: number }) => {
      const updates: { [key: string]: any } = {};
      updates[`/textEditor/textBoxes/${id}/position`] = newPosition;
      update(ref(db), updates);
    },
    []
  );

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  const wipeDatabase = () => {
    const textBoxesRef = ref(db, "textEditor/textBoxes");
    remove(textBoxesRef).then(() => {
      setTextBoxes([]);
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="relative h-full w-full overflow-hidden opacity-30"
      onContextMenu={handleContextMenu}
    >
      <div className="absolute inset-0 overflow-hidden bg-purple-950 bg-opacity-15">
        <div
          className="absolute w-full h-full object-cover bg-violet-950 bg-opacity-5"
          style={{ transform: "translateY(-57.5%)" }}
        ></div>
        <div
          className="absolute w-full h-full object-cover bg-black bg-opacity-20"
          style={{ transform: "translateY(-57.5%)" }}
        ></div>
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute bottom-0 left-0 w-full object-cover opacity-15"
          style={{ transform: "translateY(45%)" }}
        >
          <source src="/media/bh.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div
        ref={canvasRef}
        className="absolute inset-0"
        onDoubleClick={handleCanvasDoubleClick}
      >
        {isTyping && (
          <div
            className="absolute z-10"
            style={{
              left: typingPosition.x,
              top: typingPosition.y,
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={currentText}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              className="bg-transparent outline-none caret-white font-dank-mono"
              style={{
                ...currentStyle,
                width: `${inputWidth}px`,
                minWidth: "1ch",
              }}
              autoFocus
            />
            <span
              ref={measureRef}
              style={{
                position: "absolute",
                top: "-9999px",
                left: "-9999px",
                visibility: "hidden",
                whiteSpace: "pre",
                ...currentStyle,
              }}
            >
              {currentText}
            </span>
          </div>
        )}
        {textBoxes.map((textBox) => (
          <TextBox
            key={textBox.id}
            textBox={textBox}
            onDrag={handleTextBoxDrag}
          />
        ))}
      </div>
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={closeContextMenu}
          onWipeDatabase={wipeDatabase}
        />
      )}
    </motion.div>
  );
};

export default TextEditor;
