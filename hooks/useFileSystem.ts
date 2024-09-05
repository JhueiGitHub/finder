"use client";

import { useState, useEffect, useCallback } from "react";
import { ref, onValue, push, set, remove, update } from "firebase/database";
import { db } from "../lib/firebase";
import { FileSystemItem } from "@/app/types/FileSystem";

export const useFileSystem = () => {
  const [fileSystem, setFileSystem] = useState<{
    [key: string]: FileSystemItem;
  }>({});
  const [currentFolder, setCurrentFolder] = useState<string>("root");
  const [navigationHistory, setNavigationHistory] = useState<string[]>([
    "root",
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [favorites, setFavorites] = useState<FileSystemItem[]>([]);

  useEffect(() => {
    const fileSystemRef = ref(db, "fileSystem");
    const favoritesRef = ref(db, "favorites");

    const unsubscribeFileSystem = onValue(fileSystemRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setFileSystem(data);
      } else {
        // Initialize with a root folder if empty
        const rootFolder: FileSystemItem = {
          id: "root",
          name: "Root",
          parentId: null,
          position: { x: 0, y: 0 },
        };
        set(ref(db, "fileSystem/root"), rootFolder);
      }
    });

    const unsubscribeFavorites = onValue(favoritesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setFavorites(Object.values(data));
      } else {
        setFavorites([]);
      }
    });

    return () => {
      unsubscribeFileSystem();
      unsubscribeFavorites();
    };
  }, []);

  const getFolderContents = useCallback(
    (folderId: string): FileSystemItem[] => {
      return Object.values(fileSystem).filter(
        (item) => item.parentId === folderId
      );
    },
    [fileSystem]
  );

  const navigateToFolder = useCallback(
    (folderId: string) => {
      setCurrentFolder(folderId);
      setNavigationHistory((prev) => [
        ...prev.slice(0, historyIndex + 1),
        folderId,
      ]);
      setHistoryIndex((prev) => prev + 1);
    },
    [historyIndex]
  );

  const navigateUp = useCallback(() => {
    const parentFolder = fileSystem[currentFolder]?.parentId;
    if (parentFolder) {
      navigateToFolder(parentFolder);
    }
  }, [currentFolder, fileSystem, navigateToFolder]);

  const navigateForward = useCallback(() => {
    if (historyIndex < navigationHistory.length - 1) {
      setHistoryIndex((prev) => prev + 1);
      setCurrentFolder(navigationHistory[historyIndex + 1]);
    }
  }, [historyIndex, navigationHistory]);

  const createFolder = useCallback(
    (name: string, position: { x: number; y: number }) => {
      const newFolderRef = push(ref(db, "fileSystem"));
      const newFolder: FileSystemItem = {
        id: newFolderRef.key!,
        name,
        parentId: currentFolder,
        position,
      };
      set(newFolderRef, newFolder);
    },
    [currentFolder]
  );

  const renameFolder = useCallback((id: string, newName: string) => {
    update(ref(db, `fileSystem/${id}`), { name: newName });
  }, []);

  const deleteFolder = useCallback((id: string) => {
    remove(ref(db, `fileSystem/${id}`));
  }, []);

  const updateFolderPosition = useCallback(
    (id: string, position: { x: number; y: number }) => {
      update(ref(db, `fileSystem/${id}`), { position });
    },
    []
  );

  const addToFavorites = useCallback((folder: FileSystemItem) => {
    set(ref(db, `favorites/${folder.id}`), folder);
  }, []);

  const removeFromFavorites = useCallback((folderId: string) => {
    remove(ref(db, `favorites/${folderId}`));
  }, []);

  const getFolderName = useCallback(
    (folderId: string): string => {
      return fileSystem[folderId]?.name || "Unknown Folder";
    },
    [fileSystem]
  );

  const wipeDatabase = useCallback(async () => {
    await remove(ref(db, "fileSystem"));
    await remove(ref(db, "favorites"));
    setFileSystem({});
    setFavorites([]);
    setCurrentFolder("root");
    setNavigationHistory(["root"]);
    setHistoryIndex(0);

    const rootFolder: FileSystemItem = {
      id: "root",
      name: "Root",
      parentId: null,
      position: { x: 0, y: 0 },
    };
    await set(ref(db, "fileSystem/root"), rootFolder);
  }, []);

  return {
    currentFolder,
    folderContents: getFolderContents(currentFolder),
    favorites,
    navigateToFolder,
    navigateUp,
    navigateForward,
    createFolder,
    renameFolder,
    deleteFolder,
    updateFolderPosition,
    addToFavorites,
    removeFromFavorites,
    getFolderName,
    canNavigateForward: historyIndex < navigationHistory.length - 1,
    wipeDatabase,
  };
};
