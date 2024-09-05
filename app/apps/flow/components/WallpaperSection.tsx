import React from "react";

const WallpaperSection: React.FC = () => {
  return (
    <div className="rounded-lg bg-gray-900 p-6">
      <h2 className="mb-4 text-2xl font-bold text-white">Wallpaper</h2>
      <div className="relative h-48 w-full overflow-hidden rounded-lg">
        <video
          src="/media/bh.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
};

export default WallpaperSection;
