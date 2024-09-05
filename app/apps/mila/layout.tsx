import React from "react";

export const metadata = {
  title: "Mila",
  description: "Mila text editor application",
};

export default function MilaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="h-full w-full overflow-hidden">{children}</div>;
}
