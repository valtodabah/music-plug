"use client"

import Link from 'next/link';
import { Bell, User, Music, Search } from 'lucide-react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function NavBar() {
    const { data: session, status } = useSession()

    return (
        <header className="px-4 lg:px-6 h-16 flex items-center border-b">
            <Link className="flex items-center justify-center mr-4" href="/">
                <Music className="h-6 w-6 text-purple-600" />
                <span className="ml-2 text-xl font-bold">Music Plug</span>
            </Link>
            <nav className="hidden md:flex space-x-4 flex-1">
                <Link href="/dashboard" className="text-sm font-medium hover:text-purple-600">Explore Projects</Link>
            </nav>
            <div className="flex items-center space-x-4">
                {status === "authenticated" ? (
                    <>
                        <Bell className="h-5 w-5 text-gray-600 cursor-pointer hover:text-purple-600" />
                        <Link href="/profile">
                            <User className="h-5 w-5 text-gray-600 hover:text-purple-600" />
                        </Link>
                        <Button onClick={() => signOut()} variant="ghost">
                            Sign Out
                        </Button>
                    </>
                ) : (
                    <>
                        <Button asChild variant="ghost">
                            <Link href="/auth/signin">Sign In</Link>
                        </Button>
                        <Button asChild>
                            <Link href="/auth/signup">Sign Up</Link>
                        </Button>
                    </>
                )}
            </div>
        </header>
    )
}

