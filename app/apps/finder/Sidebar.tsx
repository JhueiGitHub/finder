import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileSystemItem } from "../../types/FileSystem";

interface SidebarProps {
  favorites: FileSystemItem[];
  onNavigate: (folderId: string) => void;
  onRemoveFromFavorites: (folderId: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  onDrop: (folder: FileSystemItem) => void;
  className?: string;
  style?: React.CSSProperties;
}

const Sidebar: React.FC<SidebarProps> = ({
  favorites,
  onNavigate,
  onRemoveFromFavorites,
  isOpen,
  onToggle,
  onDrop,
}) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const folderData = e.dataTransfer.getData("application/json");
    if (folderData) {
      const folder: FileSystemItem = JSON.parse(folderData);
      onDrop(folder);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 200 }}
          exit={{ width: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="h-full border-r border-gray-700 border-opacity-30 bg-black bg-opacity-45"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="flex flex-col p-4 h-full">
            <h2
              className="text-white/70 font-semibold mb-4 text-nowrap text-lg"
              style={{
                marginLeft: "39px",
                fontFamily: "ExemplarPro",
                transform: "translateY(-1.5px)",
              }}
            >
              Quick Access
            </h2>
            {favorites.map((folder) => (
              <motion.div
                key={folder.id}
                className="flex items-center mb-2 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                onClick={() => onNavigate(folder.id)}
              >
                <img
                  src="/media/folder.png"
                  alt="Folder"
                  className="w-6 h-6 mr-2"
                />
                <span className="text-gray-300 text-sm flex-grow">
                  {folder.name}
                </span>
                <button
                  className="ml-auto text-gray-500 hover:text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFromFavorites(folder.id);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
      <button
        onClick={onToggle}
        className="absolute top-4 left-4 z-10 text-gray-400 hover:text-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
    </AnimatePresence>
  );
};

export default Sidebar;
