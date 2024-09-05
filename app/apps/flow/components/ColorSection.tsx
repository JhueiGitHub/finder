import React from "react";

const ColorSection: React.FC = () => {
  return (
    <div className="rounded-lg bg-gray-900 p-6">
      <h2 className="mb-4 text-2xl font-bold text-white">Colors</h2>
      <div className="flex space-x-4">
        <ColorSwatch name="Primary" color="#3498db" />
        <ColorSwatch name="Secondary" color="#2ecc71" />
        <ColorSwatch name="Tertiary" color="#e74c3c" />
      </div>
    </div>
  );
};

const ColorSwatch: React.FC<{ name: string; color: string }> = ({
  name,
  color,
}) => (
  <div className="text-center">
    <div
      className="mb-2 h-20 w-20 rounded-full"
      style={{ backgroundColor: color }}
    ></div>
    <p className="text-sm text-white">{name}</p>
  </div>
);

export default ColorSection;
