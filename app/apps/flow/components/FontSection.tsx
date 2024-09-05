import React from "react";

const FontSection: React.FC = () => {
  return (
    <div className="rounded-lg bg-gray-900 p-6">
      <h2 className="mb-4 text-2xl font-bold text-white">Fonts</h2>
      <div className="space-y-4">
        <FontExample name="ExemplarPro" fontFamily="ExemplarPro" />
        <FontExample name="Dank" fontFamily="Dank" />
      </div>
    </div>
  );
};

const FontExample: React.FC<{ name: string; fontFamily: string }> = ({
  name,
  fontFamily,
}) => (
  <div>
    <p className="text-white" style={{ fontFamily, fontSize: "24px" }}>
      {name}
    </p>
  </div>
);

export default FontSection;
