import React from "react";

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onWipeDatabase: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  onClose,
  onWipeDatabase,
}) => {
  return (
    <>
      <div className="fixed inset-0 z-50" onClick={onClose} />
      <div
        className="fixed z-50 bg-white bg-opacity-80 backdrop-blur-md rounded-lg shadow-lg py-2 w-64"
        style={{ left: `${x}px`, top: `${y}px` }}
      >
        <button
          className="w-full text-left px-4 py-2 hover:bg-blue-500 hover:text-white transition-colors duration-150 ease-in-out"
          onClick={() => {
            onWipeDatabase();
            onClose();
          }}
        >
          Wipe Canvas
        </button>
      </div>
    </>
  );
};

export default ContextMenu;
