"use client";

import dynamic from "next/dynamic";

/**
 * disable ssr to avoid pre-rendering issues of Next.js
 *
 * we're doing this because we're using a canvas element that can't be pre-rendered by Next.js on the server
 */
const App = dynamic(() => import("./Mila"), { ssr: false });

export default function MilaPage() {
  return <App />;
}
