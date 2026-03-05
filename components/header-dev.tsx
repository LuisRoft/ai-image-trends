'use client';

import { Github, Twitter, Linkedin, Settings, User } from 'lucide-react';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useAuth,
} from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { useMediaQuery } from '@/hooks/use-media-query';

export default function HeaderDev() {
  const { isLoaded } = useAuth();
  const isMobile = useMediaQuery('(max-width: 640px)');

  return (
    <header className="flex justify-between items-center gap-2 py-4 sm:py-6 md:py-8 text-gray-800 min-w-0">
      <Link
        href="/"
        className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0 min-w-0"
      >
        <Image
          src="/logo.svg"
          alt="VizAI"
          width={20}
          height={20}
          priority
          className="shrink-0"
        />
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-gray-900 truncate">
          VizAI
        </h1>
      </Link>

      <nav className="flex items-center gap-1 sm:gap-2 shrink-0 min-w-0">
        <div className="hidden sm:flex items-center gap-1 rounded-full bg-white/80 backdrop-blur-sm px-2 shadow-sm">
          <a
            href="https://github.com/LuisRoft/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-zinc-500 hover:text-gray-800 rounded-full transition-colors"
            aria-label="GitHub"
          >
            <Github className="size-4" />
          </a>
          <a
            href="https://x.com/luisroftl"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-zinc-500 hover:text-gray-800 rounded-full transition-colors"
            aria-label="X / Twitter"
          >
            <Twitter className="size-4" />
          </a>
          <a
            href="https://www.linkedin.com/in/luisvelasco27/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-zinc-500 hover:text-gray-800 rounded-full transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin className="size-4" />
          </a>
        </div>

        <div className="hidden sm:block h-6 w-px bg-zinc-200 shrink-0" aria-hidden />

        <div className="flex justify-end min-w-0">
          {!isLoaded ? (
            <div
              className="h-8 w-[120px] rounded-md bg-zinc-100 animate-pulse"
              aria-hidden
            />
          ) : (
            <>
              <SignedOut>
                <SignInButton mode="modal">
                  <Button
                    size="sm"
                    className="rounded-full px-2 sm:px-3"
                    aria-label="Iniciar Sesión"
                  >
                    <User className="size-4 sm:mr-2" />
                    <span className="hidden sm:inline">Iniciar Sesión</span>
                  </Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="flex items-center justify-center rounded-full bg-white/80 shadow-sm py-1 px-1 min-w-0">
                    <UserButton
                      showName={!isMobile}
                      appearance={{
                        elements: {
                          userButtonTrigger:
                            'text-zinc-800 rounded-full focus:shadow-none',
                          avatarBox: 'size-6 rounded-full',
                        },
                      }}
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    asChild
                    className="rounded-full"
                  >
                    <Link href="/settings" className="inline-flex items-center">
                      <Settings className="size-4" />
                    </Link>
                  </Button>
                </div>
              </SignedIn>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
