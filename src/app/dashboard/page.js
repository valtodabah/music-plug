"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectItem } from "@/components/ui/select";

export default function Dashboard() {
    const { data: session, status } = useSession();
    const [projects, setProjects] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [applyMessage, setApplyMessage] = useState("");
    const [selectedSkill, setSelectedSkill] = useState("");

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
            alert("Application submitted successfully!");
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
            alert("Error applying to project");
        }
    };

    return (
        <Layout>
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <div className="space-y-4">
            {projects.map((project) => {
                const hasApplied = project.applicants.some(
                    (applicant) => applicant.user._id === session.user.id
                );

                return (
                    <Card key={project._id} className="border p-4">
                        <CardHeader>
                            <CardTitle className="text-xl">{project.name}</CardTitle>
                            <p className="text-gray-500">{project.description}</p>
                        </CardHeader>
                        <CardContent>
                            <p className="font-semibold">Skills Needed:</p>
                            <ul className="list-disc ml-5">
                                {project.tags.map((tag, index) => (
                                    tag.map((skillTag, tagIndex) => (
                                        <li key={tagIndex}>{skillTag}</li>
                                    ))
                                ))}
                            </ul>
                            {!hasApplied ? (
                                <Button
                                    className="mt-4"
                                    onClick={() => {
                                        setSelectedProject(project);
                                        setShowPopup(true);
                                    }}
                                >
                                    Apply
                                </Button>
                            ) : (
                                <p className="mt-4 text-green-600">You have applied</p>
                            )}
                        </CardContent>
                    </Card>
                );
            })}
            </div>
    
            {showPopup && selectedProject && (
              <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-md w-full max-w-md">
                  <h3 className="text-xl font-bold mb-4">
                    Apply to {selectedProject.name}
                  </h3>
                  <Select
                    value={selectedSkill}
                    onChange={(e) => setSelectedSkill(e.target.value)}
                    className="mb-4"
                  >
                    <option value="" disabled>
                      Select a skill
                    </option>
                    {selectedProject.tags.map((tag) => (
                        tag.map((skillTag, tagIndex) => (
                            <SelectItem key={tagIndex} value={skillTag}>
                                {skillTag}
                            </SelectItem>
                        ))
                    ))}
                  </Select>
                  <Textarea
                    placeholder="Write a message to the project owner"
                    value={applyMessage}
                    onChange={(e) => setApplyMessage(e.target.value)}
                    className="mb-4"
                  />
                  <div className="flex justify-end space-x-2">
                    <Button onClick={() => setShowPopup(false)} variant="secondary">
                      Cancel
                    </Button>
                    <Button
                      onClick={() => handleApply(selectedProject._id)}
                      variant="primary"
                    >
                      Submit Application
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Layout>
      );
}