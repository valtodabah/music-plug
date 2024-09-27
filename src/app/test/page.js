import React from 'react'
import { Bell, User, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"


export default function Component() {
  const artists = [
    { name: 'John Doe', skill: 'Painter' },
    { name: 'Jane Smith', skill: 'Pianist' },
    { name: 'Carlos Garcia', skill: 'Photographer' }
  ];
  const projects = [
    { title: 'Music Video Collaboration', status: 'In Progress' },
    { title: 'Street Art Mural', status: 'Completed' },
    { title: 'Photography Exhibition', status: 'Open' }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <MountainIcon className="h-6 w-6" />
          <span className="sr-only">ArtistCollabHub</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Pricing
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            About
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Contact
          </Link>
        </nav>
        <div className="flex items-center gap-4 ml-auto">
          <Bell className="h-5 w-5" />
          <User className="h-5 w-5" />
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Collaborate with Creative Minds
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Join our vibrant community of artists and bring your creative visions to life through collaboration.
                </p>
              </div>
              <div className="space-x-4">
                <Link
                  className="inline-flex h-9 items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white shadow transition-transform duration-300 ease-in-out transform hover:scale-105 hover:bg-black/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black"
                  href="/auth/signup"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Featured Artists</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {artists.map((artist, index) => (
                <div key={index} className="flex flex-col items-center space-y-2">
                  <Image
                    alt={`Featured Artist ${index}`}
                    className="rounded-full"
                    height={100}
                    src={`/placeholder.svg?height=100&width=100`}
                    style={{
                      aspectRatio: "100/100",
                      objectFit: "cover",
                    }}
                    width={100}
                  />
                  <h3 className="text-xl font-bold">{artist.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{artist.skill}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Featured Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
              {projects.map((project, index) => (
                <div key={index} className="flex flex-col items-center space-y-2">
                  <h3 className="text-xl font-bold">{project.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{project.status}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Join Our Creative Community
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Start collaborating with talented artists from around the world. Sign up now and bring your ideas to life.
                </p>
              </div>
              <div className="space-x-4">
                <Link
                  className="inline-flex h-9 items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white shadow transition-transform duration-300 ease-in-out transform hover:scale-105 hover:bg-black/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black"
                  href="/auth/signup"
                >
                  Sign Up
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2023 ArtistCollabHub. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}

function MountainIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  )
}