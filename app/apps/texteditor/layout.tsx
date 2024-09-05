import React from "react";

export const metadata = {
  title: "Text Editor",
  description: "A simple and efficient text editor application",
};

export default function TextEditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="h-full w-full overflow-hidden">{children}</div>;
}
