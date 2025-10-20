"use client";

import { Github, Twitter, Linkedin, Settings, User } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function HeaderDev() {
  const router = useRouter();

  return (
    <header className="flex justify-between items-center gap-2 py-8 text-gray-800">
      <h1 className="text-xl font-semibold">AImage</h1>
      <div className="flex items-center gap-4">
        <div className="flex gap-4 text-zinc-500">
          <a
            href="https://github.com/LuisRoft/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-800 transition"
          >
            <Github />
          </a>
          <a
            href="https://x.com/luisroftl"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-800 transition"
          >
            <Twitter />
          </a>
          <a
            href="https://www.linkedin.com/in/luisvelasco27/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-800 transition"
          >
            <Linkedin />
          </a>
        </div>
        <SignedOut>
          <SignInButton mode="modal">
            <Button size="sm">
              <User className="h-4 w-4 mr-2" />
              Iniciar Sesión
            </Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/settings")}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </SignedIn>
      </div>
    </header>
  );
}
