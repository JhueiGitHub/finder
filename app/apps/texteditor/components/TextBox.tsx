import React from "react";
import { motion } from "framer-motion";

interface TextBoxProps {
  textBox: {
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
  };
  onDrag: (id: string, newPosition: { x: number; y: number }) => void;
}

const TextBox: React.FC<TextBoxProps> = ({ textBox, onDrag }) => {
  return (
    <motion.div
      drag
      dragMomentum={false}
      initial={textBox.position}
      animate={textBox.position}
      className="absolute cursor-move"
      onDragEnd={(event, info) => {
        onDrag(textBox.id, {
          x: textBox.position.x + info.offset.x,
          y: textBox.position.y + info.offset.y,
        });
      }}
    >
      <div
        className="whitespace-pre-wrap break-words"
        style={{
          fontFamily: textBox.style?.fontFamily || "Dank Mono",
          color: textBox.style?.color || "#748393",
          ...textBox.style,
          backgroundClip: textBox.style?.WebkitBackgroundClip,
          WebkitBackgroundClip: textBox.style?.WebkitBackgroundClip,
          display: "inline-block",
          minWidth: "1ch",
          maxWidth: "100%", // Allow the text box to expand to the full width of the container
          wordWrap: "break-word", // Ensure long words break to the next line
        }}
      >
        {textBox.text}
      </div>
    </motion.div>
  );
};

export default TextBox;
