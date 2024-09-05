import React from "react";

interface ContextMenuOption {
  label: string;
  onClick: () => void;
}

interface ContextMenuProps {
  x: number;
  y: number;
  options: ContextMenuOption[];
  onClose: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  options,
  onClose,
}) => {
  return (
    <div
      className="fixed bg-black bg-opacity-80 border border-gray-700 rounded-md shadow-lg py-1 z-50"
      style={{ top: y, left: x }}
    >
      <ul>
        {options.map((option, index) => (
          <li
            key={index}
            className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-white font-dank-mono"
            onClick={() => {
              option.onClick();
              onClose();
            }}
          >
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContextMenu;
