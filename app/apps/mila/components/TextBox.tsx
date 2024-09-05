import React from "react";
import { motion, PanInfo } from "framer-motion";

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
      className="absolute cursor-move"
      onDragEnd={(
        event: MouseEvent | TouchEvent | PointerEvent,
        info: PanInfo
      ) => {
        onDrag(textBox.id, {
          x: textBox.position.x + info.offset.x,
          y: textBox.position.y + info.offset.y,
        });
      }}
    >
      <div
        className={`font-dank-mono italic whitespace-nowrap ${
          textBox.style?.fontFamily === "ExemplarPro"
            ? "font-exemplar text-[1.2em]"
            : "text-[#748393]"
        }`}
        style={{
          ...textBox.style,
          backgroundClip: textBox.style?.WebkitBackgroundClip,
          WebkitBackgroundClip: textBox.style?.WebkitBackgroundClip,
          color: textBox.style?.color,
        }}
      >
        {textBox.text}
      </div>
    </motion.div>
  );
};

export default TextBox;
