import Layout from '../components/Layout';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function Home()
{
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
    <Layout>
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
    </Layout>
  );
};