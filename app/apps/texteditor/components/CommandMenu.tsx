import React from "react";

interface CommandMenuProps {
  onSelect: (command: string) => void;
  position: { x: number; y: number };
}

const CommandMenu: React.FC<CommandMenuProps> = ({ onSelect, position }) => {
  return (
    <div
      className="absolute z-50 bg-black bg-opacity-80 rounded-md shadow-lg py-2"
      style={{ left: position.x, top: position.y + 20 }}
    >
      <div
        className="px-4 py-2 text-white hover:bg-gray-700 cursor-pointer"
        onClick={() => onSelect("exemplar")}
      >
        Exemplar
      </div>
    </div>
  );
};

export default CommandMenu;
