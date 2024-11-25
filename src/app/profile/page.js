"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Layout from '@/components/Layout';
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExternalLink, Mail, Pencil, PlusCircle, Music, Users, Star, Briefcase } from 'lucide-react'


export default function Profile() {
  const { data: session, status } = useSession()
  const [user, setUser] = useState(null)
  const [imageUrl, setImageUrl] = useState('')
  const [imageLoaded, setImageLoaded] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()
  const [projects, setProjects] = useState([])
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    tags: '',
  })
  const [editingProjectId, setEditingProjectId] = useState(null)
  const [editProjectData, setEditProjectData] = useState({
    name: '',
    description: '',
    tags: '',
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
    if (status === 'authenticated') {
      const fetchUserData = async () => {
        try {
          const response = await axios.get('/api/user/profile', {
            params: {
              id: session.user.id,
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
              owner: session.user.id,
            },
          })
          setProjects(response.data || [])
          setLoading(false)
        } catch (error) {
          console.error('Error fetching projects: ', error)
          setLoading(false)
        }
      }

      fetchUserData()
      fetchUserProjects()
    }
  }, [status, router, session])

  if (status === 'loading' || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    )
  }

  /* if (!session || !session.user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">You need to be logged in to view this page.</p>
      </div>
    )
  } */

  const handleProjectChange = (e) => {
    setNewProject({ ...newProject, [e.target.name]: e.target.value })
  }

  // Function to load project data into edit form
  const startEditingProject = (project) => {
    setEditingProjectId(project._id)
    setEditProjectData({ name: project.name, description: project.description, tags: project.tags.join(', ') })
  }

  const handleEditProject = async (projectId) => {
    try {
      const response = await axios.put('/api/projects', {
        id: projectId,
        ...editProjectData,
      })

      // Update the projects list
      setProjects(projects.map(project => project._id === projectId ? response.data : project))
      setEditingProjectId(null) // Exit edit mode
    } catch (error) {
      console.error('Error updating project: ', error)
    }
  }

  const handleDeleteProject = async (projectId) => {
    try {
      await axios.delete(`/api/projects`, {
        params: {
          id: projectId
        }
      });
      // Remove the project from the projects list
      setProjects(projects.filter(project => project._id !== projectId))
    } catch (error) {
      console.error('Error deleting project: ', error)
    }
  }

  const handleReOpenProject = async (projectId) => {
    try {
      const response = await axios.put('/api/projects/reopen', {
        id: projectId,
        status: 'open',
      })
      // Update the projects list
      setProjects(projects.map(project => project._id === projectId ? response.data : project))
    } catch (error) {
      console.error('Error reopening project: ', error)
    }
  }

  const handleCloseProject = async (projectId) => {
    try {
      const response = await axios.put('/api/projects/close', { 
        id: projectId,
        status: 'closed',
      })
      // Update the projects list
      setProjects(projects.map(project => project._id === projectId ? response.data : project))
    } catch (error) {
      console.error('Error closing project: ', error)
    }
  }

  const handleCreateProject = async () => {
    try {
      const projectData = {
        name: newProject.name,
        description: newProject.description,
        tags: newProject.tags.split(',').map(tag => tag.trim()),
        owner: session.user.id, // Manually passing the user ID from the frontend
      }
      const response = await axios.post('/api/projects', projectData)
      setProjects([...projects, response.data]) // Update the projects list
      setNewProject({ name: '', description: '', tags: '' }) // Reset form fields
    } catch (error) {
      console.error('Error creating project: ', error)
    }
  }

  const handleApplication = async (projectId, applicantId, skill, action) => {
    try {
      const response = await axios.post(`/api/projects/${projectId}/applicant`, {
        applicantId,
        skill,
        action,
      })

      // Update the projects list
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project._id === projectId ? response.data : project
        )
      )
    } catch (error) {
      console.error('Error applying to project: ', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading projects...</p>
      </div>
    )
  }

  return (
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
            <Button asChild className="mt-4 sm:mt-0" variant="outline">
              <Link href="/profile/edit">
                <Pencil className="w-4 h-4 mr-2" />
                Edit Profile
              </Link>
            </Button>
          </CardHeader>
        </Card>

        <Tabs defaultValue="about" className="mt-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="projects">My Projects</TabsTrigger>
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
                    
                    {editingProjectId === project._id ? (
                      <div className="space-y-4">
                        <Input
                          name="name"
                          placeholder="Project Name"
                          value={editProjectData.name}
                          onChange={(e) => setEditProjectData({...editProjectData, name: e.target.value})}
                        />
                        <Textarea
                          name="description"
                          placeholder="Project Description"
                          value={editProjectData.description}
                          onChange={(e) => setEditProjectData({...editProjectData, description: e.target.value})}
                        />
                        <Input
                          name="tags"
                          placeholder="Skills (comma-separated)"
                          value={editProjectData.tags}
                          onChange={(e) => setEditProjectData({...editProjectData, tags: e.target.value})}
                        />
                        <div className="flex space-x-2">
                          <Button onClick={() => handleEditProject(project._id)}>Save Changes</Button>
                          <Button variant="outline" onClick={() => setEditingProjectId(null)}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <h4 className="font-semibold">Collaborators:</h4>
                        {project.collaborators.length >
0 ? (
                          project.collaborators.map((collaborator) => (
                            <div key={collaborator.user?._id || collaborator.skill} className="flex items-center space-x-2">
                              <p>{collaborator.user?.name || 'Unknown User'} ({collaborator.skill})</p>
                            </div>
                          ))
                        ) : (
                          <p>No collaborators for this project.</p>
                        )}
                        
                        <h4 className="font-semibold">Applicants:</h4>
                        {project.applicants.length > 0 ? (
                          project.applicants.map((applicant) => (
                            <div key={applicant.user} className="flex items-center justify-between border-b py-2">
                              <div>
                                <p className="font-semibold">{applicant.user.name}</p>
                                <p className="text-sm text-gray-600">{applicant.skill}</p>
                                <p className="text-sm text-gray-400">{applicant.message}</p>
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  onClick={() => handleApplication(project._id, applicant.user._id, applicant.skill, "accept")}
                                >
                                  Accept
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => handleApplication(project._id, applicant.user._id, applicant.skill, "reject")}
                                >
                                  Reject
                                </Button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p>No applicants for this project.</p>
                        )}
                        
                        <div className="flex space-x-2">
                          {project.status === 'open' && (
                            <Button onClick={() => startEditingProject(project)}>Edit Project</Button>
                          )}
                          <Button variant="destructive" onClick={() => handleDeleteProject(project._id)}>
                            Delete Project
                          </Button>
                          {project.status === "open" ? (
                            <Button variant="outline" onClick={() => handleCloseProject(project._id)}>
                              Close Project
                            </Button>
                          ) : (
                            <Button variant="outline" onClick={() => handleReOpenProject(project._id)}>
                              Reopen Project
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
              
              <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
                <CardHeader>
                  <CardTitle>Create New Project</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Input
                      name="name"
                      placeholder="Project Name"
                      value={newProject.name}
                      onChange={handleProjectChange}
                      required
                    />
                    <Textarea
                      name="description"
                      placeholder="Project Description"
                      value={newProject.description}
                      onChange={handleProjectChange}
                      rows={4}
                      required
                    />
                    <Input
                      name="tags"
                      placeholder="Skills (comma-separated)"
                      value={newProject.tags}
                      onChange={handleProjectChange}
                      required
                    />
                    <Button onClick={handleCreateProject} className="w-full">
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Create Project
                    </Button>
                  </div>
                </CardContent>
              </Card>
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
  )
}