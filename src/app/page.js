import Layout from '../components/Layout';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Users, Sparkles, Music } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function Home() {
  const featuredProjects = [
    { title: 'Indie Rock Collaboration', genre: 'Rock', skills: ['Guitarist', 'Drummer'] },
    { title: 'Electronic Music Production', genre: 'Electronic', skills: ['Producer', 'Vocalist'] },
    { title: 'Jazz Ensemble Formation', genre: 'Jazz', skills: ['Saxophonist', 'Pianist'] }
  ];

  return (
    <Layout>
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Connect, Create, Collaborate
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-200 md:text-xl">
                Join our vibrant community of artists and bring your creative visions to life through collaboration.
              </p>
            </div>
            <div className="space-x-4">
              <Button asChild size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                <Link href="/auth/signup">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <Users className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Connect</h3>
              <p className="text-gray-600">Find like-minded artists and expand your network</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Sparkles className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Create</h3>
              <p className="text-gray-600">Start or join exciting collaborative projects</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Music className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Collaborate</h3>
              <p className="text-gray-600">Work together to bring your creative ideas to life</p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-12">Featured Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProjects.map((project, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-105">
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-gray-600 mb-4">Genre: {project.genre}</p>
                <div className="flex flex-wrap gap-2">
                  {project.skills.map((skill, skillIndex) => (
                    <span key={skillIndex} className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-purple-600 text-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Collaborate?
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-200 md:text-xl">
                Join our community of artists and start bringing your creative ideas to life today.
              </p>
            </div>
            <Button asChild size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
              <Link href="/auth/signup">
                Sign Up Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}

