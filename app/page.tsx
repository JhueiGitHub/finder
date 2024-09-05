import { ClerkProvider } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Desktop from "./components/Desktop";

export default function Home() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <ClerkProvider>
      <Desktop />
    </ClerkProvider>
  );
}
