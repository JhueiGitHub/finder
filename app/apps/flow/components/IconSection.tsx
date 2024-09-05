import React from "react";
import Image from "next/image";
import { appDefinitions } from "@/app/types/AppTypes";

const IconSection: React.FC = () => {
  return (
    <div className="rounded-lg bg-gray-900 p-6">
      <h2 className="mb-4 text-2xl font-bold text-white">Dock Icons</h2>
      <div className="flex flex-wrap gap-4">
        {appDefinitions.map((app) => (
          <div key={app.id} className="text-center">
            <Image
              src={app.icon}
              alt={app.name}
              width={48}
              height={48}
              className="rounded-lg"
            />
            <p className="mt-2 text-sm text-white">{app.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IconSection;
