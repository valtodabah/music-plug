"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Music, Users, Star, Search } from 'lucide-react';

export default function Dashboard() {
    const { data: session, status } = useSession();
    const [projects, setProjects] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [applyMessage, setApplyMessage] = useState("");
    const [selectedSkill, setSelectedSkill] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (status === 'authenticated') {
            fetchProjects();
        }
    }, [status]);

    const fetchProjects = async () => {
        try {
            const response = await axios.get(`/api/projects/all`, {
                params: {
                    owner: session.user.id,
                },
            });
            const userProjects = response.data.filter(
                project => project.owner !== session.user.id
            );
            setProjects(userProjects);
        } catch (error) {
            console.error('Error fetching projects: ', error);
        }
    };

    const handleApply = async (projectId) => {
        if (!selectedSkill || !applyMessage) {
            alert('Please select a skill and provide a message');
            return;
        }

        try {
            await axios.post(`/api/projects/${projectId}/apply`, {
                userId: session.user.id,
                skill: selectedSkill,
                message: applyMessage,
            });
            setSuccessMessage("Application submitted successfully");
            // Add user to applicants list
            setProjects((prevProjects) =>
                prevProjects.map((project) =>
                    project._id === projectId
                        ? {
                            ...project,
                            applicants: [
                                ...project.applicants,
                                {
                                    user: session.user.id,
                                    skill: selectedSkill,
                                    message: applyMessage,
                                },
                            ],
                        }
                        : project
                )
            );
            setShowPopup(false);
            setSelectedSkill("");
            setApplyMessage("");
        } catch (error) {
            console.error('Error applying to project: ', error);
            setErrorMessage("Error applying to project. Please try again later.");
        }
    };

    const filteredProjects = projects.filter(project =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tags.flat().some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <Layout>
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center">Discover Collaboration Opportunities</h1>
            <div className="mb-6">
              <div className="relative">
                <Input 
                  type="text" 
                  placeholder="Search projects..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => {
                const hasApplied = project.applicants.some(
                  (applicant) => applicant.user._id === session.user.id
                )
    
                return (
                  <Card key={project._id} className="bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center">
                        <Music className="w-5 h-5 mr-2 text-purple-500" />
                        {project.name}
                      </CardTitle>
                      <CardDescription>{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <h4 className="font-semibold mb-2 flex items-center">
                          <Star className="w-4 h-4 mr-2 text-yellow-500" />
                          Skills Needed:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {project.tags.flat().map((skillTag, tagIndex) => (
                            <Badge key={tagIndex} variant="secondary">
                              {skillTag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-sm font-semibold">Owner:
                            <p className="text-sm text-muted-foreground">
                              <Link href={`/user?id=${project.owner._id}`}>{project.owner.name}</Link>
                            </p>
                          </span>
                          <span className="text-sm font semibold ml-7">Collaborators:
                              {project.collaborators.length > 0 ? (
                                project.collaborators.map((collaborator, index) => (
                                  <p className="text-sm text-muted-foreground">
                                    <Link href={`/user?id=${collaborator.user._id}`} className="text-sm text-muted-foreground" key={index}>{collaborator.user.name}</Link>
                                  </p>
                                ))
                              ) : (
                                <p className="text-sm text-muted-foreground">None</p>
                              )}
                          </span>
                        </div>
                        {!hasApplied ? (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button>Apply Now</Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Apply to {project.name}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 mt-4">
                                <Select onValueChange={setSelectedSkill}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select your skill" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {project.tags.flat().map((tag, index) => (
                                      <SelectItem key={index} value={tag}>{tag}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <Textarea
                                  placeholder="Write a message to the project owner"
                                  value={applyMessage}
                                  onChange={(e) => setApplyMessage(e.target.value)}
                                />
                                <Button onClick={() => handleApply(project._id)} className="w-full">
                                  Submit Application
                                </Button>
                                {errorMessage && (
                                  <p className="text-red-500 text-sm">{errorMessage}</p>
                                )}
                                {successMessage && (
                                  <p className="text-green-500 text-sm">{successMessage}</p>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                        ) : (
                          <Badge variant="outline" className="bg-green-100">Applied</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </Layout>
      );
}