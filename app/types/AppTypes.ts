// types/AppTypes.ts
export interface AppDefinition {
  id: string;
  name: string;
  icon: string;
  dockPosition: number;
  animationType: "magnify" | "grow";
}

export const appDefinitions: AppDefinition[] = [
  {
    id: "finder",
    name: "Finder",
    icon: "/media/finder.png",
    dockPosition: 0,
    animationType: "grow",
  },
  {
    id: "flow",
    name: "Settings",
    icon: "/media/settings.png",
    dockPosition: 1,
    animationType: "magnify",
  },
  {
    id: "TextEditor",
    name: "Obsidian",
    icon: "/media/editor.png",
    dockPosition: 2,
    animationType: "magnify",
  },
  {
    id: "mila",
    name: "Mila",
    icon: "/media/mila.png",
    dockPosition: 3,
    animationType: "magnify",
  },
  {
    id: "FigmaClone",
    name: "Figma",
    icon: "/media/figma.png",
    dockPosition: 4,
    animationType: "magnify",
  },
  {
    id: "tor",
    name: "Tor",
    icon: "/media/tor.png",
    dockPosition: 5,
    animationType: "magnify",
  },
  {
    id: "discord",
    name: "Disk",
    icon: "/media/desktop.png",
    dockPosition: 6,
    animationType: "magnify",
  },
  {
    id: "flt",
    name: "Float",
    icon: "/media/trash.png",
    dockPosition: 7,
    animationType: "magnify",
  },
];
