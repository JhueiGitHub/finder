"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { NavigationAction } from "./navigation-action";
import { ScrollArea } from "@dis/components/ui/scroll-area";
import { Separator } from "@dis/components/ui/separator";
import { Server } from "@prisma/client";
import { NavigationItem } from "./navigation-item";

interface NavigationSidebarProps {
  onServerSelect: (serverId: string) => void;
}

const NavigationSidebar = ({ onServerSelect }: NavigationSidebarProps) => {
  const router = useRouter();
  const [servers, setServers] = useState<Server[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/sidebar-data");
        if (!response.ok) {
          throw new Error("Failed to fetch sidebar data");
        }
        const data = await response.json();
        setServers(data.servers);
      } catch (error) {
        console.error("Error fetching sidebar data:", error);
        router.push("/");
      }
    };

    fetchData();
  }, [router]);

  return (
    <div className="space-y-4 flex flex-col items-center h-full text-primary w-full bg-black bg-opacity-25 py-3">
      <NavigationAction />
      <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
      <ScrollArea className="flex-1 w-full">
        {servers.map((server) => (
          <div key={server.id} className="mb-4">
            <NavigationItem
              id={server.id}
              name={server.name}
              imageUrl={server.imageUrl}
              onSelect={() => onServerSelect(server.id)}
            />
          </div>
        ))}
      </ScrollArea>
    </div>
  );
};

export default NavigationSidebar;
