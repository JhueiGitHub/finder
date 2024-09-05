import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  motion,
  PanInfo,
  AnimatePresence,
  useDragControls,
} from "framer-motion";
import ContextMenu from "../../../contexts/ContextMenu";
import { CSSProperties } from "react";
import Sidebar from "./Sidebar";
import { FileSystemItem } from "../../types/FileSystem";
import { transform } from "next/dist/build/swc";

interface FileExplorerProps {
  currentFolder: string;
  folderContents: FileSystemItem[];
  favorites: FileSystemItem[];
  onNavigate: (folderId: string) => void;
  onNavigateUp: () => void;
  onNavigateForward: () => void;
  onCreateFolder: (name: string, position: { x: number; y: number }) => void;
  onRenameFolder: (id: string, newName: string) => void;
  onDeleteFolder: (id: string) => void;
  onUpdateFolderPosition: (
    id: string,
    position: { x: number; y: number }
  ) => void;
  onAddToFavorites: (folder: FileSystemItem) => void;
  onRemoveFromFavorites: (folderId: string) => void;
  getFolderName: (folderId: string) => Promise<string>;
  canNavigateForward: boolean;
  onWipeDatabase: () => Promise<void>;
}

const FileExplorer: React.FC<FileExplorerProps> = ({
  currentFolder,
  folderContents,
  favorites,
  onNavigate,
  onNavigateUp,
  onNavigateForward,
  onCreateFolder,
  onRenameFolder,
  onDeleteFolder,
  onUpdateFolderPosition,
  onAddToFavorites,
  onRemoveFromFavorites,
  getFolderName,
  canNavigateForward,
  onWipeDatabase,
}) => {
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [editingFolder, setEditingFolder] = useState<string | null>(null);
  const [newFolder, setNewFolder] = useState<{
    id: string;
    position: { x: number; y: number };
  } | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [draggingFolder, setDraggingFolder] = useState<FileSystemItem | null>(
    null
  );
  const [currentFolderName, setCurrentFolderName] = useState<string>("");
  const explorerRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();

  useEffect(() => {
    getFolderName(currentFolder).then(setCurrentFolderName);
  }, [currentFolder, getFolderName]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const rect = explorerRef.current?.getBoundingClientRect();
    if (rect) {
      setContextMenu({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const closeContextMenu = () => setContextMenu(null);

  const handleDoubleClick = (folder: FileSystemItem) => {
    onNavigate(folder.id);
  };

  const handleCreateFolder = () => {
    if (contextMenu) {
      const id = `temp-${Date.now()}`;
      setNewFolder({ id, position: { x: contextMenu.x, y: contextMenu.y } });
      setEditingFolder(id);
      closeContextMenu();
    }
  };

  const handleNewFolderNameSubmit = (name: string) => {
    if (newFolder && newFolder.position) {
      const position = {
        x: Math.max(0, newFolder.position.x),
        y: Math.max(0, newFolder.position.y),
      };
      onCreateFolder(name, position);
      setNewFolder(null);
      setEditingFolder(null);
    }
  };

  const handleDragStart = (folder: FileSystemItem) => () => {
    setDraggingFolder(folder);
  };

  const handleDragEnd =
    (folder: FileSystemItem) => (_: never, info: PanInfo) => {
      const newPosition = {
        x: (folder.position?.x || 0) + info.offset.x || 0,
        y: (folder.position?.y || 0) + info.offset.y || 0,
      };

      const targetFolder = folderContents.find((f) => {
        if (f.id === folder.id) return false;
        const fPos = f.position || { x: 0, y: 0 };
        return (
          newPosition.x >= fPos.x &&
          newPosition.x <= fPos.x + 80 &&
          newPosition.y >= fPos.y &&
          newPosition.y <= fPos.y + 80
        );
      });

      setDraggingFolder(null);
    };

  const renderFolder = (folder: FileSystemItem) => {
    return (
      <motion.div
        key={folder.id}
        className="absolute flex cursor-move flex-col items-center"
        initial={{ x: folder.position?.x || 0, y: folder.position?.y || 0 }}
        animate={{ x: folder.position?.x || 0, y: folder.position?.y || 0 }}
        drag
        dragControls={dragControls}
        dragMomentum={false}
        dragElastic={0}
        onDragStart={handleDragStart(folder)}
        onDragEnd={handleDragEnd(folder)}
        onDoubleClick={() => handleDoubleClick(folder)}
      >
        <img src="/media/folder.png" alt="Folder" className="h-12 w-12" />
        {editingFolder === folder.id ? (
          <input
            type="text"
            defaultValue={folder.name}
            className="w-20 bg-transparent text-center text-white outline-none"
            onBlur={(e) => {
              onRenameFolder(folder.id, e.target.value);
              setEditingFolder(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onRenameFolder(folder.id, e.currentTarget.value);
                setEditingFolder(null);
              }
            }}
            autoFocus
          />
        ) : (
          <span
            className="mt-1 text-sm text-gray-300"
            onDoubleClick={(e) => {
              e.stopPropagation();
              setEditingFolder(folder.id);
            }}
          >
            {folder.name}
          </span>
        )}
      </motion.div>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="absolute h-full">
        <Sidebar
          favorites={favorites}
          onNavigate={onNavigate}
          onRemoveFromFavorites={onRemoveFromFavorites}
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          onDrop={(folder) => onAddToFavorites(folder)}
        />
      </div>
      <div className="flex-1 overflow-hidden">
        <div
          className="absolute flex items-center p-4"
          style={{ transform: "translateY(-45px) translateX(72px)" }}
        >
          <button
            onClick={onNavigateUp}
            className="mr-2 text-gray-400 hover:text-white"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={onNavigateForward}
            className={`mr-2 ${
              canNavigateForward
                ? "text-gray-400 hover:text-white"
                : "cursor-not-allowed text-gray-600"
            }`}
            disabled={!canNavigateForward}
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
          <span className="text-gray-300">{currentFolderName}</span>
        </div>
        <div
          ref={explorerRef}
          className="relative h-[calc(100%-4rem)]"
          onContextMenu={handleContextMenu}
          onClick={closeContextMenu}
        >
          {folderContents.map(renderFolder)}
          {newFolder && (
            <motion.div
              className="absolute flex flex-col items-center"
              initial={{ x: newFolder.position.x, y: newFolder.position.y }}
              animate={{ x: newFolder.position.x, y: newFolder.position.y }}
            >
              <img
                src="/media/folder.png"
                alt="New Folder"
                className="h-12 w-12"
              />
              <input
                type="text"
                className="w-20 bg-transparent text-center text-white outline-none"
                placeholder=""
                autoFocus
                onBlur={(e) => handleNewFolderNameSubmit(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleNewFolderNameSubmit(e.currentTarget.value);
                  }
                }}
              />
            </motion.div>
          )}
        </div>
      </div>
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          options={[{ label: "New Folder", onClick: handleCreateFolder }]}
          onClose={closeContextMenu}
          onWipeDatabase={onWipeDatabase}
        />
      )}
    </div>
  );
};

export default FileExplorer;
