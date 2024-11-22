"use client"

import Link from 'next/link';
import { Bell, User } from "lucide-react"
import { useSession, signIn, signOut } from 'next-auth/react'

export default function NavBar()
{
    const { data: session, status } = useSession()

    return (
        <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="/">
          <img src="/musicpluglogo.png" alt="Music Plug Logo" className="h-7 w-8" />
          <span className="sr-only">ArtistCollabHub</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <p className="text-xl text-sm font-medium font-bold">
            Music Plug
          </p>
        </nav>
        <div className="flex items-center gap-4 ml-auto">
          {status === "authenticated" ? (
            <>
              <Bell className="h-5 w-5" />
              <Link href="/profile"><User className="h-5 w-5" /></Link>
              <button
                onClick={() => signOut()}
                className="text-sm font-medium text-gray-600"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link href="/auth/signin" className="text-sm font-medium text-gray-600">
              Sign In
            </Link>
          )}
        </div>
      </header>
    );
}