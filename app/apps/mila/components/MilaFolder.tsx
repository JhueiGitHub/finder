// MilaFolder.tsx

import React from "react";
import { motion, PanInfo } from "framer-motion";
import BlackHole from "./BlackHole";

interface FolderProps {
  folder: {
    id: string;
    name: string;
    position: { x: number; y: number };
  };
  onDrag: (id: string, newPosition: { x: number; y: number }) => void;
  onDoubleClick: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
}

const MilaFolder: React.FC<FolderProps> = ({
  folder,
  onDrag,
  onDoubleClick,
  onContextMenu,
}) => {
  return (
    <motion.div
      drag
      dragMomentum={false}
      initial={folder.position}
      className="absolute cursor-move"
      onDragEnd={(
        event: MouseEvent | TouchEvent | PointerEvent,
        info: PanInfo
      ) => {
        onDrag(folder.id, {
          x: folder.position.x + info.offset.x,
          y: folder.position.y + info.offset.y,
        });
      }}
      onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
    >
      <BlackHole size={96} />
      <div className="text-center text-[#748393] font-dank-mono mt-1 text-sm">
        {folder.name}
      </div>
    </motion.div>
  );
};

export default MilaFolder;
