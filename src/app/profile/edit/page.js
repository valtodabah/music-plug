"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import Layout from '@/components/Layout'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { PlusCircle, X, Upload, Trash2, Music, Palette, Link as LinkIcon, Briefcase } from 'lucide-react'

export default function EditProfile() {
  const { data: session, status, update } = useSession()
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    profilePicture: '',
    skills: [],
    portfolio: [],
    socialMedia: []
  })
  const [imageUrl, setImageUrl] = useState('')
  const [imageLoaded, setImageLoaded] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }

    if (status === 'authenticated' && session?.user) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get('/api/user/profile', {
            params: {
              id: session.user.id,
            }
          })
          setFormData(response.data || {})

          // Preload image
          const img = new Image()
          img.src = response.data.profilePicture
          img.onload = () => setImageUrl(response.data.profilePicture || '')
        } catch (error) {
          console.error('Error fetching user data: ', error)
          setError(error)
        }
      }

      fetchUserData()
    }
  }, [status, session, router])

  if (status === 'loading' || !formData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    )
  }

  if (!session || !session.user) {
    return null
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleRemoveProfileImage = () => {
    setImageUrl('')
    setFormData((prev) => ({ ...prev, profilePicture: '' }))
  }

  const handleRemoveSkill = (index) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }))
  }

  const handleRemovePortfolioItem = (index) => {
    const updatedPortfolio = formData.portfolio.filter((_, i) => i !== index)
    setFormData((prev) => ({ ...prev, portfolio: updatedPortfolio }))
  }

  const handleRemoveSocialMedia = (index) => {
    const updatedSocialMedia = formData.socialMedia.filter((_, i) => i !== index)
    setFormData((prev) => ({ ...prev, socialMedia: updatedSocialMedia }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result
        setSelectedImage(base64)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSkillsChange = (index, value) => {
    const newSkills = [...formData.skills]
    newSkills[index] = value
    setFormData({ ...formData, skills: newSkills })
  }

  const handlePortfolioChange = (index, field, value) => {
    const newPortfolio = [...formData.portfolio]
    newPortfolio[index][field] = value
    setFormData({ ...formData, portfolio: newPortfolio })
  }

  const handleSocialChange = (index, field, value) => {
    const newSocialMedia = [...formData.socialMedia]
    newSocialMedia[index][field] = value
    setFormData({ ...formData, socialMedia: newSocialMedia })
  }

  const handleImageUpload = async () => {
    if (selectedImage) {
      try {
        const response = await axios.post('/api/user/profile-image', {
          id: session.user.id,
          file: selectedImage
        })
        setImageUrl(response.data.imageUrl)
        setFormData((prev) => ({ ...prev, profilePicture: response.data.imageUrl }))
        setSuccess('Image uploaded successfully!')
      } catch (err) {
        console.error('Image upload error: ', err.response.data)
        setError('Error uploading image.')
      }
    }
  }

  const handleAddSkill = () => {
    if (!formData.skills || !formData.skills.includes('')) {
      setFormData((prev) => ({
        ...prev,
        skills: [...(prev.skills || []), '']
      }))
    }
  }

  const handleAddPortfolio = () => {
    setFormData((prev) => ({
      ...prev,
      portfolio: [...prev.portfolio, { name: '', link: '', description: '' }]
    }))
  }

  const handleAddSocialMedia = () => {
    setFormData((prev) => ({
      ...prev,
      socialMedia: [...prev.socialMedia, { platform: '', username: '', link: '' }]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError(null)
    setSuccess(null)

    // Validate form data
    if (!formData.name || !formData.email) {
      setError('Name and Email are required.')
      return
    }

    try {
      const patch = await axios.patch('/api/user/profile', {
        id: session.user.id,
        ...formData,
      })

      if (patch.status === 200) {
        setSuccess('Profile updated successfully!')
        update()
        setTimeout(() => {
          router.push('/profile')
        }, 2000)
      }
    } catch (err) {
      console.error('Edit profile error: ', err.message)
      setError('Error updating profile. Please try again.')
    }
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-3xl mx-auto bg-gradient-to-r from-purple-50 to-pink-50">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Edit Your Artist Profile</CardTitle>
            <CardDescription className="text-center">Showcase your talents and connect with fellow artists</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Artist Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell other artists about yourself and your work..."
                  className="bg-white"
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Profile Picture</Label>
                <div className="flex items-center space-x-4">
                  <Avatar className="w-24 h-24 border-2 border-purple-200">
                    <AvatarImage src={imageUrl} alt={formData.name} />
                    <AvatarFallback><Music className="w-12 h-12" /></AvatarFallback>
                  </Avatar>
                  <div className="space-y-2 flex-grow">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="bg-white"
                    />
                    {selectedImage && (
                      <Button onClick={handleImageUpload} className="w-full">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Profile Picture
                      </Button>
                    )}
                    {imageUrl && (
                      <Button onClick={handleRemoveProfileImage} variant="destructive" className="w-full">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove Profile Picture
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label className="flex items-center"><Palette className="w-4 h-4 mr-2" /> Skills</Label>
                {formData.skills?.map((skill, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={skill}
                      onChange={(e) => handleSkillsChange(index, e.target.value)}
                      placeholder="e.g. Guitar, Vocals, Production"
                      className="bg-white"
                    />
                    <Button
                      type="button"
                      onClick={() => handleRemoveSkill(index)}
                      variant="destructive"
                      size="icon"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" onClick={handleAddSkill} variant="outline" className="w-full">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add Skill
                </Button>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label className="flex items-center"><Briefcase className="w-4 h-4 mr-2" /> Portfolio</Label>
                {formData.portfolio.map((project, index) => (
                  <Card key={index} className="p-4 bg-white">
                    <Input
                      value={project.name}
                      placeholder="Project Name"
                      onChange={(e) => handlePortfolioChange(index, 'name', e.target.value)}
                      className="mb-2"
                    />
                    <Input
                      value={project.link}
                      placeholder="Project Link"
                      onChange={(e) => handlePortfolioChange(index, 'link', e.target.value)}
                      className="mb-2"
                    />
                    <Textarea
                      value={project.description}
                      placeholder="Project Description"
                      onChange={(e) => handlePortfolioChange(index, 'description', e.target.value)}
                      rows={3}
                      className="mb-2"
                    />
                    <Button
                      type="button"
                      onClick={() => handleRemovePortfolioItem(index)}
                      variant="destructive"
                    >
                      Remove Project
                    </Button>
                  </Card>
                ))}
                <Button type="button" onClick={handleAddPortfolio} variant="outline" className="w-full">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add Portfolio Project
                </Button>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label className="flex items-center"><LinkIcon className="w-4 h-4 mr-2" /> Social Media</Label>
                {formData.socialMedia.map((account, index) => (
                  <Card key={index} className="p-4 bg-white">
                    <Input
                      value={account.platform}
                      placeholder="Platform (e.g. Instagram, SoundCloud)"
                      onChange={(e) => handleSocialChange(index, 'platform', e.target.value)}
                      className="mb-2"
                    />
                    <Input
                      value={account.username}
                      placeholder="Username"
                      onChange={(e) => handleSocialChange(index, 'username', e.target.value)}
                      className="mb-2"
                    />
                    <Input
                      value={account.link}
                      placeholder="Profile Link"
                      onChange={(e) => handleSocialChange(index, 'link', e.target.value)}
                      className="mb-2"
                    />
                    <Button
                      type="button"
                      onClick={() => handleRemoveSocialMedia(index)}
                      variant="destructive"
                    >
                      Remove Social Media
                    </Button>
                  </Card>
                ))}
                <Button type="button" onClick={handleAddSocialMedia} variant="outline" className="w-full">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add Social Media
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button type="submit" onClick={handleSubmit} className="w-full">Save Changes</Button>
          </CardFooter>
          <div className="p-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert>
                <AlertDescription className="text-green-600">{success}</AlertDescription>
              </Alert>
            )}
          </div>
        </Card>
      </div>
    </Layout>
  )
}