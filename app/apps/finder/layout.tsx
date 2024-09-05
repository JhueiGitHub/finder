import React from "react";

export const metadata = {
  title: "Finder",
  description: "Finder text editor application",
};

export default function FinderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
