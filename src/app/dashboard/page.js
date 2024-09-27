"use client";

import { useState, useEffect } from "react";
import { useSession } from 'next-auth/react';
import axios from 'axios';
import NavBar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { set } from "mongoose";

export default function Dashboard() {
    const { data: session, status } = useSession();
    const [ projects, setProjects ] = useState([]);
    const [ selectedProject, setSelectedProject ] = useState(null); // To handle pop-up modal
    const [ applyMessage, setApplyMessage ] = useState(''); // Message when applying to a project
    const [showPopup, setShowPopup] = useState(false); // To show/hide pop-up modal

    useEffect(() => {
        if (status === 'authenticated') {
            fetchProjects();
        }
    }, [status]);

    const fetchProjects = async () => {
        try {
            const response = await axios.get('/api/projects');
            setProjects(response.data);
        } catch (error) {
            console.error('Error fetching projects: ', error);
        }
    };

    const handleApply = async (projectId) => {
        try {
            const response = await axios.post(`/api/projects/${projectId}/apply`, { message: applyMessage });
            alert('Application sent successfully');
            setShowPopup(false);
            setApplyMessage(''); // Clear the message after sending
        } catch (error) {
            console.error('Error applying to project: ', error);
            alert('Failed to send application');
        }
    };

    return (
        <>
            <NavBar />

            <div style={styles.container}>
                <h1>Welcome to your Dashboard</h1>
                {status === 'authenticated' ? (
                    <div style={styles.projects}>
                        {projects.length > 0 ? (
                            projects.map((project) => (
                                <div key={project._id} style={styles.projectCard}>
                                    <h2>{project.name}</h2>
                                    <p>{project.description}</p>
                                    <p>Tags: {project.tags.join(', ')}</p>
                                    <p>Status: {project.status}</p>
                                    <button
                                    style={styles.applyButton}
                                    onClick={() => {
                                        setSelectedProject(project);
                                        setShowPopup(true);
                                    }}
                                    >
                                        Apply
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p>No projects available at the moment.</p>
                        )}
                    </div>
                ) : (
                    <p>Please sign in to view projects</p>
                )}

                {showPopup && (
                    <div style={styles.popup}>
                        <h3>Apply to {selectedProject.name}</h3>
                        <textarea
                        style={styles.textarea}
                        placeholder="Write a message to the project owner"
                        value={applyMessage}
                        onChange={(e) => setApplyMessage(e.target.value)}
                        />
                        <button style={styles.submitButton} onClick={() => handleApply(selectedProject._id)}>Submit Application</button>
                        <button style={styles.cancelButton} onClick={() => setShowPopup(false)}>Cancel</button>
                    </div>
                )}
            </div>

            <Footer />
        </>
    );
}

const styles = {
    container: {
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    projects: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px',
    },
    projectCard: {
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
    },
    applyButton: {
        padding: '5px 10px',
        backgroundColor: '#333',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    popup: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        padding: '20px',
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        borderRadius: '5px',
        zIndex: 1000,
    },
    textarea: {
        width: '100%',
        padding: '10px',
        marginBottom: '10px',
        borderRadius: '5px',
    },
    submitButton: {
        padding: '5px 10px',
        backgroundColor: '#333',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginRight: '10px',
    },
    cancelButton: {
        padding: '5px 10px',
        backgroundColor: '#ccc',
        color: '#333',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
};