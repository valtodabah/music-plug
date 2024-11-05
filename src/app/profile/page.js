"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ExternalLink, Mail, Pencil, PlusCircle } from 'lucide-react'
import { set } from 'mongoose'

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

  if (!session || !session.user) {
    return null
  }

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
        params: { id: projectId }
      });
      // Remove the project from the projects list
      setProjects(projects.filter(project => project._id !== projectId))
    } catch (error) {
      console.error('Error deleting project: ', error)
    }
  }

  const handleCreateProject = async () => {
    try {
      const projectData = {
        name: newProject.name,
        description: newProject.description,
        tags: newProject.tags,
        owner: session.user.id, // Manually passing the user ID from the frontend
      }
      const response = await axios.post('/api/projects', projectData)
      setProjects([...projects, response.data]) // Update the projects list
      setNewProject({ name: '', description: '', tags: '' }) // Reset form fields
    } catch (error) {
      console.error('Error creating project: ', error)
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
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="flex flex-col sm:flex-row items-center gap-4">
          <Avatar className="w-20 h-20">
            {!imageLoaded && <div className="image-placeholder">Loading...</div>}
            <AvatarImage 
              src={imageUrl}
              alt={user.name}
              onLoad={() => setImageLoaded(true)}
              style={{ display: imageLoaded ? 'block' : 'none' }}
            />
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
                  project && project.link ? (
                    <li key={index}>
                      <Link href={project.link} target="_blank" rel="noopener noreferrer" className="flex items-center text-primary hover:underline">
                        {project.name}
                        <ExternalLink className="w-4 h-4 ml-1" />
                      </Link>
                    </li>
                  ) : null
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
                  account && account.link ? (
                    <li key={index}>
                      {account.platform}: 
                      <Link href={account.link} target="_blank" rel="noopener noreferrer" className="flex items-center text-primary hover:underline">
                        {account.username}
                        <ExternalLink className="w-4 h-4 ml-1" />
                      </Link>
                    </li>
                  ) : null
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No social media links added yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
      <Card className="max-w-3xl mx-auto mt-4">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">My Projects</CardTitle>
          <CardDescription>Manage your projects</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {projects.length > 0 ? (
            projects.map((project) => (
              <div key={project._id} className="space-y-2 p-4 border rounded-md">
                {editingProjectId === project._id ? (
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Edit Project</h3>
                    <p className="text-muted-foreground text-sm mb-1">Project Name</p>
                    <Input
                      name="name"
                      placeholder="Project Name"
                      value={editProjectData.name}
                      onChange={(e) => setEditProjectData({ ...editProjectData, name: e.target.value })}
                      className="mb-2"
                    />
                    <p className="text-muted-foreground text-sm mb-1">Project Description</p>
                    <Textarea
                      name="description"
                      placeholder="Project Description"
                      value={editProjectData.description}
                      onChange={(e) => setEditProjectData({ ...editProjectData, description: e.target.value })}
                      rows={4}
                      className="mb-2"
                    />
                    <p className="text-muted-foreground text-sm mb-1">Tags (comma-separated)</p>
                    <Input
                      name="tags"
                      placeholder="Tags (comma-separated)"
                      value={editProjectData.tags}
                      onChange={(e) => setEditProjectData({ ...editProjectData, tags: e.target.value })}
                      className="mb-2"
                    />
                    <Button onClick={() => handleEditProject(project._id, editProjectData)} className="mr-2">
                      Save Changes
                    </Button>
                    <Button onClick={() => setEditingProjectId(null)}>
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-xl font-semibold">{project.name}</h3>
                    <p>{project.description}</p>
                    <p>Status: {project.status}</p>
                    <Button onClick={() => startEditingProject(project)} className="mt-2">
                      Edit Project
                    </Button>
                    <Button onClick={() => handleDeleteProject(project._id)} className="text-red-600 hover:underline ml-2">
                      Delete Project
                    </Button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No projects found.</p>
          )}

          <Separator />
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Create New Project</h2>
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
              placeholder="Tags (comma-separated)"
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
  )
}