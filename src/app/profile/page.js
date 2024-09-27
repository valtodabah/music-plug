"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ExternalLink, Mail, Pencil } from 'lucide-react'

export default function Profile() {
  const { data: session, status } = useSession()
  const [error, setError] = useState(null)
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    )
  }

  if (!session || !session.user) {
    return null
  }

  const user = session.user

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="flex flex-col sm:flex-row items-center gap-4">
          <Avatar className="w-24 h-24">
            <AvatarImage src={user.profilePicture} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left">
            <CardTitle className="text-2xl font-bold">{user.name}</CardTitle>
            <CardDescription className="flex items-center justify-center sm:justify-start mt-1">
              <Mail className="w-4 h-4 mr-1" />
              {user.email}
            </CardDescription>
          </div>
          <div className="flex-grow" />
          <Button asChild className="mt-4 sm:mt-0">
            <Link href="/profile/edit">
              <Pencil className="w-4 h-4 mr-2" />
              Edit Profile
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Bio</h2>
            <p className="text-muted-foreground">{user.bio || 'This user has not added a bio yet.'}</p>
          </div>
          <Separator />
          <div>
            <h2 className="text-xl font-semibold mb-2">Skills</h2>
            {user?.skills?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">{skill}</Badge>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No skills added yet.</p>
            )}
          </div>
          <Separator />
          <div>
            <h2 className="text-xl font-semibold mb-2">Portfolio</h2>
            {user?.portfolio?.length > 0 ? (
              <ul className="space-y-2">
                {user.portfolio.map((project, index) => (
                  <li key={index}>
                    <Link href={project.link} target="_blank" rel="noopener noreferrer" className="flex items-center text-primary hover:underline">
                      {project.name}
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No portfolio items added yet.</p>
            )}
          </div>
          <Separator />
          <div>
            <h2 className="text-xl font-semibold mb-2">Social Media</h2>
            {user?.socialMedia?.length > 0 ? (
              <ul className="space-y-2">
                {user.socialMedia.map((account, index) => (
                  <li key={index}>
                    <Link href={account.link} target="_blank" rel="noopener noreferrer" className="flex items-center text-primary hover:underline">
                      {account.platform}: {account.username}
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No social media links added yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}