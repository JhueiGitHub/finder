import React from "react";

export const metadata = {
  title: "Flow Design System",
  description: "Design system for the OS",
};

export default function FlowLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="h-full w-full overflow-hidden">{children}</div>;
}
