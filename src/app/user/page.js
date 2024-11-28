"use client"

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'
import Layout from '@/components/Layout';
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExternalLink, Mail, Music, Users, Star, Briefcase } from 'lucide-react'


export default function Profile() {
  const [imageUrl, setImageUrl] = useState('')
  const [imageLoaded, setImageLoaded] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const userId = searchParams.get('id')
  const [user, setUser] = useState(null)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
      if (!userId) {
        router.push('/dashboard')
        return
      }

      const fetchUserData = async () => {
        try {
          const response = await axios.get('/api/user/profile', {
            params: {
              id: userId,
            }
          })

          setUser(response.data)

          // Preload image
          const img = new Image()
          img.src = response.data.profilePicture
          img.onload = () => setImageUrl(response.data.profilePicture || '')
        } catch (error) {
          console.error('Error fetching user data: ', error)
          setError(error)
        }
      }
      const fetchUserProjects = async () => {
        try {
          const response = await axios.get('/api/projects', {
            params: {
              owner: userId,
            },
          })

          const collab = await axios.get(`/api/projects/all`, {
            params: {
                owner: userId,
            },
          })
          const userProjects = collab.data.filter(
              project => project.collaborators.some(collaborator => collaborator.user._id === userId)
          )

          setProjects([...response.data, ...userProjects])
          

          setLoading(false)
        } catch (error) {
          console.error('Error fetching projects: ', error)
          setLoading(false)
        }
      }

      fetchUserData()
      fetchUserProjects()
  }, [userId])

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    )
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Card className="bg-gradient-to-r from-purple-100 to-pink-100">
            <CardHeader className="flex flex-col sm:flex-row items-center gap-6 pb-6">
              <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                {!imageLoaded && <div className="image-placeholder"></div>}
                <AvatarImage
                  src={imageUrl}
                  alt={user.name}
                  onLoad={() => setImageLoaded(true)}
                  style={{ display: imageLoaded ? 'block' : 'none' }}
                />
                <AvatarFallback><Music className="w-12 h-12" /></AvatarFallback>
              </Avatar>
              <div className="text-center sm:text-left space-y-2">
                <CardTitle className="text-3xl font-bold">{user.name}</CardTitle>
                <CardDescription className="flex items-center justify-center sm:justify-start text-lg">
                  <Mail className="w-5 h-5 mr-2" />
                  {user.email}
                </CardDescription>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  {user?.skills?.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {skill}
                    </Badge>
                  ))}
                  {user?.skills?.length > 3 && (
                    <Badge variant="secondary" className="text-sm">+{user.skills.length - 3} more</Badge>
                  )}
                </div>
              </div>
              <div className="flex-grow" />
            </CardHeader>
          </Card>

          <Tabs defaultValue="about" className="mt-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="collaborations">Discover</TabsTrigger>
            </TabsList>
            <TabsContent value="about" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold flex items-center">
                    <Users className="w-5 h-5 mr-2" /> Bio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {user.bio || 'This artist has not added a bio yet.'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold flex items-center">
                    <Star className="w-5 h-5 mr-2" /> Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {user?.skills?.map((skill, index) => (
                      <Badge key={index} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold flex items-center">
                    <Briefcase className="w-5 h-5 mr-2" /> Portfolio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {user?.portfolio?.map((project, index) => (
                      <Card key={index} className="bg-gradient-to-br from-purple-50 to-pink-50">
                        <CardContent className="p-4">
                          <h4 className="font-semibold">{project.name}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center"
                          >
                            View Project
                            <ExternalLink className="w-4 h-4 ml-1" />
                          </a>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold flex items-center">
                    <Users className="w-5 h-5 mr-2" /> Social Media
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {user?.socialMedia?.length > 0 ? (
                    <ul className="space-y-2">
                      {user.socialMedia.map(
                        (account, index) =>
                          account && account.link && (
                            <li key={index} className="flex items-center">
                              <span className="font-semibold mr-2">{account.platform}:</span>
                              <a
                                href={account.link.startsWith('http') ? account.link : `http://${account.link}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline flex items-center"
                              >
                                {account.username}
                                <ExternalLink className="w-4 h-4 ml-1" />
                              </a>
                            </li>
                          )
                      )}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">No social media links added yet.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="projects" className="mt-6">
              <div className="space-y-6">
                {projects.map((project) => (
                  <Card key={project._id} className="bg-gradient-to-br from-purple-50 to-pink-50">
                    <CardHeader>
                      <CardTitle>{project.name}</CardTitle>
                      <CardDescription>{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags.flat().map((tag, index) => (
                          <Badge key={index} variant="secondary">{tag}</Badge>
                        ))}
                      </div>
                      <p className="text-sm mb-4">Status: <span className="font-semibold">{project.status}</span></p>
                      
                      <div className="space-y-4">
                          <h4 className="font-semibold">Owner:</h4>
                          <div className="flex items-center space-x-2">
                              <Link href={`/user?id=${project.owner._id}`}>{project.owner.name}</Link>
                          </div>

                          <h4 className="font-semibold">Collaborators:</h4>
                          {project.collaborators.length > 0 ? (
                            project.collaborators.map((collaborator) => (
                              <div key={collaborator.user?._id || collaborator.skill} className="flex items-center space-x-2">
                                <Link href={`/user?id=${collaborator.user._id}`}>{collaborator.user?.name || 'Unknown User'} ({collaborator.skill})</Link>
                              </div>
                            ))
                          ) : (
                            <p>No collaborators for this project.</p>
                          )}
                      </div>
                      
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="collaborations" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Discover</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Search for new projects and apply to collaborate!</p>
                  <Button asChild>
                    <Link href="/dashboard">
                      Find Projects to Collaborate
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </Layout>
    </Suspense>
  )
}